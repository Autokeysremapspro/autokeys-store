const SITE = 'https://www.autokeysremapspro.es';
const FALLBACK_IMAGE = `${SITE}/assets/img/logo.png`;

const CASES = {
  'land-rover-discovery-4-2015-llave-rfa-autel': {
    title: 'Land Rover Discovery 4 2015: llave y RFA con Autel',
    meta: 'Caso real Land Rover Discovery 4 2015: trabajo sobre el sistema RFA, lectura con Autel y creación de una llave funcional hasta cerrar el vehículo correctamente.',
    category: 'LAND ROVER · RFA · LLAVE SMART',
    intro: 'Este Land Rover Discovery 4 de 2015 llegó a Autokeys Remaps Pro como un trabajo de llave asociado al sistema RFA. La intervención terminó cerrándose correctamente: se accedió a la información necesaria con equipo Autel, se trabajó sobre los datos del sistema y se consiguió generar una llave funcional para devolver el vehículo a servicio.',
    facts: ['Land Rover Discovery 4 2015', 'Sistema RFA', 'Lectura con Autel', 'Trabajo sobre datos del módulo', 'Nueva llave funcional', 'Caso cerrado correctamente'],
    sections: [
      {
        title: 'Identificar el sistema antes de programar',
        paragraphs: [
          'En un vehículo con llave inteligente no conviene tratar el trabajo como si fuera un simple duplicado. Antes de programar hay que confirmar qué módulo participa en la autorización, qué información conserva y qué vía de acceso es válida para esa plataforma.',
          'En este Discovery 4 el trabajo se centró en el sistema RFA. La identificación previa permitió orientar correctamente la intervención y evitar pruebas innecesarias sobre otros módulos del vehículo.'
        ]
      },
      {
        title: 'Lectura con Autel',
        paragraphs: [
          'La información necesaria se obtuvo utilizando equipo Autel. El objetivo de esta fase fue disponer de una base real del vehículo sobre la que continuar el trabajo, manteniendo la trazabilidad entre lo leído y la llave que se iba a generar.',
          'Cuando se trabaja sobre sistemas de inmovilizador y autorización, la calidad de la lectura y la identificación del módulo son más importantes que seguir una secuencia genérica. Cada plataforma puede requerir un flujo diferente.'
        ]
      },
      {
        title: 'Creación y comprobación de la llave',
        paragraphs: [
          'Con la información disponible se completó el trabajo de la nueva llave y se realizaron las comprobaciones necesarias sobre el vehículo. El resultado final fue una llave funcional y el caso quedó resuelto.',
          'No presentamos este procedimiento como una receta universal para todos los Discovery 4. El valor del caso está en haber identificado el sistema correcto, leído la información necesaria y cerrado el trabajo sobre el vehículo concreto.'
        ]
      },
      {
        title: 'Qué aporta este caso',
        paragraphs: [
          'Este trabajo muestra la diferencia entre cambiar componentes al azar y trabajar desde la electrónica del vehículo. La lectura, la identificación y la conservación de la información original permiten plantear la intervención con mucho más control.',
          'En Autokeys Remaps Pro abordamos los trabajos de llaves e inmovilizadores desde esa lógica: primero entender la arquitectura y después ejecutar únicamente el proceso que necesita el vehículo.'
        ]
      }
    ],
    related: [
      ['Programación de llaves', '/programacion-llaves-coche'],
      ['Pérdida total de llaves', '/perdida-total-llaves-coche'],
      ['Inmovilizadores y programación', '/servicios/inmovilizadores-programacion']
    ]
  },
  'opel-combo-md1cs003-recuperacion-arranque': {
    title: 'Opel Combo MD1CS003: recuperación de arranque',
    meta: 'Caso real Opel Combo con ECU MD1CS003: vehículo con problema de arranque tras una campaña, trabajo electrónico sobre la ECU y recuperación final del vehículo.',
    category: 'OPEL · MD1CS003 · RECUPERACIÓN ECU',
    intro: 'Esta Opel Combo equipada con una ECU MD1CS003 presentó un problema serio de arranque después de una campaña. El caso exigió trabajar sobre la electrónica de la unidad, conservar la información disponible y plantear una recuperación controlada hasta conseguir que el vehículo quedara finalmente operativo.',
    facts: ['Opel Combo', 'ECU MD1CS003', 'Problema de arranque tras campaña', 'Trabajo electrónico sobre ECU', 'Datos originales conservados', 'Vehículo finalmente operativo'],
    sections: [
      {
        title: 'Un fallo que no se resolvía sustituyendo piezas',
        paragraphs: [
          'El punto de partida era un vehículo que había dejado de arrancar después de una intervención previa. En una situación así es importante separar qué pertenece al estado mecánico del vehículo y qué está relacionado con la electrónica y los datos de la ECU.',
          'Antes de modificar nada se documentó la unidad y se conservaron los archivos disponibles. Esa copia permite volver siempre al punto de partida y evita trabajar sin referencia.'
        ]
      },
      {
        title: 'Trabajo sobre la MD1CS003',
        paragraphs: [
          'La recuperación se centró en la ECU MD1CS003. Se revisó la información disponible y se trabajó sobre los datos necesarios para devolver coherencia al conjunto electrónico del vehículo.',
          'En este tipo de unidad no tiene sentido aplicar una solución genérica por referencia. Hardware, software y datos de inmovilizador deben tratarse como un conjunto asociado al vehículo concreto.'
        ]
      },
      {
        title: 'Recuperación del vehículo',
        paragraphs: [
          'Tras completar el trabajo electrónico y las comprobaciones correspondientes, la Combo volvió a quedar operativa. El caso se cerró con el vehículo funcionando correctamente.',
          'El dato importante aquí no es una técnica aislada, sino el proceso de recuperación: conservar información, identificar correctamente la ECU, trabajar sobre una base controlada y verificar el resultado final en el vehículo.'
        ]
      },
      {
        title: 'Por qué documentamos este caso',
        paragraphs: [
          'Las ECU modernas integran cada vez más funciones de seguridad y sincronización. Cuando un coche deja de arrancar después de una actualización, campaña o sustitución de unidad, la causa no siempre está en un componente físico averiado.',
          'Casos como esta MD1CS003 muestran por qué el diagnóstico electrónico y la trazabilidad de los datos son fundamentales antes de decidir sustituir una centralita completa.'
        ]
      }
    ],
    related: [
      ['Reparación de centralitas ECU', '/reparacion-centralitas-ecu'],
      ['Clonación de centralitas ECU', '/clonacion-centralitas-ecu'],
      ['Recuperación ECU por escritura fallida', '/servicios/recuperacion-ecu-escritura-fallida']
    ]
  },
  'renault-kangoo-2007-uch-reparada': {
    title: 'Renault Kangoo 2007 1.5 dCi: UCH reparada',
    meta: 'Caso real Renault Kangoo I 1.5 dCi de 2007: el fallo se localizó en la UCH, se reparó la unidad y el vehículo recuperó el funcionamiento correcto.',
    category: 'RENAULT · UCH · ELECTRÓNICA',
    intro: 'En esta Renault Kangoo I 1.5 dCi de 2007 el problema estaba localizado en la UCH. En lugar de atribuirle síntomas no documentados, el caso se centra en el hecho confirmado: se trabajó sobre la unidad, se realizó la reparación y después de la intervención el vehículo volvió a funcionar correctamente.',
    facts: ['Renault Kangoo I', 'Año 2007', 'Motor 1.5 dCi', 'Fallo localizado en UCH', 'UCH reparada', 'Funcionamiento correcto tras la reparación'],
    sections: [
      {
        title: 'Localización del problema en la UCH',
        paragraphs: [
          'La UCH es una unidad central dentro de la electrónica de muchos Renault y participa en distintas funciones de carrocería y autorización. Por eso un fallo en esta unidad puede generar síntomas muy diferentes según el vehículo.',
          'En esta Kangoo se confirmó que el problema estaba en la propia UCH. Esa identificación fue el punto clave para evitar seguir buscando la avería en sistemas que no eran el origen.'
        ]
      },
      {
        title: 'Reparar la unidad original',
        paragraphs: [
          'Una vez localizada la unidad responsable se trabajó sobre la UCH original. Mantener la unidad del vehículo siempre que sea viable evita introducir de forma innecesaria otra referencia, otra configuración o nuevos problemas de compatibilidad.',
          'El caso se abordó desde la reparación electrónica y no desde una sustitución automática del módulo.'
        ]
      },
      {
        title: 'Resultado final',
        paragraphs: [
          'Después de reparar la UCH se comprobó de nuevo el vehículo y el resultado fue correcto: las funciones afectadas volvieron a trabajar con normalidad y el caso quedó cerrado.',
          'No añadimos al artículo síntomas concretos ni herramientas que no estén documentados. El valor del caso está precisamente en mostrar un diagnóstico correcto de unidad y una reparación efectiva.'
        ]
      },
      {
        title: 'UCH, BCM y módulos de confort',
        paragraphs: [
          'Los módulos de carrocería pueden concentrar averías que a primera vista parecen pertenecer a sistemas diferentes. Antes de sustituirlos conviene comprobar alimentación, comunicación, estado de la unidad y referencia instalada.',
          'En Autokeys Remaps Pro trabajamos este tipo de electrónica buscando conservar la configuración original siempre que la reparación de la unidad sea una opción viable.'
        ]
      }
    ],
    related: [
      ['Módulos confort y UCH', '/servicios/modulos-confort-uch'],
      ['Diagnóstico avanzado', '/servicios/diagnostico-avanzado'],
      ['Electrónica del automóvil en Jaén', '/electronica-automovil-jaen.html']
    ]
  },
  'golf-5-gti-med9-1-pops-bangs-tirones-corregidos': {
    title: 'Golf 5 GTI MED9.1: Pops & Bangs sin tirones',
    meta: 'Caso real Golf 5 GTI con ECU MED9.1: una calibración de Pops & Bangs provocaba tirones y se corrigió hasta obtener un funcionamiento limpio.',
    category: 'VOLKSWAGEN · MED9.1 · CALIBRACIÓN',
    intro: 'Este Golf 5 GTI con ECU MED9.1 presentaba un problema muy concreto: la calibración de Pops & Bangs generaba tirones. El trabajo consistió en revisar el planteamiento de la electrónica, desarrollar una solución propia y comprobar el resultado hasta conseguir que el efecto funcionara sin reproducir los tirones anteriores.',
    facts: ['Volkswagen Golf 5 GTI', 'ECU MED9.1', 'Pops & Bangs', 'Tirones con la calibración inicial', 'Calibración corregida', 'Resultado sin tirones'],
    sections: [
      {
        title: 'El problema no era simplemente activar Pops & Bangs',
        paragraphs: [
          'El vehículo ya permitía generar el efecto, pero la forma en la que estaba calibrado provocaba tirones. Eso demuestra que conseguir ruido en el escape y conseguir un funcionamiento bien integrado en la estrategia de la ECU son dos cosas distintas.',
          'La prioridad fue eliminar el comportamiento desagradable antes de buscar más intensidad en el efecto.'
        ]
      },
      {
        title: 'Revisión de la calibración MED9.1',
        paragraphs: [
          'Se revisó la calibración de la MED9.1 buscando qué parte del planteamiento estaba generando la transición brusca. En este tipo de trabajo no basta con copiar valores de otro archivo: la respuesta depende de la estrategia concreta de la ECU y de cómo interactúan sus distintas funciones.',
          'A partir de esa revisión se preparó una solución propia orientada a mantener el efecto solicitado sin reproducir el fallo de conducción.'
        ]
      },
      {
        title: 'Prueba y corrección',
        paragraphs: [
          'La calibración se fue comprobando sobre el vehículo hasta conseguir el comportamiento buscado. El resultado final eliminó los tirones que aparecían con la versión anterior.',
          'Ese proceso de prueba y corrección es precisamente lo que diferencia una calibración trabajada de un archivo cargado sin validar en el coche concreto.'
        ]
      },
      {
        title: 'Un caso útil para entender la calibración',
        paragraphs: [
          'Este Golf 5 GTI es un buen ejemplo de por qué una modificación que aparentemente funciona puede seguir estando mal resuelta. Si genera tirones, fallos de transición o un comportamiento poco natural, todavía hay trabajo por hacer.',
          'En Autokeys Remaps Pro utilizamos los resultados reales del vehículo para revisar y corregir la electrónica hasta conseguir un funcionamiento coherente con el objetivo solicitado.'
        ]
      }
    ],
    related: [
      ['Reprogramación de centralitas', '/reprogramacion-centralitas-jaen'],
      ['Reparación de centralitas ECU', '/reparacion-centralitas-ecu'],
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
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: item.title,
    description: item.meta,
    datePublished: '2026-08-25',
    dateModified: '2026-08-25',
    mainEntityOfPage: canonical,
    author: { '@type': 'Organization', name: 'Autokeys Remaps Pro', url: SITE },
    publisher: { '@type': 'Organization', name: 'Autokeys Remaps Pro', url: SITE, logo: { '@type': 'ImageObject', url: FALLBACK_IMAGE } }
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
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
