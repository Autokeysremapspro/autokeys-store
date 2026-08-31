const { quoteOrder } = require('../lib/order-pricing-server');

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let data = '';
  for await (const chunk of req) data += chunk;
  if (data.length > 250000) throw new Error('payload_demasiado_grande');
  try { return JSON.parse(data || '{}'); } catch { return {}; }
}

function publicQuote(quote) {
  return {
    subtotal: quote.subtotal,
    descuento: quote.descuento,
    envio: quote.envio,
    iva_importe: quote.iva_importe,
    total: quote.total,
    requiere_envio: quote.requiere_envio,
    peso_total_kg: quote.peso_total_kg,
    tarifa_envio_codigo: quote.tarifa_envio_codigo,
    envio_gratis_motivo: quote.envio_gratis_motivo,
    envio_gratis_desde: quote.envio_gratis_desde,
    envio_gratis_peso_max_kg: quote.envio_gratis_peso_max_kg,
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'metodo_no_permitido' });
  try {
    const body = await readJsonBody(req);
    const quote = await quoteOrder(body.items, body.cupon);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(publicQuote(quote));
  } catch (error) {
    const code = String(error?.message || 'cotizacion_no_disponible');
    const clientErrors = new Set([
      'carrito_no_valido','producto_no_valido','cantidad_no_valida','producto_no_disponible',
      'variante_no_disponible','precio_no_valido','cupon_no_valido','cupon_no_activo',
      'cupon_caducado','cupon_agotado','cupon_importe_minimo',
    ]);
    if (!clientErrors.has(code)) console.error('cotizar-pedido:', error);
    return res.status(clientErrors.has(code) ? 400 : 500).json({ error: code });
  }
};
