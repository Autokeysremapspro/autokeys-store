const SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';
const SITE_URL = 'https://www.autokeys.es';

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let data = '';
  for await (const chunk of req) data += chunk;
  try {
    return JSON.parse(data || '{}');
  } catch {
    return {};
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'metodo_no_permitido' });
    return;
  }

  const { SUMUP_API_KEY, SUMUP_MERCHANT_CODE, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUMUP_API_KEY || !SUMUP_MERCHANT_CODE || !SUPABASE_SERVICE_ROLE_KEY) {
    // Pagos online todavía no configurados en este despliegue: el checkout
    // debe caer de vuelta al flujo de "solicitud" existente (sin bloquear al cliente).
    res.status(503).json({ error: 'pagos_no_configurados' });
    return;
  }

  const body = await readJsonBody(req);
  const pedidoId = body.pedido_id;
  if (!pedidoId) {
    res.status(400).json({ error: 'falta_pedido_id' });
    return;
  }

  const supabaseHeaders = {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
  };

  try {
    // El importe y el número de pedido se leen del servidor, nunca del
    // cuerpo de la petición del cliente — evita que alguien manipule el total a pagar.
    const pedidoRes = await fetch(
      `${SUPABASE_URL}/rest/v1/tienda_pedidos?id=eq.${encodeURIComponent(pedidoId)}&select=id,numero,total,pago_estado`,
      { headers: supabaseHeaders }
    );
    if (!pedidoRes.ok) throw new Error('No se pudo leer el pedido en Supabase');
    const [pedido] = await pedidoRes.json();
    if (!pedido) {
      res.status(404).json({ error: 'pedido_no_encontrado' });
      return;
    }
    if (pedido.pago_estado === 'pagado') {
      res.status(409).json({ error: 'pedido_ya_pagado' });
      return;
    }

    const sumupRes = await fetch('https://api.sumup.com/v0.1/checkouts', {
      method: 'POST',
      headers: { Authorization: `Bearer ${SUMUP_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        checkout_reference: pedido.numero,
        amount: Number(pedido.total),
        currency: 'EUR',
        merchant_code: SUMUP_MERCHANT_CODE,
        description: `Pedido ${pedido.numero} — Autokeys Remaps Pro Store`,
        redirect_url: `${SITE_URL}/carrito.html?pedido=${pedido.id}&pago=retorno`,
        return_url: `${SITE_URL}/api/sumup-webhook`,
        hosted_checkout: { enabled: true },
      }),
    });
    const sumupData = await sumupRes.json();
    if (!sumupRes.ok || !sumupData.hosted_checkout_url) {
      console.error('SumUp crear checkout error:', sumupRes.status, sumupData);
      res.status(502).json({ error: 'sumup_error' });
      return;
    }

    await fetch(`${SUPABASE_URL}/rest/v1/tienda_pedidos?id=eq.${encodeURIComponent(pedido.id)}`, {
      method: 'PATCH',
      headers: { ...supabaseHeaders, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ pago_referencia: sumupData.id }),
    });

    res.status(200).json({ hosted_checkout_url: sumupData.hosted_checkout_url });
  } catch (err) {
    console.error('crear-pago error:', err);
    res.status(500).json({ error: 'error_interno' });
  }
};
