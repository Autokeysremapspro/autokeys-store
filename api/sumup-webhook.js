const crypto = require('crypto');

const SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';

async function readRawBody(req) {
  if (req.body && typeof req.body === 'object') return JSON.stringify(req.body);
  let data = '';
  for await (const chunk of req) data += chunk;
  return data;
}

module.exports = async function handler(req, res) {
  // SumUp espera una respuesta 2xx rápida; cualquier fallo posterior se
  // registra pero no debe hacer que SumUp reintente indefinidamente.
  if (req.method !== 'POST') {
    res.status(200).end();
    return;
  }

  const { SUMUP_API_KEY, SUMUP_WEBHOOK_SECRET, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUMUP_API_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    res.status(200).end();
    return;
  }

  const raw = await readRawBody(req);
  let payload = {};
  try {
    payload = JSON.parse(raw || '{}');
  } catch {
    res.status(200).end();
    return;
  }

  // Comprobación de firma en plan best-effort: solo se registra si no
  // coincide, nunca bloquea el procesamiento. La fuente de verdad real es
  // la llamada de re-verificación a la API de SumUp que hacemos más abajo
  // con nuestra propia API key — así una firma mal calculada (p. ej. por
  // cómo el runtime de Vercel entrega el cuerpo) nunca bloquea pagos
  // legítimos, y un webhook falsificado nunca puede marcar un pedido como
  // pagado sin que SumUp lo confirme de verdad.
  const signatureHeader = req.headers['x-payload-signature'];
  if (SUMUP_WEBHOOK_SECRET && signatureHeader) {
    const expected = crypto.createHmac('sha256', SUMUP_WEBHOOK_SECRET).update(raw).digest('hex');
    if (expected !== signatureHeader) {
      console.warn('sumup-webhook: firma no coincide (se continúa igualmente, se reverifica contra la API)');
    }
  }

  const checkoutId = payload.id || payload.checkout_id || (payload.checkout && payload.checkout.id);
  if (!checkoutId) {
    res.status(200).end();
    return;
  }

  try {
    const checkoutRes = await fetch(`https://api.sumup.com/v0.1/checkouts/${encodeURIComponent(checkoutId)}`, {
      headers: { Authorization: `Bearer ${SUMUP_API_KEY}` },
    });
    if (!checkoutRes.ok) {
      console.error('sumup-webhook: no se pudo reverificar el checkout', checkoutRes.status);
      res.status(200).end();
      return;
    }
    const checkout = await checkoutRes.json();
    const status = (checkout.status || '').toUpperCase();
    const pagoEstado = status === 'PAID' ? 'pagado' : status === 'FAILED' ? 'fallido' : null;
    if (!pagoEstado) {
      res.status(200).end();
      return;
    }

    await fetch(
      `${SUPABASE_URL}/rest/v1/tienda_pedidos?pago_referencia=eq.${encodeURIComponent(checkoutId)}`,
      {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ pago_estado: pagoEstado }),
      }
    );

    res.status(200).end();
  } catch (err) {
    console.error('sumup-webhook error:', err);
    res.status(200).end();
  }
};
