const SITE = 'https://www.autokeysremapspro.es';
const FALLBACK_IMAGE = `${SITE}/assets/img/logo.png`;

const CASES = {
  'mercedes-2008-2009-ezs-inoperativo-dos-llaves': {
    title: 'Mercedes 2008/2009: recuperación EZS y dos llaves',
    meta: 'Caso real Mercedes 2008/2009: EZS inoperativo tras una intervención previa, recuperación de datos, password y programación de dos llaves.',
    category: 'MERCEDES · EZS · ELV · LLAVES',
    intro: 'Este Mercedes de 2008/2009 llegó a nuestro laboratorio a través de un taller con un problema claro: al introducir la llave no abría contacto. Durante una intervención previa el EZS había sido desmontado y quedó inoperativo. En Autokeys Remaps Pro trabajamos el conjunto en banco con Autel IM508 Pro, XP400 Pro y adaptador específico Mercedes, recuperamos y clonamos la información necesaria del EZS, extraímos el password mediante el cable IR específico de Autel y añadimos dos llaves. El ELV estaba averiado y el taller decidió resolver esa parte instalando un emulador, quedando finalmente el vehículo operativo de nuevo.',
    facts: ['Mercedes 2008/2009', 'No abría contacto al introducir la llave', 'EZS inoperativo tras intervención previa', 'Autel IM508 Pro + XP400 Pro', 'Trabajo en banco con adaptador Mercedes', 'Password mediante cable IR Autel', 'Dos llaves añadidas', 'ELV averiado y resuelto por el taller con emulador'],
    sections: [
      {
        title: 'Situación inicial',
        paragraphs: [
          'El vehículo se encontraba en un taller y presentaba un fallo de autorización: al introducir la llave no se habilitaba el contacto. El EZS ya había sido desmontado durante una intervención anterior y había quedado inoperativo, por lo que el problema ya no era únicamente diagnosticar una llave o un bloqueo de dirección.',
          'El taller contactó con Autokeys Remaps Pro para recuperar la parte electrónica del sistema y devolver una base funcional sobre la que poder terminar la reparación del vehículo.'
        ]
      },
      {
        title: 'Trabajo en banco sobre el EZS',
        paragraphs: [
          'La intervención se realizó en banco utilizando Autel IM508 Pro junto con XP400 Pro y un adaptador específico para Mercedes. El objetivo era acceder de forma controlada a la información del EZS y recuperar los datos válidos del sistema.',
          'En lugar de tratar el módulo como una pieza genérica, se trabajó con la información asociada a ese vehículo para mantener la coherencia del sistema de autorización.'
        ]
      },
      {
        title: 'Extracción del password y recuperación de datos',
        paragraphs: [
          'Una vez estabilizado el trabajo sobre el EZS, se utilizó el cable IR específico de Autel para obtener el password necesario para continuar con la preparación de las llaves.',
          'Con esos datos se completó la recuperación y clonación de la información necesaria del EZS, manteniendo separado el contenido original de las versiones trabajadas para conservar trazabilidad durante todo el proceso.'
        ]
      },
      {
        title: 'Programación de dos llaves',
        paragraphs: [
          'Con la información del sistema ya recuperada se añadieron dos llaves al vehículo. El objetivo era que el taller recibiera de nuevo un conjunto utilizable y no una reparación parcial que obligara a repetir después todo el proceso de inmovilizador.',
          'Tras completar la programación, la parte correspondiente a EZS y llaves quedó resuelta correctamente.'
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
          'Después de recuperar la información del EZS, extraer el password, programar las dos llaves y resolver el taller el problema del ELV mediante emulador, el Mercedes volvió a quedar funcional.',
          'El caso demuestra por qué los sistemas EZS/ELV de Mercedes requieren trabajar con método: identificar qué módulo está realmente afectado, conservar la información válida y separar la reparación electrónica de cualquier adaptación posterior.'
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
