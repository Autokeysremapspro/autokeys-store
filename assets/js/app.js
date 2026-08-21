/* AutoKeys Remaps Pro Store — shared UI: icons, header/footer, nav, search, toast */

const AK_ICONS = {
  search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.2" y2="16.2"/>',
  cart: '<polyline points="3,4 5,4 7.2,14.5 18,14.5 20,7 6,7"/><circle cx="8.5" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8"/>',
  bell: '<path d="M6 10a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 21a2 2 0 0 0 4 0"/>',
  chevDown: '<polyline points="6 9 12 15 18 9"/>',
  chevRight: '<polyline points="9 6 15 12 9 18"/>',
  chevLeft: '<polyline points="15 6 9 12 15 18"/>',
  truck: '<rect x="1" y="7" width="13" height="9" rx="1"/><path d="M14 10h4l4 3.5V16h-8z"/><circle cx="6" cy="18.5" r="1.7"/><circle cx="17.5" cy="18.5" r="1.7"/>',
  headset: '<path d="M4 13.5v-1a8 8 0 0 1 16 0v1"/><rect x="2.5" y="13.5" width="4" height="6" rx="1.6"/><rect x="17.5" y="13.5" width="4" height="6" rx="1.6"/>',
  shield: '<path d="M12 3.2 19 6v6c0 5-3.2 8-7 9-3.8-1-7-4-7-9V6l7-2.8z"/>',
  check: '<polyline points="5 13 9 17 19 7"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><polyline points="8 12.5 11 15.5 16 9"/>',
  clock: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/>',
  lock: '<rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  award: '<path d="M14.8 6.4a4 4 0 0 0-5.6 5.6L3 18.2 5.8 21l6.2-6.2a4 4 0 0 0 5.6-5.6l-2.9 2.9-2-2 2.9-2.9z"/>',
  ecu: '<rect x="3" y="6" width="18" height="12" rx="2"/><line x1="7" y1="18" x2="7" y2="21"/><line x1="12" y1="18" x2="12" y2="21"/><line x1="17" y1="18" x2="17" y2="21"/><line x1="7" y1="3" x2="7" y2="6"/><line x1="17" y1="3" x2="17" y2="6"/>',
  key: '<circle cx="7" cy="7" r="3.2"/><circle cx="7" cy="7" r="0.6" fill="currentColor" stroke="none"/><line x1="9.5" y1="9.5" x2="19" y2="19"/><line x1="14.5" y1="14.5" x2="16.5" y2="12.5"/><line x1="16.5" y1="16.5" x2="18.5" y2="14.5"/>',
  module: '<rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="12" cy="12" r="3.2"/>',
  programmer: '<rect x="3" y="4" width="18" height="13" rx="2"/><line x1="7" y1="8" x2="14" y2="8"/><line x1="7" y1="11.5" x2="12" y2="11.5"/><line x1="8" y1="20" x2="16" y2="20"/><line x1="12" y1="17" x2="12" y2="20"/>',
  laptop: '<rect x="3" y="5" width="18" height="11" rx="1.4"/><line x1="1.5" y1="19" x2="22.5" y2="19"/>',
  box: '<polyline points="3,8 12,3.3 21,8 21,16 12,20.7 3,16 3,8"/><line x1="3" y1="8" x2="12" y2="12.6"/><line x1="21" y1="8" x2="12" y2="12.6"/><line x1="12" y1="12.6" x2="12" y2="20.7"/>',
  diag: '<polyline points="2.5,12 7,12 9,6.5 13.5,18 15.5,12 21.5,12"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  minus: '<line x1="5" y1="12" x2="19" y2="12"/>',
  close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  arrowRight: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  mapPin: '<path d="M12 21S5.5 14.4 5.5 9.5a6.5 6.5 0 0 1 13 0C18.5 14.4 12 21 12 21z"/><circle cx="12" cy="9.3" r="2.2"/>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><polyline points="3.5 7 12 13 20.5 7"/>',
  phone: '<path d="M6 3.5h3.2l1.1 4.4-2.3 1.7a11.5 11.5 0 0 0 5.4 5.4l1.7-2.3 4.4 1.1V17c0 1.4-1.1 2.5-2.5 2.5C9.6 19.5 4.5 14.4 4.5 7.5A2.5 2.5 0 0 1 6 3.5z"/>',
  whatsapp: '<path d="M4 20l1.3-4.2A8 8 0 1 1 8.3 18.8 8 8 0 0 1 4 20z"/><path d="M9 9.3c0 3.1 2.6 5.7 5.7 5.7"/>',
  facebook: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M14 21v-7h2.2l.3-3H14V9.2c0-.9.3-1.4 1.6-1.4H16.5V5.1c-.4-.1-1.2-.1-2.1-.1-2.1 0-3.4 1.2-3.4 3.5V11H9v3h2v7z"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1"/>',
  youtube: '<rect x="2" y="5" width="20" height="14" rx="3"/><polygon points="10,9 16,12 10,15"/>',
  google: '<circle cx="12" cy="12" r="9"/><text x="12" y="16.5" text-anchor="middle" font-size="11" font-weight="800" fill="currentColor" stroke="none">G</text>',
  microsoft: '<rect x="3.5" y="3.5" width="8" height="8"/><rect x="12.5" y="3.5" width="8" height="8"/><rect x="3.5" y="12.5" width="8" height="8"/><rect x="12.5" y="12.5" width="8" height="8"/>',
  eye: '<path d="M2 12s3.8-6.5 10-6.5S22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M2 12s3.8-6.5 10-6.5S22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><line x1="3" y1="3" x2="21" y2="21"/>',
  ticket: '<path d="M3 9a2 2 0 0 0 0 4v4h18v-4a2 2 0 0 1 0-4V5H3z"/><line x1="13" y1="5" x2="13" y2="19" stroke-dasharray="2 2"/>',
  file: '<path d="M6 2.5h9l4 4V21.5H6z"/><polyline points="15 2.5 15 6.5 19 6.5"/>',
  car: '<path d="M4 16.5V12l2.5-5h9L18 12v4.5"/><path d="M4 16.5h14"/><circle cx="7.5" cy="16.7" r="1.6"/><circle cx="15.5" cy="16.7" r="1.6"/>',
  gear: '<circle cx="12" cy="12" r="3.2"/><line x1="12" y1="2.5" x2="12" y2="5.5"/><line x1="12" y1="18.5" x2="12" y2="21.5"/><line x1="2.5" y1="12" x2="5.5" y2="12"/><line x1="18.5" y1="12" x2="21.5" y2="12"/><line x1="5.5" y1="5.5" x2="7.6" y2="7.6"/><line x1="16.4" y1="16.4" x2="18.5" y2="18.5"/><line x1="5.5" y1="18.5" x2="7.6" y2="16.4"/><line x1="16.4" y1="7.6" x2="18.5" y2="5.5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2.5" x2="8" y2="6.5"/><line x1="16" y1="2.5" x2="16" y2="6.5"/>',
  chart: '<line x1="4" y1="21" x2="20" y2="21"/><rect x="5" y="13" width="3.5" height="8"/><rect x="10.2" y="8" width="3.5" height="13"/><rect x="15.4" y="4" width="3.5" height="17"/>',
  trendUp: '<polyline points="3,17 9,11 13,15 21,6"/><polyline points="15,6 21,6 21,12"/>',
  trendDown: '<polyline points="3,7 9,13 13,9 21,18"/><polyline points="15,18 21,18 21,12"/>',
  grid: '<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>',
  menu: '<line x1="3.5" y1="6.5" x2="20.5" y2="6.5"/><line x1="3.5" y1="12" x2="20.5" y2="12"/><line x1="3.5" y1="17.5" x2="20.5" y2="17.5"/>',
};

