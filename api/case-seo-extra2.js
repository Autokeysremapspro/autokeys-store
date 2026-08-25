const SITE = 'https://www.autokeysremapspro.es';
const FALLBACK_IMAGE = `${SITE}/assets/img/logo.png`;

const CASES = {
  'golf-4-1-9-tdi-asz-stage-2-hardcut': {
    title: 'Golf 4 1.9 TDI ASZ: Stage 2 + hardcut',
    meta: 'Caso real Volkswagen Golf 4 1.9 TDI ASZ 130 CV: calibración Stage 2 con hardcut y configuración flames, desarrollada y comprobada en el vehículo.',
    category: 'VOLKSWAGEN · 1.9 TDI ASZ · STAGE 2',
    intro: 'Este Volkswagen Golf 4 1.9 TDI ASZ de 130 CV recibió una calibración Stage 2 acompañada de hardcut y configuración flames. El trabajo se planteó sobre el archivo del vehículo, evitando presentar la preparación como una cifra universal de potencia y centrando el resultado en una calibración adaptada al conjunto y comprobada sobre el coche.',
    facts: ['Volkswagen Golf 4', 'Motor 1.9 TDI ASZ', '130 CV de origen', 'Stage 2', 'Hardcut', 'Configuración flames'],
    sections: [
      {
        title: 'Partir del archivo real del vehículo',
        paragraphs: [
          'Una Stage 2 no debería tratarse como un archivo intercambiable entre todos los Golf 4. Aunque dos vehículos compartan motor ASZ, la versión de software, el estado del conjunto y las modificaciones mecánicas pueden cambiar el punto de partida.',
          'Por eso el trabajo comienza conservando la lectura correspondiente al vehículo y usando esa base para preparar la calibración. Esto permite mantener trazabilidad entre el archivo original y la versión modificada.'
        ]
      },
      {
        title: 'Calibración Stage 2',
        paragraphs: [
          'La preparación se realizó como Stage 2 para el 1.9 TDI ASZ. El objetivo era conseguir una respuesta más contundente y un comportamiento acorde con la preparación, sin convertir el trabajo en una simple subida indiscriminada de valores.',
          'No publicamos una cifra de potencia que no esté respaldada por una medición documentada. El valor del caso está en la calibración realizada y en el resultado comprobado sobre el vehículo.'
        ]
      },
      {
        title: 'Hardcut y configuración flames',
        paragraphs: [
          'Junto con la Stage 2 se incorporó hardcut y una configuración flames, dos funciones que modifican de forma muy perceptible el comportamiento en determinadas condiciones. Por ese motivo deben integrarse dentro de la calibración completa y no añadirse como bloques independientes sin comprobar cómo responde el conjunto.',
          'En este caso se trabajaron como parte de la misma preparación y se verificó su funcionamiento junto al resto de la electrónica.'
        ]
      },
      {
        title: 'Resultado del trabajo',
        paragraphs: [
          'El Golf quedó terminado con la configuración solicitada: Stage 2, hardcut y flames. El caso forma parte de los trabajos reales de Autokeys Remaps Pro y muestra nuestra forma de abordar una preparación sobre un TDI PD conocido, pero siempre desde el archivo concreto del vehículo.',
          'Cada nueva intervención se identifica y se trabaja de forma individual, incluso cuando ya tenemos experiencia previa con el mismo código de motor.'
        ]
      }
    ],
    related: [
      ['Reprogramación de centralitas', '/reprogramacion-centralitas-jaen'],
      ['Reparación de centralitas ECU', '/reparacion-centralitas-ecu'],
      ['Casos reales', '/casos-reales.html']
    ]
  },
  'seat-ibiza-6l-multimapa-hardcut': {
    title: 'Seat Ibiza 6L: Multimapa + hardcut',
    meta: 'Caso real Seat Ibiza 6L en Autokeys Remaps Pro: desarrollo de una configuración multimapa con hardcut, manteniendo trazabilidad del archivo y comprobación final.',
    category: 'SEAT IBIZA 6L · MULTIMAPA · HARDCUT',
    intro: 'En este Seat Ibiza 6L se realizó un trabajo de calibración con sistema Multimapa y hardcut. La información que tenemos confirmada del caso no incluye una referencia concreta de ECU ni un código de motor, por lo que el artículo se centra únicamente en lo que sí quedó documentado: preparación multimapa, integración del hardcut y comprobación final del funcionamiento.',
    facts: ['Seat Ibiza 6L', 'Configuración Multimapa', 'Hardcut', 'Trabajo sobre calibración', 'Archivo trazable', 'Caso terminado'],
    sections: [
      {
        title: 'Qué buscábamos con el Multimapa',
        paragraphs: [
          'Un sistema Multimapa permite concentrar más de una configuración de calibración dentro de un mismo proyecto, de forma que el vehículo pueda disponer de diferentes comportamientos previstos por el desarrollo realizado.',
          'El reto no está únicamente en duplicar mapas, sino en mantener una estructura coherente, saber qué zonas pertenecen a cada configuración y comprobar que la lógica de selección no altera el funcionamiento normal del vehículo.'
        ]
      },
      {
        title: 'Preparación sobre una base controlada',
        paragraphs: [
          'Para este Ibiza se trabajó conservando la referencia del archivo de partida y separando claramente las versiones generadas durante el desarrollo. Ese orden es especialmente importante en un Multimapa, porque cualquier cambio debe poder relacionarse con la base de la que procede.',
          'No atribuimos al caso una ECU, herramienta de lectura o método de selección que no tengamos confirmado. La documentación pública recoge únicamente los elementos que quedaron verificados en el trabajo.'
        ]
      },
      {
        title: 'Integración del hardcut',
        paragraphs: [
          'El hardcut se integró dentro de la configuración final del vehículo. Al igual que con el Multimapa, no se trató como una función aislada: debía convivir con el resto de la calibración sin introducir un comportamiento incoherente.',
          'La comprobación final permitió validar que el conjunto respondía como estaba previsto y cerrar el trabajo con la configuración solicitada.'
        ]
      },
      {
        title: 'Un caso que también alimenta nuestro desarrollo',
        paragraphs: [
          'Este tipo de trabajos es especialmente útil porque la experiencia real ayuda a entender qué partes de una calibración deben mantenerse relacionadas cuando se construyen soluciones Multimapa.',
          'En Autokeys Remaps Pro documentamos estos casos para que el conocimiento adquirido en vehículo pueda reutilizarse de forma controlada en desarrollos posteriores, sin asumir que una referencia sirve automáticamente para cualquier otra.'
        ]
      }
    ],
    related: [
      ['Reprogramación de centralitas', '/reprogramacion-centralitas-jaen'],
      ['Reparación de centralitas ECU', '/reparacion-centralitas-ecu'],
      ['Casos reales', '/casos-reales.html']
    ]
  },
  'bmw-f36-420d-codificacion-levas': {
    title: 'BMW F36 420d: codificación de levas con E-Sys',
    meta: 'Caso real BMW F36 420d Gran Coupé: volante OEM con levas instalado pero sin respuesta; diagnóstico y codificación con E-Sys hasta dejarlas operativas.',
    category: 'BMW F36 · CODIFICACIÓN · E-SYS',
    intro: 'Este BMW 420d Gran Coupé F36 llevaba montado un volante OEM con levas. Airbag y mandos multifunción funcionaban correctamente y no existían averías registradas, pero las levas no actuaban. El problema no estaba en que el volante no encajara físicamente: faltaba adaptar la configuración electrónica del vehículo para que reconociera correctamente esa función.',
    facts: ['BMW 420d Gran Coupé F36', 'Volante OEM con levas', 'Airbag y multifunción operativos', 'Sin averías registradas', 'Codificación con E-Sys', 'Levas finalmente funcionales'],
    sections: [
      {
        title: 'El montaje físico no era suficiente',
        paragraphs: [
          'El volante estaba correctamente instalado y las funciones básicas respondían. Además, el conector presentaba sus posiciones ocupadas y el conjunto encajaba con el anillo del vehículo. Sin embargo, accionar las levas no producía ninguna respuesta.',
          'La ausencia de fallos en diagnosis ayudó a orientar el caso hacia configuración y codificación, en lugar de asumir directamente una avería de hardware.'
        ]
      },
      {
        title: 'Revisión de la configuración del vehículo',
        paragraphs: [
          'En BMW, montar un componente compatible físicamente no significa que todas sus funciones queden habilitadas de forma automática. Determinados equipamientos necesitan estar reflejados en la configuración del vehículo y en los módulos que intervienen en esa función.',
          'Por eso se trabajó con E-Sys sobre la configuración correspondiente, manteniendo una copia de la información original antes de aplicar cambios.'
        ]
      },
      {
        title: 'Codificación con E-Sys',
        paragraphs: [
          'La intervención se realizó mediante E-Sys, adaptando la configuración necesaria para que los módulos asociados reconocieran las levas del volante. El trabajo se limitó a la parte de codificación relacionada con esta función, sin modificar sistemas que no formaban parte del problema.',
          'Después de codificar se realizaron las comprobaciones sobre el vehículo para confirmar que la orden de las levas llegaba correctamente y que el resto de funciones del volante permanecía operativo.'
        ]
      },
      {
        title: 'Resultado: retrofit funcional',
        paragraphs: [
          'Tras la adaptación electrónica, las levas quedaron operativas y el retrofit se dio por terminado. El caso demuestra por qué en un BMW moderno la parte de software puede ser tan importante como el montaje físico del componente.',
          'En Autokeys Remaps Pro abordamos estos trabajos desde diagnosis y codificación, verificando primero qué funciona, qué no funciona y qué necesita realmente ser adaptado.'
        ]
      }
    ],
    related: [
      ['Diagnóstico avanzado', '/servicios/diagnostico-avanzado'],
      ['Electrónica del automóvil en Jaén', '/electronica-automovil-jaen.html'],
      ['Casos reales', '/casos-reales.html']
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
