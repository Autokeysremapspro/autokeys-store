const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function render(handler, slug) {
  const res = {
    code: null, headers: {}, body: '',
    setHeader(name, value) { this.headers[name.toLowerCase()] = value; return this; },
    status(code) { this.code = code; return this; },
    send(body) { this.body = String(body); return this; },
    end() { return this; },
  };
  handler({ method: 'GET', query: { slug } }, res);
  assert.equal(res.code, 200, slug);
  assert.match(res.headers['content-type'], /text\/html/);
  return res.body;
}

function jsonScripts(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
}

test('clonación ECU: title, formulario con servicio seleccionado, teléfono y caso real', () => {
  const html = render(require('../api/seo-priority2.js'), 'clonacion-centralitas-ecu');
  assert.match(html, /Clonación y sustitución de centralitas ECU/);
  assert.match(html, /enviar-reparacion\.html\?unidad=ecu&amp;trabajo=Clonaci%C3%B3n|enviar-reparacion\.html\?unidad=ecu&trabajo=Clonaci%C3%B3n/);
  assert.match(html, /ford-mustang-ecu-clonada\.html/);
  assert.match(html, /tel:\+34632982646/);
  assert.doesNotMatch(html, /\+34953852778/);
  const schema = jsonScripts(html);
  assert.ok(schema.some((item) => item['@type'] === 'Service'));
  assert.ok(schema.some((item) => item['@type'] === 'FAQPage'));
});

test('reparación de ECU: contenido propio, valoración y schema', () => {
  const html = render(require('../api/seo-search-growth.js'), 'reparacion-centralitas-ecu');
  assert.match(html, /reparación y recuperación de centralitas ECU/i);
  assert.match(html, /escritura fallida/i);
  assert.match(html, /(?:una|unidad) donante/i);
  assert.match(html, /Diagn%C3%B3stico%20%2F%20comprobaci%C3%B3n/);
  assert.match(html, /tel:\+34632982646/);
  assert.doesNotMatch(html, /\+34953852778/);
  assert.ok(jsonScripts(html).some((item) => item['@type'] === 'Service'));
});

test('inmovilizador: contenido diferenciado y enlaces a servicios relacionados', () => {
  const html = render(require('../api/seo-search-growth.js'), 'inmovilizador-coche');
  assert.match(html, /Fallo de inmovilizador/);
  assert.match(html, /UCH, BCM, CAS, FEM, BDC/);
  assert.match(html, /coche-no-arranca-despues-cambiar-centralita/);
  assert.match(html, /enviar-reparacion\.html/);
  assert.doesNotMatch(html, /\+34953852778/);
});

test('caso real de Mustang: sin datos personales y con datos estructurados válidos', () => {
  const html = fs.readFileSync('ford-mustang-ecu-clonada.html', 'utf8');
  assert.match(html, /Ford Mustang/);
  assert.match(html, /Cuenca/);
  assert.match(html, /se suministró otra unidad compatible clonada|otra centralita clonada/i);
  assert.match(html, /MG1CS019/);
  assert.match(html, /MG1CS019 indica la familia de la ECU/);
  assert.match(html, /cuatro cilindros/);
  assert.doesNotMatch(html, /Carlos Orea|[0-9]{8}[A-Z]/);
  const schemas = jsonScripts(html);
  assert.ok(schemas.some((item) => item['@type'] === 'Article'));
  assert.ok(schemas.some((item) => item['@type'] === 'BreadcrumbList'));
  assert.match(fs.readFileSync('casos-reales.html','utf8'), /ford-mustang-ecu-clonada.html/);
  assert.match(fs.readFileSync('api/sitemap.js','utf8'), /ford-mustang-ecu-clonada.html/);
});

test('las páginas de servicio conservan métodos seguros', () => {
  for (const [handler,slug] of [
    [require('../api/seo-priority2.js'),'clonacion-centralitas-ecu'],
    [require('../api/seo-search-growth.js'),'reparacion-centralitas-ecu'],
    [require('../api/seo-search-growth.js'),'inmovilizador-coche'],
  ]) {
    const response = {code:null,headers:{},status(c){this.code=c;return this;},setHeader(a,b){this.headers[a]=b;return this;},send(){return this;}};
    handler({method:'POST',query:{slug}},response);
    assert.equal(response.code,405);
  }
});
