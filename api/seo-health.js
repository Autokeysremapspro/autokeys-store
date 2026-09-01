const SITE = 'https://www.autokeysremapspro.es';
const FALLBACK_IMAGE = `${SITE}/assets/img/logo.png`;

const CASE_ENDPOINTS = new Map([
  ['land-rover-discovery-4-2015-llave-rfa-autel', 'case-seo-extra'],
  ['opel-combo-md1cs003-recuperacion-arranque', 'case-seo-extra'],
  ['renault-kangoo-2007-uch-reparada', 'case-seo-extra'],
  ['golf-5-gti-med9-1-pops-bangs-tirones-corregidos', 'case-seo-extra'],
  ['golf-4-1-9-tdi-asz-stage-2-hardcut', 'case-seo-extra2'],
  ['seat-ibiza-6l-multimapa-hardcut', 'case-seo-extra2'],
  ['bmw-f36-420d-codificacion-levas', 'case-seo-extra2'],
  ['seat-leon-mk1-1-8-pops-bangs', 'case-seo-extra3'],
  ['desarrollo-edc15p-multimapa-autokeys', 'case-seo-extra3'],
  ['mercedes-2008-2009-ezs-inoperativo-dos-llaves', 'case-seo-extra4'],
]);

/*
 * Algunas fichas transaccionales tienen la misma intención principal que una
 * landing editorial/comercial reforzada. La ficha sigue operativa (precio,
 * variantes y carrito), pero todas sus señales SEO apuntan a una sola URL para
 * evitar canibalización entre dos páginas de Autokeys.
 */
const PREFERRED_PRODUCT_CANONICALS = new Map([
  ['clonacion-ecu-general', '/clonacion-centralitas-ecu'],
  ['reparacion-electronica-ecu-pcm', '/reparacion-centralitas-ecu'],
  ['llaves-copia-programacion', '/programacion-llaves-coche'],
  ['inmovilizadores-programacion', '/inmovilizador-coche'],
  ['bmw-fem-bdc', '/bmw-fem-bdc'],
  ['mercedes-ezs-elv', '/mercedes-ezs-elv'],
  ['airbag-srs-reparacion', '/reparacion-airbag-srs'],
  ['cuadros-reparacion', '/reparacion-cuadro-instrumentos'],
]);

function cleanSlug(value) {
  const slug = String(value || '').trim();
  return /^[a-z0-9][a-z0-9-]{0,180}$/.test(slug) ? slug : '';
}

function endpointFor(kind, slug) {
  if (kind === 'guide') return `/api/guide-seo?slug=${encodeURIComponent(slug)}`;
  if (kind === 'category') return `/api/render-seo?type=category&slug=${encodeURIComponent(slug)}`;
  if (kind === 'product') return `/api/render-seo?type=product&slug=${encodeURIComponent(slug)}`;
  if (kind === 'case') {
    const endpoint = CASE_ENDPOINTS.get(slug) || 'case-seo';
    return `/api/${endpoint}?slug=${encodeURIComponent(slug)}`;
  }
  return '';
}

function preferredCanonical(kind, slug) {
  if (kind !== 'product') return '';
  const path = PREFERRED_PRODUCT_CANONICALS.get(slug);
  return path ? `${SITE}${path}` : '';
}

function ensureOrganizationLogo(value) {
  if (!value || typeof value !== 'object') return;
  const type = value['@type'];
  const isOrganization = type === 'Organization' || (Array.isArray(type) && type.includes('Organization'));
  if (isOrganization && !value.logo) {
    value.logo = { '@type': 'ImageObject', url: FALLBACK_IMAGE };
  }
}

function patchSchema(value) {
  if (!value || typeof value !== 'object') return value;
  if (Array.isArray(value)) {
    value.forEach(patchSchema);
    return value;
  }

  ensureOrganizationLogo(value);

  const type = value['@type'];
  const isArticle = type === 'Article' || (Array.isArray(type) && type.includes('Article'));
  if (isArticle) {
    if (!value.image) value.image = FALLBACK_IMAGE;
    if (value.author && typeof value.author === 'object') ensureOrganizationLogo(value.author);
    if (value.publisher && typeof value.publisher === 'object') ensureOrganizationLogo(value.publisher);
  }

  const isCollection = type === 'CollectionPage' || (Array.isArray(type) && type.includes('CollectionPage'));
  if (isCollection && Array.isArray(value.mainEntity)) {
    value.mainEntity = value.mainEntity.filter((item) => {
      if (!item || typeof item !== 'object') return false;
      return item['@type'] !== 'Product';
    });
    if (!value.mainEntity.length) delete value.mainEntity;
  }

  Object.values(value).forEach((child) => {
    if (child && typeof child === 'object') patchSchema(child);
  });
  return value;
}

