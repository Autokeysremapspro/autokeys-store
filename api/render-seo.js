const fs = require('fs');
const path = require('path');

const SITE = 'https://www.autokeysremapspro.es';
const SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';
const FALLBACK_IMAGE = `${SITE}/assets/img/logo.png`;

const CATEGORY_FOCUS = {
  'ecu-uce': 'Centralitas de motor ECU y UCE: diagnóstico de comunicación, recuperación de memorias, reparación electrónica, programación y comprobación de compatibilidad antes de sustituir una unidad.',
  'clonacion-ecu': 'Clonación de centralitas y transferencia de datos desde la unidad original a una donante compatible, conservando la información necesaria del vehículo cuando el estado de ambas unidades lo permite.',
  'reparacion-ecu': 'Reparación electrónica de centralitas con fallos internos, ausencia de comunicación, daños de alimentación o incidencias de memoria. Primero se diagnostica y después se confirma la intervención viable.',
  'inmovilizadores': 'Sistemas de inmovilizador y arranque: diagnóstico de llaves no reconocidas, pérdida de sincronización, sustitución de módulos y recuperación de información relacionada con el arranque.',
  'llaves': 'Duplicado, programación y recuperación de llaves de coche. Cada vehículo utiliza una arquitectura distinta de transponder, mando e inmovilizador, por lo que se identifica el sistema antes de programar.',
  'bmw-fem-bdc': 'BMW FEM y BDC: diagnóstico, recuperación, sustitución mediante donante compatible, programación y trabajos relacionados con llaves y sistemas de arranque.',
  'bmw-cas-ews': 'BMW CAS y EWS: programación de llaves, sincronización con la ECU, recuperación de datos y sustitución o clonación según la generación del sistema.',
  'mercedes-ezs-elv': 'Mercedes EZS/EIS y ELV/ESL: diagnóstico de fallos de contacto y bloqueo de dirección, reparación, recuperación y sustitución según referencias y estado de los datos.',
  'modulos': 'Módulos de confort y carrocería como UCH, BCM y BSI: diagnóstico, reparación, clonación y recuperación de configuraciones cuando el módulo original conserva información utilizable.',
  'abs-esp': 'Módulos ABS y ESP: diagnóstico electrónico, fallos de comunicación, reparación y clonación a unidades compatibles, además de las adaptaciones que cada vehículo pueda requerir.',
  'tcu-tcm': 'Unidades TCU y TCM de transmisión: lectura, recuperación, clonación y programación de controladores de cambio automático, siempre verificando hardware, software y compatibilidad.',
  'audi-j518-elv': 'Audi y VAG J518/ELV: diagnóstico de problemas de arranque y bloqueo electrónico, recuperación del módulo original, clonación o sustitución cuando el sistema lo permite.',
  'bmw-frm': 'BMW y MINI FRM: recuperación de módulos con fallos de iluminación, elevalunas, comunicación o memoria, manteniendo la configuración original siempre que los datos sean recuperables.',
  'airbag-srs': 'Módulos Airbag/SRS: diagnóstico electrónico, recuperación y tratamiento de datos almacenados cuando corresponde. La intervención del módulo no sustituye la reparación completa del sistema de seguridad.',
  'cuadros': 'Cuadros de instrumentos: diagnóstico de averías electrónicas, fallos de iluminación o comunicación y recuperación o clonación de datos según el modelo.',
  'software': 'Software y licencias desarrollados o distribuidos para profesionales de automoción, con información clara sobre compatibilidad, requisitos, soporte y modalidad de uso.',
  'reparacion-envio': 'Servicios de laboratorio por envío para clientes y talleres de toda España. Antes de enviar una unidad se revisan referencias, síntomas y material necesario para evitar desmontajes innecesarios.',
  'diagnostico': 'Diagnóstico avanzado de electrónica del automóvil para localizar el origen de fallos antes de sustituir centralitas o módulos. Se revisan códigos, comunicaciones y síntomas de forma estructurada.',
  'herramientas': 'Herramientas y equipos orientados a profesionales de electrónica, diagnosis, programación y trabajo en banco, con compatibilidad y uso definidos en cada ficha.',
  'audi-bcm2-kessy': 'Audi/VAG BCM2 y KESSY: diagnóstico, recuperación, clonación y trabajos asociados a sistemas de acceso y arranque, comprobando referencias y arquitectura antes de intervenir.',
};

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

