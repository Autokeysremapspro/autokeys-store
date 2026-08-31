const { quoteOrder } = require('../lib/order-pricing-server');

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let raw = '';
  for await (const chunk of req) raw += chunk;
  try { return JSON.parse(raw || '{}'); } catch { return {}; }
}

function normalizeLegacyItems(items) {
  if (!Array.isArray(items)) return items;
  return items.map((item) => ({
    product_id: item.product_id || item.productId,
    variant_id: item.variant_id || item.variantId,
    qty: item.qty,
  }));
}

function isPeninsula(pais, codigoPostal) {
  const country = String(pais || 'España').trim().toLowerCase();
  if (!['españa', 'espana', 'es'].includes(country)) return false;
  const cp = String(codigoPostal || '').replace(/\D/g, '');
  if (!cp) return true; // Cotización sin destino todavía: precio orientativo peninsular.
  return /^\d{5}$/.test(cp) && !['07', '35', '38', '51', '52'].includes(cp.slice(0, 2));
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'metodo_no_permitido' });
  try {
    const body = await readBody(req);
    const result = await quoteOrder(normalizeLegacyItems(body.items), body.cupon);
    if (result.requiere_envio && !isPeninsula(body.pais, body.codigo_postal)) {
      return res.status(400).json({ error: 'destino_fuera_peninsula' });
    }
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      subtotal: result.subtotal,
      descuento: result.descuento,
      envio: result.envio,
      iva_importe: result.iva_importe,
      total: result.total,
      peso_total_kg: result.peso_total_kg,
      tarifa_envio_codigo: result.tarifa_envio_codigo,
      envio_gratis_motivo: result.envio_gratis_motivo,
    });
  } catch (error) {
    const code = String(error?.message || 'error_calculo_envio');
    const status = [
      'carrito_no_valido','producto_no_valido','cantidad_no_valida','producto_no_disponible',
      'variante_no_disponible','cupon_no_valido','cupon_no_activo','cupon_caducado',
      'cupon_agotado','cupon_importe_minimo','destino_fuera_peninsula',
    ].includes(code) ? 400 : 500;
    return res.status(status).json({ error: code });
  }
};