function patchHtml(html) {
  let output = String(html || '');

  output = output.replace(/<base\b[^>]*>/gi, '');
  output = output.replace(/<head([^>]*)>/i, '<head$1>\n<base href="/">');
  output = output.replace(/((?:href|src)=["'])\.?\/?assets\//gi, '$1/assets/');

  if (!/<link[^>]+rel=["'](?:shortcut )?icon["']/i.test(output)) {
    output = output.replace(
      /<\/head>/i,
      '<link rel="icon" type="image/png" href="/assets/img/logo.png">\n</head>',
    );
  }

  output = output.replace(
    /<script([^>]*\btype=["']application\/ld\+json["'][^>]*)>([\s\S]*?)<\/script>/gi,
    (whole, attrs, rawJson) => {
      try {
        const parsed = JSON.parse(rawJson.trim());
        const patched = patchSchema(parsed);
        const safe = JSON.stringify(patched).replace(/</g, '\\u003c');
        return `<script${attrs}>${safe}</script>`;
      } catch (_) {
        return whole;
      }
    },
  );

  return output;
}

function patchPreferredCanonical(html, kind, slug) {
  const canonical = preferredCanonical(kind, slug);
  if (!canonical) return { html, canonical: '' };

  const oldCanonical = `${SITE}/servicios/${slug}`;
  let output = String(html || '').split(oldCanonical).join(canonical);

  /* El JS de producto recalcula canonical/OG/schema tras cargar el catálogo.
     Lo fijamos también ahí para que el DOM renderizado conserve la misma URL
     preferida que el HTML servido inicialmente. */
  const runtimeUrlLine = "const url = 'https://www.autokeysremapspro.es/' + (product.isProduct ? 'productos/' : 'servicios/') + product.id;";
  output = output.replace(runtimeUrlLine, `const url = '${canonical}';`);

  return { html: output, canonical };
}

function requestOrigin(req) {
  const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || 'www.autokeysremapspro.es').split(',')[0].trim();
  return `${proto}://${host}`;
}

async function sendStyledNotFound(req, res) {
  try {
    const notFoundResponse = await fetch(`${requestOrigin(req)}/404.html`, {
      method: 'GET',
      redirect: 'manual',
    });
    const notFoundBody = await notFoundResponse.text();
    const html = patchHtml(notFoundBody);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    res.setHeader('X-AK-SEO-Health', '1');
    if (req.method === 'HEAD') return res.status(404).end();
    return res.status(404).send(html);
  } catch (_) {
    return res.status(404).send('Página no encontrada');
  }
}

async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).send('Method not allowed');
  }

  const kind = String(req.query.kind || '').trim();
  const slug = cleanSlug(req.query.slug);
  const endpoint = endpointFor(kind, slug);
  if (!slug || !endpoint) return res.status(400).send('Ruta no válida');

  try {
    const upstream = await fetch(`${requestOrigin(req)}${endpoint}`, {
      method: 'GET',
      headers: { 'x-ak-seo-health': '1' },
      redirect: 'manual',
    });
    const body = await upstream.text();

    if (upstream.status === 404) return sendStyledNotFound(req, res);
    if (!upstream.ok) {
      res.setHeader('Content-Type', upstream.headers.get('content-type') || 'text/plain; charset=utf-8');
      return res.status(upstream.status).send(body);
    }

    const baseHtml = patchHtml(body);
    const preferred = patchPreferredCanonical(baseHtml, kind, slug);
    const html = preferred.html;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', upstream.headers.get('cache-control') || 'public, s-maxage=300, stale-while-revalidate=3600');
    res.setHeader('X-AK-SEO-Health', '1');
    if (preferred.canonical) res.setHeader('X-AK-Preferred-Canonical', preferred.canonical);
    if (req.method === 'HEAD') return res.status(200).end();
    return res.status(200).send(html);
  } catch (error) {
    console.error('seo-health:', error);
    return res.status(500).send('No se pudo cargar la página');
  }
}

handler.patchHtml = patchHtml;
handler.patchSchema = patchSchema;
handler.patchPreferredCanonical = patchPreferredCanonical;
handler.sendStyledNotFound = sendStyledNotFound;
module.exports = handler;
