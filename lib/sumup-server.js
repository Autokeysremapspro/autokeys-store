/* Autokeys Remaps Pro Store — helpers de servidor para SumUp + Supabase,
   compartidos por las funciones serverless de api/. Sigue el mismo patrón
   ya probado en producción en autokeys-file-service (lib/sumup.ts): claves
   live en producción, claves sandbox en despliegues preview de Vercel. */

const SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';

function isPreview() {
  return process.env.VERCEL_ENV === 'preview';
}

function getSumUpApiKey() {
  return isPreview() ? process.env.SUMUP_SANDBOX_API_KEY : process.env.AK_SUMUP_LIVE_API_KEY;
}

function getSumUpMerchantCode() {
  return isPreview() ? process.env.SUMUP_SANDBOX_MERCHANT_CODE : process.env.AK_SUMUP_LIVE_MERCHANT_CODE;
}

function getServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || '';
}

function pagosConfigurados() {
  return Boolean(getSumUpApiKey() && getSumUpMerchantCode() && getServiceRoleKey());
}

async function sumupFetch(path, init = {}) {
  const apiKey = getSumUpApiKey();
  const res = await fetch(`https://api.sumup.com${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
  const text = await res.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = { raw: text };
  }
  if (!res.ok) {
    throw new Error(payload?.message || payload?.error_message || payload?.error || `Error SumUp (${res.status})`);
  }
  return payload;
}

async function createHostedCheckout({ checkoutReference, amount, description, redirectUrl, returnUrl }) {
  return sumupFetch('/v0.1/checkouts', {
    method: 'POST',
    body: JSON.stringify({
      checkout_reference: checkoutReference,
      amount: Number(Number(amount).toFixed(2)),
      currency: 'EUR',
      merchant_code: getSumUpMerchantCode(),
      description: description.slice(0, 255),
      redirect_url: redirectUrl,
      return_url: returnUrl,
      hosted_checkout: { enabled: true },
    }),
  });
}

async function getCheckout(checkoutId) {
  return sumupFetch(`/v0.1/checkouts/${encodeURIComponent(checkoutId)}`, { method: 'GET' });
}

async function supabaseAdminRequest(path, init = {}) {
  const key = getServiceRoleKey();
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
}

async function getPedido(pedidoId) {
  const res = await supabaseAdminRequest(
    `tienda_pedidos?id=eq.${encodeURIComponent(pedidoId)}&select=id,numero,total,pago_estado,pago_referencia,usuario_id`
  );
  if (!res.ok) throw new Error('No se pudo leer el pedido en Supabase');
  const [pedido] = await res.json();
  return pedido || null;
}

async function updatePedido(pedidoId, changes) {
  const res = await supabaseAdminRequest(`tienda_pedidos?id=eq.${encodeURIComponent(pedidoId)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify(changes),
  });
  if (!res.ok) throw new Error('No se pudo actualizar el pedido en Supabase');
}

/**
 * Reverifica un checkout de SumUp directamente contra su API (nunca se fía
 * de un payload de cliente/webhook por sí solo) y, si está pagado y el
 * importe/moneda coinciden con el pedido, marca pago_estado='pagado'.
 * Se usa tanto desde el webhook como desde la confirmación activa al volver
 * del pago — es la única función que escribe pago_estado.
 */
async function reverificarYActualizarPago(checkoutId) {
  const pedido = await (async () => {
    const res = await supabaseAdminRequest(
      `tienda_pedidos?pago_referencia=eq.${encodeURIComponent(checkoutId)}&select=id,numero,total,pago_estado`
    );
    if (!res.ok) throw new Error('No se pudo leer el pedido asociado al checkout');
    const [p] = await res.json();
    return p || null;
  })();
  if (!pedido) return null;
  if (pedido.pago_estado === 'pagado') return pedido;

  const checkout = await getCheckout(checkoutId);
  const status = String(checkout?.status || '').toUpperCase();

  if (status === 'PAID') {
    const importeCoincide =
      Number(checkout.amount).toFixed(2) === Number(pedido.total).toFixed(2) && checkout.currency === 'EUR';
    if (!importeCoincide) {
      console.error('sumup: importe confirmado no coincide con el pedido', pedido.id, checkout.amount, pedido.total);
      return pedido;
    }
    await updatePedido(pedido.id, { pago_estado: 'pagado' });
    return { ...pedido, pago_estado: 'pagado' };
  }

  if (status === 'FAILED') {
    await updatePedido(pedido.id, { pago_estado: 'fallido' });
    return { ...pedido, pago_estado: 'fallido' };
  }

  return pedido;
}

module.exports = {
  pagosConfigurados,
  createHostedCheckout,
  getCheckout,
  getPedido,
  updatePedido,
  reverificarYActualizarPago,
};
