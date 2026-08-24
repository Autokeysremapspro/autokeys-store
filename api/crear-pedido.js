const { calcularPedido, crearPedido, usuarioDesdeToken } = require('../lib/orders-server');

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let raw = '';
  for await (const chunk of req) raw += chunk;
  try { return JSON.parse(raw || '{}'); } catch { return {}; }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'metodo_no_permitido' });
  try {
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    const user = await usuarioDesdeToken(token);
    if (!user) return res.status(401).json({ error: 'no_autorizado' });
    const body = await readBody(req);
    const calculo = await calcularPedido({ items: body.items, codigo_postal: body.codigo_postal, pais: body.pais, cupon: body.cupon });
    const pedido = await crearPedido({ user, body, calculo });
    res.status(201).json({ pedido_id: pedido.id, numero: pedido.numero, subtotal: pedido.subtotal, descuento: pedido.descuento, envio: pedido.envio, total: pedido.total, peso_total_kg: pedido.peso_total_kg, tarifa_envio_codigo: pedido.tarifa_envio_codigo });
  } catch (error) {
    const code = error.message || 'error_creando_pedido';
    const status = ['carrito_no_valido', 'producto_no_disponible', 'cupon_no_valido', 'destino_fuera_peninsula', 'envio_requiere_presupuesto', 'faltan_datos_cliente'].includes(code) ? 400 : 500;
    res.status(status).json({ error: code });
  }
};
