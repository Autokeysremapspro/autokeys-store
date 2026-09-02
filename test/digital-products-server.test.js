'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
const { authorizeDownload } = require('../lib/digital-products-server');

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

function request(authorization = '') {
  return { headers: { authorization, 'user-agent': 'node-test', 'x-forwarded-for': '127.0.0.1' } };
}

test('un producto gratuito entrega solo enlaces HTTPS y registra la descarga', async () => {
  let logged = false;
  global.fetch = async (url, init = {}) => {
    const value = String(url);
    if (value.includes('tienda_productos?')) return json([{ id: 'manual-gratis', name: 'Manual', digital_gratis: true }]);
    if (value.includes('tienda_producto_digital?')) return json([{
      producto_id: 'manual-gratis', entrega_tipo: 'enlace', enlace_externo: 'https://descargas.example/manual.pdf', max_descargas: null,
    }]);
    if (value.endsWith('/rest/v1/tienda_descargas') && init.method === 'POST') {
      logged = true;
      return new Response('', { status: 201 });
    }
    throw new Error(`URL inesperada: ${value}`);
  };

  const result = await authorizeDownload(request(), 'manual-gratis');
  assert.equal(result.url, 'https://descargas.example/manual.pdf');
  assert.equal(logged, true);
});

test('un producto de pago no se entrega sin autenticar', async () => {
  global.fetch = async (url) => {
    const value = String(url);
    if (value.includes('tienda_productos?')) return json([{ id: 'software-pro', name: 'Software', digital_gratis: false }]);
    if (value.includes('tienda_producto_digital?')) return json([{
      producto_id: 'software-pro', entrega_tipo: 'archivo', archivo_path: 'software-pro/app.zip', max_descargas: 3,
    }]);
    throw new Error(`URL inesperada: ${value}`);
  };

  await assert.rejects(() => authorizeDownload(request(), 'software-pro'), /no_autorizado/);
});

test('los archivos privados se entregan mediante URL firmada de corta duración', async () => {
  global.fetch = async (url, init = {}) => {
    const value = String(url);
    if (value.includes('tienda_productos?')) return json([{ id: 'guia', name: 'Guía', digital_gratis: true }]);
    if (value.includes('tienda_producto_digital?')) return json([{
      producto_id: 'guia', entrega_tipo: 'archivo', archivo_path: 'guia/documento.pdf', nombre_archivo: 'guia.pdf', enlace_duracion_segundos: 120,
    }]);
    if (value.includes('/storage/v1/object/sign/productos-digitales/guia/documento.pdf')) {
      const body = JSON.parse(init.body);
      assert.equal(body.expiresIn, 120);
      return json({ signedURL: '/object/sign/productos-digitales/guia/documento.pdf?token=firma' });
    }
    if (value.endsWith('/rest/v1/tienda_descargas') && init.method === 'POST') return new Response('', { status: 201 });
    throw new Error(`URL inesperada: ${value}`);
  };

  const result = await authorizeDownload(request(), 'guia');
  assert.match(result.url, /supabase\.co\/storage\/v1\/object\/sign\/productos-digitales/);
});
