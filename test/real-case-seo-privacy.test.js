const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function load(name) { return fs.readFileSync(name, 'utf8'); }
function schemas(content) { return [...content.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1])); }
function caseRender(slug) {
  const handler = require('../api/case-seo.js');
  const res = { code:null, headers:{}, body:'',
    status(c) { this.code=c; return this; },
    setHeader(k,v) { this.headers[k]=v; return this; },
    send(s) { this.body=String(s); return this; }
  };
  handler({ method:'GET',url:'/api/case-seo?slug='+encodeURIComponent(slug)},res);
  assert.equal(res.code,200);
  return res.body;
}

test('Volvo S60 2011: CEM concreta, dos llaves, sin VIN ni claves',()=>{
  const html=caseRender('volvo-s60-2011-cem-recuperada');
  assert.match(html,/Volvo S60 2011/);
  assert.match(html,/BG9T-14C256-GA/);
  assert.match(html,/31314116/);
  assert.match(html,/R5F64524KFD/);
  assert.match(html,/31314116 AA/);
  assert.match(html,/Delphi · 28261901/);
  assert.doesNotMatch(html,/28261901-IGEE1/);
  assert.match(html,/dos llaves/i);
  assert.match(html,/sin DTC/);
  assert.doesNotMatch(html,/YV1FS5250B2012618|2618|PIN 0891414272/);
  assert.ok(schemas(html).some(x=>x['@type']==='Article'));
  assert.ok(schemas(html).some(x=>x['@type']==='BreadcrumbList'));
});

test('Mustang: año, MG1CS019, funcionamiento a cuatro cilindros y clonación',()=>{
  const html=load('ford-mustang-ecu-clonada.html');
  assert.match(html,/Mustang 2019/);
  assert.match(html,/MG1CS019/);
  assert.match(html,/Fabricante \/ familia: Bosch MG1CS019/);
  assert.match(html,/cuatro cilindros/);
  assert.match(html,/Cuenca/);
  assert.match(html,/clonada/);
  assert.match(html,/precio|potencia/);
  assert.ok(schemas(html).some(x=>x['@type']==='Article'));
  assert.match(html,/MG1CS019 indica la familia de la ECU/);
});

test('Jaguar XF X250 2013: corrupción de datos, RFA y SDD sin afirmar KVM/llaves',()=>{
  const html=load('jaguar-xf-2013-rfa-reparacion.html');
  assert.match(html,/Jaguar XF 2013/);
  assert.match(html,/X250/);
  assert.match(html,/corrupción de datos/);
  assert.match(html,/RFA dañado/);
  assert.match(html,/DPLA-19H440-BF/);
  assert.doesNotMatch(html,/DPLA-14C250-BA/);
  assert.doesNotMatch(html,/DPLA-14C104-CB/);
  assert.match(html,/DX23-14B476-AG/);
  assert.doesNotMatch(html,/DX23-14C256-AC/);
  assert.doesNotMatch(html,/DX23-14C184-AF/);
  assert.match(html,/JLR SDD|SDD/);
  assert.doesNotMatch(html,/<h1>[^<]*X260/);
  assert.doesNotMatch(html,/programaron nuevas llaves|pérdida total de llaves/i);
  assert.ok(schemas(html).some(x=>x['@type']==='Article'));
  assert.ok(schemas(html).some(x=>x['@type']==='BreadcrumbList'));
});

test('los tres casos tienen enlaces desde índice, portada y sitemap',()=>{
  const index=load('index.html'), directory=load('casos-reales.html'), sitemap=load('api/sitemap.js');
  const slugs=['ford-mustang-ecu-clonada.html','jaguar-xf-2013-rfa-reparacion.html','casos/volvo-s60-2011-cem-recuperada'];
  for(const slug of slugs){
    assert.ok(index.includes(slug), 'missing home: '+slug);
    assert.ok(directory.includes(slug),'missing directory: '+slug);
    assert.ok(sitemap.includes(slug),'missing sitemap: '+slug);
  }
});

test('las páginas de casos no exponen imágenes reales de coches ni datos identificativos',()=>{
  const jag=load('jaguar-xf-2013-rfa-reparacion.html');
  const must=load('ford-mustang-ecu-clonada.html');
  assert.doesNotMatch(jag,/<img[^>]*src=/i);
  assert.doesNotMatch(must,/<img[^>]*src=/i);
  assert.doesNotMatch(jag, /6185HTF|275713|43214965N/i);
  assert.match(jag,/assets\/img\/logo.png/);
  assert.match(must,/assets\/img\/logo.png/);
});

test('tarifa CEM Volvo: presupuesto sin importes propuestos sin aprobar', () => {
  const page=load('volvo-cem-recuperacion.html');
  assert.match(page,/Presupuesto personalizado para cada CEM/);
  assert.match(page,/comunicamos por escrito el precio/);
  assert.doesNotMatch(page,/desde\s*<strong>(?:90|350|490)\s*€|28261901-IGEE1/);
});
test('Jaguar: referencias comprobadas y CTA a reparación preseleccionada', () => {
  const page=load('jaguar-xf-2013-rfa-reparacion.html');
  assert.match(page,/DX23-14B476-AG/);
  assert.match(page,/DPLA-19H440-BF/);
  assert.match(page,/unidad=otro&amp;trabajo=Reparaci%C3%B3n/);
  assert.doesNotMatch(page,/Core Assembly|DPLA-19H440-AC/);
});