function plainText(value) {
  return String(value == null ? '' : value)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function asArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (value == null || value === '') return [];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [value];
    } catch (_) {
      return [value];
    }
  }
  return [value];
}

function listText(value) {
  return asArray(value).map((item) => {
    if (typeof item === 'string') return plainText(item);
    if (item && typeof item === 'object') return plainText(item.text || item.label || item.name || item.desc || item.description || '');
    return plainText(item);
  }).filter(Boolean);
}

function faqItems(value) {
  return asArray(value).map((item) => {
    if (Array.isArray(item)) return [plainText(item[0]), plainText(item[1])];
    if (item && typeof item === 'object') return [plainText(item.q || item.question || item.pregunta), plainText(item.a || item.answer || item.respuesta)];
    return ['', ''];
  }).filter(([q, a]) => q && a);
}

function replaceTag(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace('</head>', `${replacement}\n</head>`);
}

function clipAtWord(value, max) {
  const text = plainText(value);
  if (text.length <= max) return text;
  const clipped = text.slice(0, max + 1).replace(/\s+\S*$/, '').replace(/[,:;\-–—.]+$/, '').trim();
  return clipped || text.slice(0, max).trim();
}

function compactTitle(name) {
  const base = plainText(name);
  const fullSuffix = ' | Autokeys Remaps Pro';
  const shortSuffix = ' | Autokeys';
  if ((base + fullSuffix).length <= 60) return base + fullSuffix;
  if ((base + shortSuffix).length <= 60) return base + shortSuffix;
  const available = 60 - shortSuffix.length;
  return clipAtWord(base, available) + shortSuffix;
}

function metaDescription(row) {
  let text = plainText(row.short_desc || row.long_desc || '');
  if (text.length < 115) {
    const extra = row.is_product
      ? ' Consulta compatibilidad, disponibilidad y soporte en Autokeys Remaps Pro.'
      : ' Diagnóstico profesional y servicio de laboratorio Autokeys Remaps Pro para clientes y talleres de toda España.';
    text = `${text}${extra}`.trim();
  }
  return clipAtWord(text, 155);
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
  if (!/<meta[^>]+name="robots"/i.test(html)) {
    html = html.replace('</head>', '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">\n</head>');
  }
  const extras = `<base href="/">\n<script id="ld-server" type="application/ld+json">${jsonLd(seo.schema)}</script>`;
  return html.replace('</head>', `${extras}\n</head>`);
}

function availability(row) {
  if (!row.is_product) return 'https://schema.org/InStock';
  if (row.stock === 'agotado' || Number(row.stock_actual) <= 0) return 'https://schema.org/OutOfStock';
  if (row.stock === 'encargo') return 'https://schema.org/PreOrder';
  return 'https://schema.org/InStock';
}

function renderBulletSection(title, items) {
  if (!items.length) return '';
  return `<section><h2>${escapeHtml(title)}</h2><ul class="feature-check">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>`;
}

function serviceContext(row, categoryLabel) {
  const name = plainText(row.name);
  const category = plainText(categoryLabel || 'electrónica del automóvil');
  return [
    `Antes de intervenir en ${name}, revisamos la referencia de la unidad, los síntomas descritos, los códigos de diagnosis disponibles y el trabajo realizado anteriormente. En electrónica del automóvil dos módulos con aspecto similar pueden utilizar hardware o software diferentes, por lo que identificar correctamente la unidad evita sustituciones innecesarias y permite elegir el procedimiento adecuado para el vehículo.`,
    `El trabajo se plantea desde un enfoque de laboratorio: primero diagnóstico y lectura de la información disponible, después reparación, recuperación, clonación o programación únicamente cuando el estado de la unidad y la compatibilidad lo permiten. Conservamos los datos originales que sean necesarios y verificamos la integridad del resultado antes de cerrar el servicio. En ${category} no aplicamos una solución genérica si el sistema requiere una comprobación específica.`,
    `Autokeys Remaps Pro trabaja desde Puente de Génave, Jaén, y recibe unidades de talleres, distribuidores y particulares de toda España. Si el servicio puede realizarse por envío, recomendamos solicitar valoración antes de desmontar o enviar nada. Con fotografías de la etiqueta, datos del vehículo y una descripción clara de la avería podemos indicar qué componentes necesitamos recibir y evitar paquetes o desmontajes innecesarios.`,
    `Cuando recibimos la unidad, el trabajo queda asociado a la referencia y al caso comunicado. Si durante la comprobación aparece una incompatibilidad, un daño diferente al descrito o una intervención previa que cambie el procedimiento, se revisa antes de continuar. Esta trazabilidad es especialmente importante en centralitas, inmovilizadores y módulos de seguridad o confort, donde conservar correctamente la información original puede ser tan importante como la reparación física.`,
  ];
}

