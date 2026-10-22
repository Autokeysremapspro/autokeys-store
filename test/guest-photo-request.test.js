const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const handler = require('../api/adjuntar-foto-solicitud.js');

const requestId = 'a288cc11-f35a-4b31-9b41-f8dc5d9cabc1';
const token = '7a25edc1-a559-4d7a-85c0-e3fc04508abe';
const jpeg = Buffer.from([0xff,0xd8,0xff,0xdb,0,16,0,0,0,0,0,0,0,0,0,0,0xff]);
const png = Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),Buffer.alloc(12)]);
function payload(mime='image/jpeg',data=jpeg) {
  return { solicitud_id:requestId,seguimiento_token:token, mime_type:mime,nombre:'referencia-ecu.jpg',base64:data.toString('base64') };
}
function response() {
  return {statusCode:0,headers:{},body:null,setHeader(k,v){this.headers[k]=v;return this;},status(n){this.statusCode=n;return this;},json(b){this.body=b;return this;}};
}
const oldKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
const oldFetch=global.fetch;
function mockFetch(opts={}) {
  const requests=[];
  global.fetch=async(url,init={})=>{
    const uri=String(url),method=init.method||'GET';
    requests.push({uri,method,headers:init.headers,body:init.body});
    if(uri.includes('/rest/v1/tienda_solicitudes_reparacion')) return {
      ok:true,status:200,json:async()=> opts.request ? [opts.request] : [{id:requestId,cliente_id:null,estado:'pendiente_revision',created_at:new Date().toISOString()}]
    };
    if(uri.includes('/rest/v1/tienda_solicitud_reparacion_archivos') && method==='GET') return {
      ok:true,status:200,json:async()=>new Array(opts.existing||0).fill({id:'some-id'})
    };
    if(uri.includes('/rest/v1/tienda_solicitud_reparacion_archivos') && method==='POST') return {
      ok:opts.metadataOk!==false,status:opts.metadataOk===false?500:201,json:async()=>[{id:'file-id'}]
    };
    if(uri.includes('/storage/v1/object/') && method==='POST') return {ok:true,status:200,json:async()=>({})};
    if(uri.includes('/storage/v1/object/') && method==='DELETE') return {ok:true,status:200,json:async()=>({})};
    throw Error('Unexpected test request');
  };
  return requests;
}
async function call(body,options={}) {
  const res=response();
  await handler({method:'POST',headers:{'content-length':String(JSON.stringify(body).length)},body,...options},res);
  return res;
}
test.beforeEach(()=>{process.env.SUPABASE_SERVICE_ROLE_KEY='mock-not-real-key';});
test.afterEach(()=>{global.fetch=oldFetch;if(oldKey===undefined)delete process.env.SUPABASE_SERVICE_ROLE_KEY;else process.env.SUPABASE_SERVICE_ROLE_KEY=oldKey;});

test('foto JPEG por token privado se guarda en bucket privado y genera metadatos sin cliente',async()=>{
  const requests=mockFetch();
  const result=await call(payload());
  assert.equal(result.statusCode,201);
  assert.deepEqual(result.body,{ok:true,nombre:'referencia-ecu.jpg'});
  assert.equal(result.headers['Cache-Control'],'no-store');
  const upload=requests.find(x=>x.uri.includes('/storage/v1/object/')&&x.method==='POST');
  assert.ok(upload);
  assert.match(upload.uri,/solicitudes-reparacion\/invitado\/a288cc11-/);
  assert.equal(upload.headers['Content-Type'],'image/jpeg');
  assert.ok(Buffer.isBuffer(upload.body));
  const meta=requests.find(x=>x.uri.includes('/tienda_solicitud_reparacion_archivos')&&x.method==='POST');
  assert.equal(JSON.parse(meta.body).cliente_id,null);
  assert.equal(JSON.parse(meta.body).solicitud_id,requestId);
  assert.equal(JSON.parse(meta.body).mime_type,'image/jpeg');
});

