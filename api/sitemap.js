const SITE_URL = 'https://www.autokeysremapspro.es';
const SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_UMSdVTexHpOImBBonUJKdw_s7XgKVeq';

function xmlEscape(value) {
  return String(value).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
}

function isoDate(value) {
  return new Date(value || Date.now()).toISOString().slice(0, 10);
}

async function fetchProductos() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/tienda_productos?select=id,updated_at&activo=eq.true&order=sort_order`,
    { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
  );
  if (!res.ok) throw new Error(`Supabase respondió ${res.status}`);
  return res.json();
}

async function fetchCategorias() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/tienda_categorias?select=id`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
  });
  if (!res.ok) throw new Error(`Supabase respondió ${res.status}`);
  return res.json();
}

module.exports = async function handler(req, res) {
  const today = isoDate(Date.now());
  let productos = [];
  let categorias = [];
  try {
    [productos, categorias] = await Promise.all([fetchProductos(), fetchCategorias()]);
  } catch (err) {
    res.status(502).send('No se pudo generar el sitemap: ' + err.message);
    return;
  }

  const urls = [
    { loc: `${SITE_URL}/`, lastmod: today, changefreq: 'weekly', priority: '1.0' },
    { loc: `${SITE_URL}/tienda.html`, lastmod: today, changefreq: 'weekly', priority: '0.9' },
  ];

  categorias.forEach((c) => {
    urls.push({ loc: `${SITE_URL}/tienda.html?cat=${encodeURIComponent(c.id)}`, lastmod: today, changefreq: 'weekly', priority: '0.6' });
  });

  productos.forEach((p) => {
    urls.push({
      loc: `${SITE_URL}/producto.html?id=${encodeURIComponent(p.id)}`,
      lastmod: isoDate(p.updated_at),
      changefreq: 'monthly',
      priority: '0.8',
    });
  });

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls
      .map(
        (u) =>
          `  <url>\n    <loc>${xmlEscape(u.loc)}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
      )
      .join('\n') +
    '\n</urlset>\n';

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(body);
};
