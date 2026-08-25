const SITE = 'https://www.autokeysremapspro.es';
const FALLBACK_IMAGE = `${SITE}/assets/img/logo.png`;

const CASES = {
  'seat-leon-mk1-1-8-pops-bangs': {
    title: 'Seat León Mk1 1.8: calibración Pops & Bangs',
    meta: 'Caso real Seat León Mk1 1.8 atmosférico: trabajo de calibración Pops & Bangs realizado y comprobado sin atribuir datos de ECU no documentados.',
    category: 'SEAT LEÓN MK1 · 1.8 · CALIBRACIÓN',
    intro: 'Este Seat León Mk1 equipado con motor 1.8 atmosférico recibió un trabajo de calibración Pops & Bangs. Del caso tenemos confirmado el vehículo, la motorización y el trabajo realizado, por lo que la documentación pública se centra en esos hechos y evita añadir una referencia de ECU, herramienta de lectura o cifras de potencia que no estén registradas.',
    facts: ['Seat León Mk1', 'Motor 1.8 atmosférico', 'Calibración Pops & Bangs', 'Trabajo realizado', 'Comprobación en vehículo', 'Sin datos técnicos inventados'],
    sections: [
      {
        title: 'Un trabajo de calibración sobre un motor atmosférico',
        paragraphs: [
          'El punto de partida era un León Mk1 1.8 atmosférico sobre el que se buscaba incorporar una respuesta específica en retención. En un motor atmosférico el comportamiento y las posibilidades de la calibración son diferentes a las de un motor turbo, por lo que no tiene sentido trasladar ajustes de otra plataforma sin comprobarlos.',
          'El trabajo se planteó sobre el vehículo concreto y se mantuvo separado de cualquier dato que no estuviera documentado en la intervención.'
        ]
      },
      {
        title: 'Preparación de la calibración',
        paragraphs: [
          'La calibración se trabajó buscando integrar el efecto solicitado dentro del funcionamiento normal del vehículo. La prioridad fue que la modificación formara parte de una estrategia coherente y no quedara como un cambio aislado aplicado sin comprobar.',
          'No publicamos en este caso una referencia concreta de ECU ni una herramienta de lectura porque esos datos no están confirmados en la documentación disponible.'
        ]
      },
      {
        title: 'Comprobación sobre el coche',
        paragraphs: [
          'Después de preparar la calibración se comprobó el resultado sobre el vehículo. El trabajo quedó cerrado con la configuración solicitada funcionando como estaba previsto.',
          'Esa comprobación final es la que permite convertir una modificación de archivo en un caso real documentado, en lugar de presentar únicamente una configuración teórica.'
        ]
      },
      {
        title: 'Qué aporta este caso',
        paragraphs: [
          'Este León amplía nuestra biblioteca con una plataforma diferente a los TDI y GTI que ya tenemos publicados. Nos permite mostrar que la metodología de identificación, trazabilidad y prueba final se mantiene incluso cuando cambia por completo el tipo de motor.',
          'En Autokeys Remaps Pro documentamos cada trabajo con el nivel de detalle que podemos confirmar, evitando completar los huecos con referencias o cifras no verificadas.'
        ]
      }
    ],
    related: [
      ['Reprogramación de centralitas', '/reprogramacion-centralitas-jaen'],
      ['Casos reales', '/casos-reales.html'],
      ['Quiénes somos', '/quienes-somos.html']
    ]
  },
  'desarrollo-edc15p-multimapa-autokeys': {
    title: 'Desarrollo EDC15P/P+ Multimapa de Autokeys',
    meta: 'Desarrollo propio de Autokeys Remaps Pro para EDC15P/P+: lógica Multimapa validada en vehículo y contrastada en más de una aplicación real.',
    category: 'I+D AUTOKEYS · EDC15P/P+ · MULTIMAPA',
    intro: 'Además de los trabajos de cliente, Autokeys Remaps Pro desarrolla soluciones propias. Uno de los proyectos más avanzados es nuestro sistema Multimapa para Bosch EDC15P/P+, construido a partir de pruebas reales, comparación de archivos y validación en vehículo. La referencia 038906019MS con Bosch SW 1037370651 fue una de las bases de validación funcional, y posteriormente la misma lógica se comprobó también en un segundo vehículo con motor ARL.',
    facts: ['Bosch EDC15P/P+', 'Desarrollo propio Autokeys', '038906019MS validada', 'Bosch SW 1037370651', 'Validación real en vehículo', 'Segunda validación en motor ARL'],
    sections: [
      {
        title: 'Objetivo: extraer una lógica reutilizable',
        paragraphs: [
          'El objetivo del proyecto no era crear un único archivo válido para una sola referencia, sino identificar la lógica común que permite construir un Multimapa sobre distintas EDC15P/P+. Para ello se compararon archivos originales y Multimapa ya funcionales y se separaron las zonas relacionadas con selección y mapas.',
          'Ese enfoque convierte el proyecto en un desarrollo de ingeniería inversa y validación, no en una simple colección de archivos prehechos.'
        ]
      },
      {
        title: 'Primera validación funcional',
        paragraphs: [
          'Una de las validaciones clave se realizó sobre la referencia VAG 038906019MS con software Bosch 1037370651. El Multimapa generado fue escrito y probado en vehículo, confirmando arranque y funcionamiento correcto de la lógica prevista.',
          'Una incidencia inicial durante una escritura con una unidad MPPS concreta quedó descartada posteriormente al escribir el mismo Multimapa por OBD con otra unidad MPPS sin problema.'
        ]
      },
      {
        title: 'Segunda validación en motor ARL',
        paragraphs: [
          'La misma base de desarrollo se probó después en un segundo vehículo con motor ARL, donde el Multimapa también funcionó correctamente. La referencia exacta de esa segunda ECU quedó pendiente de identificar, por lo que no la publicamos como dato cerrado.',
          'Esta segunda prueba es relevante porque aporta evidencia de compatibilidad transversal más allá de la primera referencia validada.'
        ]
      },
      {
        title: 'Del caso real a una herramienta propia',
        paragraphs: [
          'El conocimiento extraído de estas pruebas se está utilizando para construir una herramienta capaz de generar Multimapas de forma controlada sobre EDC15P/P+, conservando ORI, verificando la estructura del archivo y rechazando entradas que no cumplan las condiciones esperadas.',
          'Este proyecto resume una parte importante de nuestro trabajo de I+D: convertir experiencia real en vehículo en procesos reproducibles y documentados.'
        ]
      }
    ],
    related: [
      ['Reprogramación de centralitas', '/reprogramacion-centralitas-jaen'],
      ['Casos reales', '/casos-reales.html'],
      ['Quiénes somos', '/quienes-somos.html']
    ]
  }
};

