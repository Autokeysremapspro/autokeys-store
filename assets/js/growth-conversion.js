/* Conversion UX layer — no cambia precios, pagos, permisos ni lógica de negocio. */
(function () {
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
    if (notice) fillIcons(notice);
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
    if (!article || !article.children.length) return;
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

  function conversionContext() {
    const path = location.pathname.replace(/\/$/, '') || '/';
    if (/carrito\.html$|login\.html$|cuenta\.html$|enviar-reparacion\.html$/i.test(path)) return null;
    if (/^\/productos\//i.test(path)) {
      return { eyebrow: '¿TIENES DUDAS?', text: 'Confirma compatibilidad antes de comprar', label: 'Consultar producto', icon: 'whatsapp', href: 'https://wa.me/34632982646?text=Hola%2C%20quiero%20confirmar%20la%20compatibilidad%20de%20un%20producto%20de%20Autokeys', key: 'sticky_product_whatsapp' };
    }
    if (/^\/servicios\//i.test(path) || SERVICE_PATHS[path]) {
      return { eyebrow: 'REVISIÓN PREVIA', text: 'Cuéntanos el vehículo, la referencia y el fallo', label: 'Revisar mi caso', icon: 'file', href: '/enviar-reparacion.html', key: 'sticky_service_review' };
    }
    if (/tienda\.html$|^\/categorias\//i.test(path)) {
      return { eyebrow: '¿NO SABES QUÉ ELEGIR?', text: 'Te orientamos antes de contratar o enviar nada', label: 'Cuéntanos el caso', icon: 'file', href: '/enviar-reparacion.html', key: 'sticky_catalog_review' };
    }
    // En portada, contacto, páginas legales y reserva no se superpone otra
    // barra a los botones propios de cada pantalla.
    return null;
  }

  function addConversionDock() {
    const context = conversionContext();
    if (!context || document.getElementById('conversion-dock')) return;
    const dock = document.createElement('aside');
    dock.id = 'conversion-dock';
    dock.className = 'conversion-dock';
    dock.setAttribute('aria-label', 'Ayuda para continuar');
    dock.innerHTML =
      '<div class="conversion-dock-copy"><small>' + context.eyebrow + '</small><b>' + context.text + '</b></div>' +
      '<a class="btn btn-primary" data-ak-cta="' + context.key + '" href="' + context.href + '"' + (/^https:/.test(context.href) ? ' target="_blank" rel="noopener"' : '') + '>' + icon(context.icon) + context.label + '</a>' +
      '<button type="button" class="conversion-dock-close" aria-label="Cerrar ayuda">×</button>';
    document.body.appendChild(dock);
    const close = dock.querySelector('.conversion-dock-close');
    close.addEventListener('click', () => {
      dock.classList.add('is-hidden');
      try { sessionStorage.setItem('ak_conversion_dock_closed', '1'); } catch (_) {}
    });
    try { if (sessionStorage.getItem('ak_conversion_dock_closed') === '1') dock.classList.add('is-hidden'); } catch (_) {}
    fillIcons(dock);
  }

  function labelPrimaryActions() {
    document.querySelectorAll('a[href*="enviar-reparacion"]').forEach((link) => {
      if (!link.dataset.akCta) link.dataset.akCta = 'repair_review';
    });
    document.querySelectorAll('a[href^="https://wa.me/"]').forEach((link) => {
      if (!link.dataset.akCta) link.dataset.akCta = 'whatsapp_general';
    });
    document.querySelectorAll('#add-cart-btn').forEach((button) => { button.dataset.akCta = 'direct_purchase'; });
  }

  function watchDynamicConversionUi() {
    let queued = false;
    const refresh = () => {
      if (queued) return;
      queued = true;
      setTimeout(() => {
        queued = false;
        enhanceProductTrust();
        labelPrimaryActions();
      }, 80);
    };
    new MutationObserver(refresh).observe(document.body, { childList: true, subtree: true });
    refresh();
  }

  function init() {
    setupCleanInternalLinks();
    enhanceServiceLanding();
    enhanceRepairForm();
    enhanceCheckoutGate();
    enhanceProductTrust();
    addConversionDock();
    labelPrimaryActions();
    watchDynamicConversionUi();
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
}());
