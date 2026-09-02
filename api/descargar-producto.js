const { authorizeDownload } = require('../lib/digital-products-server');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'metodo_no_permitido' });
  res.setHeader('Cache-Control', 'no-store');
  try {
    const productId = req.body?.producto_id;
    const result = await authorizeDownload(req, productId);
    return res.status(200).json({
      url: result.url,
      nombre: result.product.name,
      version: result.product.digital_version || null,
    });
  } catch (error) {
    const code = String(error?.message || 'error_interno');
    const statuses = {
      producto_no_valido: 400,
      no_autorizado: 401,
      compra_requerida: 403,
      limite_descargas_alcanzado: 429,
      producto_no_disponible: 404,
      descarga_no_configurada: 404,
    };
    if (!statuses[code]) console.error('descargar-producto:', error);
    return res.status(statuses[code] || 500).json({ error: code });
  }
};
