const SITE = 'https://www.autokeysremapspro.es';
const AKCLOUD = 'https://www.akcloud.es/file-service-ecu';
const FALLBACK_IMAGE = `${SITE}/assets/img/logo.png`;

const CASES = {
  'renault-megane-2008-perdida-total-llaves': {
    title: 'Renault Mégane 2008 1.9 dCi F9Q: pérdida total de llaves',
    meta: 'Caso real en Autokeys Remaps Pro: Renault Mégane 2008 1.9 dCi F9Q con todas las llaves perdidas. Trabajo sobre UCH y alta de una nueva llave.',
    category: 'LLAVES · UCH · PÉRDIDA TOTAL',
    intro: 'Este Renault Mégane 2008 equipado con motor 1.9 dCi F9Q llegó a Autokeys Remaps Pro con pérdida total de llaves. El objetivo era recuperar una llave funcional sin basar el trabajo en suposiciones: primero había que identificar correctamente el sistema, acceder a la información necesaria de la UCH y comprobar que el vehículo podía volver a reconocer una llave nueva.',
    facts: ['Renault Mégane 2008', 'Motor 1.9 dCi F9Q', 'Pérdida total de llaves', 'Trabajo sobre UCH', 'Autel + XP400 Pro', 'Nueva llave añadida y vehículo funcional'],
    sections: [
      {
        title: 'Situación inicial',
        paragraphs: [
          'El vehículo se presentó sin ninguna llave operativa. En una pérdida total el punto de partida es diferente a un simple duplicado: no existe una llave funcional con la que comprobar el sistema o realizar un proceso convencional de copia. Por eso el trabajo comienza identificando la arquitectura de inmovilizador y el módulo que conserva la información necesaria.',
          'En este caso se trabajó sobre la UCH del vehículo. Antes de intervenir se documentó la unidad y se planteó el proceso con el objetivo de conservar la información original y evitar modificaciones innecesarias en otros módulos.',
        ],
      },
      {
        title: 'Acceso a la UCH y trabajo por volcado',
        paragraphs: [
          'Se desmontó la UCH para poder trabajar con la información almacenada en la unidad. Utilizamos equipo Autel junto con XP400 Pro para realizar el proceso de lectura y alta de la nueva llave a partir del volcado correspondiente.',
          'El trabajo por volcado exige orden y trazabilidad: identificación correcta de la unidad, conservación de la información original y separación clara entre los datos leídos y cualquier archivo generado durante el proceso. No se trata de “probar llaves” hasta que una funcione, sino de trabajar sobre el sistema que realmente gestiona la autorización de arranque.',
        ],
      },
      {
        title: 'Alta de la nueva llave',
        paragraphs: [
          'Una vez obtenida y tratada la información necesaria, se añadió una nueva llave al sistema. Después se volvió a montar la unidad y se comprobó el reconocimiento de la llave y el funcionamiento del vehículo.',
          'El resultado fue la recuperación de una llave funcional y la vuelta del vehículo a servicio. No fue necesario presentar el caso como una sustitución indiscriminada de módulos: el objetivo fue conservar la configuración del coche y resolver la pérdida total desde la electrónica existente.',
        ],
      },
      {
        title: 'Qué enseña este caso',
        paragraphs: [
          'Una pérdida total de llaves no se resuelve igual en todos los vehículos. Dependiendo de marca, año, inmovilizador, UCH/BCM, cuadro o ECU, el procedimiento puede cambiar. Por eso antes de presupuestar o intervenir es importante identificar el sistema concreto y saber qué unidad participa en la autorización.',
          'En Autokeys Remaps Pro trabajamos estos casos desde la diagnosis y la electrónica del vehículo, documentando cada intervención y evitando prometer procedimientos universales para plataformas distintas.',
        ],
      },
    ],
    related: [
      ['Pérdida total de llaves', '/perdida-total-llaves-coche'],
      ['Programación de llaves', '/programacion-llaves-coche'],
      ['Electrónica del automóvil en Jaén', '/electronica-automovil-jaen.html'],
    ],
  },
  'bmw-418d-stage-1-sport-display': {
    title: 'BMW 418d: Stage 1 y ajuste de Sport Display',
    meta: 'Caso real de Autokeys Remaps Pro en BMW 418d: trabajo de reprogramación Stage 1 y ajuste de Sport Display sin publicar cifras de potencia no verificadas.',
    category: 'BMW · REPROGRAMACIÓN ECU',
    intro: 'En este BMW 418d se realizó un trabajo de reprogramación Stage 1 acompañado del ajuste de Sport Display. El objetivo del caso no es publicar una cifra genérica de potencia, porque una calibración responsable depende de la versión concreta, el estado del vehículo y la lectura original; lo importante es mostrar cómo se estructura el proceso antes de modificar una ECU.',
    facts: ['BMW 418d', 'Reprogramación Stage 1', 'Sport Display ajustado', 'Trabajo sobre archivo original', 'Diagnosis previa', 'Sin cifras de potencia inventadas'],
    sections: [
      {
        title: 'Primero, comprobar el vehículo',
        paragraphs: [
          'Antes de preparar una Stage 1 es necesario confirmar que el vehículo llega en condiciones de trabajar. La diagnosis previa permite detectar averías activas o síntomas que podrían confundirse después con el efecto de una calibración. Una reprogramación no debe utilizarse para ocultar un problema mecánico o eléctrico existente.',
          'También se registra la versión de software y se conserva el archivo original. Esa copia es la referencia del trabajo y permite mantener trazabilidad entre lo que traía el vehículo y la versión modificada que se prepara después.',
        ],
      },
      {
        title: 'Stage 1 adaptada al vehículo',
        paragraphs: [
          'La etiqueta Stage 1 describe un nivel de preparación, pero no existe una cifra universal aplicable a todos los BMW 418d. La calibración debe partir del software real de esa unidad y tener en cuenta motor, transmisión, combustible, estado mecánico y uso previsto.',
          'Por esa razón no publicamos en este caso un número de potencia que no haya sido medido y documentado. El enfoque profesional consiste en trabajar sobre una base identificada y mantener márgenes coherentes con la configuración del vehículo.',
        ],
      },
      {
        title: 'Ajuste del Sport Display',
        paragraphs: [
          'Junto al trabajo de motor se realizó el ajuste correspondiente del Sport Display para que la visualización quedara alineada con la nueva configuración. Esta parte forma parte de la presentación del resultado al conductor, pero no sustituye una medición real de potencia ni debe interpretarse como un banco de potencia.',
          'Separar la calibración de motor de la representación gráfica evita confundir una indicación de pantalla con un dato medido. Cada una cumple una función distinta dentro del trabajo.',
        ],
      },
      {
        title: 'Trazabilidad y comprobación final',
        paragraphs: [
          'Tras preparar el archivo se mantiene el ORI conservado y la versión modificada claramente identificada. El vehículo se comprueba para confirmar que no aparecen incidencias relacionadas con el proceso y que el funcionamiento general es coherente con el estado previo documentado.',
          'Este tipo de trabajo resume nuestra forma de abordar una reprogramación: diagnosis, identificación, copia original, modificación controlada y verificación posterior, sin tratar una Stage como una receta universal.',
        ],
      },
    ],
    related: [
      ['Reprogramación de centralitas en Jaén', '/reprogramacion-centralitas-jaen'],
      ['Reparación de centralitas ECU', '/reparacion-centralitas-ecu'],
      ['Quiénes somos', '/quienes-somos.html'],
    ],
  },
  'bosch-edc17cp54-stage-1-plus-malaga': {
    title: 'Bosch EDC17CP54: trabajo Stage 1+ gestionado desde Málaga',
    meta: 'Caso real de Autokeys Remaps Pro con una ECU Bosch EDC17CP54 vinculada a un trabajo Stage 1+ gestionado desde Málaga y documentado por archivo.',
    category: 'BOSCH EDC17CP54 · TRABAJO A DISTANCIA',
    intro: 'Este caso corresponde a un trabajo con Bosch EDC17CP54 gestionado para un cliente de Málaga. La intervención se planteó como un proceso de archivo documentado: identificar correctamente la ECU y su software, conservar el original, preparar una calibración Stage 1+ sobre esa base y mantener separadas las versiones del trabajo.',
    facts: ['Bosch EDC17CP54', 'Origen del trabajo: Málaga', 'Calibración Stage 1+', 'Archivo original conservado', 'Identificación previa', 'Servicio gestionado a distancia'],
    sections: [
      {
        title: 'La referencia de ECU importa',
        paragraphs: [
          'EDC17CP54 identifica una familia concreta dentro del universo Bosch EDC17, pero incluso dentro de una misma referencia pueden existir versiones de hardware y software diferentes. Antes de modificar un archivo es necesario confirmar que la lectura pertenece a la unidad declarada y conservar los identificadores disponibles.',
          'El nombre del fichero por sí solo no sustituye esa identificación. Una buena trazabilidad relaciona archivo, vehículo, HW, SW y solicitud, de forma que la versión modificada pueda volver a vincularse siempre con su origen.',
        ],
      },
      {
        title: 'Trabajar a distancia exige más orden, no menos',
        paragraphs: [
          'Cuando el trabajo se gestiona desde otra provincia no tenemos el vehículo delante durante todas las fases. Eso hace todavía más importante que la información llegue completa: estado del vehículo, lectura original, referencia de ECU, software y objetivo solicitado.',
          'La ausencia física del coche no debe compensarse con suposiciones. Si existe una incidencia mecánica, una lectura dudosa o un historial de modificaciones desconocido, debe declararse antes de preparar el archivo.',
        ],
      },
      {
        title: 'Preparación del Stage 1+',
        paragraphs: [
          'La calibración se prepara sobre el archivo original asociado al trabajo. El término Stage 1+ describe el alcance solicitado en este caso, pero no implica una cifra de potencia universal ni una receta reutilizable en cualquier EDC17CP54. El resultado depende de la aplicación concreta y de los límites del conjunto.',
          'Por ese motivo el archivo modificado se mantiene ligado a su ORI y a los datos del trabajo. Evitamos presentar un archivo de una referencia como si fuera automáticamente intercambiable con otra ECU o software.',
        ],
      },
      {
        title: 'Un modelo útil para talleres y colaboradores',
        paragraphs: [
          'Este tipo de flujo demuestra por qué la documentación es clave cuando trabajamos con profesionales de otras provincias. El taller local mantiene el control del vehículo, la lectura, la escritura y la diagnosis; nosotros trabajamos sobre la parte de archivo acordada y devolvemos una versión identificada.',
          'Para profesionales que necesitan un flujo todavía más centralizado, AK Cloud reúne ORI, información técnica, solicitud y MOD dentro del mismo pedido de File Service.',
        ],
      },
    ],
    related: [
      ['Reprogramación de centralitas', '/reprogramacion-centralitas-jaen'],
      ['Clonación de centralitas ECU', '/clonacion-centralitas-ecu'],
      ['Reparación por envío', '/reparacion-centralita-por-envio'],
    ],
    professionalLink: true,
  },
};