function productContext(row) {
  const name = plainText(row.name);
  return [
    `${name} forma parte del catálogo profesional de Autokeys Remaps Pro. Antes de confirmar la compra revisa la compatibilidad indicada en la ficha, la referencia del vehículo o equipo y los requisitos técnicos aplicables. Si existe alguna duda de compatibilidad, es preferible consultarla antes de realizar el pedido para evitar adquirir una herramienta o accesorio que no corresponda al uso previsto.`,
    `Nuestro catálogo está orientado a trabajos reales de diagnosis, programación y electrónica del automóvil. La información de cada producto distingue disponibilidad, variantes, requisitos y soporte para que el profesional pueda valorar correctamente qué necesita. Cuando un artículo se trabaja bajo pedido, el plazo y las condiciones se confirman según disponibilidad del proveedor.`,
  ];
}

function serverProductBody(row, variants, categoryLabel) {
  const name = plainText(row.name);
  const intro = plainText(row.long_desc || row.short_desc || `Servicio profesional de ${name}.`);
  const features = listText(row.features);
  const whatWeFix = listText(row.what_we_fix);
  const symptoms = listText(row.symptoms);
  const compatibility = listText(row.compatibility);
  const whatToSend = listText(row.what_to_send);
  const requirements = listText(row.requirements);
  const faqs = faqItems(row.faqs);
  const image = absoluteImage(row.image);
  const context = row.is_product ? productContext(row) : serviceContext(row, categoryLabel);
  const variantNames = variants.map((v) => plainText(v.name)).filter(Boolean);

  return {
    breadcrumb: `<a href="/">Inicio</a><span>›</span><a href="/categorias/${escapeHtml(row.category_id || '')}">${escapeHtml(categoryLabel || 'Servicios')}</a><span>›</span><span class="current">${escapeHtml(name)}</span>`,
    body: `<article class="section seo-server-content" data-server-rendered="true">
      <div class="eyebrow">${escapeHtml(row.is_product ? 'PRODUCTO AUTOKEYS' : 'SERVICIO AUTOKEYS')}</div>
      <h1>${escapeHtml(name)}</h1>
      ${row.image ? `<img class="blog-post-hero" src="${escapeHtml(image)}" alt="${escapeHtml(name)}" loading="eager">` : ''}
      <p class="lead">${escapeHtml(intro)}</p>
      ${context.map((p) => `<p class="section-desc">${escapeHtml(p)}</p>`).join('')}
      ${renderBulletSection('Qué incluye este servicio', features)}
      ${renderBulletSection('Qué revisamos o solucionamos', whatWeFix)}
      ${renderBulletSection('Síntomas habituales', symptoms)}
      ${renderBulletSection('Compatibilidad', compatibility)}
      ${renderBulletSection('Qué necesitamos recibir', whatToSend)}
      ${renderBulletSection('Requisitos', requirements)}
      ${row.turnaround ? `<section><h2>Plazo orientativo</h2><p>${escapeHtml(plainText(row.turnaround))}</p></section>` : ''}
      ${row.warranty ? `<section><h2>Garantía</h2><p>${escapeHtml(plainText(row.warranty))}</p></section>` : ''}
      ${variantNames.length ? `<section><h2>Opciones disponibles</h2><ul>${variantNames.map((v) => `<li>${escapeHtml(v)}</li>`).join('')}</ul></section>` : ''}
      ${faqs.length ? `<section><h2>Preguntas frecuentes</h2>${faqs.map(([q, a]) => `<h3>${escapeHtml(q)}</h3><p>${escapeHtml(a)}</p>`).join('')}</section>` : ''}
      <p><a class="btn btn-primary" href="/enviar-reparacion.html">Solicitar valoración</a></p>
    </article>`,
  };
}

