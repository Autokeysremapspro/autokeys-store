const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const app = fs.readFileSync('assets/js/app.js','utf8');
const styles = fs.readFileSync('assets/css/style.css','utf8');
const repair = fs.readFileSync('assets/js/reparacion-form.js','utf8');
const home = fs.readFileSync('index.html','utf8');

function renderHeader(active) {
  const document={querySelector:()=>({}),addEventListener:()=>{}};
  const context={document,window:{},console};
  vm.runInNewContext(app,context,{filename:'app.js'});
  return context.akHeaderHTML(active);
}

test('cabecera: menú accesible con cierre, grupos y accesos principales',()=>{
  const html=renderHeader('casos');
  assert.match(html,/id="ak-main-navigation"/);
  assert.match(html,/data-nav-toggle aria-controls="ak-main-navigation" aria-expanded="false"/);
  assert.match(html,/data-nav-close aria-label="Cerrar menú"/);
  for(const name of ['tienda','servicios','ecu']){
    assert.match(html,new RegExp('aria-controls="ak-dropdown-'+name+'" aria-expanded="false"'));
    assert.match(html,new RegExp('id="ak-dropdown-'+name+'"'));
  }
  assert.match(html,/href="\/casos-reales\.html"/);
  assert.match(html,/href="\/mi-solicitud\.html"/);
  assert.match(html,/head-action-cta" href="\/enviar-reparacion\.html"/);
  assert.match(html,/alt="Autokeys Remaps Pro"/);
  assert.match(html,/class="active"><a href="\/casos-reales\.html">CASOS REALES/);
});

test('móvil: los submenús no se despliegan todos a la vez',()=>{
  assert.match(styles,/\.main-nav\.mobile-open \.dropdown\{[\s\S]*?display:none/);
  assert.match(styles,/\.main-nav\.mobile-open \.has-dropdown\.is-expanded \.dropdown\{display:grid/);
  assert.match(styles,/\.main-nav\.mobile-open \.mobile-nav-top\{/);
  assert.match(styles,/body\.ak-nav-open\{overflow:hidden\}/);
  assert.match(app,/e\.key === 'Escape'/);
  assert.match(app,/e\.key === 'Tab'/);
  assert.match(app,/closeNavigation\(true\)/);
  assert.match(app,/aria-expanded', 'true'/);
});

test('estética: variables de calculadora presentes y tipografía legible',()=>{
  assert.match(styles,/--card:var\(--panel\)/);
  assert.match(styles,/--border:var\(--line\)/);
  assert.match(styles,/\.product-cat\{font-size:10px/);
  assert.match(styles,/\.request-form-grid \.field input,[\s\S]*?min-height:46px/);
  assert.match(styles,/@media\(prefers-reduced-motion:reduce\)/);
});

test('formulario: botones accesibles, pasos anunciados y recogida por teclado',()=>{
  assert.match(repair,/aria-pressed="false"/);
  assert.match(repair,/setAttribute\('aria-pressed'/);
  assert.match(repair,/aria-current="step"/);
  assert.match(repair,/focusStepHeading/);
  assert.match(repair,/card\.classList\.toggle\('active', Boolean\(radio\?\.checked\)\)/);
  assert.match(styles,/\.method-card input\[type="radio"\]/);
  assert.match(styles,/\.method-card input\[type="radio"\]\{[\s\S]*?position:absolute/);
});

test('privacidad: el borrador no guarda VIN, matrícula o datos de contacto',()=>{
  const ids=repair.match(/const IDS = \[([^\]]+)\];/);
  assert.ok(ids);
  for(const key of ['matricula','vin','nombre','email','telefono','direccion','cp','poblacion','provincia','contacto-recogida'])
    assert.equal(ids[1].includes("'"+key+"'"),false, 'no guardar '+key);
  assert.match(repair,/PERSONAL_IDS\.has\(id\)/);
});

test('portada: ruta de solicitud clara y caso real accesible',()=>{
  assert.match(home,/href="\/enviar-reparacion\.html"[^>]*>.*Solicitar valoración del módulo/);
  assert.match(home,/Ver clonación y reparación ECU/);
  for(const p of ['casos-reales.html','jaguar-xf-2013-rfa-reparacion.html','ford-mustang-ecu-clonada.html']){
    const html=fs.readFileSync(p,'utf8');
    assert.match(html,/data-active="casos"/);
  }
  const caseApi=fs.readFileSync('api/case-seo.js','utf8');
  assert.match(caseApi,/data-active="casos"/);
});
