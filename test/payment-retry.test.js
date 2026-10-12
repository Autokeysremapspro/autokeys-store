'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test';
process.env.AK_SUMUP_LIVE_API_KEY = 'test';
process.env.AK_SUMUP_LIVE_MERCHANT_CODE = 'test';
const handler = require('../api/crear-pago');
const json = data => ({ ok: true, json: async () => data, text: async () => JSON.stringify(data) });

for (const status of ['PENDING', 'PAID', 'UNKNOWN']) {
  test('reintentar checkout ' + status + ' no crea otro cobro', async () => {
    let creates = 0;
    global.fetch = async (url, init = {}) => {
      if (url.includes('tienda_configuracion')) return json([{ metodo_pago_activo: 'sumup' }]);
      if (url.includes('/auth/v1/user')) return json({ id: 'user' });
      if (url.includes('tienda_pedidos')) return json([{ id: 'order', numero: 'WEB-1', total: 119.79, usuario_id: 'user', pago_estado: 'pendiente', pago_referencia: 'old' }]);
      if (url.endsWith('/checkouts') && init.method === 'POST') { creates++; throw new Error('No debe crear otro checkout'); }
      if (url.endsWith('/checkouts/old')) return json({ status, amount: 119.79, currency: 'EUR', hosted_checkout_url: 'https://pay.sumup.com/old' });
      throw new Error('URL inesperada');
    };
    const res = { status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
    await handler({ method: 'POST', headers: { authorization: 'Bearer test' }, body: { pedido_id: 'order' } }, res);
    assert.equal(creates, 0);
    assert.equal(res.code, status === 'PENDING' ? 200 : status === 'PAID' ? 409 : 503);
  });
}

for (const scenario of ['error', 'network', 'success']) {
  test('interfaz de reintento: ' + scenario, async () => {
    const html = fs.readFileSync(require.resolve('../carrito.html'), 'utf8');
    const code = html.slice(html.indexOf('  async function startOrderPayment'), html.indexOf('\n  function render()'));
    let pending = null;
    let sent = null;
    const context = {
      document: { getElementById: () => null }, window: { location: { href: '' } }, console: { error() {} },
      akSupabase: () => ({ auth: { getSession: async () => ({ data: { session: { access_token: 'token' } } }) } }),
      fetch: async (url, init) => { sent = JSON.parse(init.body); if (scenario === 'network') throw new Error('offline'); return { ok: scenario === 'success', status: 500, json: async () => scenario === 'success' ? { hosted_checkout_url: 'https://pay.sumup.com/existing' } : {} }; },
      showPendingPayment: (id, message) => { pending = { id, message }; },
    };
    vm.createContext(context); vm.runInContext(code, context);
    await context.startOrderPayment('existing-order');
    assert.equal(sent.pedido_id, 'existing-order');
    if (scenario === 'success') assert.equal(context.window.location.href, 'https://pay.sumup.com/existing');
    else { assert.equal(pending.id, 'existing-order'); assert.match(pending.message, /no hay un pago confirmado/); assert.equal(context.window.location.href, ''); }
  });
}
