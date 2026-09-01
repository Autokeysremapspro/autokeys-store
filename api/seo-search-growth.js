const SITE = 'https://www.autokeysremapspro.es';
const BUSINESS_ID = `${SITE}/#business`;
const IMAGE = `${SITE}/assets/img/hero-taller.webp`;

const PAGES = {
  'inmovilizador-coche': {
    title: 'Inmovilizador del Coche | Diagnóstico y Programación',
    description: 'Diagnóstico de fallos de inmovilizador, llaves no reconocidas y problemas de arranque. Programación y recuperación de sistemas en Autokeys Remaps Pro.',
    eyebrow: 'INMOVILIZADOR · LLAVES · ARRANQUE',
    h1: 'Inmovilizador del coche: diagnóstico, programación y reparación',
    intro: 'Si el vehículo muestra inmovilizador activo, no reconoce la llave, arranca y se para o directamente no autoriza el arranque, primero hay que identificar qué parte del sistema está fallando. En Autokeys Remaps Pro diagnosticamos llaves, inmovilizadores y módulos de autorización de arranque antes de programar o sustituir componentes.',
    serviceName: 'Diagnóstico y programación de inmovilizador de coche',
    area: ['Jaén', 'España'],
    highlights: [
      'Diagnóstico cuando el coche no reconoce la llave',
      'Comprobación de inmovilizador activo y autorización de arranque',
      'Programación y aprendizaje de llaves cuando el sistema lo permite',
      'Recuperación de sincronización entre módulos según arquitectura',
      'Trabajo de laboratorio sobre módulos cuando la diagnosis por vehículo no es suficiente'
    ],
    sections: [
      ['Qué significa que el inmovilizador esté activo', 'El inmovilizador es parte del sistema antirrobo del vehículo y autoriza o bloquea el arranque según la información intercambiada entre llave, antena, cuadro, BCM, UCH, CAS, FEM, BDC, EZS u otros módulos según la marca. Un mensaje de inmovilizador activo no significa automáticamente que la llave esté averiada: puede existir un problema de alimentación, comunicación, sincronización o datos.'],
      ['Síntomas habituales de un fallo de inmovilizador', 'Los síntomas más frecuentes son llave no reconocida, testigo de inmovilizador encendido o parpadeando, motor que gira pero no arranca, arranque durante uno o dos segundos y parada inmediata, ausencia de autorización de arranque o pérdida de sincronización después de sustituir o programar un módulo. El patrón exacto cambia según fabricante y generación.'],
      ['Diagnóstico antes de codificar una llave', 'Codificar una llave sin saber por qué el vehículo no la reconoce puede no resolver la avería. Revisamos diagnosis, estado de la llave, alimentación, comunicaciones y módulos implicados. Cuando el sistema requiere acceso a memoria o trabajo en banco, la intervención se plantea desde laboratorio conservando los datos originales siempre que sea posible.'],
      ['Programación, recuperación y sustitución', 'Según el vehículo, la solución puede ser programar una nueva llave, recuperar una sincronización, reparar un módulo, adaptar una unidad donante o reconstruir información del sistema. No aplicamos un procedimiento genérico: primero identificamos la arquitectura y la compatibilidad de cada componente.'],
      ['Servicio en Jaén y trabajos de laboratorio por envío', 'Los trabajos que necesitan el vehículo se realizan en nuestro laboratorio de Puente de Génave, Jaén. Cuando la intervención puede hacerse sobre módulos concretos, también recibimos unidades de talleres y profesionales de otras provincias previa identificación del sistema y del material necesario.']
    ],
    faq: [
      ['¿Qué significa inmovilizador activo?', 'Significa que el sistema de autorización de arranque no está validando correctamente una de las condiciones necesarias. Puede deberse a llave, comunicación, alimentación, sincronización o a un módulo implicado en el arranque.'],
      ['¿Cómo saber si falla la llave o el inmovilizador?', 'La forma correcta es diagnosticar el sistema. Si hay otra llave funcional, su comportamiento ayuda a orientar el fallo, pero la diagnosis y las comunicaciones entre módulos son las que permiten confirmar el origen.'],
      ['¿Se puede programar una llave nueva si el coche no reconoce ninguna?', 'En muchos vehículos sí, aunque el procedimiento depende de la arquitectura. En algunos casos basta con diagnosis y en otros es necesario trabajar sobre módulos electrónicos.'],
      ['¿Un inmovilizador averiado siempre obliga a cambiar la centralita?', 'No. El inmovilizador puede estar gestionado por distintos módulos y un fallo de arranque no implica necesariamente que la ECU de motor esté dañada. Primero se identifica el elemento que está bloqueando la autorización.']
    ],
    cases: [
      ['/casos/renault-megane-2008-perdida-total-llaves', 'Renault Megane 2008 · recuperación de llave e inmovilizador'],
      ['/casos/renault-kangoo-2007-uch-reparada', 'Renault Kangoo · recuperación electrónica UCH'],
      ['/bmw-fem-bdc', 'BMW FEM / BDC · autorización de arranque y llaves'],
      ['/mercedes-ezs-elv', 'Mercedes EZS / ELV · sistema de arranque']
    ],
    related: [
      ['/programacion-llaves-coche', 'Programación de llaves de coche'],
      ['/perdida-total-llaves-coche', 'Pérdida total de llaves'],
      ['/duplicado-llaves-coche-jaen', 'Duplicado de llaves de coche en Jaén'],
      ['/reparacion-centralitas-ecu', 'Reparación de centralitas ECU']
    ],
    ctaTitle: '¿Tu coche muestra fallo de inmovilizador o no reconoce la llave?',
    ctaText: 'Envíanos marca, modelo, año, síntomas y los códigos de diagnosis si los tienes. Revisamos primero la arquitectura antes de indicarte el procedimiento.'
  },

  'reparacion-centralitas-ecu': {
    title: 'Reparación de Centralitas ECU por Envío | Autokeys',
    description: 'Reparación y diagnóstico de centralitas ECU de coche. Recuperación, clonación y servicio por envío desde toda España en Autokeys Remaps Pro.',
    eyebrow: 'REPARACIÓN ECU · DIAGNÓSTICO · SERVICIO NACIONAL',
    h1: 'Reparación de centralitas ECU de coche por envío',
    intro: 'Reparamos y diagnosticamos centralitas de motor con fallos internos, ausencia de comunicación, daños de alimentación, corrupción de memoria o problemas después de una intervención previa. Trabajamos desde nuestro laboratorio en Puente de Génave, Jaén, y recibimos unidades por envío desde toda España.',
    serviceName: 'Reparación y diagnóstico de centralitas ECU de coche',
    area: ['España', 'Jaén'],
    highlights: [
      'Diagnóstico y peritación técnica antes de reparar cuando es necesario',
      'Reparación electrónica a nivel de componente cuando es viable',
      'Recuperación de memorias y unidades con escritura fallida',
      'Clonación a una ECU donante compatible cuando procede',
      'Servicio por envío para particulares, talleres y profesionales de toda España'
    ],
    sections: [
      ['Cómo saber si una centralita de coche está realmente averiada', 'Una ECU que no comunica, provoca fallos internos o impide el arranque no siempre es la causa primaria. Antes de sustituir revisamos alimentación, masas, comunicaciones, códigos de avería, daños físicos, estado de memorias y antecedentes de manipulación para separar una avería real de la centralita de un fallo externo del vehículo.'],
      ['Diagnóstico y valoración antes de la reparación', 'Cuando el caso lo requiere realizamos una valoración técnica de la unidad antes de confirmar la intervención. La referencia, la familia electrónica, el daño y las manipulaciones previas determinan si conviene reparar la ECU original, recuperar sus datos o estudiar una unidad donante.'],
      ['Familias de ECU que trabajamos en laboratorio', 'El procedimiento depende de cada familia. Trabajamos con numerosas unidades Bosch EDC15, EDC16, EDC17, MED y MED17, además de plataformas MD1 y MG1, Siemens/Continental SID, Delphi y otras familias habituales de electrónica de motor. La referencia exacta es la que determina el método de lectura, comprobación y reparación.'],
      ['Reparar, recuperar o clonar una ECU', 'Si el daño es reparable intervenimos sobre la propia centralita. Cuando la unidad original no puede seguir trabajando pero conserva información útil, estudiamos la recuperación y transferencia de datos a una donante compatible. No todas las ECU físicamente iguales son intercambiables, por lo que comprobamos hardware, software y referencias antes de clonar.'],
      ['Precio de reparar una centralita de coche', 'No existe un precio único porque el trabajo cambia mucho entre una avería de alimentación, una memoria dañada, una ECU sin comunicación, una clonación o una recuperación compleja. La referencia exacta y los síntomas permiten orientar el caso antes de enviar la unidad y evitar presupuestos genéricos que luego no corresponden al trabajo real.'],
      ['Reparación de ECU por envío desde toda España', 'Antes de enviar una centralita, facilítanos marca, modelo, motor, referencia de la ECU y síntomas. Te indicamos qué necesitamos recibir y registramos el trabajo asociado a esa referencia. De esta forma evitamos desmontajes y envíos innecesarios y mantenemos trazabilidad durante el proceso.']
    ],
    faq: [
      ['¿Cómo puedo saber si tengo que reparar la centralita del coche?', 'La diagnosis del vehículo y la comprobación de alimentaciones y comunicaciones son el punto de partida. Una avería registrada en la ECU no siempre significa que el módulo esté físicamente dañado.'],
      ['¿Cuánto cuesta reparar una centralita de coche?', 'Depende de la referencia, la avería y el procedimiento necesario. Con fotografías de la etiqueta, datos del vehículo y síntomas podemos orientar el trabajo antes del envío.'],
      ['¿Puedo enviar solo la ECU?', 'En muchos casos sí. Antes de desmontar confirmamos si necesitamos únicamente la centralita o también algún módulo, llave o unidad donante.'],
      ['¿Se puede recuperar una ECU después de una escritura fallida?', 'En determinadas familias sí. La viabilidad depende del estado de la unidad, del método utilizado y de si todavía es posible acceder a las memorias necesarias.'],
      ['¿Trabajáis reparación de ECU para talleres de toda España?', 'Sí. Recibimos unidades de talleres, profesionales y clientes de distintas provincias mediante servicio por envío.']
    ],
    cases: [
      ['/casos/opel-combo-md1cs003-recuperacion-arranque', 'Opel Combo MD1CS003 · recuperación de arranque'],
      ['/casos/bosch-edc17cp54-stage-1-plus-malaga', 'Bosch EDC17CP54 · unidad trabajada desde Málaga'],
      ['/casos/golf-6-gti-med17-5-electronica-corregida', 'Volkswagen Golf GTI MED17.5 · electrónica de motor'],
      ['/clonacion-centralitas-ecu', 'Clonación de centralitas ECU']
    ],
    related: [
      ['/clonacion-centralitas-ecu', 'Clonación de centralitas ECU'],
      ['/reparacion-centralita-por-envio', 'Reparación de módulos por envío'],
      ['/enviar-reparacion.html', 'Enviar una unidad al laboratorio'],
      ['/inmovilizador-coche', 'Diagnóstico de inmovilizador de coche']
    ],
    ctaTitle: '¿Necesitas reparar o diagnosticar una centralita ECU?',
    ctaText: 'Envíanos una fotografía de la etiqueta, marca, modelo, motor y síntomas. Te indicamos qué material necesitamos antes de realizar el envío.'
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
    dateModified: '2026-09-01',
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
<link rel="icon" type="image/png" href="/assets/img/logo.png">
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
    <a class="btn btn-primary" href="https://wa.me/34632982646" target="_blank" rel="noopener">Consultar por WhatsApp</a>
    <a class="btn btn-secondary" href="tel:+34953852778">Llamar al laboratorio</a>
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