test('sin token correcto no se suben archivos',async()=>{
  const reqs=mockFetch();
  const wrong=await call({...payload(),seguimiento_token:'incorrect'});
  assert.equal(wrong.statusCode,400);
  assert.equal(reqs.length,0);
  const noRequest=mockFetch({request:null});
  const res=await call({...payload(),solicitud_id:'a288cc11-f35a-4b31-9b41-f8dc5d9cabc1'});
  assert.equal(res.statusCode,201);
  assert.ok(noRequest.length>0);
});

test('deniega fotos de solicitudes vinculadas a otra cuenta o con estado diferente',async()=>{
  const original={id:requestId,cliente_id:'a288cc11-f35a-4b31-9b41-f8dc5d9cabc1',estado:'pendiente_revision',created_at:new Date().toISOString()};
  const requests=mockFetch({request:original});
  const res=await call(payload());
  assert.equal(res.statusCode,403);
  assert.equal(requests.filter(x=>x.uri.includes('/storage/')).length,0);
});

test('no acepta tipo falso, fotografías dañadas ni PDF ejecutable',async()=>{
  const requests=mockFetch();
  let res=await call(payload('application/pdf'));
  assert.equal(res.statusCode,415);
  res=await call(payload('image/png',jpeg));
  assert.equal(res.statusCode,415);
  res=await call(payload('image/jpeg',Buffer.from('%PDF-1.7', 'ascii')));
  assert.ok([413,415].includes(res.statusCode));
  assert.equal(requests.length,0);
});
test('respeta máximo de 3 fotos por solicitud',async()=>{
  const requests=mockFetch({existing:3});
  const res=await call(payload());
  assert.equal(res.statusCode,429);
  assert.equal(requests.filter(x=>x.uri.includes('/storage/')).length,0);
});
test('rechaza archivos superiores a 3 MB sin consultar base de datos',async()=>{
  const requests=mockFetch();
  const tooBig=Buffer.concat([jpeg,Buffer.alloc(3*1024*1024)]);
  const res=await call(payload('image/jpeg',tooBig),{headers:{'content-length':String(tooBig.length)}});
  assert.equal(res.statusCode,413);
  assert.equal(requests.length,0);
});
test('elimina el archivo de storage si falla el registro de metadatos',async()=>{
  const requests=mockFetch({metadataOk:false});
  const res=await call(payload());
  assert.equal(res.statusCode,500);
  assert.ok(requests.some(x=>x.method==='DELETE'&&x.uri.includes('/storage/v1/object/')));
});
test('interfaz corrige estimaciones no confirmadas, emails y permite fotos invitado',()=>{
  const form=fs.readFileSync('enviar-reparacion.html','utf8');
  const js=fs.readFileSync('assets/js/reparacion-form.js','utf8');
  const home=fs.readFileSync('index.html','utf8');
  const pro=fs.readFileSync('profesionales.html','utf8');
  const shipping=fs.readFileSync('envios-garantias.html','utf8');
  assert.match(form,/Puedes adjuntar hasta 3 fotos sin registrarte/);
  assert.match(js,/GUEST_MAX_FILES = 3/);
  assert.match(js,/adjuntar-foto-solicitud/);
  assert.doesNotMatch(js,/document\.getElementById\('archivos'\)\.disabled = !session/);
  assert.doesNotMatch(form,/14,90 €|17,90 €/);
  assert.doesNotMatch(home,/Calcula el coste en 30 segundos/);
  assert.match(home,/Orienta tu avería en menos de 1 minuto/);
  assert.match(pro,/gestión manual/);
  assert.match(shipping,/administración gestionará manualmente/);
  const footer=fs.readFileSync('assets/js/app.js','utf8');
  for(const address of ['info@autokeysremapspro.es','laboratorio@autokeysremapspro.com','info@autokeyspro.es']) assert.ok(footer.includes(address));
});
