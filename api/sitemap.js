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
  '/casos/golf-6-gti-med17-5-electronica-corregida',
  '/casos/land-rover-discovery-4-2015-llave-rfa-autel',
  '/casos/opel-combo-md1cs003-recuperacion-arranque',
  '/casos/renault-kangoo-2007-uch-reparada',
  '/casos/golf-5-gti-med9-1-pops-bangs-tirones-corregidos',
  '/casos/golf-4-1-9-tdi-asz-stage-2-hardcut',
  '/casos/seat-ibiza-6l-multimapa-hardcut',
  '/casos/bmw-f36-420d-codificacion-levas',
  '/casos/seat-leon-mk1-1-8-pops-bangs',
  '/casos/desarrollo-edc15p-multimapa-autokeys',
  '/casos/mercedes-2008-2009-ezs-inoperativo-dos-llaves',
  '/enviar-reparacion.html',
  '/profesionales.html',
  '/quienes-somos.html',
  '/electronica-automovil-jaen.html',
  '/electronica-maquinaria-agricola-industrial.html',
  '/reparacion-centralitas-ecu',
  '/clonacion-centralitas-ecu',
  '/reparacion-centralita-por-envio',
  '/inmovilizador-coche',
  '/programacion-llaves-coche',
  '/perdida-total-llaves-coche',
  '/duplicado-llaves-coche-jaen',
  '/bmw-fem-bdc',
  '/mercedes-ezs-elv',
  '/reparacion-airbag-srs',
  '/reparacion-cuadro-instrumentos',
  '/reprogramacion-centralitas-jaen',
  '/aviso-legal.html',
  '/politica-privacidad.html',
  '/politica-cookies.html',
  '/condiciones-venta.html',
];

/* Fichas transaccionales cuyo contenido principal ya tiene una landing
   canónica reforzada. Se conservan operativas para comprar/solicitar el
   servicio, pero no se duplican en el sitemap. */
const CONSOLIDATED_SERVICE_IDS = new Set([
  'clonacion-ecu-general',
  'reparacion-electronica-ecu-pcm',
  'llaves-copia-programacion',
  'inmovilizadores-programacion',
  'bmw-fem-bdc',
  'mercedes-ezs-elv',
  'airbag-srs-reparacion',
  'cuadros-reparacion',
]);

/* Categorías que tienen exactamente la misma intención que una landing
   comercial reforzada. Siguen disponibles para navegar por la tienda, pero
   Google debe concentrar las señales en la landing principal. */
const CONSOLIDATED_CATEGORY_IDS = new Set([
  'airbag-srs',
  'bmw-fem-bdc',
  'clonacion-ecu',
  'cuadros',
  'mercedes-ezs-elv',
  'reparacion-envio',
]);

const STATIC_LASTMOD = {
  '/': '2026-09-01',
  '/casos-reales.html': '2026-08-25',
  '/enviar-reparacion.html': '2026-08-25',
  '/profesionales.html': '2026-08-25',
  '/quienes-somos.html': '2026-08-24',
  '/electronica-automovil-jaen.html': '2026-08-24',
  '/electronica-maquinaria-agricola-industrial.html': '2026-09-02',
  '/reparacion-centralitas-ecu': '2026-09-01',
  '/clonacion-centralitas-ecu': '2026-09-01',
  '/reparacion-centralita-por-envio': '2026-08-24',
  '/inmovilizador-coche': '2026-09-01',
  '/programacion-llaves-coche': '2026-09-01',
  '/perdida-total-llaves-coche': '2026-09-01',
  '/duplicado-llaves-coche-jaen': '2026-09-01',
  '/bmw-fem-bdc': '2026-09-01',
  '/mercedes-ezs-elv': '2026-09-01',
  '/reparacion-airbag-srs': '2026-09-01',
  '/reparacion-cuadro-instrumentos': '2026-09-01',
  '/reprogramacion-centralitas-jaen': '2026-09-01',
  '/casos/seat-leon-mk1-1-8-pops-bangs': '2026-08-25',
  '/casos/desarrollo-edc15p-multimapa-autokeys': '2026-08-25',
  '/casos/mercedes-2008-2009-ezs-inoperativo-dos-llaves': '2026-08-25',
};

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
  const urls = STATIC_URLS.map((path) => ({
    loc: `${SITE_URL}${path}`,
    lastmod: STATIC_LASTMOD[path],
  }));

  try {
    const [productos, categorias, blogPosts] = await Promise.all([
      fetchJson('tienda_productos?select=id,updated_at,is_product&activo=eq.true&order=sort_order'),
      fetchJson('tienda_categorias?select=id'),
      fetchJson('tienda_blog_posts?select=slug,updated_at&publicado=eq.true&order=publicado_en.desc'),
    ]);

    categorias.forEach((c) => {
      if (CONSOLIDATED_CATEGORY_IDS.has(c.id)) return;
      urls.push({ loc: `${SITE_URL}/categorias/${encodeURIComponent(c.id)}` });
    });
    productos.forEach((p) => {
      if (!p.is_product && CONSOLIDATED_SERVICE_IDS.has(p.id)) return;
      urls.push({ loc: `${SITE_URL}/${p.is_product ? 'productos' : 'servicios'}/${encodeURIComponent(p.id)}`, lastmod: p.updated_at });
    });
    blogPosts.forEach((p) => urls.push({ loc: `${SITE_URL}/guias/${encodeURIComponent(p.slug)}`, lastmod: p.updated_at }));
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

  const body = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    uniqueUrls.map(renderUrl).join('\n') + '\n</urlset>\n';

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(body);
};
