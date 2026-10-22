const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const read = (path) => fs.readFileSync(path, 'utf8');
const home = read('index.html');
const app = read('assets/js/app.js');
const growth = read('assets/js/growth-conversion.js');
const css = read('assets/css/style.css');

test('portada: un único titular y botones que no se sobrescriben', () => {
  assert.match(home, /LABORATORIO ESPECIALIZADO · JAÉN · TODA ESPAÑA/);
  assert.match(home, /Solicitar valoración del módulo/);
  assert.match(home, /Explorar servicios/);
  assert.doesNotMatch(home, /ELECTRÓNICA AUTOMOTRIZ SIN LÍMITES|Solicitar recogida<\/a>/);
  assert.equal((home.match(/<section class="proof-metrics"/g)||[]).length, 1);
  assert.match(css, /\.proof-metrics\{[^}]*grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
  assert.doesNotMatch(growth, /function enhanceHome\(/);
  assert.doesNotMatch(growth, /function normalizeBrandConsistency\(/);
  assert.doesNotMatch(growth, /17:00–20:30/);
  assert.match(growth, /enhanceServiceLanding\(\)/);
  assert.match(growth, /enhanceProductTrust\(\)/);
  assert.match(growth, /labelPrimaryActions\(\)/);
});

test('la barra flotante solo aparece en productos, servicios y catálogo', () => {
  const f = growth.slice(growth.indexOf('function conversionContext()'), growth.indexOf('function addConversionDock()'));
  assert.match(f, /\/productos/);
  assert.match(f, /\/servicios/);
  assert.match(f, /tienda/);
  assert.match(f, /return null;/);
  assert.doesNotMatch(f, /key: 'sticky_home_review'/);
});

test('pie de página: dirección completa, horario oficial y marca sin Store', () => {
  assert.match(app, /Av\. Andalucía 125, Bajo · 23350 Puente de Génave \(Jaén\)/);
  assert.match(app, /L-V · 09:30–13:30 · 17:00–20:00/);
  assert.doesNotMatch(app, /\[empresa\.ciudad, empresa\.provincia\]\.filter/);
  assert.match(app, /© 2026 AUTOKEYS REMAPS PRO\. Todos los derechos reservados/);
  assert.doesNotMatch(app, /Autokeys Remaps Pro Store/);
  for(const email of ['info@autokeysremapspro.es','laboratorio@autokeysremapspro.com','info@autokeyspro.es']) {
    assert.ok(app.includes(email), email + ' debe conservarse');
  }
});

test('menús separados: tienda sin reparaciones duplicadas y búsqueda móvil accesible', () => {
  const start = app.indexOf("dropdown('tienda'");
  const end = app.indexOf("dropdown('servicios'", start);
  assert.ok(start>=0 && end>start);
  const shop = app.slice(start, end);
  assert.match(shop, /Productos y herramientas/);
  assert.match(shop, /Software y licencias/);
  assert.doesNotMatch(shop, /Reparación ECU — catálogo|Enviar una unidad a reparar/);
  const after = app.slice(app.indexOf("dropdown('servicios'"),app.indexOf("dropdown('ecu'"));
  assert.doesNotMatch(after, /Enviar una unidad a reparar/);
  assert.match(app, /Buscar en la tienda/);
  assert.match(app, /href="\/mi-solicitud\.html">Consultar solicitud de reparación/);
  assert.match(app, /href="\/cuenta\.html">Consultar pedido de tienda/);
});

test('seguimiento de reparaciones y de pedidos no se confunden', () => {
  const shipping = read('envios-garantias.html');
  assert.match(shipping, /href="\/mi-solicitud\.html">Seguir mi reparación/);
  assert.match(shipping, /href="\/cuenta\.html">Ver pedidos de tienda/);
  assert.doesNotMatch(shipping, /href="\/seguimiento\.html">Consultar seguimiento/);
  const portal = read('assets/js/mi-solicitud.js');
  assert.match(portal, /Seguimiento de reparación/);
  assert.match(portal, /enlace privado enviado al correo/);
  assert.match(portal, /renderError\(true\)/);
  const quote = read('calculadora-reparacion.html');
  assert.match(quote, /Valoración orientativa de centralitas y módulos/);
});

test('aplicación: archivos JS críticos mantienen sintaxis ejecutable', () => {
  for(const path of ['assets/js/app.js','assets/js/growth-conversion.js','assets/js/mi-solicitud.js']){
    assert.doesNotThrow(() => new vm.Script(read(path), { filename:path }), path);
  }
});