function categoryGenericParagraphs(label) {
  const category = plainText(label);
  return [
    `Esta sección reúne servicios y productos relacionados con ${category}. El objetivo es que puedas identificar rápidamente el trabajo adecuado sin mezclar procedimientos que pertenecen a sistemas distintos. Cada ficha indica el alcance del servicio, la información necesaria para valorar el caso y, cuando corresponde, las referencias o elementos que deben enviarse al laboratorio.`,
    `Antes de sustituir una unidad electrónica es importante comprobar diagnosis, referencias y compatibilidad. En Autokeys Remaps Pro priorizamos la identificación de la avería y la recuperación de la unidad original cuando resulta técnicamente viable. Si se necesita una pieza donante o una programación posterior, se confirma antes de realizar la intervención para evitar costes y desmontajes innecesarios.`,
    `Nuestro laboratorio se encuentra en Puente de Génave, Jaén. Además de la atención local, trabajamos por envío con talleres, distribuidores y particulares de toda España. Puedes revisar las fichas disponibles en esta categoría y solicitar una valoración con fotografías de la etiqueta, datos del vehículo, códigos de avería y una descripción de los síntomas.`,
  ];
}

function serverCategoryBody(row, products) {
  const label = plainText(row.label);
  const focus = CATEGORY_FOCUS[row.id] || `Servicios especializados de ${label} para diagnosis, reparación, programación y soporte técnico según la unidad y el vehículo.`;
  const generic = categoryGenericParagraphs(label);
  const cards = products.slice(0, 16).map((p) => {
    const desc = plainText(p.short_desc || p.long_desc || 'Servicio profesional Autokeys Remaps Pro.');
    const route = p.is_product ? 'productos' : 'servicios';
    return `<article class="product-card"><div class="product-body"><div class="product-cat">${escapeHtml(label)}</div><h3>${escapeHtml(plainText(p.name))}</h3><p>${escapeHtml(desc)}</p><a class="btn btn-primary btn-sm" href="/${route}/${escapeHtml(p.id)}">Ver ${p.is_product ? 'producto' : 'servicio'}</a></div></article>`;
  }).join('');
  const productNames = products.map((p) => plainText(p.name)).filter(Boolean);

  return {
    heading: `<div class="section" style="padding-bottom:0"><div class="eyebrow">AUTOKEYS REMAPS PRO</div><h1>${escapeHtml(label)}</h1><p class="section-desc">${escapeHtml(focus)}</p></div>`,
    count: `${products.length} ${products.length === 1 ? 'resultado' : 'resultados'}`,
    grid: cards,
    content: `<section class="category-seo-section" id="category-seo-content" data-server-rendered="true">
      <div class="eyebrow">INFORMACIÓN ESPECIALIZADA</div>
      <h2>Servicios de ${escapeHtml(label)}</h2>
      <p class="category-seo-intro">${escapeHtml(focus)}</p>
      ${generic.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
      ${productNames.length ? `<h3>Servicios y soluciones disponibles</h3><ul>${productNames.map((name) => `<li>${escapeHtml(name)}</li>`).join('')}</ul>` : ''}
      <h3>Cómo solicitar una valoración</h3>
      <p>Facilita marca, modelo, año, motorización, referencia de la unidad y una descripción de la avería. Si dispones de códigos de diagnosis o fotografías de la etiqueta, adjúntalos para poder revisar el caso antes de confirmar qué debes enviar.</p>
      <p><a class="btn btn-primary" href="/enviar-reparacion.html">Solicitar revisión</a></p>
    </section>`,
  };
}

