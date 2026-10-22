const SITE = 'https://www.autokeysremapspro.es';
const BUSINESS_ID = `${SITE}/#business`;
const IMAGE = `${SITE}/assets/img/hero-taller.webp`;

const PAGES = {
  'inmovilizador-coche': {
    title: 'Fallo de Inmovilizador del Coche | Diagnóstico y Reparación',
    description: '¿Tu coche no reconoce la llave o no autoriza el arranque? Diagnóstico de inmovilizadores, UCH, BCM, CAS, EZS y módulos relacionados. Laboratorio en Jaén.',
    eyebrow: 'INMOVILIZADOR · LLAVES · AUTORIZACIÓN DE ARRANQUE',
    h1: 'Fallo de inmovilizador: diagnóstico de llave y arranque',
    intro: 'Cuando un coche no reconoce la llave, muestra inmovilizador activo o deja de arrancar después de cambiar un módulo, hay que identificar qué componente bloquea realmente la autorización. Revisamos llaves, comunicaciones y sistemas como UCH, BCM, CAS, FEM, BDC, EZS o ELV según la marca y arquitectura del vehículo.',
    serviceName: 'Diagnóstico, reparación y programación de inmovilizadores',
    area: ['Jaén', 'España'],
    formUrl: '/enviar-reparacion.html',
    highlights: [
      'Diagnóstico de llave no reconocida o inmovilizador activo',
      'Comprobación de alimentación y comunicaciones entre módulos',
      'Valoración de pérdidas de sincronización tras cambiar una ECU',
      'Programación de llaves cuando la arquitectura lo permite',
      'Estudio de fallos UCH, BCM, CAS, EWS, FEM, BDC, EZS y ELV',
      'Reparaciones de laboratorio por envío cuando no es imprescindible el vehículo'
    ],
    sections: [
      ['El inmovilizador no es una sola centralita', 'La autorización de arranque puede depender de la llave o transponder, antena lectora, cuadro, UCH, BCM, CAS, FEM, BDC, EZS, ELV y ECU de motor. Los elementos implicados cambian según marca y generación, por lo que una solución genérica puede no resolver el fallo.'],
      ['Síntomas que necesitan un diagnóstico diferencial', 'Un testigo de llave, mensaje de inmovilizador activo, contacto que no se habilita, motor que gira pero no arranca o arranque que se interrumpe pueden deberse a causas distintas. Identificamos en qué punto deja de autorizarse el arranque antes de cambiar componentes.'],
      ['Coche que no arranca después de sustituir la ECU', 'Una centralita donante puede necesitar transferencia de datos o adaptación al sistema de inmovilizador del vehículo. La compatibilidad física de conectores no es suficiente. Revisamos referencias y antecedentes del cambio antes de recomendar clonación, programación o recuperación.'],
      ['Llave, módulo o alimentación: qué comprobar primero', 'Si existe una segunda llave funcional, su respuesta ayuda a orientar el diagnóstico. También importan voltaje de batería, alimentaciones del módulo, códigos de avería y comunicación entre unidades. Programar una nueva llave sin estas comprobaciones puede no solucionar el problema.'],
      ['¿Se puede resolver con módulos enviados al laboratorio?', 'En determinados sistemas sí: después de estudiar el caso podemos pedir la UCH, ECU, EZS, ELV u otros elementos necesarios. Hay trabajos de aprendizaje de llaves que requieren el vehículo completo; lo indicaremos antes de aceptar una recogida.']
    ],
    faq: [
      ['¿Inmovilizador activo significa que la ECU está rota?', 'No. La incidencia puede estar en la llave, un módulo de carrocería, una desincronización o en alimentación y comunicaciones.'],
      ['¿Mi coche puede no arrancar por un ELV o bloqueo de dirección?', 'Sí, en arquitecturas que integran el bloqueo electrónico en la autorización de contacto o arranque; debe comprobarse la unidad correspondiente.'],
      ['¿Puedo montar una centralita usada?', 'En algunos sistemas sí, tras verificar compatibilidad y realizar la transferencia o adaptación necesaria. No suele bastar con conectar una donante cualquiera.'],
      ['¿Se puede programar otra llave si se han perdido todas?', 'Existen procedimientos para diversos vehículos, pero dependen de la generación del inmovilizador y de los módulos disponibles.'],
      ['¿Puedo enviar los módulos desde otra provincia?', 'Si el trabajo puede realizarse en banco, sí. Confirmaremos qué elementos necesitas enviar; en otros casos será imprescindible el vehículo.']
    ],
    cases: [
      ['/casos/renault-kangoo-2007-uch-reparada', 'Renault Kangoo · reparación electrónica UCH'],
      ['/casos/renault-megane-2008-perdida-total-llaves', 'Renault Mégane · recuperación de llave'],
      ['/casos/mercedes-2008-2009-ezs-inoperativo-dos-llaves', 'Mercedes · recuperación de EZS y llaves']
    ],
    related: [
      ['/clonacion-centralitas-ecu', 'Clonación de ECU donante'],
      ['/coche-no-arranca-despues-cambiar-centralita', 'No arranca después de cambiar ECU'],
      ['/mercedes-ezs-elv', 'Mercedes EZS / ELV'],
      ['/programacion-llaves-coche', 'Programación de llaves']
    ],
    ctaTitle: '¿Tu coche no reconoce la llave o no autoriza el arranque?',
    ctaText: 'Envíanos marca, modelo, año, síntomas y códigos de diagnosis. Te indicaremos si hay que revisar el vehículo o si se puede estudiar un módulo por envío.'
  },

  'reparacion-centralitas-ecu': {
    title: 'Reparación de Centralitas ECU por Envío | Autokeys Remaps Pro',
    description: 'Diagnóstico y reparación de ECU que no comunica, falla al arrancar o presenta daños electrónicos. Recuperación de datos y servicio por mensajería en España.',
    eyebrow: 'REPARACIÓN ECU · DIAGNÓSTICO · SERVICIO NACIONAL',
    h1: 'Reparación y recuperación de centralitas ECU',
    intro: 'Un fallo de arranque o de comunicación no significa necesariamente que haya que sustituir la centralita. En nuestro laboratorio de Puente de Génave (Jaén) diagnosticamos daños electrónicos y estudiamos la reparación de la ECU original, la recuperación de sus datos o el uso de una donante compatible. Recibimos unidades de talleres y particulares de toda España.',
    serviceName: 'Diagnóstico y reparación electrónica de centralitas ECU',
    area: ['España', 'Jaén'],
    formUrl: '/enviar-reparacion.html?unidad=ecu&trabajo=Diagn%C3%B3stico%20%2F%20comprobaci%C3%B3n',
    highlights: [
      'Comprobaciones de alimentación, masas y comunicaciones antes de condenar la ECU',
      'Diagnóstico de fallo interno, daños electrónicos y memorias',
      'Estudio de recuperación tras fallos de escritura o intervención previa',
      'Reparación de componentes cuando técnicamente corresponde',
      'Valoración de transferencia de datos a una ECU donante compatible',
      'Recepción de centralitas por mensajería desde toda España'
    ],
    sections: [
      ['Síntomas que pueden indicar un problema de ECU', 'La ausencia de comunicación, fallos de alimentación, errores internos, motor que no arranca o problemas surgidos tras una escritura son motivos para investigar. Sin embargo, también pueden estar causados por instalación, fusibles, masas, sensores o la red del vehículo. Por eso la diagnosis previa es fundamental.'],
      ['Cómo diferenciamos un fallo interno de un problema externo', 'Antes de intervenir revisamos la historia de la avería, alimentación, comunicaciones y referencias. Cuando la centralita se estudia desmontada realizamos comprobaciones de laboratorio acordes a su arquitectura. No damos por averiada una ECU basándonos únicamente en un código de error.'],
      ['Centralitas que han dejado de comunicar tras una reprogramación', 'Una escritura interrumpida o un archivo incompatible puede dejar una unidad sin responder al método habitual. La posibilidad de recuperación depende del microcontrolador, el estado de las memorias, el acceso físico y la disponibilidad de información válida de la unidad. No existe una recuperación universal.'],
      ['Bosch, Continental, Delphi y otras familias', 'Cada ECU exige métodos distintos. Valoramos unidades Bosch EDC16, EDC17, MED17, MD1 y MG1; Siemens/Continental SID; Delphi y otras familias, siempre a partir de referencia de fabricante, hardware, software y síntomas comprobados. Mencionar una familia no implica que todas sus variantes sean reparables.'],
      ['¿Reparar la ECU original o sustituirla?', 'Si la avería permite reparar la unidad, podemos conservar la ECU original. Cuando existe un daño que impide su reutilización, estudiamos clonación o transferencia de datos a una donante adecuada. La decisión depende del presupuesto, del acceso a los datos y de la compatibilidad.'],
      ['Cómo solicitar diagnóstico por envío', 'Facilítanos marca, modelo, motor, referencia de la centralita, síntomas, códigos de avería y manipulaciones anteriores. Confirmaremos qué material enviar y las condiciones de valoración. Una vez recibido el módulo, concretaremos la intervención viable.']
    ],
    faq: [
      ['¿Cómo sé si falla la ECU o el cableado?', 'Una diagnosis del vehículo, la comprobación de alimentaciones y el estado de comunicaciones son necesarios antes de atribuir el fallo a la centralita.'],
      ['¿Reparáis centralitas que no comunican?', 'Las estudiamos, pero no todas se pueden recuperar. Primero hay que comprobar la causa y el estado de sus memorias y componentes.'],
      ['¿Se puede recuperar una ECU con una escritura fallida?', 'En algunas familias es posible mediante métodos de laboratorio. Depende del estado de la unidad y de si se conserva la información necesaria.'],
      ['¿Podéis suministrar una ECU donante si la original está irrecuperable?', 'Podemos estudiar esa posibilidad por referencia y disponibilidad, siempre verificando compatibilidad y viabilidad de transferencia o adaptación.'],
      ['¿Qué debo enviar al laboratorio?', 'Depende del caso: a menudo la ECU desmontada es suficiente para empezar. Si necesitamos donante, llaves u otros módulos lo indicaremos antes de solicitar el envío.'],
      ['¿Cuánto cuesta una reparación?', 'Se presupuesta según referencia, avería y procedimiento. No se puede dar un precio único sin identificar la unidad y el problema.']
    ],
    cases: [
      ['/casos/opel-combo-md1cs003-recuperacion-arranque', 'Opel Combo Bosch MD1CS003 · recuperación de arranque'],
      ['/casos/volvo-s60-2011-cem-recuperada', 'Volvo S60 · recuperación electrónica de un módulo CEM'],
      ['/ford-mustang-ecu-clonada.html', 'Ford Mustang · sustitución mediante ECU donante clonada']
    ],
    related: [
      ['/clonacion-centralitas-ecu', 'Clonación y sustitución de ECU'],
      ['/ecu-no-comunica', 'Diagnóstico de ECU que no comunica'],
      ['/reparacion-centralita-por-envio', 'Recepción de unidades por mensajería'],
      ['/inmovilizador-coche', 'Diagnóstico de inmovilizador de coche']
    ],
    ctaTitle: '¿La ECU no comunica, no arranca o ha sufrido una escritura fallida?',
    ctaText: 'Envíanos la referencia y los síntomas. Revisaremos si corresponde reparar la unidad, recuperar sus datos o estudiar una donante antes de que envíes material.'
  },
  'reparacion-airbag-srs': {
    title: 'Reparación Airbag SRS y Testigo Encendido | Autokeys',
    description: 'Diagnóstico y reparación electrónica de módulos Airbag SRS. Testigo de airbag encendido, crash data y servicio de laboratorio en Autokeys Remaps Pro.',
    eyebrow: 'AIRBAG · SRS · DIAGNÓSTICO ELECTRÓNICO',
    h1: 'Reparación de módulos Airbag SRS y testigo de airbag encendido',
    intro: 'El testigo de airbag o SRS encendido indica que el sistema de retención ha detectado una incidencia. Diagnosticamos módulos Airbag/SRS y trabajos de laboratorio sobre unidades electrónicas cuando corresponde, diferenciando el fallo del módulo de problemas en sensores, cableado, pretensores, airbags u otros elementos del sistema.',
    serviceName: 'Diagnóstico y reparación electrónica de módulos Airbag SRS',
    area: ['España', 'Jaén'],
    highlights: [
      'Diagnóstico de testigo Airbag/SRS encendido',
      'Comprobación de módulo Airbag con fallos internos o de comunicación',
      'Tratamiento de datos almacenados cuando técnicamente corresponde',
      'Reparación electrónica del módulo cuando es viable',
      'Servicio de laboratorio por envío para módulos desmontados'
    ],
    sections: [
      ['Qué significa tener la luz de airbag encendida', 'La luz de airbag o SRS indica que la unidad de control ha detectado un fallo en el sistema de retención. Puede estar relacionado con alimentación, conectores, sensores, pretensores, airbags, comunicaciones o con la propia centralita SRS. Borrar el fallo sin identificar su causa no constituye una reparación.'],
      ['Avería de airbag: primero diagnosis del sistema completo', 'Antes de intervenir sobre el módulo es importante conocer los códigos de avería y el contexto del vehículo. Un fallo almacenado puede apuntar a un elemento externo al módulo, por lo que la reparación electrónica solo tiene sentido cuando la diagnosis y las comprobaciones justifican trabajar sobre la unidad.'],
      ['Crash data y datos almacenados en el módulo SRS', 'Después de determinadas activaciones el módulo puede almacenar información asociada al evento. El tratamiento de esos datos depende de la referencia y de la arquitectura del sistema. La intervención sobre la centralita no sustituye la inspección y reparación de airbags, pretensores, sensores, cableado y demás elementos de seguridad afectados.'],
      ['Reparación electrónica del módulo Airbag', 'Cuando existe un fallo interno reparable, revisamos la unidad y sus memorias según la referencia concreta. En módulos con daños físicos graves, alimentación comprometida o intervenciones previas puede ser necesaria otra estrategia o una unidad compatible.'],
      ['Servicio por envío de módulos Airbag/SRS', 'Para trabajos que pueden realizarse sobre el módulo desmontado, recibimos unidades por envío desde toda España. Antes de enviar, facilítanos referencia, vehículo, códigos de diagnosis y una descripción de la incidencia para confirmar qué necesitamos recibir.']
    ],
    faq: [
      ['¿Puedo circular con el testigo de airbag encendido?', 'El testigo indica una anomalía en un sistema de seguridad. Lo adecuado es diagnosticarla y repararla antes de dar por válido el funcionamiento del sistema de retención.'],
      ['¿Qué significa SRS en un coche?', 'SRS hace referencia al sistema suplementario de retención, que integra la gestión de airbags y otros elementos relacionados con la protección de los ocupantes.'],
      ['¿Borrar el fallo apaga definitivamente la luz de airbag?', 'Solo si la causa real ya está resuelta. Si existe una avería activa, el fallo volverá a registrarse o el sistema seguirá sin funcionar correctamente.'],
      ['¿Podéis reparar un módulo Airbag por envío?', 'En muchos casos sí. Necesitamos primero la referencia del módulo, el vehículo y los códigos de diagnosis para confirmar el procedimiento.'],
      ['¿Resetear el módulo sustituye la reparación de airbags y pretensores?', 'No. Los componentes de seguridad activados o averiados deben inspeccionarse y repararse o sustituirse según corresponda. El trabajo sobre el módulo es solo una parte del sistema.']
    ],
    cases: [
      ['/casos-reales.html', 'Casos reales documentados por Autokeys'],
      ['/reparacion-centralita-por-envio', 'Servicio de electrónica por envío'],
      ['/electronica-automovil-jaen.html', 'Electrónica del automóvil en Jaén']
    ],
    related: [
      ['/reparacion-centralitas-ecu', 'Reparación de centralitas ECU'],
      ['/reparacion-centralita-por-envio', 'Reparación electrónica por envío'],
      ['/enviar-reparacion.html', 'Enviar un módulo al laboratorio']
    ],
    ctaTitle: '¿Tienes el testigo Airbag/SRS encendido o un módulo con fallo?',
    ctaText: 'Envíanos referencia del módulo, vehículo y códigos de diagnosis. Te indicamos si el trabajo corresponde al módulo y qué necesitamos recibir.'
  }
};

