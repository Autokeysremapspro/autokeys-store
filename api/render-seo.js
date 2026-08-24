const fs = require('fs');
const path = require('path');

const SITE = 'https://www.autokeysremapspro.es';
const SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';
const FALLBACK_IMAGE = `${SITE}/assets/img/logo.png`;

function serviceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || '';
}

function cleanSlug(value) {
  const slug = String(value || '').trim();
  return /^[a-z0-9][a-z0-9-]{0,159}$/.test(slug) ? slug : '';
}

function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function jsonLd(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function absoluteImage(src) {
  if (!src) return FALLBACK_IMAGE;
  return /^https?:\/\//i.test(src) ? src : `${SITE}/${String(src).replace(/^\//, '')}`;
}

async function rest(resource) {
  const key = serviceKey();
  if (!key) throw new Error('missing_service_key');
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${resource}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!response.ok) throw new Error(`supabase_${response.status}`);
  return response.json();
}

function replaceTag(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace('</head>', `${replacement}\n</head>`);
}

function renderHead(template, seo) {
  let html = template;
  html = replaceTag(html, /<title[^>]*>[\s\S]*?<\/title>/i, `<title id="page-title">${escapeHtml(seo.title)}</title>`);
  html = replaceTag(html, /<meta[^>]+name="description"[^>]*>/i, `<meta id="meta-description" name="description" content="${escapeHtml(seo.description)}">`);
  html = replaceTag(html, /<link[^>]+rel="canonical"[^>]*>/i, `<link id="link-canonical" rel="canonical" href="${escapeHtml(seo.url)}">`);
  html = replaceTag(html, /<meta[^>]+property="og:title"[^>]*>/i, `<meta id="meta-og-title" property="og:title" content="${escapeHtml(seo.title)}">`);
  html = replaceTag(html, /<meta[^>]+property="og:description"[^>]*>/i, `<meta id="meta-og-description" property="og:description" content="${escapeHtml(seo.description)}">`);
  html = replaceTag(html, /<meta[^>]+property="og:url"[^>]*>/i, `<meta id="meta-og-url" property="og:url" content="${escapeHtml(seo.url)}">`);
  html = replaceTag(html, /<meta[^>]+property="og:image"[^>]*>/i, `<meta id="meta-og-image" property="og:image" content="${escapeHtml(seo.image)}">`);
  html = replaceTag(html, /<meta[^>]+name="twitter:title"[^>]*>/i, `<meta id="meta-twitter-title" name="twitter:title" content="${escapeHtml(seo.title)}">`);
  html = replaceTag(html, /<meta[^>]+name="twitter:description"[^>]*>/i, `<meta id="meta-twitter-description" name="twitter:description" content="${escapeHtml(seo.description)}">`);
  html = replaceTag(html, /<meta[^>]+name="twitter:image"[^>]*>/i, `<meta id="meta-twitter-image" name="twitter:image" content="${escapeHtml(seo.image)}">`);
  const extras = `<base href="/">\n<script id="ld-server" type="application/ld+json">${jsonLd(seo.schema)}</script>`;
  return html.replace('</head>', `${extras}\n</head>`);
}

function availability(row) {
  if (!row.is_product) return 'https://schema.org/InStock';
  if (row.stock === 'agotado' || Number(row.stock_actual) <= 0) return 'https://schema.org/OutOfStock';
  if (row.stock === 'encargo') return 'https://schema.org/PreOrder';
  return 'https://schema.org/InStock';
}

async function productSeo(slug) {
  const [products, variants] = await Promise.all([
    rest(`tienda_productos?id=eq.${encodeURIComponent(slug)}&activo=eq.true&select=*`),
    rest(`tienda_producto_variantes?producto_id=eq.${encodeURIComponent(slug)}&select=price&order=sort_order`),
  ]);
  const row = products[0];
  if (!row) return null;
  const isProduct = Boolean(row.is_product);
  const url = `${SITE}/${isProduct ? 'productos' : 'servicios'}/${row.id}`;
  const prices = variants.map((v) => Number(v.price)).filter(Number.isFinite);
  const price = prices.length ? Math.min(...prices) : Number(row.price_from || 0);
  const description = String(row.short_desc || row.long_desc || `Servicio profesional de ${row.name}.`).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);
  const image = absoluteImage(row.image);
  return {
    template: 'producto.html',
    title: `${row.name} — Autokeys Remaps Pro`, description, url, image,
    schema: {
      '@context': 'https://schema.org', '@type': isProduct ? 'Product' : 'Service',
      name: row.name, description: row.long_desc || row.short_desc, image,
      brand: { '@type': 'Brand', name: 'Autokeys Remaps Pro' },
      offers: { '@type': 'Offer', priceCurrency: 'EUR', price, availability: availability(row), url },
      ...(!isProduct ? { provider: { '@type': 'AutomotiveBusiness', name: 'Autokeys Remaps Pro', url: SITE }, areaServed: 'ES' } : {}),
    },
  };
}

async function categorySeo(slug) {
  const rows = await rest(`tienda_categorias?id=eq.${encodeURIComponent(slug)}&select=id,label`);
  const row = rows[0];
  if (!row) return null;
  const url = `${SITE}/categorias/${row.id}`;
  const description = `Servicios y productos de ${String(row.label).toLowerCase()} en Autokeys Remaps Pro: atención profesional, garantía y servicio para toda España.`;
  return {
    template: 'tienda.html', title: `${row.label} — Autokeys Remaps Pro`, description, url, image: FALLBACK_IMAGE,
    schema: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: row.label, description, url, isPartOf: { '@type': 'WebSite', name: 'Autokeys Remaps Pro', url: SITE } },
  };
}

async function articleSeo(slug) {
  const rows = await rest(`tienda_blog_posts?slug=eq.${encodeURIComponent(slug)}&publicado=eq.true&select=*`);
  const row = rows[0];
  if (!row) return null;
  const url = `${SITE}/guias/${row.slug}`;
  const description = String(row.meta_description || row.resumen || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);
  const rawTitle = String(row.meta_title || row.titulo);
  const title = /autokeys remaps pro/i.test(rawTitle) ? rawTitle : `${rawTitle} | Autokeys Remaps Pro`;
  const image = absoluteImage(row.imagen_url);
  return {
    template: 'blog-post.html', title, description, url, image,
    schema: { '@context': 'https://schema.org', '@type': 'Article', headline: row.titulo, description, image, datePublished: row.publicado_en, dateModified: row.updated_at || row.publicado_en, author: { '@type': 'Organization', name: row.autor || 'Autokeys Remaps Pro' }, publisher: { '@type': 'Organization', name: 'Autokeys Remaps Pro', logo: { '@type': 'ImageObject', url: FALLBACK_IMAGE } }, mainEntityOfPage: url },
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).send('Método no permitido');
  const type = String(req.query.type || '');
  const slug = cleanSlug(req.query.slug || req.query.id);
  if (!slug || !['product', 'category', 'article'].includes(type)) return res.status(400).send('Ruta no válida');
  try {
    const seo = type === 'product' ? await productSeo(slug) : type === 'category' ? await categorySeo(slug) : await articleSeo(slug);
    if (!seo) return res.status(404).send('Página no encontrada');
    const template = fs.readFileSync(path.join(process.cwd(), seo.template), 'utf8');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    return res.status(200).send(renderHead(template, seo));
  } catch (error) {
    console.error('render-seo:', error);
    return res.status(500).send('No se pudo cargar la página');
  }
};