function serverArticleBody(row) {
  const title = plainText(row.titulo);
  const category = plainText(row.categoria || 'GUÍA TÉCNICA');
  const summary = plainText(row.resumen || row.meta_description || '');
  const content = plainText(row.contenido || '');
  const image = absoluteImage(row.imagen_url);
  return {
    breadcrumb: `<a href="/">Inicio</a><span>›</span><a href="/blog.html">Blog</a><span>›</span><span class="current">${escapeHtml(title)}</span>`,
    body: `<article class="section seo-server-content" data-server-rendered="true">
      <div class="eyebrow">${escapeHtml(category)}</div>
      <h1>${escapeHtml(title)}</h1>
      ${row.imagen_url ? `<img class="blog-post-hero" src="${escapeHtml(image)}" alt="${escapeHtml(title)}" loading="eager">` : ''}
      ${summary ? `<p class="lead">${escapeHtml(summary)}</p>` : ''}
      <div class="blog-post-body"><p>${escapeHtml(content)}</p></div>
      <div class="blog-post-cta"><div><b>¿Necesitas ayuda con este sistema?</b><p>Consulta el catálogo o envíanos los datos de tu caso para revisarlo.</p></div><a class="btn btn-primary" href="/tienda.html">Ver servicios</a></div>
    </article>`,
  };
}

function renderBody(template, seo) {
  let html = template;
  if (seo.kind === 'product') {
    html = html.replace(/<nav class="breadcrumb" id="breadcrumb"[^>]*>[\s\S]*?<\/nav>/i, `<nav class="breadcrumb" id="breadcrumb" aria-label="Migas de pan">${seo.server.breadcrumb}</nav>`);
    html = html.replace(/<div id="detail-root"><\/div>/i, `<div id="detail-root">${seo.server.body}</div>`);
    html = html.replace(/alt="" loading="lazy"/g, 'alt="Vista adicional del servicio Autokeys Remaps Pro" loading="lazy"');
    html = html.replace("'<h1>' + product.name + '</h1>'", "'<h' + '1>' + product.name + '</h' + '1>'");
  } else if (seo.kind === 'category') {
    html = html.replace(/<div class="section" style="padding-bottom:0">[\s\S]*?<\/div>\s*<div class="store-layout">/i, `${seo.server.heading}\n<div class="store-layout">`);
    html = html.replace(/<div id="result-count"[^>]*><\/div>/i, `<div id="result-count" style="color:var(--muted);font-size:13px">${escapeHtml(seo.server.count)}</div>`);
    html = html.replace(/<div class="product-grid cols-4" id="store-grid"><\/div>/i, `<div class="product-grid cols-4" id="store-grid">${seo.server.grid}</div>`);
    html = html.replace(/<section class="category-seo-section" id="category-seo-content" hidden><\/section>/i, seo.server.content);
  } else if (seo.kind === 'article') {
    html = html.replace(/<nav class="breadcrumb" id="breadcrumb"[^>]*>[\s\S]*?<\/nav>/i, `<nav class="breadcrumb" id="breadcrumb" aria-label="Migas de pan">${seo.server.breadcrumb}</nav>`);
    html = html.replace(/<div class="section" id="post-root"[^>]*>[\s\S]*?<\/div>/i, `<div class="section" id="post-root" style="padding-bottom:0">${seo.server.body}</div>`);
  }
  return html;
}

async function productSeo(slug) {
  const [products, variants] = await Promise.all([
    rest(`tienda_productos?id=eq.${encodeURIComponent(slug)}&activo=eq.true&select=*`),
    rest(`tienda_producto_variantes?producto_id=eq.${encodeURIComponent(slug)}&select=variant_key,name,description,price&order=sort_order`),
  ]);
  const row = products[0];
  if (!row) return null;
  const categoryRows = row.category_id ? await rest(`tienda_categorias?id=eq.${encodeURIComponent(row.category_id)}&select=id,label`) : [];
  const categoryLabel = categoryRows[0] ? categoryRows[0].label : 'Servicios';
  const isProduct = Boolean(row.is_product);
  const url = `${SITE}/${isProduct ? 'productos' : 'servicios'}/${row.id}`;
  const prices = variants.map((v) => Number(v.price)).filter(Number.isFinite);
  const price = prices.length ? Math.min(...prices) : Number(row.price_from || 0);
  const description = metaDescription(row);
  const image = absoluteImage(row.image);
  return {
    kind: 'product', template: 'producto.html',
    title: compactTitle(row.name), description, url, image,
    server: serverProductBody(row, variants, categoryLabel),
    schema: {
      '@context': 'https://schema.org', '@type': isProduct ? 'Product' : 'Service',
      name: row.name, description: plainText(row.long_desc || row.short_desc), image,
      brand: { '@type': 'Brand', name: 'Autokeys Remaps Pro' },
      offers: { '@type': 'Offer', priceCurrency: 'EUR', price, availability: availability(row), url },
      ...(!isProduct ? { provider: { '@type': 'AutomotiveBusiness', '@id': `${SITE}/#business`, name: 'Autokeys Remaps Pro', url: SITE }, areaServed: { '@type': 'Country', name: 'España' } } : {}),
    },
  };
}