function cleanSlug(value) {
  const slug = String(value || '').trim();
  return /^[a-z0-9][a-z0-9-]{0,180}$/.test(slug) ? slug : '';
}

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
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
    publisher: { '@type': 'Organization', name: 'Autokeys Remaps Pro', url: SITE, logo: { '@type': 'ImageObject', url: FALLBACK_IMAGE } },
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Casos reales', item: `${SITE}/casos-reales.html` },
      { '@type': 'ListItem', position: 3, name: item.title, item: canonical },
    ],
  };

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(item.title)} | Autokeys</title>
<meta name="description" content="${esc(item.meta)}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Autokeys Remaps Pro">
<meta property="og:locale" content="es_ES">
<meta property="og:title" content="${esc(item.title)} | Autokeys Remaps Pro">
<meta property="og:description" content="${esc(item.meta)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(FALLBACK_IMAGE)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="/assets/css/style.css">
<script type="application/ld+json">${jsonLd(schema)}</script>
<script type="application/ld+json">${jsonLd(breadcrumb)}</script>
</head>
<body>
<a class="skip-link" href="#main">Saltar al contenido</a>
<header id="site-header" data-active="blog"></header>
<main id="main">
<nav class="breadcrumb" aria-label="Migas de pan"><a href="/">Inicio</a><span>›</span><a href="/casos-reales.html">Casos reales</a><span>›</span><span class="current">${esc(item.title)}</span></nav>
<article class="section">
  <div class="eyebrow">${esc(item.category)}</div>
  <h1>${esc(item.title)}</h1>
  <p class="lead">${esc(item.intro)}</p>
  <div class="cat-grid" style="margin-top:28px">${item.facts.map((fact) => `<div class="cat-item"><span><b>${esc(fact)}</b></span></div>`).join('')}</div>
  <div class="blog-post-body" style="margin-top:36px">${item.sections.map((section) => `<section style="margin-top:34px"><h2>${esc(section.title)}</h2>${section.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}</section>`).join('')}</div>
  <div class="blog-post-cta"><div><b>¿Tienes un caso parecido?</b><p>Cuéntanos vehículo, sistema, avería y trabajo que necesitas. Revisaremos el caso antes de intervenir.</p></div><a class="btn btn-primary" href="/enviar-reparacion.html">Solicitar valoración</a></div>
  ${item.professionalLink ? `<div class="blog-post-cta" style="margin-top:16px"><div><b>¿Eres taller o profesional?</b><p>El File Service profesional de Autokeys Remaps Pro se gestiona mediante AK Cloud.</p></div><a class="btn btn-ghost" href="${AKCLOUD}" rel="noopener">Abrir AK Cloud</a></div>` : ''}
</article>
<section class="section">
  <div class="eyebrow">SERVICIOS RELACIONADOS</div>
  <h2>Información y servicios relacionados</h2>
  <div class="cat-grid">${item.related.map(([label, href]) => `<a class="cat-item" href="${esc(href)}"><span><b>${esc(label)}</b><p style="margin:4px 0 0;color:var(--muted);font-size:12px">Ver servicio</p></span></a>`).join('')}</div>
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
  if (!slug || !CASES[slug]) return res.status(404).send('Caso no encontrado');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).send(renderPage(slug, CASES[slug]));
};