function esc(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
}

function schemaJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function renderFaq(items) {
  return items.map(([q, a]) => `<article><h3>${esc(q)}</h3><p>${esc(a)}</p></article>`).join('');
}

function renderLinks(items, className = 'cat-item') {
  return items.map(([href, label]) => `<a class="${className}" href="${esc(href)}"><span><b>${esc(label)}</b></span></a>`).join('');
}

function renderPage(slug, page) {
  const canonical = `${SITE}/${slug}`;
  const formUrl = page.formUrl || '/enviar-reparacion.html';
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a }
    }))
  };
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.serviceName,
    description: page.description,
    url: canonical,
    image: IMAGE,
    areaServed: page.area.map((name) => ({ '@type': name === 'España' ? 'Country' : 'AdministrativeArea', name })),
    provider: {
      '@type': 'AutomotiveBusiness',
      '@id': BUSINESS_ID,
      name: 'Autokeys Remaps Pro',
      url: `${SITE}/`,
      telephone: '+34632982646',
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
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: page.h1, item: canonical }
    ]
  };
  const webpageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: page.title,
    description: page.description,
    inLanguage: 'es-ES',
    dateModified: ['inmovilizador-coche', 'reparacion-centralitas-ecu'].includes(slug) ? '2026-10-22' : '2026-09-01',
    isPartOf: { '@id': `${SITE}/#website` },
    about: { '@id': BUSINESS_ID },
    primaryImageOfPage: { '@type': 'ImageObject', url: IMAGE }
  };

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Autokeys Remaps Pro">
<meta property="og:locale" content="es_ES">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${IMAGE}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.title)}">
<meta name="twitter:description" content="${esc(page.description)}">
<meta name="twitter:image" content="${IMAGE}">
<link rel="stylesheet" href="/assets/css/style.css">
<link rel="icon" href="/favicon-48x48.png" type="image/png" sizes="48x48"><link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="any"><link rel="alternate icon" href="/favicon.ico"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest"><meta name="theme-color" content="#0a0a0c">
<script type="application/ld+json">${schemaJson(serviceSchema)}</script>
<script type="application/ld+json">${schemaJson(breadcrumbSchema)}</script>
<script type="application/ld+json">${schemaJson(faqSchema)}</script>
<script type="application/ld+json">${schemaJson(webpageSchema)}</script>
</head>
<body>
<a class="skip-link" href="#main">Saltar al contenido</a>
<header id="site-header"></header>
<main id="main">
<nav class="breadcrumb" aria-label="Migas de pan"><a href="/">Inicio</a><span>›</span><span class="current">${esc(page.h1)}</span></nav>

