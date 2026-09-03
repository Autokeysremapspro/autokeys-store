const SITE = 'https://www.autokeysremapspro.es';
const SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';
const FALLBACK_IMAGE = `${SITE}/assets/img/logo.png`;
const BLOG_COVER_BY_SLUG = {
  'perdida-total-de-llaves-de-coche-que-hacer-cuando-no-queda-ninguna': '/assets/img/blog/perdida-total-llaves.webp',
  'clonacion-de-centralitas-ecu-cuando-es-necesaria-y-como-funciona': '/assets/img/blog/clonacion-centralitas-ecu.webp',
  'mercedes-ezs-elv-que-es-y-como-se-soluciona-un-fallo-de-arranque': '/assets/img/blog/mercedes-ezs-elv.webp',
};

function serviceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || '';
}

function cleanSlug(value) {
  const slug = String(value || '').trim();
  return /^[a-z0-9][a-z0-9-]{0,180}$/.test(slug) ? slug : '';
}

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function plainText(value) {
  return String(value == null ? '' : value)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function stripBrand(value) {
  return plainText(value)
    .replace(/\s*[|—–-]\s*Autokeys(?:\s+Remaps\s+Pro)?(?:\s+Store)?\s*$/i, '')
    .trim();
}

function trimDanglingWords(value) {
  let text = value.trim();
  let previous = '';
  while (text !== previous) {
    previous = text;
    text = text.replace(/\s+(?:y|e|o|u|de|del|la|el|los|las|en|con|para|por|a|al)$/i, '').trim();
  }
  return text;
}

function clipAtWord(value, max) {
  const text = plainText(value);
  if (text.length <= max) return trimDanglingWords(text);
  const clipped = text.slice(0, max + 1).replace(/\s+\S*$/, '').replace(/[,:;\-–—.]+$/, '').trim();
  return trimDanglingWords(clipped || text.slice(0, max).trim());
}

function seoTitle(value) {
  const base = stripBrand(value);
  const fullSuffix = ' | Autokeys Remaps Pro';
  const shortSuffix = ' | Autokeys';
  if ((base + fullSuffix).length <= 60) return base + fullSuffix;
  if ((base + shortSuffix).length <= 60) return base + shortSuffix;
  return clipAtWord(base, 60 - shortSuffix.length) + shortSuffix;
}

function absoluteImage(src, slug) {
  src = src || BLOG_COVER_BY_SLUG[slug];
  if (!src) return FALLBACK_IMAGE;
  return /^https?:\/\//i.test(src) ? src : `${SITE}/${String(src).replace(/^\//, '')}`;
}

function jsonLd(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function articleParagraphs(value) {
  const text = plainText(value);
  const blocks = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  if (blocks.length > 1) return blocks;
  const sentences = text.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) || [];
  if (sentences.length < 5) return text ? [text] : [];
  const paragraphs = [];
  for (let i = 0; i < sentences.length; i += 3) {
    paragraphs.push(sentences.slice(i, i + 3).join(' ').replace(/\s+/g, ' ').trim());
  }
  return paragraphs.filter(Boolean);
}

function cleanArticleHref(value) {
  const href = String(value || '').trim();
  if (!href) return '';
  if (/^https?:\/\//i.test(href) || /^(?:mailto:|tel:)/i.test(href)) return href;
  if (/^\/(?!\/)/.test(href)) return href;
  if (/^index\.html#contacto$/i.test(href)) return '/enviar-reparacion.html';
  const category = href.match(/^tienda\.html\?cat=([a-z0-9-]+)$/i);
  if (category) return `/categorias/${category[1]}`;
  if (/^[a-z0-9][a-z0-9._/-]*(?:[?#].*)?$/i.test(href)) return `/${href}`;
  return '';
}

function safeArticleHtml(value) {
  const allowed = new Set(['p', 'h2', 'h3', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'br', 'blockquote']);
  let html = String(value == null ? '' : value)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|iframe|object|embed|form|svg|math)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(script|style|iframe|object|embed|form|svg|math)[^>]*\/?>/gi, '');

  html = html.replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (whole, rawName, attrs) => {
    const name = String(rawName || '').toLowerCase();
    if (!allowed.has(name)) return '';
    const closing = /^<\//.test(whole);
    if (closing) return `</${name}>`;
    if (name === 'br') return '<br>';
    if (name === 'a') {
      const match = String(attrs || '').match(/\bhref\s*=\s*(["'])(.*?)\1/i);
      const href = cleanArticleHref(match ? match[2] : '');
      return href ? `<a href="${esc(href)}">` : '<a>';
    }
    return `<${name}>`;
  });

  if (!/<(?:p|h2|h3|ul|ol|li|blockquote)\b/i.test(html)) {
    return articleParagraphs(value).map((p) => `<p>${esc(p)}</p>`).join('');
  }
  return html;
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

function relatedLinks(categoryId) {
  const links = {
    'llaves': [
      ['Programación de llaves', '/programacion-llaves-coche'],
      ['Pérdida total de llaves', '/perdida-total-llaves-coche'],
      ['Duplicado de llaves en Jaén', '/duplicado-llaves-coche-jaen'],
    ],
    'inmovilizadores': [
      ['Programación de llaves', '/programacion-llaves-coche'],
      ['Pérdida total de llaves', '/perdida-total-llaves-coche'],
      ['Centralitas ECU', '/reparacion-centralitas-ecu'],
    ],
    'ecu-uce': [
      ['Reparación de centralitas ECU', '/reparacion-centralitas-ecu'],
      ['Clonación de centralitas ECU', '/clonacion-centralitas-ecu'],
      ['Reparación por envío', '/reparacion-centralita-por-envio'],
    ],
    'reparacion-ecu': [
      ['Reparación de centralitas ECU', '/reparacion-centralitas-ecu'],
      ['Clonación de centralitas ECU', '/clonacion-centralitas-ecu'],
      ['Reparación por envío', '/reparacion-centralita-por-envio'],
    ],
    'airbag-srs': [
      ['Reparación Airbag / SRS', '/reparacion-airbag-srs'],
      ['Reparación por envío', '/reparacion-centralita-por-envio'],
      ['Electrónica en Jaén', '/electronica-automovil-jaen.html'],
    ],
    'bmw-fem-bdc': [
      ['BMW FEM / BDC', '/bmw-fem-bdc'],
      ['Programación de llaves', '/programacion-llaves-coche'],
      ['Reparación por envío', '/reparacion-centralita-por-envio'],
    ],
    'cuadros': [
      ['Electrónica del automóvil en Jaén', '/electronica-automovil-jaen.html'],
      ['Reparación por envío', '/reparacion-centralita-por-envio'],
      ['Catálogo Autokeys', '/tienda.html'],
    ],
  };
  return links[categoryId] || [
    ['Centralitas ECU', '/reparacion-centralitas-ecu'],
    ['Programación de llaves', '/programacion-llaves-coche'],
    ['Catálogo Autokeys', '/tienda.html'],
  ];
}

function renderPage(row) {
  const canonical = `${SITE}/guias/${row.slug}`;
  const title = seoTitle(row.meta_title || row.titulo);
  const description = clipAtWord(row.meta_description || row.resumen || row.contenido || '', 155);
  const image = absoluteImage(row.imagen_url, row.slug);
  const articleTitle = plainText(row.titulo);
  const summary = plainText(row.resumen || '');
  const articleHtml = safeArticleHtml(row.contenido || '');
  const category = plainText(row.categoria || 'GUÍA TÉCNICA');
  const links = relatedLinks(row.categoria_tienda_id);
  const published = row.publicado_en ? new Date(row.publicado_en).toISOString().slice(0, 10) : '';
  const modified = row.updated_at ? new Date(row.updated_at).toISOString().slice(0, 10) : published;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: articleTitle,
    description,
    image,
    datePublished: row.publicado_en || undefined,
    dateModified: row.updated_at || row.publicado_en || undefined,
    author: { '@type': 'Organization', name: row.autor || 'Autokeys Remaps Pro' },
    publisher: { '@type': 'Organization', name: 'Autokeys Remaps Pro', logo: { '@type': 'ImageObject', url: FALLBACK_IMAGE } },
    mainEntityOfPage: canonical,
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Guías', item: `${SITE}/blog.html` },
      { '@type': 'ListItem', position: 3, name: articleTitle, item: canonical },
    ],
  };

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Autokeys Remaps Pro">
<meta property="og:locale" content="es_ES">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(image)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(image)}">
<base href="/">
<link rel="stylesheet" href="/assets/css/style.css">
<script type="application/ld+json">${jsonLd(schema)}</script>
<script type="application/ld+json">${jsonLd(breadcrumb)}</script>
</head>
<body>
<a class="skip-link" href="#main">Saltar al contenido</a>
<header id="site-header" data-active="blog"></header>
<main id="main">
<nav class="breadcrumb" aria-label="Migas de pan"><a href="/">Inicio</a><span>›</span><a href="/blog.html">Blog</a><span>›</span><span class="current">${esc(articleTitle)}</span></nav>
<article class="section">
  <div class="eyebrow">${esc(category)}</div>
  <h1>${esc(articleTitle)}</h1>
  <div class="blog-meta">${published ? `<span>Publicado ${esc(published)}</span>` : ''}${modified && modified !== published ? `<span> · Actualizado ${esc(modified)}</span>` : ''}</div>
  ${image !== FALLBACK_IMAGE ? `<img class="blog-post-hero" src="${esc(image)}" alt="${esc(articleTitle)}" loading="eager">` : ''}
  ${summary ? `<p class="lead">${esc(summary)}</p>` : ''}
  <div class="blog-post-body">${articleHtml}</div>
  <div class="blog-post-cta"><div><b>¿Necesitas ayuda con este sistema?</b><p>Cuéntanos el caso y revisaremos qué servicio o unidad necesitamos.</p></div><a class="btn btn-primary" href="/enviar-reparacion.html">Solicitar valoración</a></div>
</article>
<section class="section">
  <div class="eyebrow">SERVICIOS RELACIONADOS</div>
  <h2>Del contenido técnico al servicio adecuado</h2>
  <div class="cat-grid">${links.map(([label, href]) => `<a class="cat-item" href="${esc(href)}"><span><b>${esc(label)}</b><p style="margin:4px 0 0;color:var(--muted);font-size:12px">Ver información y servicio</p></span></a>`).join('')}</div>
</section>
</main>
<footer id="site-footer"></footer>
<script defer src="/assets/js/catalog.js"></script>
<script defer src="/assets/js/cart.js"></script>
<script defer src="/assets/js/app.js"></script>
<script defer src="/_vercel/insights/script.js"></script>
</body>
</html>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).send('Método no permitido');
  const requestUrl = new URL(req.url, SITE);
  const slug = cleanSlug(requestUrl.searchParams.get('slug'));
  if (!slug) return res.status(400).send('Ruta no válida');

  try {
    const rows = await rest(`tienda_blog_posts?slug=eq.${encodeURIComponent(slug)}&publicado=eq.true&select=*`);
    const row = rows[0];
    if (!row) return res.status(404).send('Artículo no encontrado');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    return res.status(200).send(renderPage(row));
  } catch (error) {
    console.error('guide-seo:', error);
    return res.status(500).send('No se pudo cargar la guía');
  }
};
