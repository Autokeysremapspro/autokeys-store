'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const KEYS = [
  'MRW_API_BASE_URL', 'MRW_CUSTOMER_CODE', 'MRW_AUTH_TYPE', 'MRW_USERNAME',
  'MRW_PASSWORD', 'MRW_API_KEY', 'MRW_FRANCHISE_CODE', 'MRW_SERVICE_CODE',
];

function resetEnv() {
  for (const key of KEYS) delete process.env[key];
}

test.afterEach(resetEnv);

test('MRW permanece desactivado si faltan credenciales', () => {
  resetEnv();
  const { configuracionMrw } = require('../lib/transportistas/mrw');
  const status = configuracionMrw();
  assert.equal(status.configurado, false);
  assert.ok(status.faltan.includes('MRW_API_BASE_URL'));
  assert.ok(status.faltan.includes('MRW_CUSTOMER_CODE'));
});

test('MRW acepta autenticación básica completa sin API key', () => {
  resetEnv();
  process.env.MRW_API_BASE_URL = 'https://sandbox.mrw.example';
  process.env.MRW_CUSTOMER_CODE = '12345';
  process.env.MRW_AUTH_TYPE = 'basic';
  process.env.MRW_USERNAME = 'autokeys';
  process.env.MRW_PASSWORD = 'secret';
  const { configuracionMrw } = require('../lib/transportistas/mrw');
  assert.equal(configuracionMrw().configurado, true);
});

test('construye el destinatario desde un pedido de la tienda', () => {
  resetEnv();
  process.env.MRW_CUSTOMER_CODE = '12345';
  process.env.MRW_FRANCHISE_CODE = '02600';
  process.env.MRW_SERVICE_CODE = '24H';
  const { construirSolicitud } = require('../lib/transportistas/mrw');
  const payload = construirSolicitud({
    id: 'pedido-1', nombre: 'Carlos', apellidos: 'Prueba', direccion: 'Calle Taller 1',
    codigo_postal: '23320', ciudad: 'Puente de Génave', provincia: 'Jaén', telefono: '600000000',
    email: 'cliente@example.com',
  });
  assert.equal(payload.referencia, 'pedido-1');
  assert.equal(payload.destinatario.nombre, 'Carlos Prueba');
  assert.equal(payload.destinatario.codigo_postal, '23320');
  assert.equal(payload.abonado, '12345');
  assert.equal(payload.franquicia, '02600');
});

test('crea el envío y extrae seguimiento y etiqueta configurables', async () => {
  resetEnv();
  process.env.MRW_API_BASE_URL = 'https://sandbox.mrw.example';
  process.env.MRW_CUSTOMER_CODE = '12345';
  process.env.MRW_AUTH_TYPE = 'bearer';
  process.env.MRW_API_KEY = 'test-token';
  process.env.MRW_TRACKING_FIELD = 'data.expedicion.numero';
  process.env.MRW_LABEL_FIELD = 'data.expedicion.etiqueta';
  const previousFetch = global.fetch;
  global.fetch = async (url, init) => {
    assert.equal(url, 'https://sandbox.mrw.example/shipments');
    assert.equal(init.method, 'POST');
    assert.equal(init.headers.Authorization, 'Bearer test-token');
    return new Response(JSON.stringify({ data: { expedicion: { numero: 'MRW123', etiqueta: 'https://labels.example/MRW123.pdf' } } }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  };
  try {
    const { crearEnvioMrw } = require('../lib/transportistas/mrw');
    const envio = await crearEnvioMrw({ id: 'pedido-1' });
    assert.deepEqual(envio, { numero_seguimiento: 'MRW123', etiqueta_url: 'https://labels.example/MRW123.pdf' });
  } finally {
    global.fetch = previousFetch;
  }
});
