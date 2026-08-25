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
      buttons[1].setAttribute('href', '/casos-reales.html');
      buttons[1].innerHTML = '<span data-icon="award"></span>Ver casos reales';
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
          '<a class="cat-item" href="/clonacion-centralitas-ecu"><span class="icon">' + icon('copy') + '</span><span><b>Necesito copiar una ECU a una donante</b><p style="margin:4px 0 0;color:var(--muted);font-size:11px">Comprobamos compatibilidad y datos antes de clonar.</p></span></a>' +
          '<a class="cat-item" href="/bmw-fem-bdc"><span class="icon">' + icon('module') + '</span><span><b>BMW con fallo FEM / BDC</b><p style="margin:4px 0 0;color:var(--muted);font-size:11px">Arranque, recuperación, sustitución y llaves según sistema.</p></span></a>' +
          '<a class="cat-item" href="/mercedes-ezs-elv"><span class="icon">' + icon('lock') + '</span><span><b>Mercedes sin contacto o ELV bloqueado</b><p style="margin:4px 0 0;color:var(--muted);font-size:11px">EZS/EIS, ELV/ESL y problemas de reconocimiento de llave.</p></span></a>' +
          '<a class="cat-item" href="/perdida-total-llaves-coche"><span class="icon">' + icon('key') + '</span><span><b>He perdido todas las llaves</b><p style="margin:4px 0 0;color:var(--muted);font-size:11px">Identificamos el inmovilizador y el procedimiento correcto.</p></span></a>' +
        '</div>' +
        '<div class="btn-row" style="margin-top:22px">' +
          '<a class="btn btn-primary" href="/enviar-reparacion.html">' + icon('file') + 'No sé cuál es: revisar mi caso</a>' +
          '<a class="btn btn-secondary" href="/tienda.html">' + icon('search') + 'Ver todos los servicios</a>' +
        '</div>' +
        '<p class="section-desc" style="margin-top:12px">Con marca, modelo, año, referencia o foto de la etiqueta y una descripción de los síntomas podemos orientarte antes de que desmontes o envíes nada.</p>';
      hero.insertAdjacentElement('afterend', section);
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

  function init() {
    enhanceHome();
    enhanceServiceLanding();
    enhanceRepairForm();
    enhanceCheckoutGate();
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
}());
