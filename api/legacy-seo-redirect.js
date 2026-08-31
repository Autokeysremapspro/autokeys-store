const SITE = 'https://www.autokeysremapspro.es';
const SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';

function serviceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || '';
}

function cleanSlug(value) {
  const slug = String(value || '').trim();
  return /^[a-z0-9][a-z0-9-]{0,159}$/.test(slug) ? slug : '';
}

function cleanSearch(value, max = 160) {
  return String(value || '').trim().slice(0, max);
}

function go(res, path, permanent = true) {
  const status = permanent ? 301 : 302;
  res.setHeader('Location', `${SITE}${path}`);
  res.setHeader('Cache-Control', permanent ? 'public, max-age=86400' : 'no-store');
  return res.status(status).end();
}

async function productKind(id) {
  const key = serviceKey();
  if (!key) throw new Error('missing_service_key');

  const query = new URLSearchParams({
    select: 'id,is_product',
    id: `eq.${id}`,
    limit: '1',
  });

  const response = await fetch(`${SUPABASE_URL}/rest/v1/tienda_productos?${query.toString()}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });

  if (!response.ok) throw new Error(`supabase_${response.status}`);
  const rows = await response.json();
  return rows[0] || null;
}

function specialProductPath(id) {
  const special = {
    'reparacion-por-envio': '/reparacion-centralita-por-envio',
    'software-licencias': '/categorias/software',
  };
  return special[id] || '';
}

async function redirectProduct(req, res) {
  const id = cleanSlug(req.query.id);
  if (!id) return go(res, '/tienda.html');

  const special = specialProductPath(id);
  if (special) return go(res, special);

  try {
    const row = await productKind(id);
    if (!row) return go(res, '/tienda.html', false);
    const section = row.is_product ? 'productos' : 'servicios';
    return go(res, `/${section}/${encodeURIComponent(id)}`);
  } catch (error) {
    console.error('legacy product redirect:', error);
    return go(res, '/tienda.html', false);
  }
}

function redirectBlog(req, res) {
  const slug = cleanSlug(req.query.slug);
  if (!slug) return go(res, '/blog.html');
  return go(res, `/guias/${encodeURIComponent(slug)}`);
}

function redirectShop(req, res) {
  const category = cleanSlug(req.query.cat);
  if (category) return go(res, `/categorias/${encodeURIComponent(category)}`);

  const brand = cleanSlug(req.query.brand);
  if (brand) return go(res, `/tienda.html?brand=${encodeURIComponent(brand)}`);

  const query = cleanSearch(req.query.q);
  if (query) return go(res, `/tienda.html?q=${encodeURIComponent(query)}`, false);

  return go(res, '/tienda.html');
}

async function redirectNested(req, res) {
  const file = cleanSlug(req.query.file);
  if (!file) return res.status(404).send('Not found');

  if (file === 'producto') return redirectProduct(req, res);
  if (file === 'blog-post') return redirectBlog(req, res);
  if (file === 'tienda') return redirectShop(req, res);

  const staticPaths = {
    index: '/',
    blog: '/blog.html',
    'casos-reales': '/casos-reales.html',
    'aviso-legal': '/aviso-legal.html',
    'politica-privacidad': '/politica-privacidad.html',
    'politica-cookies': '/politica-cookies.html',
    'condiciones-venta': '/condiciones-venta.html',
    'quienes-somos': '/quienes-somos.html',
    login: '/login.html',
    cuenta: '/cuenta.html',
    carrito: '/carrito.html',
    seguimiento: '/seguimiento.html',
    profesionales: '/profesionales.html',
    'electronica-automovil-jaen': '/electronica-automovil-jaen.html',
    'enviar-reparacion': '/enviar-reparacion.html',
    'reprogramacion-centralitas-jaen': '/reprogramacion-centralitas-jaen.html',
  };

  const destination = staticPaths[file];
  if (!destination) return res.status(404).send('Not found');
  return go(res, destination);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).send('Method not allowed');
  }

  const type = String(req.query.type || '').trim();

  if (type === 'blog') return redirectBlog(req, res);
  if (type === 'product') return redirectProduct(req, res);
  if (type === 'shop') return redirectShop(req, res);
  if (type === 'nested') return redirectNested(req, res);

  res.setHeader('Cache-Control', 'no-store');
  return res.status(404).send('Not found');
};
