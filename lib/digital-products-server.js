const crypto = require('crypto');
const { SUPABASE_URL, serviceKey, adminRequest } = require('./order-pricing-server');

const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_UMSdVTexHpOImBBonUJKdw_s7XgKVeq';
const DIGITAL_BUCKET = 'productos-digitales';

async function jsonOrThrow(response, code) {
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    console.error(code, response.status, body.slice(0, 300));
    throw new Error(code);
  }
  if (response.status === 204) return null;
  const body = await response.text();
  return body ? JSON.parse(body) : null;
}

async function authenticatedUser(req) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return null;
  const user = await response.json();
  return user?.id ? user : null;
}

function safeProductId(value) {
  const id = String(value || '').trim();
  if (!/^[a-zA-Z0-9_-]{1,160}$/.test(id)) throw new Error('producto_no_valido');
  return id;
}

async function digitalProduct(productId) {
  const [productResponse, deliveryResponse] = await Promise.all([
    adminRequest(`tienda_productos?id=eq.${encodeURIComponent(productId)}&activo=eq.true&es_digital=eq.true&select=id,name,digital_gratis,digital_version,digital_instrucciones&limit=1`),
    adminRequest(`tienda_producto_digital?producto_id=eq.${encodeURIComponent(productId)}&select=producto_id,entrega_tipo,archivo_path,enlace_externo,nombre_archivo,max_descargas,enlace_duracion_segundos&limit=1`),
  ]);
  const [products, deliveries] = await Promise.all([
    jsonOrThrow(productResponse, 'producto_no_disponible'),
    jsonOrThrow(deliveryResponse, 'descarga_no_configurada'),
  ]);
  if (!products?.[0]) throw new Error('producto_no_disponible');
  if (!deliveries?.[0]) throw new Error('descarga_no_configurada');
  return { ...products[0], delivery: deliveries[0] };
}

async function paidOrderFor(userId, productId) {
  const ordersResponse = await adminRequest(
    `tienda_pedidos?usuario_id=eq.${encodeURIComponent(userId)}&pago_estado=eq.pagado&select=id,created_at&order=created_at.desc&limit=100`
  );
  const orders = await jsonOrThrow(ordersResponse, 'pedidos_no_disponibles');
  if (!orders?.length) return null;
  const ids = orders.map((order) => order.id);
  const linesResponse = await adminRequest(
    `tienda_pedido_lineas?producto_id=eq.${encodeURIComponent(productId)}&pedido_id=in.(${ids.join(',')})&select=pedido_id&limit=1`
  );
  const lines = await jsonOrThrow(linesResponse, 'pedidos_no_disponibles');
  return lines?.[0]?.pedido_id || null;
}

async function downloadCount(userId, productId, orderId) {
  const parts = [
    `usuario_id=eq.${encodeURIComponent(userId)}`,
    `producto_id=eq.${encodeURIComponent(productId)}`,
    orderId ? `pedido_id=eq.${encodeURIComponent(orderId)}` : 'pedido_id=is.null',
    'select=id',
  ];
  const response = await adminRequest(`tienda_descargas?${parts.join('&')}`, {
    headers: { Prefer: 'count=exact' },
  });
  if (!response.ok) throw new Error('historial_descargas_no_disponible');
  const range = response.headers.get('content-range') || '';
  const total = Number(range.split('/')[1]);
  return Number.isFinite(total) ? total : (await response.json()).length;
}

async function recordDownload({ userId, productId, orderId, req }) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const ipHash = forwarded
    ? crypto.createHash('sha256').update(`${forwarded}:${process.env.DOWNLOAD_AUDIT_SALT || 'autokeys'}`).digest('hex')
    : null;
  const response = await adminRequest('tienda_descargas', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({
      usuario_id: userId || null,
      producto_id: productId,
      pedido_id: orderId || null,
      ip_hash: ipHash,
      user_agent: String(req.headers['user-agent'] || '').slice(0, 500) || null,
    }),
  });
  await jsonOrThrow(response, 'no_se_pudo_registrar_descarga');
}

async function signedStorageUrl(delivery) {
  const path = String(delivery.archivo_path || '').replace(/^\/+/, '');
  if (!path || path.includes('..')) throw new Error('descarga_no_configurada');
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');
  const expiresIn = Math.min(Math.max(Number(delivery.enlace_duracion_segundos) || 300, 60), 3600);
  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/sign/${DIGITAL_BUCKET}/${encodedPath}`, {
    method: 'POST',
    headers: {
      apikey: serviceKey(),
      Authorization: `Bearer ${serviceKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ expiresIn, download: delivery.nombre_archivo || true }),
  });
  const payload = await jsonOrThrow(response, 'no_se_pudo_firmar_descarga');
  const signed = payload?.signedURL || payload?.signedUrl || payload?.signed_url;
  if (!signed) throw new Error('no_se_pudo_firmar_descarga');
  return /^https?:\/\//i.test(signed) ? signed : `${SUPABASE_URL}/storage/v1${signed.startsWith('/') ? '' : '/'}${signed}`;
}

function externalUrl(delivery) {
  const value = String(delivery.enlace_externo || '').trim();
  let url;
  try { url = new URL(value); } catch { throw new Error('descarga_no_configurada'); }
  if (url.protocol !== 'https:') throw new Error('descarga_no_configurada');
  return url.toString();
}

async function authorizeDownload(req, productId) {
  if (!serviceKey()) throw new Error('configuracion_no_disponible');
  const product = await digitalProduct(safeProductId(productId));
  let user = null;
  let orderId = null;
  if (!product.digital_gratis) {
    user = await authenticatedUser(req);
    if (!user) throw new Error('no_autorizado');
    orderId = await paidOrderFor(user.id, product.id);
    if (!orderId) throw new Error('compra_requerida');
    const count = await downloadCount(user.id, product.id, orderId);
    if (product.delivery.max_descargas && count >= Number(product.delivery.max_descargas)) {
      throw new Error('limite_descargas_alcanzado');
    }
  }

  const url = product.delivery.entrega_tipo === 'archivo'
    ? await signedStorageUrl(product.delivery)
    : externalUrl(product.delivery);
  await recordDownload({ userId: user?.id, productId: product.id, orderId, req });
  return { url, product, orderId };
}

module.exports = { authenticatedUser, authorizeDownload, digitalProduct, paidOrderFor };
