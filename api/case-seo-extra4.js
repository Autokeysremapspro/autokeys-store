const SITE = 'https://www.autokeysremapspro.es';
const FALLBACK_IMAGE = `${SITE}/assets/img/logo.png`;

const CASES = {
  'mercedes-2008-2009-ezs-inoperativo-dos-llaves': {
    title: 'Mercedes 2008/2009: recuperación EZS y dos llaves',
    meta: 'Caso real Mercedes 2008/2009: EZS inoperativo tras una intervención previa, recuperación de la información, extracción de password y alta de dos llaves.',
    category: 'MERCEDES · EZS · ELV · LLAVES',
    intro: 'Este Mercedes de 2008/2009 llegó a nuestro laboratorio a través de un taller con un problema claro: al introducir la llave no abría contacto. Durante una intervención previa el EZS había sido desmontado y quedó inoperativo. El trabajo de Autokeys Remaps Pro consistió en recuperar y trasladar la información necesaria del EZS, obtener los datos de autorización y dejar preparadas dos llaves funcionales. El ELV estaba averiado y el taller decidió resolver esa parte instalando un emulador, quedando finalmente el vehículo operativo de nuevo.',
    facts: ['Mercedes 2008/2009', 'No abría contacto al introducir la llave', 'EZS inoperativo tras intervención previa', 'Recuperación y clonación de información EZS', 'Extracción de password', 'Dos llaves añadidas', 'ELV averiado', 'Vehículo funcional de nuevo'],
    sections: [
      {
        title: 'Situación inicial',
        paragraphs: [
          'El vehículo se encontraba en un taller y presentaba un fallo de autorización: al introducir la llave no se habilitaba el contacto. El EZS ya había sido desmontado durante una intervención anterior y había quedado inoperativo, por lo que el problema ya no era únicamente diagnosticar una llave o un bloqueo de dirección.',
          'El taller contactó con Autokeys Remaps Pro para recuperar la parte electrónica del sistema y devolver una base funcional sobre la que poder terminar la reparación del vehículo.'
        ]
      },
      {
        title: 'Recuperación de la información del EZS',
        paragraphs: [
          'El trabajo se centró en preservar y trasladar la información válida contenida en el EZS. En lugar de tratar el módulo como una pieza genérica, se trabajó con los datos asociados a ese vehículo para mantener la coherencia del sistema de autorización.',
          'Una vez recuperada la información necesaria, se completó la extracción de los datos de seguridad requeridos para continuar con la preparación de las llaves.'
        ]
      },
      {
        title: 'Preparación de dos llaves',
        paragraphs: [
          'Con la información del sistema disponible se añadieron dos llaves para el vehículo. El objetivo era que el taller recibiera de nuevo un conjunto utilizable y no una reparación parcial que obligara a repetir el proceso de inmovilizador después.',
          'La intervención se documentó manteniendo separados los datos originales y las versiones trabajadas, de forma que el proceso siguiera siendo trazable.'
        ]
      },
      {
        title: 'El ELV estaba averiado',
        paragraphs: [
          'Durante el cierre del caso se confirmó que el ELV también estaba averiado. Esa parte no fue reparada por Autokeys Remaps Pro: el propio taller optó por instalar un emulador de ELV para completar la reparación del vehículo.',
          'Esta distinción es importante porque permite explicar exactamente qué parte del sistema resolvimos nosotros y qué decisión técnica tomó después el taller responsable del coche.'
        ]
      },
      {
        title: 'Resultado final',
        paragraphs: [
          'Después de recuperar la información del EZS, completar los datos de autorización, preparar las dos llaves y resolver el taller el problema del ELV, el Mercedes volvió a quedar funcional.',
          'El caso demuestra por qué los sistemas EZS/ELV de Mercedes requieren trabajar con método: identificar qué módulo está realmente afectado, conservar la información válida y separar la reparación electrónica de cualquier sustitución o adaptación posterior.'
        ]
      }
    ],
    related: [
      ['Mercedes EZS / ELV', '/mercedes-ezs-elv'],
      ['Programación de llaves', '/programacion-llaves-coche'],
      ['Pérdida total de llaves', '/perdida-total-llaves-coche']
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
