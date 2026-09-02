const { authenticatedUser } = require('../lib/digital-products-server');
const { serviceKey, adminRequest } = require('../lib/order-pricing-server');

async function rows(response, code) {
  if (!response.ok) throw new Error(code);
  return response.json();
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'metodo_no_permitido' });
  res.setHeader('Cache-Control', 'no-store');
  if (!serviceKey()) return res.status(503).json({ error: 'configuracion_no_disponible' });
  try {
    const user = await authenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'no_autorizado' });
    const orders = await rows(await adminRequest(
      `tienda_pedidos?usuario_id=eq.${encodeURIComponent(user.id)}&pago_estado=eq.pagado&select=id,numero,created_at&order=created_at.desc&limit=100`
    ), 'pedidos_no_disponibles');
    if (!orders.length) return res.status(200).json({ descargas: [] });

    const orderMap = new Map(orders.map((order) => [order.id, order]));
    const orderIds = orders.map((order) => order.id);
    const lines = await rows(await adminRequest(
      `tienda_pedido_lineas?pedido_id=in.(${orderIds.join(',')})&select=pedido_id,producto_id&limit=500`
    ), 'pedidos_no_disponibles');
    const productIds = [...new Set(lines.map((line) => line.producto_id))];
    if (!productIds.length) return res.status(200).json({ descargas: [] });

    const encodedIds = productIds.map((id) => `\"${String(id).replace(/[\"\\]/g, '')}\"`).join(',');
    const [products, configs, logs] = await Promise.all([
      rows(await adminRequest(`tienda_productos?id=in.(${encodedIds})&es_digital=eq.true&select=id,name,image,digital_version,digital_instrucciones,activo`), 'productos_no_disponibles'),
      rows(await adminRequest(`tienda_producto_digital?producto_id=in.(${encodedIds})&select=producto_id,max_descargas`), 'productos_no_disponibles'),
      rows(await adminRequest(`tienda_descargas?usuario_id=eq.${encodeURIComponent(user.id)}&producto_id=in.(${encodedIds})&select=producto_id,pedido_id`), 'historial_descargas_no_disponible'),
    ]);
    const productMap = new Map(products.map((product) => [product.id, product]));
    const configMap = new Map(configs.map((config) => [config.producto_id, config]));
    const seen = new Set();
    const downloads = [];
    for (const line of lines) {
      const key = `${line.pedido_id}:${line.producto_id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const product = productMap.get(line.producto_id);
      if (!product) continue;
      const order = orderMap.get(line.pedido_id);
      const used = logs.filter((log) => log.producto_id === line.producto_id && log.pedido_id === line.pedido_id).length;
      downloads.push({
        producto_id: product.id,
        nombre: product.name,
        imagen: product.image,
        version: product.digital_version,
        instrucciones: product.digital_instrucciones,
        activo: product.activo,
        pedido_id: order.id,
        pedido_numero: order.numero,
        comprado_en: order.created_at,
        descargas_usadas: used,
        max_descargas: configMap.get(product.id)?.max_descargas || null,
      });
    }
    return res.status(200).json({ descargas: downloads });
  } catch (error) {
    console.error('mis-descargas:', error);
    return res.status(500).json({ error: 'error_interno' });
  }
};
