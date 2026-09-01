const SITE = 'https://www.autokeysremapspro.es';
const BUSINESS_ID = `${SITE}/#business`;
const IMAGE = `${SITE}/assets/img/hero-taller.webp`;

const PAGES = {
  'programacion-llaves-coche': {
    title: 'Programación de Llaves de Coche | Autokeys Remaps Pro',
    description: 'Programación de llaves de coche, inmovilizadores y sistemas de arranque. Diagnóstico profesional y servicio especializado en Autokeys Remaps Pro.',
    eyebrow: 'LLAVES · INMOVILIZADOR · PROGRAMACIÓN',
    h1: 'Programación de llaves de coche e inmovilizadores',
    intro: 'Programamos y diagnosticamos sistemas de llaves e inmovilizador para diferentes fabricantes. Trabajamos duplicados, problemas de reconocimiento, sustituciones relacionadas con el arranque y situaciones en las que el vehículo ha perdido una o todas sus llaves.',
    serviceName: 'Programación de llaves de coche',
    area: ['Jaén'],
    highlights: ['Programación de llaves y transponders', 'Diagnóstico de inmovilizador y arranque', 'Duplicado de llave cuando existe una funcional', 'Pérdida total según arquitectura del vehículo', 'Comprobación final de arranque y funciones'],
    sections: [
      ['Cada vehículo requiere un procedimiento distinto', 'La programación depende del año, fabricante, inmovilizador y módulos instalados. Antes de intervenir identificamos el sistema y comprobamos qué procedimiento corresponde para evitar operaciones innecesarias o incompatibles.'],
      ['Cuando la diagnosis convencional no es suficiente', 'Algunos sistemas permiten programar directamente sobre el vehículo; otros requieren trabajo adicional de laboratorio sobre módulos electrónicos. La estrategia se decide después de identificar correctamente la arquitectura de arranque.'],
      ['Diagnóstico antes de programar', 'Si una llave ha dejado de ser reconocida, primero hay que determinar si el problema está en la llave, el inmovilizador, la alimentación, la comunicación entre módulos o una desincronización. Programar sin diagnosticar puede no resolver la avería real.']
    ],
    faq: [
      ['¿Podéis programar una segunda llave?', 'En muchos modelos sí. Necesitamos marca, modelo y año para comprobar compatibilidad y procedimiento.'],
      ['¿Y si el coche no reconoce ninguna llave?', 'Primero diagnosticamos el sistema de arranque. Dependiendo del vehículo puede ser necesario trabajar sobre módulos electrónicos además de programar una nueva llave.'],
      ['¿Necesito llevar el coche?', 'Para muchos trabajos sí, ya que debemos programar y comprobar el funcionamiento final sobre el vehículo.']
    ],
    cases: [['/casos/renault-megane-2008-perdida-total-llaves', 'Renault Megane 2008 · pérdida total de llaves'], ['/casos/land-rover-discovery-4-2015-llave-rfa-autel', 'Land Rover Discovery 4 · llave y RFA'], ['/bmw-fem-bdc', 'BMW FEM / BDC · sistemas de arranque']],
    related: [['/duplicado-llaves-coche-jaen', 'Duplicado de llaves de coche en Jaén'], ['/perdida-total-llaves-coche', 'Pérdida total de llaves'], ['/mercedes-ezs-elv', 'Mercedes EZS / ELV']],
    ctaTitle: '¿Tu coche necesita una llave nueva o no reconoce la actual?',
    ctaText: 'Indícanos marca, modelo y año para identificar el sistema antes de programar.'
  },
  'perdida-total-llaves-coche': {
    title: 'Pérdida Total de Llaves de Coche | Autokeys Remaps Pro',
    description: 'Soluciones profesionales cuando se han perdido todas las llaves del coche: diagnosis, programación y recuperación de sistemas de arranque e inmovilizador.',
    eyebrow: 'ALL KEYS LOST · RECUPERACIÓN DE ARRANQUE',
    h1: 'Pérdida total de llaves del coche',
    intro: 'Cuando un vehículo se queda sin ninguna llave disponible, el procedimiento cambia respecto a un duplicado convencional. Identificamos el sistema de inmovilizador, los módulos implicados y la estrategia correcta para recuperar el acceso y volver a disponer de una llave funcional.',
    serviceName: 'Pérdida total de llaves de coche',
    area: ['Jaén'],
    highlights: ['Identificación del sistema de inmovilizador', 'Programación de nueva llave cuando es viable', 'Trabajo de laboratorio en módulos cuando es necesario', 'Recuperación de sincronización y arranque según sistema', 'Comprobación final antes de entregar'],
    sections: [
      ['No es lo mismo duplicar que recuperar un vehículo sin llaves', 'Con una llave funcional normalmente existe una referencia activa en el sistema. En una pérdida total puede ser necesario acceder a información del inmovilizador, trabajar con módulos concretos o realizar procedimientos de aprendizaje específicos para esa arquitectura.'],
      ['Primero identificamos la arquitectura', 'Marca, modelo y año orientan el trabajo, pero la confirmación depende del sistema instalado. Revisamos qué módulos gestionan la autorización de arranque, qué tipo de llave utiliza el vehículo y qué método es técnicamente adecuado.'],
      ['Casos reales como base de diagnóstico', 'Documentamos trabajos reales de pérdida total porque cada plataforma presenta particularidades. Esa experiencia ayuda a reducir pruebas innecesarias y a preparar de antemano el material y procedimiento correctos.']
    ],
    faq: [
      ['¿Se puede hacer una llave si no queda ninguna?', 'En muchos vehículos sí, pero depende de la arquitectura y del estado de los módulos. Primero debemos identificar el sistema.'],
      ['¿Siempre hace falta desmontar módulos?', 'No. Algunos vehículos permiten el procedimiento mediante diagnosis y otros requieren trabajo de laboratorio.'],
      ['¿Cuánto tarda?', 'Depende del vehículo, la disponibilidad de la llave correcta y el procedimiento necesario. Se puede concretar mejor después de identificar el sistema.']
    ],
    cases: [['/casos/renault-megane-2008-perdida-total-llaves', 'Renault Megane · todas las llaves perdidas'], ['/casos/land-rover-discovery-4-2015-llave-rfa-autel', 'Land Rover Discovery 4 · sistema RFA'], ['/bmw-fem-bdc', 'BMW FEM / BDC · llaves y arranque']],
    related: [['/programacion-llaves-coche', 'Programación de llaves'], ['/duplicado-llaves-coche-jaen', 'Duplicado de llaves en Jaén'], ['/mercedes-ezs-elv', 'Mercedes EZS / ELV']],
    ctaTitle: '¿Has perdido todas las llaves?',
    ctaText: 'Envíanos marca, modelo y año. Revisamos la arquitectura antes de indicarte el procedimiento.'
  },
  'clonacion-centralitas-ecu': {
    title: 'Clonación de Centralitas ECU | Servicio por Envío | Autokeys',
    description: 'Clonación de centralitas ECU y transferencia de datos a unidades donantes compatibles. Laboratorio en Jaén y servicio por envío en toda España.',
    eyebrow: 'CLONACIÓN ECU · TRANSFERENCIA DE DATOS',
    h1: 'Clonación de centralitas ECU y transferencia a donante',
    intro: 'Transferimos la información necesaria desde una centralita original a una unidad donante compatible cuando la familia electrónica y el estado de ambas unidades lo permiten. El objetivo es conservar los datos propios del vehículo y reducir sustituciones innecesarias.',
    serviceName: 'Clonación de centralitas ECU',
    area: ['España', 'Jaén'],
    highlights: ['Comprobación de referencias y compatibilidad', 'Lectura y recuperación de datos', 'Transferencia a unidad donante compatible', 'Verificación de integridad antes de entrega', 'Servicio por envío desde toda España'],
    sections: [
      ['La compatibilidad se comprueba antes de clonar', 'No todas las ECU físicamente iguales son intercambiables. Revisamos referencias de hardware y software, familia electrónica y estado de ambas unidades antes de confirmar el trabajo.'],
      ['Lectura y transferencia de información', 'Según la ECU, el acceso puede realizarse por los métodos profesionales adecuados para esa familia. Recuperamos la información necesaria de la unidad original y la transferimos a la donante, verificando la integridad de los datos antes de cerrar el trabajo.'],
      ['Alternativa cuando la ECU original no puede seguir trabajando', 'La clonación puede ser una opción cuando la unidad original presenta un daño que hace inviable su uso, siempre que los datos necesarios puedan recuperarse y exista una donante realmente compatible.']
    ],
    faq: [
      ['¿Sirve cualquier centralita donante?', 'No. Debemos comprobar referencias, hardware, software y familia electrónica.'],
      ['¿Qué tengo que enviar?', 'Normalmente la ECU original y la donante. Antes del envío confirmamos qué elementos necesitamos.'],
      ['¿Podéis trabajar por envío?', 'Sí. Recibimos centralitas de clientes, talleres y profesionales desde toda España.']
    ],
    cases: [['/casos/opel-combo-md1cs003-recuperacion-arranque', 'Opel Combo MD1CS003 · recuperación de arranque'], ['/reparacion-centralitas-ecu', 'Reparación de centralitas ECU'], ['/reparacion-centralita-por-envio', 'Servicio de laboratorio por envío']],
    related: [['/reparacion-centralitas-ecu', 'Reparación de centralitas ECU'], ['/reparacion-centralita-por-envio', 'Reparación por envío'], ['/enviar-reparacion.html', 'Enviar una unidad']],
    ctaTitle: '¿Tienes una ECU original y una donante?',
    ctaText: 'Envíanos fotografías claras de ambas referencias antes de realizar el envío.'
  },
  'bmw-fem-bdc': {
    title: 'BMW FEM / BDC: Reparación, Programación y Llaves | Autokeys',
    description: 'Servicio BMW FEM y BDC: diagnóstico, recuperación, programación, sustitución y trabajos de llaves según compatibilidad en Autokeys Remaps Pro.',
    eyebrow: 'BMW FEM · BDC · SISTEMAS DE ARRANQUE',
    h1: 'BMW FEM y BDC: diagnóstico, recuperación y programación',
    intro: 'Servicio especializado para módulos FEM y BDC de BMW. Revisamos incidencias de arranque, sustitución de módulos, recuperación de datos, programación y trabajos relacionados con llaves cuando la arquitectura del vehículo lo permite.',
    serviceName: 'Diagnóstico y programación BMW FEM BDC',
    area: ['España', 'Jaén'],
    highlights: ['Diagnóstico de FEM / BDC y comunicaciones', 'Recuperación de módulos y datos', 'Programación y sustitución según compatibilidad', 'Trabajos de llaves e inmovilizador', 'Servicio para clientes y talleres'],
    sections: [
      ['Un fallo de arranque no significa siempre FEM o BDC averiado', 'Antes de sustituir revisamos diagnosis, alimentación, comunicaciones, estado de llaves y antecedentes de programación. Un problema de sincronización, alimentación o codificación puede provocar síntomas similares a un fallo interno del módulo.'],
      ['Programación y sustitución con verificación previa', 'Cuando se utiliza una unidad donante es necesario comprobar compatibilidad y determinar qué datos deben recuperarse o adaptarse. El procedimiento cambia según generación y configuración del vehículo.'],
      ['Llaves BMW y autorización de arranque', 'FEM y BDC forman parte de la arquitectura de autorización de arranque en numerosas plataformas BMW. Por eso los trabajos de llave requieren identificar correctamente el módulo, el estado del sistema y el procedimiento compatible.']
    ],
    faq: [
      ['¿Podéis trabajar una llave BMW con FEM o BDC?', 'Depende del modelo, generación y estado del módulo. Primero identificamos la arquitectura y el procedimiento disponible.'],
      ['¿Se puede montar un FEM o BDC usado?', 'En determinados casos sí, pero requiere comprobar compatibilidad y realizar la adaptación correspondiente.'],
      ['¿Hace falta el vehículo completo?', 'Depende del trabajo. Algunos procedimientos requieren el vehículo y otros pueden comenzar con módulos concretos.']
    ],
    cases: [['/casos/bmw-f36-420d-codificacion-levas', 'BMW F36 · electrónica y codificación'], ['/programacion-llaves-coche', 'Programación de llaves de coche'], ['/perdida-total-llaves-coche', 'Pérdida total de llaves']],
    related: [['/programacion-llaves-coche', 'Programación de llaves'], ['/perdida-total-llaves-coche', 'Pérdida total'], ['/reparacion-centralitas-ecu', 'Reparación de centralitas ECU']],
    ctaTitle: '¿Tienes un BMW con fallo de FEM, BDC o arranque?',
    ctaText: 'Envíanos modelo, año, síntomas y diagnosis disponible para orientar el procedimiento.'
  },
  'mercedes-ezs-elv': {
    title: 'Mercedes EZS / ELV: Reparación y Programación | Autokeys',
    description: 'Diagnóstico, reparación y programación de Mercedes EZS y ELV. Sistemas de arranque, bloqueo de dirección y llaves en Autokeys Remaps Pro.',
    eyebrow: 'MERCEDES EZS · ELV · ARRANQUE',
    h1: 'Mercedes EZS y ELV: diagnóstico, reparación y programación',
    intro: 'Trabajamos sistemas Mercedes EZS y ELV relacionados con autorización de arranque, bloqueo electrónico de dirección y llaves. El diagnóstico parte de los síntomas, comunicaciones y estado de los módulos antes de decidir si hay que reparar, recuperar o sustituir una unidad.',
    serviceName: 'Reparación y programación Mercedes EZS ELV',
    area: ['España', 'Jaén'],
    highlights: ['Diagnóstico de EZS / EIS y ELV / ESL', 'Comprobación de autorización de arranque', 'Recuperación y reparación cuando es viable', 'Adaptación de unidades según compatibilidad', 'Trabajos relacionados con llaves y sincronización'],
    sections: [
      ['No arranca, no desbloquea o no reconoce la llave', 'Los síntomas de EZS y ELV pueden confundirse con fallos de alimentación, llave, comunicación o sincronización. Antes de sustituir módulos comprobamos qué elemento está bloqueando realmente la autorización de arranque.'],
      ['EZS y ELV trabajan como parte de un sistema', 'La solución no consiste únicamente en cambiar un módulo. Deben mantenerse coherentes los datos de autorización entre los elementos implicados, por lo que la compatibilidad y el procedimiento de adaptación son fundamentales.'],
      ['Reparación y servicio de laboratorio', 'Según la avería, el trabajo puede centrarse en la unidad EZS, el bloqueo ELV u otros componentes del sistema de arranque. Antes de enviar nada confirmamos exactamente qué módulos necesitamos recibir.']
    ],
    faq: [
      ['¿Un Mercedes que no gira la llave tiene siempre el EZS averiado?', 'No. Hay que revisar alimentación, llave, comunicaciones y ELV antes de confirmar la causa.'],
      ['¿Se puede reparar un ELV?', 'Depende del modelo y del tipo de fallo. Valoramos la unidad antes de confirmar la intervención.'],
      ['¿Trabajáis con unidades enviadas desde otras provincias?', 'Sí. Determinados trabajos de laboratorio pueden gestionarse por envío después de confirmar qué elementos necesitamos.']
    ],
    cases: [['/casos/mercedes-2008-2009-ezs-inoperativo-dos-llaves', 'Mercedes 2008–2009 · EZS inoperativo con dos llaves'], ['/programacion-llaves-coche', 'Programación de llaves'], ['/reparacion-centralita-por-envio', 'Servicio por envío']],
    related: [['/programacion-llaves-coche', 'Programación de llaves'], ['/perdida-total-llaves-coche', 'Pérdida total de llaves'], ['/reparacion-centralita-por-envio', 'Reparación por envío']],
    ctaTitle: '¿Tu Mercedes no desbloquea, no reconoce la llave o no arranca?',
    ctaText: 'Envíanos modelo, año y síntomas para revisar qué parte del sistema EZS/ELV hay que comprobar.'
  }
};