function akIcon(name, cls) {
  const body = AK_ICONS[name] || AK_ICONS.checkCircle;
  return '<svg' + (cls ? ' class="' + cls + '"' : '') +
    ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    body + '</svg>';
}

function akQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

/* Fills every <span data-icon="name" data-icon-class="..."></span> found in
   static page markup — used for icons written directly in HTML (hero, etc.)
   rather than built from a JS template string. */
function akFillIcons(root) {
  (root || document).querySelectorAll('[data-icon]').forEach((el) => {
    el.innerHTML = akIcon(el.dataset.icon, el.dataset.iconClass || '');
  });
}

/* ---------------- Header ---------------- */

function akHeaderHTML(active) {
  const navLink = (href, id, label) =>
    '<li class="' + (active === id ? 'active' : '') + '"><a href="' + href + '">' + label + '</a></li>';

  const dropdown = (id, label, items) =>
    '<li class="' + (active === id ? 'active' : '') + '">' +
      '<button type="button">' + label + akIcon('chevDown', 'chev') + '</button>' +
      '<div class="dropdown">' + items.map((i) => '<a href="' + i.href + '"' + (i.external ? ' target="_blank" rel="noopener"' : '') + '>' + i.label + (i.external ? akIcon('arrowRight', 'ext') : '') + '</a>').join('') + '</div>' +
    '</li>';

  return '' +
  '<div class="topbar"><div class="container">' +
    '<div class="tb-item">' + akIcon('award') + '<span>Especialistas en electrónica automotriz</span></div>' +
    '<div class="tb-item">' + akIcon('headset') + '<span>Soporte técnico experto 7 días a la semana</span></div>' +
    '<div class="tb-item">' + akIcon('truck') + '<span>Envíos rápidos a toda España y UE</span><span class="tb-flag">🇪🇸</span></div>' +
  '</div></div>' +
  '<header class="site-header"><div class="container">' +
    '<a class="brand" href="index.html">' +
      '<img class="logo-img" src="assets/img/logo.png" alt="Autokeys Remaps Pro Store" width="330" height="132">' +
    '</a>' +
    '<ul class="main-nav">' +
      dropdown('tienda', 'TIENDA', [
        { href: 'tienda.html', label: 'Ver todo el catálogo' },
        { href: 'tienda.html?cat=reparacion-ecu', label: 'Reparación ECU' },
        { href: 'tienda.html?cat=clonacion-ecu', label: 'Clonación ECU' },
        { href: 'tienda.html?brand=bmw', label: 'BMW' },
        { href: 'tienda.html?brand=mercedes', label: 'Mercedes-Benz' },
        { href: 'tienda.html?cat=reparacion-envio', label: 'Reparación por envío' },
      ]) +
      dropdown('servicios', 'SERVICIOS', [
        { href: 'producto.html?id=ecu-uce-diagnostico', label: 'Diagnóstico ECU / UCE' },
        { href: 'producto.html?id=modulos-confort-uch', label: 'Módulos confort / UCH' },
        { href: 'producto.html?id=airbag-srs-reparacion', label: 'Airbag / SRS' },
        { href: 'producto.html?id=cuadros-reparacion', label: 'Cuadros de instrumentos' },
        { href: 'producto.html?id=diagnostico-avanzado', label: 'Diagnóstico avanzado' },
      ]) +
      dropdown('ecu', 'ECU Y MÓDULOS', [
        { href: 'producto.html?id=recuperacion-bosch-edc17cp54', label: 'Reparación ECU' },
        { href: 'producto.html?id=clonacion-ecu-general', label: 'Clonación ECU' },
        { href: 'producto.html?id=bmw-fem-bdc', label: 'BMW FEM / BDC' },
        { href: 'producto.html?id=bmw-cas-ews-programacion', label: 'BMW CAS / EWS' },
        { href: 'producto.html?id=mercedes-ezs-elv', label: 'Mercedes EZS / ELV' },
      ]) +
      dropdown('llaves', 'LLAVES / IMMO', [
        { href: 'producto.html?id=inmovilizadores-programacion', label: 'Inmovilizadores' },
        { href: 'producto.html?id=llaves-copia-programacion', label: 'Llaves — copia y programación' },
        { href: 'producto.html?id=bmw-cas-ews-programacion', label: 'BMW CAS / EWS' },
      ]) +
      dropdown('software', 'SOFTWARE', [
        { href: 'producto.html?id=software-licencias', label: 'Software y licencias' },
        { href: 'producto.html?id=edc15-multimap-suite', label: 'EDC15 Multimap Suite' },
        { href: 'producto.html?id=programadores-multimarca', label: 'Programadores' },
        { href: 'https://akcloud.com', label: 'File Service (AK Cloud)', external: true },
      ]) +
      navLink('tienda.html?cat=reparacion-envio', 'envio', 'REPARACIÓN POR ENVÍO') +
      navLink('login.html', 'profesional', 'ÁREA PROFESIONAL') +
    '</ul>' +
    '<form class="search-form" action="tienda.html" method="get">' +
      '<input type="text" name="q" placeholder="Buscar productos, servicios..." aria-label="Buscar">' +
      '<button type="submit" aria-label="Buscar">' + akIcon('search') + '</button>' +
    '</form>' +
    '<div class="head-actions">' +
      '<a class="search-icon-btn" href="tienda.html" aria-label="Buscar">' + akIcon('search') + '</a>' +
      '<a class="head-action" href="login.html">' + akIcon('user') + '<span>Mi cuenta</span></a>' +
      '<a class="head-action" href="carrito.html">' + akIcon('cart') + '<span>Carrito</span><span class="badge" data-cart-badge>0</span></a>' +
      '<button class="burger" type="button" data-nav-toggle aria-label="Menú">' + akIcon('plus') + '</button>' +
    '</div>' +
  '</div></header>';
}

