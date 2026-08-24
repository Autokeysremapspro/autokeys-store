const SITE_URL = 'https://www.autokeysremapspro.es';
const SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_UMSdVTexHpOImBBonUJKdw_s7XgKVeq';

const STATIC_URLS = [
  '/',
  '/tienda.html',
  '/blog.html',
  '/casos-reales.html',
  '/casos/renault-megane-2008-perdida-total-llaves',
  '/casos/bmw-418d-stage-1-sport-display',
  '/casos/bosch-edc17cp54-stage-1-plus-malaga',
  '/enviar-reparacion.html',
  '/quienes-somos.html',
  '/electronica-automovil-jaen.html',
  '/reparacion-centralitas-ecu',
  '/clonacion-centralitas-ecu',
  '/reparacion-centralita-por-envio',
  '/programacion-llaves-coche',
  '/perdida-total-llaves-coche',
  '/duplicado-llaves-coche-jaen',
  '/bmw-fem-bdc',
  '/mercedes-ezs-elv',
  '/reparacion-airbag-srs',
  '/reprogramacion-centralitas-jaen',
  '/aviso-legal.html',
  '/politica-privacidad.html',
  '/politica-cookies.html',
  '/condiciones-venta.html',
];

function xmlEscape(value) {
  return String(value).replace(/[<>&'\"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '\"': '&quot;' }[c]));
}

function isoDate(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}

async function fetchJson(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
  });
  if (!res.ok) throw new Error(`Supabase respondió ${res.status}`);
  return res.json();
}

function renderUrl(entry) {
  const lastmod = isoDate(entry.lastmod);
  return `  <url>\n    <loc>${xmlEscape(entry.loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`;
}

module.exports = async function handler(req, res) {
  const urls = STATIC_URLS.map((path) => ({ loc: `${SITE_URL}${path}` }));

  try {
    const [productos, categorias, blogPosts] = await Promise.all([
      fetchJson('tienda_productos?select=id,updated_at,is_product&activo=eq.true&order=sort_order'),
      fetchJson('tienda_categorias?select=id'),
      fetchJson('tienda_blog_posts?select=slug,updated_at&publicado=eq.true&order=publicado_en.desc'),
    ]);

    categorias.forEach((c) => {
      urls.push({ loc: `${SITE_URL}/categorias/${encodeURIComponent(c.id)}` });
    });

    productos.forEach((p) => {
      urls.push({
        loc: `${SITE_URL}/${p.is_product ? 'productos' : 'servicios'}/${encodeURIComponent(p.id)}`,
        lastmod: p.updated_at,
      });
    });

    blogPosts.forEach((p) => {
      urls.push({
        loc: `${SITE_URL}/guias/${encodeURIComponent(p.slug)}`,
        lastmod: p.updated_at,
      });
    });
  } catch (err) {
    console.error('sitemap dynamic data:', err);
    res.setHeader('X-Sitemap-Partial', '1');
  }

  const seen = new Set();
  const uniqueUrls = urls.filter((entry) => {
    if (seen.has(entry.loc)) return false;
    seen.add(entry.loc);
    return true;
  });

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    uniqueUrls.map(renderUrl).join('\n') +
    '\n</urlset>\n';

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(body);
};