function esc(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
function json(value) { return JSON.stringify(value).replace(/</g, '\\u003c'); }
function linkGrid(items) { return items.map(([href, label]) => `<a class="cat-item" href="${esc(href)}"><span><b>${esc(label)}</b></span></a>`).join(''); }
function faqHtml(items) { return items.map(([q, a]) => `<article><h3>${esc(q)}</h3><p>${esc(a)}</p></article>`).join(''); }

function render(slug, page) {
  const canonical = `${SITE}/${slug}`;
  const schemas = [
    {
      '@context': 'https://schema.org', '@type': 'Service', name: page.serviceName, description: page.description, url: canonical, image: IMAGE,
      areaServed: page.area.map((name) => ({ '@type': name === 'España' ? 'Country' : 'AdministrativeArea', name })),
      provider: { '@type': 'AutomotiveBusiness', '@id': BUSINESS_ID, name: 'Autokeys Remaps Pro', url: `${SITE}/`, telephone: '+34953852778', address: { '@type': 'PostalAddress', streetAddress: 'Av. Andalucía 125, Bajo', postalCode: '23350', addressLocality: 'Puente de Génave', addressRegion: 'Jaén', addressCountry: 'ES' } }
    },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE}/` }, { '@type': 'ListItem', position: 2, name: page.h1, item: canonical }] },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: page.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    { '@context': 'https://schema.org', '@type': 'WebPage', '@id': `${canonical}#webpage`, url: canonical, name: page.title, description: page.description, inLanguage: 'es-ES', isPartOf: { '@id': `${SITE}/#website` }, about: { '@id': BUSINESS_ID } }
  ];

  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(page.title)}</title><meta name="description" content="${esc(page.description)}"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"><link rel="canonical" href="${canonical}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Autokeys Remaps Pro"><meta property="og:locale" content="es_ES"><meta property="og:title" content="${esc(page.title)}"><meta property="og:description" content="${esc(page.description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${IMAGE}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(page.title)}"><meta name="twitter:description" content="${esc(page.description)}"><meta name="twitter:image" content="${IMAGE}"><link rel="stylesheet" href="/assets/css/style.css"><link rel="icon" type="image/png" href="/assets/img/logo.png">${schemas.map((s) => `<script type="application/ld+json">${json(s)}</script>`).join('')}</head>
<body><a class="skip-link" href="#main">Saltar al contenido</a><header id="site-header"></header><main id="main"><nav class="breadcrumb" aria-label="Migas de pan"><a href="/">Inicio</a><span>›</span><span class="current">${esc(page.h1)}</span></nav>
<section class="section" style="padding-bottom:18px"><div class="eyebrow">${esc(page.eyebrow)}</div><h1>${esc(page.h1)}</h1><p class="section-desc">${esc(page.intro)}</p><div class="btn-row" style="margin-top:22px"><a class="btn btn-primary" href="https://wa.me/34632982646" target="_blank" rel="noopener">Consultar por WhatsApp</a><a class="btn btn-secondary" href="tel:+34953852778">Llamar al laboratorio</a></div></section>
<section class="section"><div class="eyebrow">SERVICIO AUTOKEYS</div><h2>Qué incluye este servicio</h2><ul>${page.highlights.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></section>
${page.sections.map(([t, x]) => `<section class="section"><h2>${esc(t)}</h2><p class="section-desc">${esc(x)}</p></section>`).join('')}
<section class="section"><div class="eyebrow">CASOS REALES AUTOKEYS</div><h2>Trabajos y contenidos relacionados</h2><p class="section-desc">Casos reales y páginas técnicas relacionadas con este servicio.</p><div class="cat-grid">${linkGrid(page.cases)}</div></section>
<section class="section"><div class="eyebrow">PREGUNTAS FRECUENTES</div><h2>Dudas habituales</h2><div class="product-grid cols-2">${faqHtml(page.faq)}</div></section>
<section class="section"><div class="eyebrow">SERVICIOS RELACIONADOS</div><h2>Más soluciones Autokeys</h2><div class="cat-grid">${linkGrid(page.related)}</div></section>
<section class="section"><div class="eyebrow">AUTOKEYS REMAPS PRO</div><h2>${esc(page.ctaTitle)}</h2><p class="section-desc">${esc(page.ctaText)}</p><div class="btn-row" style="margin-top:22px"><a class="btn btn-primary" href="https://wa.me/34632982646" target="_blank" rel="noopener">Enviar consulta</a><a class="btn btn-secondary" href="/enviar-reparacion.html">Enviar una unidad</a></div></section></main>
<footer id="site-footer"></footer><script defer src="/assets/js/catalog.js"></script><script defer src="/assets/js/cart.js"></script><script defer src="/assets/js/app.js"></script><script defer src="/_vercel/insights/script.js"></script></body></html>`;
}

module.exports = function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.setHeader('Allow', 'GET, HEAD'); return res.status(405).send('Method not allowed'); }
  const slug = String(req.query.slug || '').trim();
  const page = PAGES[slug];
  if (!page) return res.status(404).send('Página no encontrada');
  const html = render(slug, page);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.setHeader('X-AK-SEO-Priority', '2');
  if (req.method === 'HEAD') return res.status(200).end();
  return res.status(200).send(html);
};
