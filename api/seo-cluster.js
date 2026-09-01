const SITE = 'https://www.autokeysremapspro.es';
const BUSINESS_ID = `${SITE}/#business`;
const IMAGE = `${SITE}/assets/img/hero-taller.webp`;

function esc(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
}

function jsonLd(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

module.exports = function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).send('Method not allowed');
  }

  const canonical = `${SITE}/reparacion-cuadro-instrumentos`;
  const title = 'Reparación de Cuadro de Instrumentos | Autokeys';
  const description = 'Diagnóstico y reparación electrónica de cuadros de instrumentos: fallos de pantalla, iluminación, agujas, comunicación y datos. Servicio Autokeys Remaps Pro.';
  const h1 = 'Reparación de cuadros de instrumentos del coche';

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Reparación electrónica de cuadros de instrumentos',
    description,
    url: canonical,
    image: IMAGE,
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Jaén' },
      { '@type': 'Country', name: 'España' }
    ],
    provider: {
      '@type': 'AutomotiveBusiness',
      '@id': BUSINESS_ID,
      name: 'Autokeys Remaps Pro',
      url: `${SITE}/`,
      telephone: '+34953852778',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Av. Andalucía 125, Bajo',
        postalCode: '23350',
        addressLocality: 'Puente de Génave',
        addressRegion: 'Jaén',
        addressCountry: 'ES'
      }
    }
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      ['¿Qué averías puede tener un cuadro de instrumentos?', 'Pantallas sin imagen, iluminación intermitente, agujas que no responden, reinicios, fallos de comunicación o problemas de memoria son algunas incidencias habituales.'],
      ['¿Se puede reparar un cuadro sin cambiarlo completo?', 'En muchos casos sí. Primero se diagnostica la avería y se comprueba si el problema está en alimentación, componentes, memoria o comunicación.'],
      ['¿Podéis trabajar un cuadro por envío?', 'En determinadas averías sí. Antes de enviar necesitamos la referencia del cuadro, vehículo, síntomas y, si existe, la diagnosis disponible.'],
      ['¿Un cuadro usado funciona directamente?', 'No siempre. Dependiendo del vehículo puede contener datos, configuración o información de inmovilizador que requieren adaptación.']
    ].map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a }
    }))
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: h1, item: canonical }
    ]
  };

  const webpageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    inLanguage: 'es-ES',
    dateModified: '2026-09-01',
    isPartOf: { '@id': `${SITE}/#website` },
    about: { '@id': BUSINESS_ID }
  };

  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Autokeys Remaps Pro">
<meta property="og:locale" content="es_ES">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${IMAGE}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${IMAGE}">
<link rel="stylesheet" href="/assets/css/style.css">
<link rel="icon" type="image/png" href="/assets/img/logo.png">
<script type="application/ld+json">${jsonLd(serviceSchema)}</script>
<script type="application/ld+json">${jsonLd(faqSchema)}</script>
<script type="application/ld+json">${jsonLd(breadcrumbSchema)}</script>
<script type="application/ld+json">${jsonLd(webpageSchema)}</script>
</head>
<body>
<a class="skip-link" href="#main">Saltar al contenido</a>
<header id="site-header"></header>
<main id="main">
<nav class="breadcrumb" aria-label="Migas de pan"><a href="/">Inicio</a><span>›</span><span class="current">${esc(h1)}</span></nav>

<section class="section" style="padding-bottom:18px">
  <div class="eyebrow">CUADRO · CLUSTER · ELECTRÓNICA</div>
  <h1>${esc(h1)}</h1>
  <p class="section-desc">Diagnosticamos cuadros de instrumentos con fallos de pantalla, iluminación, agujas, reinicios, comunicación o memoria. Antes de sustituir la unidad comprobamos la referencia y los síntomas para decidir si el cuadro puede repararse, recuperar sus datos o requiere una adaptación diferente.</p>
  <div class="btn-row" style="margin-top:22px">
    <a class="btn btn-primary" href="https://wa.me/34632982646" target="_blank" rel="noopener">Consultar por WhatsApp</a>
    <a class="btn btn-secondary" href="tel:+34953852778">Llamar al laboratorio</a>
  </div>
</section>

<section class="section">
  <div class="eyebrow">SÍNTOMAS HABITUALES</div>
  <h2>Fallos frecuentes en el cuadro de instrumentos</h2>
  <ul>
    <li>Pantalla apagada, incompleta o con segmentos defectuosos</li>
    <li>Agujas que no se mueven o marcan valores incorrectos</li>
    <li>Iluminación intermitente o zonas sin luz</li>
    <li>Cuadro que se reinicia o pierde información</li>
    <li>Fallo de comunicación con diagnosis o con otros módulos</li>
    <li>Problemas de memoria, configuración o datos después de una sustitución</li>
  </ul>
