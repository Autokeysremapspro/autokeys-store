const { calcularPedido } = require('../lib/orders-server');

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let raw = '';
  for await (const chunk of req) raw += chunk;
  try { return JSON.parse(raw || '{}'); } catch { return {}; }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'metodo_no_permitido' });
  try {
    const body = await readBody(req);
    const result = await calcularPedido(body);
    res.status(200).json({ subtotal: result.subtotal, descuento: result.descuento, envio: result.envio, total: result.total, peso_total_kg: result.peso_total_kg, tarifa_envio_codigo: result.tarifa_envio_codigo, envio_gratis_motivo: result.envio_gratis_motivo });
  } catch (error) {
    const code = error.message || 'error_calculo_envio';
    const status = ['carrito_no_valido', 'producto_no_disponible', 'cupon_no_valido', 'destino_fuera_peninsula', 'envio_requiere_presupuesto'].includes(code) ? 400 : 500;
    res.status(status).json({ error: code });
  }
};