<section class="section" style="padding-bottom:18px">
  <div class="eyebrow">${esc(page.eyebrow)}</div>
  <h1>${esc(page.h1)}</h1>
  <p class="section-desc">${esc(page.intro)}</p>
  <div class="btn-row" style="margin-top:22px">
    <a class="btn btn-primary" href="${esc(formUrl)}">Solicitar valoración</a>
    <a class="btn btn-secondary" href="https://wa.me/34632982646" target="_blank" rel="noopener">Consultar por WhatsApp</a>
  </div>
</section>

<section class="section">
  <div class="eyebrow">SERVICIO AUTOKEYS</div>
  <h2>Qué incluye este servicio</h2>
  <ul>${page.highlights.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>
</section>

${page.sections.map((section) => `<section class="section"><h2>${esc(section[0])}</h2><p class="section-desc">${esc(section[1])}</p></section>`).join('\n')}

<section class="section">
  <div class="eyebrow">CASOS REALES AUTOKEYS</div>
  <h2>Trabajos y recursos relacionados</h2>
  <p class="section-desc">Cada vehículo y referencia puede requerir un procedimiento distinto. Estos contenidos ayudan a entender cómo abordamos casos reales y sistemas relacionados.</p>
  <div class="cat-grid">${renderLinks(page.cases)}</div>
</section>

<section class="section">
  <div class="eyebrow">PREGUNTAS FRECUENTES</div>
  <h2>Dudas habituales antes de solicitar el servicio</h2>
  <div class="product-grid cols-2">${renderFaq(page.faq)}</div>
</section>

<section class="section">
  <div class="eyebrow">SERVICIOS RELACIONADOS</div>
  <h2>Más soluciones de Autokeys Remaps Pro</h2>
  <div class="cat-grid">${renderLinks(page.related)}</div>
</section>

<section class="section">
  <div class="eyebrow">AUTOKEYS REMAPS PRO</div>
  <h2>${esc(page.ctaTitle)}</h2>
  <p class="section-desc">${esc(page.ctaText)}</p>
  <div class="btn-row" style="margin-top:22px">
    <a class="btn btn-primary" href="${esc(formUrl)}">Enviar mi caso</a>
    <a class="btn btn-secondary" href="tel:+34632982646">Llamar a oficina</a>
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
}

module.exports = function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).send('Method not allowed');
  }
  const slug = String(req.query.slug || '').trim();
  const page = PAGES[slug];
  if (!page) return res.status(404).send('Página no encontrada');

  const html = renderPage(slug, page);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.setHeader('X-AK-SEO-Growth', '1');
  if (req.method === 'HEAD') return res.status(200).end();
  return res.status(200).send(html);
};