/* ---------------- Footer ---------------- */

function akFooterHTML() {
  return '' +
  '<div class="feature-strip">' +
    '<div>' + akIcon('award') + '<div><b>Expertos en electrónica</b><span>Más de 10 años de experiencia</span></div></div>' +
    '<div>' + akIcon('checkCircle') + '<div><b>Miles de unidades reparadas</b><span>Resultados comprobados</span></div></div>' +
    '<div>' + akIcon('programmer') + '<div><b>Equipos y herramientas premium</b><span>Tecnología de última generación</span></div></div>' +
    '<div>' + akIcon('headset') + '<div><b>Atención personalizada</b><span>Te acompañamos en todo el proceso</span></div></div>' +
    '<div>' + akIcon('shield') + '<div><b>Garantía por escrito</b><span>Tranquilidad total en tu reparación</span></div></div>' +
  '</div>' +
  '<footer class="site-footer" id="contacto"><div class="container">' +
    '<div class="footer-grid">' +
      '<div class="footer-brand">' +
        '<a class="brand" href="index.html" style="margin-bottom:12px">' +
          '<img class="logo-img" src="assets/img/logo.png" alt="Autokeys Remaps Pro Store" width="330" height="132">' +
        '</a>' +
        '<p>Tu tienda y taller especializado en electrónica automotriz. Soluciones profesionales, rápidas y garantizadas.</p>' +
        '<div class="footer-social">' +
          '<a href="#" aria-label="YouTube">' + akIcon('youtube') + '</a>' +
          '<a href="#" aria-label="Instagram">' + akIcon('instagram') + '</a>' +
          '<a href="#" aria-label="Facebook">' + akIcon('facebook') + '</a>' +
        '</div>' +
      '</div>' +
      '<div><h4>ENLACES RÁPIDOS</h4><ul>' +
        '<li><a href="tienda.html">Tienda</a></li>' +
        '<li><a href="tienda.html#servicios">Servicios</a></li>' +
        '<li><a href="tienda.html?cat=reparacion-envio">Reparación por envío</a></li>' +
        '<li><a href="producto.html?id=software-licencias">Software</a></li>' +
        '<li><a href="#contacto">Contacto</a></li>' +
      '</ul></div>' +
      '<div><h4>INFORMACIÓN</h4><ul>' +
        '<li><a href="#" data-action="mock">Quiénes somos</a></li>' +
        '<li><a href="#" data-action="mock">Preguntas frecuentes</a></li>' +
        '<li><a href="#" data-action="mock">Envíos y devoluciones</a></li>' +
        '<li><a href="#" data-action="mock">Términos y condiciones</a></li>' +
        '<li><a href="#" data-action="mock">Política de privacidad</a></li>' +
      '</ul></div>' +
      '<div><h4>CONTACTO</h4><ul class="contact-list">' +
        '<li><a href="tel:+34953852778">' + akIcon('phone') + '<span>+34 953 85 27 78</span></a></li>' +
        '<li><a href="https://wa.me/34632982646" target="_blank" rel="noopener">' + akIcon('whatsapp') + '<span>+34 632 98 26 46 (WhatsApp)</span></a></li>' +
        '<li><a href="mailto:info@autokeyspro.es">' + akIcon('mail') + '<span>info@autokeyspro.es</span></a></li>' +
        '<li>' + akIcon('mapPin') + '<span>España</span></li>' +
        '<li>' + akIcon('clock') + '<span>Lun - Dom · 09:00 - 20:00</span></li>' +
      '</ul></div>' +
      '<div><h4>ACEPTAMOS</h4>' +
        '<div class="pay-icons"><span>VISA</span><span>Mastercard</span><span>PayPal</span><span>Bizum</span><span>SumUp</span></div>' +
      '</div>' +
    '</div>' +
    '<div class="footer-bottom">© 2026 AUTOKEYS REMAPS PRO STORE. Todos los derechos reservados.</div>' +
  '</div></footer>';
}

/* ---------------- Toast ---------------- */

function akToast(message) {
  let el = document.querySelector('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.innerHTML = akIcon('checkCircle') + '<span></span>';
  el.querySelector('span').textContent = message;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2600);
}

/* ---------------- Boot ---------------- */

document.addEventListener('DOMContentLoaded', () => {
  const headerEl = document.getElementById('site-header');
  if (headerEl) headerEl.outerHTML = akHeaderHTML(headerEl.dataset.active || '');
  const footerEl = document.getElementById('site-footer');
  if (footerEl) footerEl.outerHTML = akFooterHTML();

  akCartRenderBadge();
  akFillIcons();

  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('[data-nav-toggle]');
    if (toggle) {
      const open = document.querySelector('.main-nav').classList.toggle('mobile-open');
      toggle.innerHTML = akIcon(open ? 'close' : 'plus');
      return;
    }
    const mock = e.target.closest('[data-action="mock"]');
    if (mock && mock.getAttribute('href') === '#') {
      e.preventDefault();
      akToast('Esta sección todavía no está disponible en esta demo');
    }
  });
});
