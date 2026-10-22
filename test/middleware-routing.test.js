const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

async function getMiddleware() {
  const source = fs.readFileSync('middleware.js', 'utf8');
  const moduleUrl = 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
  const result = await import(moduleUrl);
  assert.equal(result.config.runtime, 'nodejs');
  assert.deepEqual(result.config.matcher, ['/producto.html', '/blog-post.html']);
  return result.default;
}

test('middleware utiliza Node.js y conserva redirección de blog con slug válido', async () => {
  const handler = await getMiddleware();
  const res = await handler(new Request('https://www.autokeysremapspro.es/blog-post.html?slug=diagnostico-ecu'));
  assert.equal(res.status, 301);
  assert.equal(res.headers.get('location'), 'https://www.autokeysremapspro.es/guias/diagnostico-ecu');
});

test('slug de blog vacío o inseguro redirige al listado', async () => {
  const handler = await getMiddleware();
  for (const slug of ['', '../admin', 'No valido']) {
    const input = new URL('https://www.autokeysremapspro.es/blog-post.html');
    if (slug) input.searchParams.set('slug', slug);
    const res = await handler(new Request(input));
    assert.equal(res.status, 301);
    assert.equal(res.headers.get('location'), 'https://www.autokeysremapspro.es/blog.html');
  }
});

test('producto sin id válido redirige a tienda sin llamada a upstream', async () => {
  const handler = await getMiddleware();
  const res = await handler(new Request('https://www.autokeysremapspro.es/producto.html?id=..'));
  assert.equal(res.status, 301);
  assert.equal(res.headers.get('location'), 'https://www.autokeysremapspro.es/tienda.html');
});

test('producto válido conserva respuesta del handler legacy', async () => {
  const handler = await getMiddleware();
  const original = global.fetch;
  let called = 0;
  try {
    global.fetch = async (url, init) => {
      called++;
      const target = new URL(url);
      assert.equal(target.pathname, '/api/legacy-seo-redirect');
      assert.equal(target.searchParams.get('type'), 'product');
      assert.equal(target.searchParams.get('id'), 'ecu-donante');
      assert.equal(init.redirect, 'manual');
      return new Response(null, { status: 301, headers: { Location: 'https://www.autokeysremapspro.es/productos/ecu-donante' } });
    };
    const res = await handler(new Request('https://www.autokeysremapspro.es/producto.html?id=ecu-donante'));
    assert.equal(res.status, 301);
    assert.equal(res.headers.get('location'), 'https://www.autokeysremapspro.es/productos/ecu-donante');
    assert.equal(called, 1);
  } finally {
    global.fetch = original;
  }
});

test('error de upstream usa fallback temporal a tienda', async () => {
  const handler = await getMiddleware();
  const original = global.fetch;
  try {
    global.fetch = async () => { throw Error('upstream unavailable'); };
    const originalError = console.error;
    try {
      console.error = () => {};
      const res = await handler(new Request('https://www.autokeysremapspro.es/producto.html?id=ecu-donante'));
      assert.equal(res.status, 302);
      assert.equal(res.headers.get('location'), 'https://www.autokeysremapspro.es/tienda.html');
    } finally {
      console.error = originalError;
    }
  } finally {
    global.fetch = original;
  }
});
