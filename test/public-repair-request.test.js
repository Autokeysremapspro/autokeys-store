const test = require('node:test');
const assert = require('node:assert/strict');

test('la solicitud de reparación acepta clientes sin cuenta y mantiene controles básicos', async () => {
  const mail = require('../lib/resend-server');
  const previousSendEmail = mail.sendEmail;
  const previousFetch = global.fetch;
  const previousKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const handlerPath = require.resolve('../api/solicitud-reparacion.js');
  const requests = [];
  try {
    mail.sendEmail = async () => ({ id: 'test' });
    delete require.cache[handlerPath];
    const handler = require(handlerPath);
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';

    global.fetch = async (url, options = {}) => {
      requests.push({ url: String(url), options });
      if (String(url).includes('select=id&limit=4')) {
        return { ok: true, json: async () => [] };
      }
      if (String(url).endsWith('/tienda_solicitudes_reparacion')) {
        const payload = JSON.parse(options.body);
        assert.equal(payload.cliente_id, null, 'la solicitud pública no debe suplantar una cuenta');
        assert.equal(payload.email, 'cliente@example.invalid');
        assert.equal(payload.notas_cliente, 'Solicitud enviada sin cuenta de cliente.');
        return { ok: true, json: async () => [{
          id: '1a47adef-2f90-4ee1-84a8-2038eb3e97b1',
          numero: 'AK-TEST-001',
          seguimiento_token: '937e15fd-41b0-435e-90b7-a96387b4fc2e',
          nombre: payload.nombre, email: payload.email, marca: payload.marca, modelo: payload.modelo,
          tipo_unidad: payload.tipo_unidad, trabajo_solicitado: payload.trabajo_solicitado,
        }] };
      }
      throw Error('Petición inesperada: ' + url);
    };

    const request = {
      method: 'POST',
      headers: {},
      body: {
        website: '', opened_at: Date.now() - 4500,
        tipo_cliente: 'particular', nombre: 'Cliente de prueba',
        email: 'cliente@example.invalid', telefono: '612345678',
        tipo_unidad: 'ecu', trabajo_solicitado: 'Clonación',
        marca: 'Ford', modelo: 'Mustang',
        descripcion_averia: 'La centralita original no comunica y necesita valoración.',
        metodo_envio: 'cuenta_cliente',
        acepta_diagnostico: true, acepta_condiciones: true, acepta_privacidad: true,
      },
    };
    const result = {
      statusCode: 0, body: null,
      status(code) { this.statusCode = code; return this; },
      json(body) { this.body = body; return this; },
    };
    await handler(request, result);
    assert.equal(result.statusCode, 201);
    assert.equal(result.body.vinculada, false);
    assert.equal(result.body.numero, 'AK-TEST-001');
    assert.equal(requests.filter((r) => r.options.method === 'POST').length, 1);

    const spamResponse = {
      statusCode: 0, body: null,
      status(code) { this.statusCode = code; return this; },
      json(body) { this.body = body; return this; },
    };
    await handler({ ...request, body: { ...request.body, website: 'spam.test' } }, spamResponse);
    assert.equal(spamResponse.statusCode, 400);
    assert.equal(spamResponse.body.error, 'spam');
    assert.equal(requests.filter((r) => r.options.method === 'POST').length, 1);
  } finally {
    mail.sendEmail = previousSendEmail;
    global.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = previousKey;
    delete require.cache[handlerPath];
  }
});
