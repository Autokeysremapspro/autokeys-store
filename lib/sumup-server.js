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

async function getSolicitudByToken(token) {
  const res = await supabaseAdminRequest(
    `tienda_solicitudes_reparacion?seguimiento_token=eq.${encodeURIComponent(token)}&select=*`
  );
  if (!res.ok) throw new Error('No se pudo leer la solicitud en Supabase');
  const [solicitud] = await res.json();
  return solicitud || null;
}

async function updateSolicitud(solicitudId, changes) {
  const res = await supabaseAdminRequest(`tienda_solicitudes_reparacion?id=eq.${encodeURIComponent(solicitudId)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify(changes),
  });
  if (!res.ok) throw new Error('No se pudo actualizar la solicitud en Supabase');
}

/**
 * Reverifica un checkout de SumUp directamente contra su API (nunca se fía
 * de un payload de cliente/webhook por sí solo) y, si está pagado y el
 * importe/moneda coinciden con el pedido o presupuesto, marca el pago como
 * confirmado y avanza la solicitud de reparación.
 * Se usa tanto desde el webhook como desde la confirmación activa al volver
 * del pago; el navegador nunca puede confirmar un pago por sí solo.
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
  let objeto = pedido;
  let tipo = 'pedido';
  if (!objeto) {
    const res = await supabaseAdminRequest(
      `tienda_solicitudes_reparacion?pago_referencia=eq.${encodeURIComponent(checkoutId)}&select=id,numero,presupuesto_total,pago_estado,estado`
    );
    if (!res.ok) throw new Error('No se pudo leer la solicitud asociada al checkout');
    const [solicitud] = await res.json();
    objeto = solicitud || null;
    tipo = 'solicitud';
  }
  if (!objeto) return null;
  if (objeto.pago_estado === 'pagado') return { ...objeto, tipo };

  const checkout = await getCheckout(checkoutId);
  const status = String(checkout?.status || '').toUpperCase();

  if (status === 'PAID') {
    const totalEsperado = tipo === 'pedido' ? objeto.total : objeto.presupuesto_total;
    const importeCoincide =
      Number(checkout.amount).toFixed(2) === Number(totalEsperado).toFixed(2) && checkout.currency === 'EUR';
    if (!importeCoincide) {
      console.error('sumup: importe confirmado no coincide', tipo, objeto.id, checkout.amount, totalEsperado);
      return { ...objeto, tipo };
    }
    if (tipo === 'pedido') await updatePedido(objeto.id, { pago_estado: 'pagado' });
    else await updateSolicitud(objeto.id, { pago_estado: 'pagado', pago_confirmado_at: new Date().toISOString(), estado: 'presupuesto_aceptado' });
    return { ...objeto, tipo, pago_estado: 'pagado' };
  }

  if (status === 'FAILED' || status === 'EXPIRED') {
    if (tipo === 'pedido') await updatePedido(objeto.id, { pago_estado: 'fallido' });
    else await updateSolicitud(objeto.id, { pago_estado: 'fallido' });
    return { ...objeto, tipo, pago_estado: 'fallido' };
  }

  return { ...objeto, tipo };
}

module.exports = {
  pagosConfigurados,
  createHostedCheckout,
  getCheckout,
  getPedido,
  updatePedido,
  getSolicitudByToken,
  updateSolicitud,
  reverificarYActualizarPago,
};