</section>

<section class="section">
  <h2>Un cuadro dañado no siempre necesita sustituirse</h2>
  <p class="section-desc">Un fallo en el cluster puede deberse a alimentación, soldaduras, componentes internos, memoria o comunicaciones. Por eso primero se comprueba el origen de la avería. Cuando la unidad original conserva sus datos, repararla puede evitar problemas adicionales de configuración o compatibilidad.</p>
</section>

<section class="section">
  <h2>Reparación, recuperación y adaptación</h2>
  <p class="section-desc">Según el modelo y la referencia, el trabajo puede consistir en reparar la electrónica original, recuperar información de memoria, clonar datos a una unidad compatible o adaptar un cuadro de sustitución. En algunos vehículos el cuadro participa también en funciones de inmovilizador o configuración, por lo que no debe tratarse como una pieza completamente independiente.</p>
</section>

<section class="section">
  <h2>Cuadro de instrumentos por envío</h2>
  <p class="section-desc">Cuando la avería puede trabajarse con el módulo desmontado, recibimos cuadros de talleres y clientes de otras provincias. Antes del envío necesitamos fotografías de la referencia, datos del vehículo, descripción del fallo y cualquier código de diagnosis disponible para confirmar qué material hace falta.</p>
</section>

<section class="section">
  <div class="eyebrow">INFORMACIÓN ÚTIL</div>
  <h2>Contenido relacionado</h2>
  <div class="cat-grid">
    <a class="cat-item" href="/guias/cuadro-instrumentos-averias-comunes"><span><b>Averías comunes del cuadro de instrumentos</b></span></a>
    <a class="cat-item" href="/electronica-automovil-jaen.html"><span><b>Electrónica del automóvil en Jaén</b></span></a>
    <a class="cat-item" href="/reparacion-centralita-por-envio"><span><b>Reparación electrónica por envío</b></span></a>
    <a class="cat-item" href="/inmovilizador-coche"><span><b>Diagnóstico de inmovilizador</b></span></a>
  </div>
</section>

<section class="section">
  <div class="eyebrow">PREGUNTAS FRECUENTES</div>
  <h2>Dudas habituales sobre cuadros de instrumentos</h2>
  <div class="product-grid cols-2">
    <article><h3>¿Qué averías puede tener un cuadro de instrumentos?</h3><p>Pantallas sin imagen, iluminación intermitente, agujas que no responden, reinicios, fallos de comunicación o problemas de memoria son algunas incidencias habituales.</p></article>
    <article><h3>¿Se puede reparar un cuadro sin cambiarlo completo?</h3><p>En muchos casos sí. Primero se diagnostica la avería y se comprueba si el problema está en alimentación, componentes, memoria o comunicación.</p></article>
    <article><h3>¿Podéis trabajar un cuadro por envío?</h3><p>En determinadas averías sí. Antes de enviar necesitamos la referencia del cuadro, vehículo, síntomas y, si existe, la diagnosis disponible.</p></article>
    <article><h3>¿Un cuadro usado funciona directamente?</h3><p>No siempre. Dependiendo del vehículo puede contener datos, configuración o información de inmovilizador que requieren adaptación.</p></article>
  </div>
</section>

<section class="section">
  <div class="eyebrow">AUTOKEYS REMAPS PRO</div>
  <h2>¿Tienes un cuadro de instrumentos averiado?</h2>
  <p class="section-desc">Envíanos marca, modelo, año, referencia del cuadro y síntomas. Te indicamos si necesitamos el vehículo o si la unidad puede trabajarse por envío.</p>
  <div class="btn-row" style="margin-top:22px">
    <a class="btn btn-primary" href="https://wa.me/34632982646" target="_blank" rel="noopener">Enviar consulta</a>
    <a class="btn btn-secondary" href="/enviar-reparacion.html">Enviar una unidad</a>
  </div>
</section>
</main>
<footer id="site-footer"></footer>
<script defer src="/assets/js/catalog.js"></script>
<script defer src="/assets/js/cart.js"></script>
<script defer src="/assets/js/app.js"></script>
<script defer src="/_vercel/insights/script.js"></script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.setHeader('X-AK-SEO-Cluster', '1');
  if (req.method === 'HEAD') return res.status(200).end();
  return res.status(200).send(html);
};