async function categorySeo(slug) {
  const [rows, products] = await Promise.all([
    rest(`tienda_categorias?id=eq.${encodeURIComponent(slug)}&select=id,label`),
    rest(`tienda_productos?category_id=eq.${encodeURIComponent(slug)}&activo=eq.true&select=id,name,short_desc,long_desc,is_product&order=sort_order`),
  ]);
  const row = rows[0];
  if (!row) return null;
  const url = `${SITE}/categorias/${row.id}`;
  const focus = CATEGORY_FOCUS[row.id] || `Servicios y productos de ${String(row.label).toLowerCase()} en Autokeys Remaps Pro.`;
  const description = clipAtWord(`${focus} Servicio profesional desde Jaén y por envío en toda España.`, 155);
  return {
    kind: 'category', template: 'tienda.html', title: compactTitle(row.label), description, url, image: FALLBACK_IMAGE,
    server: serverCategoryBody(row, products),
    schema: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: row.label, description, url, isPartOf: { '@type': 'WebSite', name: 'Autokeys Remaps Pro', url: SITE }, mainEntity: products.map((p) => ({ '@type': p.is_product ? 'Product' : 'Service', name: p.name, url: `${SITE}/${p.is_product ? 'productos' : 'servicios'}/${p.id}` })) },
  };
}

async function articleSeo(slug) {
  const rows = await rest(`tienda_blog_posts?slug=eq.${encodeURIComponent(slug)}&publicado=eq.true&select=*`);
  const row = rows[0];
  if (!row) return null;
  const url = `${SITE}/guias/${row.slug}`;
  const description = clipAtWord(row.meta_description || row.resumen || row.contenido || '', 155);
  const rawTitle = plainText(row.meta_title || row.titulo);
  const title = /autokeys remaps pro/i.test(rawTitle) ? rawTitle : compactTitle(rawTitle);
  const image = absoluteImage(row.imagen_url);
  return {
    kind: 'article', template: 'blog-post.html', title, description, url, image,
    server: serverArticleBody(row),
    schema: { '@context': 'https://schema.org', '@type': 'Article', headline: row.titulo, description, image, datePublished: row.publicado_en, dateModified: row.updated_at || row.publicado_en, author: { '@type': 'Organization', name: row.autor || 'Autokeys Remaps Pro' }, publisher: { '@type': 'Organization', name: 'Autokeys Remaps Pro', logo: { '@type': 'ImageObject', url: FALLBACK_IMAGE } }, mainEntityOfPage: url },
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).send('Método no permitido');
  const requestUrl = new URL(req.url, SITE);
  const type = String(requestUrl.searchParams.get('type') || '');
  const slug = cleanSlug(requestUrl.searchParams.get('slug') || requestUrl.searchParams.get('id'));
  if (!slug || !['product', 'category', 'article'].includes(type)) return res.status(400).send('Ruta no válida');
  try {
    const seo = type === 'product' ? await productSeo(slug) : type === 'category' ? await categorySeo(slug) : await articleSeo(slug);
    if (!seo) return res.status(404).send('Página no encontrada');
    const template = fs.readFileSync(path.join(process.cwd(), seo.template), 'utf8');
    const html = renderBody(renderHead(template, seo), seo);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    return res.status(200).send(html);
  } catch (error) {
    console.error('render-seo:', error);
    return res.status(500).send('No se pudo cargar la página');
  }
};