function cleanSlug(value) {
  const slug = String(value || '').trim();
  return /^[a-z0-9][a-z0-9-]{0,180}$/.test(slug) ? slug : '';
}

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function jsonLd(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function renderPage(slug, item) {
  const canonical = `${SITE}/casos/${slug}`;
  const schema = {
    '@context': 'https://schema.org', '@type': 'Article', headline: item.title, description: item.meta,
    datePublished: '2026-08-25', dateModified: '2026-08-25', mainEntityOfPage: canonical,
    author: { '@type': 'Organization', name: 'Autokeys Remaps Pro', url: SITE },
    publisher: { '@type': 'Organization', name: 'Autokeys Remaps Pro', url: SITE, logo: { '@type': 'ImageObject', url: FALLBACK_IMAGE } }
  };
  const breadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Casos reales', item: `${SITE}/casos-reales.html` },
      { '@type': 'ListItem', position: 3, name: item.title, item: canonical }
    ]
  };

  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(item.title)} | Autokeys</title><meta name="description" content="${esc(item.meta)}"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"><link rel="canonical" href="${esc(canonical)}"><meta property="og:type" content="article"><meta property="og:site_name" content="Autokeys Remaps Pro"><meta property="og:locale" content="es_ES"><meta property="og:title" content="${esc(item.title)} | Autokeys Remaps Pro"><meta property="og:description" content="${esc(item.meta)}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:image" content="${esc(FALLBACK_IMAGE)}"><meta name="twitter:card" content="summary_large_image"><link rel="stylesheet" href="/assets/css/style.css"><script type="application/ld+json">${jsonLd(schema)}</script><script type="application/ld+json">${jsonLd(breadcrumb)}</script></head><body><a class="skip-link" href="#main">Saltar al contenido</a><header id="site-header" data-active="blog"></header><main id="main"><nav class="breadcrumb" aria-label="Migas de pan"><a href="/">Inicio</a><span>›</span><a href="/casos-reales.html">Casos reales</a><span>›</span><span class="current">${esc(item.title)}</span></nav><article class="section"><div class="eyebrow">${esc(item.category)}</div><h1>${esc(item.title)}</h1><p class="lead">${esc(item.intro)}</p><div class="cat-grid" style="margin-top:28px">${item.facts.map((fact) => `<div class="cat-item"><span><b>${esc(fact)}</b></span></div>`).join('')}</div><div class="blog-post-body" style="margin-top:36px">${item.sections.map((section) => `<section style="margin-top:34px"><h2>${esc(section.title)}</h2>${section.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}</section>`).join('')}</div><div class="blog-post-cta"><div><b>¿Tienes un caso parecido?</b><p>Cuéntanos vehículo, sistema, avería y trabajo que necesitas. Revisaremos el caso antes de intervenir.</p></div><a class="btn btn-primary" href="/enviar-reparacion.html">Solicitar valoración</a></div></article><section class="section"><div class="eyebrow">SERVICIOS RELACIONADOS</div><h2>Información y servicios relacionados</h2><div class="cat-grid">${item.related.map(([label, href]) => `<a class="cat-item" href="${esc(href)}"><span><b>${esc(label)}</b><p style="margin:4px 0 0;color:var(--muted);font-size:12px">Ver servicio</p></span></a>`).join('')}</div></section></main><footer id="site-footer"></footer><script defer src="/assets/js/catalog.js"></script><script defer src="/assets/js/cart.js"></script><script defer src="/assets/js/app.js"></script><script defer src="/_vercel/insights/script.js"></script></body></html>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).send('Método no permitido');
  const requestUrl = new URL(req.url, SITE);
  const slug = cleanSlug(requestUrl.searchParams.get('slug'));
  if (!slug || !CASES[slug]) return res.status(404).send('Caso no encontrado');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).send(renderPage(slug, CASES[slug]));
};
