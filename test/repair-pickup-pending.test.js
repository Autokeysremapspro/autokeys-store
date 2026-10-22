const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function responseMock() {
  return {
    code: 0, body: null,
    status(code) { this.code = code; return this; },
    json(value) { this.body = value; return this; },
  };
}

function pickupPayload() {
  return {
    opened_at: Date.now() - 5000, website: '', tipo_cliente: 'taller',
    nombre: 'Taller de prueba', email: 'test@example.invalid', telefono: '612345678',
    tipo_unidad: 'ecu', trabajo_solicitado: 'Clonación',
    marca: 'Ford', modelo: 'Mustang',
    descripcion_averia: 'La centralita original no comunica y necesita valoración en laboratorio.',
    metodo_envio: 'recogida_autokeys',
    direccion_recogida: 'Calle Inventada 12', codigo_postal: '16001',
    poblacion: 'Cuenca', provincia: 'Cuenca',
    persona_contacto_recogida: 'Recepción', peso_recogida_kg: 1,
    precio_recogida: 0.01, tarifa_recogida_codigo: 'TARIFA_MANIPULADA',
    acepta_diagnostico: true, acepta_condiciones: true, acepta_privacidad: true,
  };
}

test('la recogida queda pendiente y no se acepta como definitivo el precio del navegador', async () => {
  const mail = require('../lib/resend-server');
  const originalMail = mail.sendEmail;
  const originalFetch = global.fetch;
  const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const originalResend = process.env.RESEND_API_KEY;
  const path = require.resolve('../api/solicitud-reparacion.js');
  const emails = [], inserted = [];
  try {
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'fake-service-key';
    process.env.RESEND_API_KEY = 'fake-resend-key';
    mail.sendEmail = async (args) => { emails.push(args); return { id:'mock' }; };
    delete require.cache[path];
    const handler = require(path);
    global.fetch = async (url, opts={}) => {
      if (String(url).includes('select=id&limit=4')) return { ok:true,json:async()=>[] };
      if (String(url).endsWith('/tienda_solicitudes_reparacion')) {
        const payload = JSON.parse(opts.body);
        inserted.push(payload);
        return { ok:true,json:async()=>[{
          ...payload,
          id:'2df49d1c-f774-45fa-a170-d1da03190af3',
          numero:'AKR-2026-12345',seguimiento_token:'e1084687-07c7-49ab-b167-d1078c73e1e1'
        }] };
      }
      throw Error('Unmocked URL ' + url);
    };

    const invalid = pickupPayload();
    delete invalid.direccion_recogida;
    const invalidResponse=responseMock();
    await handler({method:'POST',headers:{},body:invalid},invalidResponse);
    assert.equal(invalidResponse.code,400);
    assert.equal(invalidResponse.body.error,'recogida_incompleta');
    assert.equal(inserted.length,0);

    const invalidWeight=pickupPayload();
    invalidWeight.peso_recogida_kg = 0;
    const weightResponse=responseMock();
    await handler({method:'POST',headers:{},body:invalidWeight},weightResponse);
    assert.equal(weightResponse.code,400);
    assert.equal(weightResponse.body.error,'peso_recogida_invalido');
    assert.equal(inserted.length,0);

    const valid=responseMock();
    await handler({method:'POST',headers:{},body:pickupPayload()},valid);
    assert.equal(valid.code,201);
    assert.equal(valid.body.recogida_pendiente,true);
    assert.equal(valid.body.email_enviado,true);
    assert.equal(inserted.length,1);
    assert.equal(inserted[0].estado,undefined, 'el estado pendiente_revision lo fija la base de datos');
    assert.equal(inserted[0].metodo_envio,'recogida_autokeys');
    assert.equal(inserted[0].precio_recogida,null);
    assert.equal(inserted[0].tarifa_recogida_codigo,null);
    assert.equal(emails.length,2);

    assert.equal(emails[0].to,'test@example.invalid');
    assert.match(emails[0].html,/Recogida solicitada, no confirmada/);
    assert.match(emails[0].html,/mi-solicitud.html#token=/);
    assert.equal(emails[1].to,'info@autokeyspro.es');
    assert.match(emails[1].subject,/RECOGIDA POR CONFIRMAR/);
    assert.match(emails[1].html,/Calle Inventada 12/);
    assert.match(emails[1].html,/612345678/);
    assert.doesNotMatch(emails[1].html,/seguimiento_token|mi-solicitud.html#token/);
  } finally {
    mail.sendEmail=originalMail;
    global.fetch=originalFetch;
    if(originalKey===undefined)delete process.env.SUPABASE_SERVICE_ROLE_KEY;else process.env.SUPABASE_SERVICE_ROLE_KEY=originalKey;
    if(originalResend===undefined)delete process.env.RESEND_API_KEY;else process.env.RESEND_API_KEY=originalResend;
    delete require.cache[path];
  }
});

test('interfaz distingue una solicitud de recogida de una reserva confirmada',()=>{
  const form=fs.readFileSync('enviar-reparacion.html','utf8');
  const thankyou=fs.readFileSync('assets/js/gracias.js','utf8');
  const script=fs.readFileSync('assets/js/reparacion-form.js','utf8');
  assert.match(form,/MRW pendiente de integración/);
  assert.match(form,/Importe orientativo/);
  assert.match(form,/sin reserva automática/);
  assert.match(script,/recogidaPendiente/);
  assert.match(thankyou,/NO reservada/);
});
