/* Conversion UX layer — no cambia precios, pagos, permisos ni lógica de negocio. */
(function () {
  const HOME_PATH = /^\/(?:index\.html)?$/i;
  const SERVICE_PATHS = {
    '/reparacion-centralitas-ecu': {
      title: '¿La ECU no comunica, está dañada o falló una escritura?',
      desc: 'Antes de sustituirla, revisamos referencia, síntomas y diagnosis para confirmar si procede recuperar, reparar o trabajar con una donante.'
    },
    '/clonacion-centralitas-ecu': {
      title: '¿Necesitas pasar los datos de tu ECU a una unidad donante?',
      desc: 'Comprobamos hardware, software y compatibilidad antes de confirmar la clonación y qué unidades debes enviar.'
    },
    '/bmw-fem-bdc': {
      title: '¿Tu BMW tiene un problema de arranque, FEM o BDC?',
      desc: 'Revisamos diagnosis, alimentación, referencias y antecedentes de programación antes de decidir reparación, recuperación o sustitución.'
    },
    '/mercedes-ezs-elv': {
      title: '¿Tu Mercedes no da contacto o presenta fallo de EZS / ELV?',
      desc: 'Identificamos el sistema y confirmamos qué elementos necesitamos antes de desmontar o enviar módulos innecesarios.'
    },
    '/perdida-total-llaves-coche': {
      title: '¿Has perdido todas las llaves del vehículo?',
      desc: 'Identificamos el inmovilizador y el procedimiento correcto antes de programar una llave o solicitar módulos del vehículo.'
    }
  };

  function icon(name) {
    try { return typeof akIcon === 'function' ? akIcon(name) : ''; } catch (_) { return ''; }
  }

  function fillIcons(root) {
    try { if (typeof akFillIcons === 'function') akFillIcons(root || document); } catch (_) {}
  }

  function productRoute(product) {
    if (!product || !product.id) return '';
    return '/' + (product.isProduct ? 'productos/' : 'servicios/') + encodeURIComponent(product.id);
  }

  function rewriteLegacyProductLinks(root) {
    const scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll('a[href*="producto.html?id="]').forEach((link) => {
      try {
        const parsed = new URL(link.getAttribute('href'), location.href);
        const id = parsed.searchParams.get('id');
        const product = typeof akFindProduct === 'function' ? akFindProduct(id) : null;
        const route = productRoute(product);
        if (route) link.setAttribute('href', route);
      } catch (_) {}
    });
  }

  function setupCleanInternalLinks() {
    const run = () => rewriteLegacyProductLinks(document);
    run();
    if (typeof akCatalogReady === 'function') {
      Promise.resolve(akCatalogReady()).then(run).catch(() => {});
    }
    let queued = false;
    new MutationObserver(() => {
      if (queued) return;
      queued = true;
      setTimeout(() => { queued = false; run(); }, 60);
    }).observe(document.body, { childList: true, subtree: true });
  }

  function normalizeBrandConsistency() {
    const run = () => {
      const topbarItems = document.querySelectorAll('.topbar .tb-item');
      if (topbarItems[1]) {
        const span = topbarItems[1].querySelector('span');
        if (span) span.textContent = 'Atención técnica L-V · 09:00–14:00 · 16:00–20:30';
      }
      if (topbarItems[2]) {
        const span = topbarItems[2].querySelector('span');
        if (span) span.textContent = 'Servicio por envío a toda España';
      }

      const features = document.querySelectorAll('.feature-strip > div');
      const featureCopy = [
        ['Laboratorio especializado', 'Electrónica del automóvil'],
        ['Casos reales documentados', 'Procesos y resultados publicados'],
        ['Equipamiento profesional', 'Diagnosis, programación y banco'],
        ['Atención personalizada', 'Te acompañamos en el proceso'],
        ['Garantía según servicio', 'Condiciones claras antes del trabajo']
      ];
      features.forEach((item, index) => {
        const title = item.querySelector('b');
        const text = item.querySelector('span');
        if (featureCopy[index] && title) title.textContent = featureCopy[index][0];
        if (featureCopy[index] && text) text.textContent = featureCopy[index][1];
      });

      const footerBrand = document.querySelector('.footer-brand p');
      if (footerBrand) {
        footerBrand.textContent = 'Laboratorio y tienda especializada en electrónica del automóvil. Servicios técnicos y trabajos por envío para particulares y profesionales.';
      }

      document.querySelectorAll('.contact-list li span').forEach((span) => {
        if (/Lun\s*-\s*Dom/i.test(span.textContent || '')) span.textContent = 'Lun - Vie · 09:00–14:00 · 16:00–20:30';
      });

      const quickLinks = Array.from(document.querySelectorAll('.site-footer a'));
      const software = quickLinks.find((link) => /^Software$/i.test((link.textContent || '').trim()));
      if (software) software.setAttribute('href', '/categorias/software');

      const quickList = Array.from(document.querySelectorAll('.site-footer h4')).find((h) => /ENLACES RÁPIDOS/i.test(h.textContent || ''));
      const ul = quickList && quickList.nextElementSibling;
      if (ul && !ul.querySelector('a[href="/profesionales.html"]')) {
        const li = document.createElement('li');
        li.innerHTML = '<a href="/profesionales.html">Servicio para profesionales</a>';
        const about = ul.querySelector('a[href$="quienes-somos.html"]');
        if (about && about.parentElement) about.parentElement.insertAdjacentElement('afterend', li);
        else ul.prepend(li);
      }

      document.querySelectorAll('.pay-icons span').forEach((item) => {
        if (/Bizum/i.test(item.textContent || '')) item.remove();
      });
    };

    run();
    setTimeout(run, 120);
  }

  function enhanceHome() {
    if (!HOME_PATH.test(location.pathname) || document.documentElement.dataset.akGrowthHome === '1') return;
    const hero = document.querySelector('main .hero');
    if (!hero) return;
    document.documentElement.dataset.akGrowthHome = '1';

    const kicker = hero.querySelector('.kicker');
    const h1 = hero.querySelector('h1');
    const lead = hero.querySelector('.lead');
    const buttons = hero.querySelectorAll('.btn-row a');
    if (kicker) kicker.textContent = 'LABORATORIO DE ELECTRÓNICA · JAÉN + TODA ESPAÑA';
    if (h1) h1.innerHTML = '¿Tu coche no arranca o falla una centralita?<br><em>Primero revisamos el caso. Después te decimos qué enviar.</em>';
    if (lead) lead.textContent = 'ECU que no comunica, escritura fallida, clonación, BMW FEM/BDC, Mercedes EZS/ELV y pérdida total de llaves. Trabajamos en laboratorio y por envío desde toda España.';
    if (buttons[0]) {
      buttons[0].setAttribute('href', '/enviar-reparacion.html');
      buttons[0].innerHTML = '<span data-icon="file"></span>Revisar mi caso';
    }
    if (buttons[1]) {
      buttons[1].setAttribute('href', '/enviar-reparacion.html?envio=recogida');
      buttons[1].innerHTML = '<span data-icon="truck"></span>Solicitar recogida';
    }

    const badges = hero.querySelectorAll('.hero-badge');
    const badgeCopy = [
      ['Diagnóstico previo', 'No envíes nada sin confirmar'],
      ['Laboratorio técnico', 'Electrónica especializada'],
      ['Servicio nacional', 'Unidades desde toda España'],
      ['Proceso trazable', 'Solicitud, revisión y seguimiento']
    ];
    badges.forEach((badge, i) => {
      const b = badge.querySelector('b');
      const spans = badge.querySelectorAll('span span');
      if (b && badgeCopy[i]) b.textContent = badgeCopy[i][0];
      if (spans.length && badgeCopy[i]) spans[spans.length - 1].textContent = badgeCopy[i][1];
    });

    if (!document.getElementById('growth-problems')) {
      const section = document.createElement('section');
      section.className = 'section';
      section.id = 'growth-problems';
      section.innerHTML =
        '<div class="eyebrow">¿QUÉ TE ESTÁ PASANDO?</div>' +
        '<h2>Entra por el problema, no por el nombre del módulo</h2>' +
        '<p class="section-desc">No necesitas saber qué servicio contratar. Elige lo que más se parece a tu caso y te explicamos el siguiente paso.</p>' +
        '<div class="cat-grid">' +
          '<a class="cat-item" href="/reparacion-centralitas-ecu"><span class="icon">' + icon('ecu') + '</span><span><b>La ECU no comunica o falló una escritura</b><p style="margin:4px 0 0;color:var(--muted);font-size:11px">Recuperación, diagnóstico y reparación antes de sustituir.</p></span></a>' +
          '<a class="cat-item" href="/clonacion-centralitas-ecu"><span class="icon">' + icon('ecu') + '</span><span><b>Necesito copiar una ECU a una donante</b><p style="margin:4px 0 0;color:var(--muted);font-size:11px">Comprobamos compatibilidad y datos antes de clonar.</p></span></a>' +
          '<a class="cat-item" href="/bmw-fem-bdc"><span class="icon">' + icon('module') + '</span><span><b>BMW con fallo FEM / BDC</b><p style="margin:4px 0 0;color:var(--muted);font-size:11px">Arranque, recuperación, sustitución y llaves según sistema.</p></span></a>' +
          '<a class="cat-item" href="/mercedes-ezs-elv"><span class="icon">' + icon('lock') + '</span><span><b>Mercedes sin contacto o ELV bloqueado</b><p style="margin:4px 0 0;color:var(--muted);font-size:11px">EZS/EIS, ELV/ESL y problemas de reconocimiento de llave.</p></span></a>' +
          '<a class="cat-item" href="/perdida-total-llaves-coche"><span class="icon">' + icon('key') + '</span><span><b>He perdido todas las llaves</b><p style="margin:4px 0 0;color:var(--muted);font-size:11px">Identificamos el inmovilizador y el procedimiento correcto.</p></span></a>' +
          '<a class="cat-item" href="/electronica-maquinaria-agricola-industrial.html"><span class="icon">' + icon('gear') + '</span><span><b>Falla una ECU de maquinaria</b><p style="margin:4px 0 0;color:var(--muted);font-size:11px">Agrícola, industrial y maquinaria especializada.</p></span></a>' +
        '</div>' +
        '<div class="btn-row" style="margin-top:22px">' +
          '<a class="btn btn-primary" href="/enviar-reparacion.html">' + icon('file') + 'No sé cuál es: revisar mi caso</a>' +
          '<a class="btn btn-secondary" href="/tienda.html">' + icon('search') + 'Ver todos los servicios</a>' +
        '</div>' +
        '<p class="section-desc" style="margin-top:12px">Con marca, modelo, año, referencia o foto de la etiqueta y una descripción de los síntomas podemos orientarte antes de que desmontes o envíes nada.</p>';
      hero.insertAdjacentElement('afterend', section);
    }

    if (!document.getElementById('growth-professionals')) {
      const target = document.getElementById('proceso') || document.querySelector('main section:last-of-type');
      if (target) {
        const section = document.createElement('section');
        section.className = 'section';
        section.id = 'growth-professionals';
        section.innerHTML =
          '<div class="eyebrow">PARA TALLERES Y PROFESIONALES</div>' +
          '<h2>Tu laboratorio externo cuando la electrónica se complica</h2>' +
          '<p class="section-desc">Puedes derivarnos ECU, TCU, inmovilizadores y módulos electrónicos sin montar toda la infraestructura de laboratorio en tu taller. Primero revisamos referencias y síntomas; después te indicamos qué enviar.</p>' +
          '<div class="btn-row" style="margin-top:20px">' +
            '<a class="btn btn-primary" href="/profesionales.html">' + icon('diag') + 'Servicio para talleres</a>' +
            '<a class="btn btn-secondary" href="/enviar-reparacion.html?tipo=taller">' + icon('file') + 'Abrir caso profesional</a>' +
          '</div>';
        target.insertAdjacentElement('afterend', section);
        fillIcons(section);
      }
    }
    fillIcons(hero);
  }

  function enhanceServiceLanding() {
    const copy = SERVICE_PATHS[location.pathname.replace(/\/$/, '')];
    if (!copy || document.getElementById('growth-service-path')) return;
    const main = document.querySelector('main');
    const firstSection = main && main.querySelector('.section');
    if (!main || !firstSection) return;

    const section = document.createElement('section');
    section.className = 'section';
    section.id = 'growth-service-path';
    section.innerHTML =
      '<div class="eyebrow">ANTES DE DESMONTAR O ENVIAR</div>' +
      '<h2>' + copy.title + '</h2>' +
      '<p class="section-desc">' + copy.desc + '</p>' +
      '<div class="steps" style="margin-top:22px">' +
        '<div class="step"><div class="num">01</div><h3>Envíanos los datos</h3><p>Marca, modelo, año, referencia de la unidad, síntomas y diagnosis si la tienes.</p></div>' +
        '<div class="step"><div class="num">02</div><h3>Revisamos el caso</h3><p>Confirmamos si el servicio aplica y qué elementos necesitamos realmente.</p></div>' +
        '<div class="step"><div class="num">03</div><h3>Envía solo lo necesario</h3><p>La unidad llega identificada al laboratorio y el trabajo queda asociado a tu solicitud.</p></div>' +
      '</div>' +
      '<div class="btn-row" style="margin-top:22px">' +
        '<a class="btn btn-primary" href="/enviar-reparacion.html">' + icon('file') + 'Enviar datos de mi caso</a>' +
        '<a class="btn btn-secondary" href="/casos-reales.html">' + icon('award') + 'Ver casos reales</a>' +
      '</div>';
    firstSection.insertAdjacentElement('afterend', section);
    fillIcons(section);
  }

  function enhanceRepairForm() {
    if (!/(?:^|\/)enviar-reparacion\.html$/i.test(location.pathname)) return;
    const notice = document.getElementById('auth-notice');
    const typeSelect = document.getElementById('tipo-cliente');
    const requestedType = new URLSearchParams(location.search).get('tipo');
    if (typeSelect && ['taller', 'empresa', 'particular'].includes(requestedType)) {
      typeSelect.value = requestedType;
      typeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (!notice) return;
    const update = () => {
      const text = notice.textContent || '';
      if (!notice.hidden && /Para enviarlo necesitarás iniciar sesión|crear una cuenta/i.test(text) && notice.dataset.akGrowth !== '1') {
        notice.dataset.akGrowth = '1';
        notice.innerHTML = icon('user') + '<span><b>Puedes completar todo el formulario sin registrarte.</b> Solo al enviarlo te pediremos iniciar sesión o crear una cuenta para guardar el expediente y que puedas consultar su estado. Tu borrador se conserva.</span>';
        fillIcons(notice);
      }
    };
    update();
    new MutationObserver(update).observe(notice, { attributes: true, childList: true, subtree: true });
  }

  function enhanceCheckoutGate() {
    if (!/(?:^|\/)carrito\.html$/i.test(location.pathname)) return;
    const root = document.getElementById('cart-root');
    if (!root) return;
    const update = () => {
      const h3 = Array.from(root.querySelectorAll('h3')).find((el) => /INICIA SESIÓN PARA CONTINUAR/i.test(el.textContent || ''));
      if (!h3 || h3.dataset.akGrowth === '1') return;
      h3.dataset.akGrowth = '1';
      h3.textContent = 'TU CARRITO ESTÁ GUARDADO';
      const panel = h3.closest('.cart-panel');
      const paragraph = panel && panel.querySelector('p');
      const button = panel && panel.querySelector('a.btn-primary');
      if (paragraph) paragraph.textContent = 'Para finalizar el pedido necesitamos identificarte para asociar el pago, el seguimiento y el historial de compras. Los productos del carrito no se pierden.';
      if (button) {
        button.innerHTML = icon('user') + 'Continuar con mi cuenta' + icon('arrowRight');
        fillIcons(button);
      }
    };
    setTimeout(update, 80);
    new MutationObserver(update).observe(root, { childList: true, subtree: true });
  }

  function enhanceProductTrust() {
    if (!/^\/(?:servicios|productos)\//i.test(location.pathname) || document.getElementById('growth-product-trust')) return;
    const article = document.querySelector('article.seo-server-content, #detail-root article, #detail-root');
    if (!article) return;
    const isProduct = /^\/productos\//i.test(location.pathname);
    const section = document.createElement('section');
    section.id = 'growth-product-trust';
    section.style.marginTop = '24px';
    section.innerHTML =
      '<div class="eyebrow">COMPATIBILIDAD Y TRAZABILIDAD</div>' +
      '<h2>' + (isProduct ? 'Confirma que es la opción correcta antes de comprar' : 'Confirma el caso antes de enviar la unidad') + '</h2>' +
      '<p class="section-desc">' + (isProduct
        ? 'Si una herramienta, licencia o accesorio depende de referencia, vehículo o equipo, consúltanos antes del pedido. Preferimos confirmar compatibilidad a vender una opción que no corresponda.'
        : 'Una misma familia puede montar hardware o software diferentes. Con referencia, fotografía de la etiqueta, vehículo y síntomas podemos revisar el alcance antes de que desmontes o envíes material.') + '</p>' +
      '<div class="btn-row" style="margin-top:18px">' +
        (isProduct
          ? '<a class="btn btn-secondary" href="https://wa.me/34632982646?text=Hola%2C%20quiero%20confirmar%20la%20compatibilidad%20de%20un%20producto%20de%20Autokeys" target="_blank" rel="noopener">' + icon('whatsapp') + 'Consultar compatibilidad</a>'
          : '<a class="btn btn-primary" href="/enviar-reparacion.html">' + icon('file') + 'Revisar mi caso</a>') +
      '</div>';
    article.appendChild(section);
    fillIcons(section);
  }

  function init() {
    setupCleanInternalLinks();
    normalizeBrandConsistency();
    enhanceHome();
    enhanceServiceLanding();
    enhanceRepairForm();
    enhanceCheckoutGate();
    enhanceProductTrust();
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
}());
