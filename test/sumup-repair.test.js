'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-test';
process.env.AK_SUMUP_LIVE_API_KEY = 'sumup-test';
process.env.AK_SUMUP_LIVE_MERCHANT_CODE = 'merchant-test';

const { reverificarYActualizarPago } = require('../lib/sumup-server');

function json(data, ok = true) {
  return { ok, status: ok ? 200 : 500, text: async () => JSON.stringify(data), json: async () => data };
}

test('un webhook pagado confirma una solicitud solo si el importe coincide', async () => {
  let update = null;
  global.fetch = async (url, init = {}) => {
    const path = String(url);
    if (path.includes('tienda_pedidos?pago_referencia')) return json([]);
    if (path.includes('tienda_solicitudes_reparacion?pago_referencia')) return json([{ id: 's1', numero: 'REP-001', presupuesto_total: 149.9, pago_estado: 'pendiente', estado: 'pendiente_pago' }]);
    if (path.includes('api.sumup.com/v0.1/checkouts/checkout-1')) return json({ status: 'PAID', amount: 149.9, currency: 'EUR' });
    if (path.includes('tienda_solicitudes_reparacion?id=eq.s1') && init.method === 'PATCH') {
      update = JSON.parse(init.body);
      return json(null);
    }
    throw new Error(`URL inesperada: ${path}`);
  };

  const result = await reverificarYActualizarPago('checkout-1');
  assert.equal(result.tipo, 'solicitud');
  assert.equal(result.pago_estado, 'pagado');
  assert.equal(update.estado, 'presupuesto_aceptado');
  assert.equal(update.pago_estado, 'pagado');
  assert.ok(update.pago_confirmado_at);
});

test('no confirma una solicitud si SumUp devuelve otro importe', async () => {
  let updated = false;
  global.fetch = async (url, init = {}) => {
    const path = String(url);
    if (path.includes('tienda_pedidos?pago_referencia')) return json([]);
    if (path.includes('tienda_solicitudes_reparacion?pago_referencia')) return json([{ id: 's2', numero: 'REP-002', presupuesto_total: 200, pago_estado: 'pendiente', estado: 'pendiente_pago' }]);
    if (path.includes('api.sumup.com/v0.1/checkouts/checkout-2')) return json({ status: 'PAID', amount: 2, currency: 'EUR' });
    if (init.method === 'PATCH') updated = true;
    return json(null);
  };

  const result = await reverificarYActualizarPago('checkout-2');
  assert.equal(result.pago_estado, 'pendiente');
  assert.equal(updated, false);
});
