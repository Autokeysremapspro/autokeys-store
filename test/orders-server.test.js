'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { calcularPedido } = require('../lib/orders-server');

process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

function response(data, ok = true) {
  return { ok, json: async () => data };
}

function mockCatalog({ price = 10, weight = 1, physical = true, excluded = false, bulky = false, dimensions = null } = {}) {
  global.fetch = async (url) => {
    const path = String(url);
    if (path.includes('tienda_configuracion')) return response([{
      envio_precio_hasta_5kg: 9.95,
      envio_precio_hasta_10kg: 11.95,
      envio_precio_kg_adicional: 0.75,
      envio_gratis_desde: 149,
      envio_gratis_peso_max_kg: 10,
      envio_peso_embalaje_kg: 0.3,
      envio_peso_fallback_kg: 1,
    }]);
    if (path.includes('tienda_producto_variantes')) return response([{ producto_id: 'p1', variant_key: 'v1', name: 'Estándar', price, peso_envio_kg: null }]);
    if (path.includes('tienda_productos')) return response([{
      id: 'p1',
      name: 'Producto',
      category_id: 'recambios',
      requiere_envio: physical,
      peso_envio_kg: weight,
      largo_cm: dimensions?.largo || null,
      ancho_cm: dimensions?.ancho || null,
      alto_cm: dimensions?.alto || null,
      voluminoso: bulky,
      excluido_envio_gratis: excluded,
    }]);
    throw new Error(`URL inesperada: ${path}`);
  };
}

async function quote(qty) {
  return calcularPedido({ items: [{ productId: 'p1', variantId: 'v1', qty }], codigo_postal: '28001', pais: 'España' });
}

test('aplica 9,95 € hasta 5 kg incluyendo embalaje', async () => {
  mockCatalog({ weight: 1 });
  const result = await quote(1);
  assert.equal(result.peso_total_kg, 1.3);
  assert.equal(result.envio, 9.95);
  assert.equal(result.tarifa_envio_codigo, 'PENINSULA_HASTA_5KG');
});

test('aplica 11,95 € entre 5 y 10 kg', async () => {
  mockCatalog({ weight: 1 });
  const result = await quote(6);
  assert.equal(result.envio, 11.95);
});

test('usa el peso volumétrico cuando supera el peso real', async () => {
  mockCatalog({ weight: 4, dimensions: { largo: 60, ancho: 40, alto: 20 } });
  const result = await quote(1);
  assert.equal(result.lineas[0].peso_real_kg, 4);
  assert.equal(result.lineas[0].peso_volumetrico_kg, 9.6);
  assert.equal(result.lineas[0].peso_unitario_kg, 9.6);
  assert.equal(result.peso_total_kg, 9.9);
  assert.equal(result.envio, 11.95);
  assert.equal(result.tarifa_envio_codigo, 'PENINSULA_HASTA_10KG');
});

test('redondea hacia arriba los kilos adicionales a partir de 10 kg', async () => {
  mockCatalog({ weight: 1 });
  const result = await quote(11);
  assert.equal(result.peso_total_kg, 11.3);
  assert.equal(result.envio, 13.45);
});

test('deja el envío gratis desde 149 € si no supera 10 kg', async () => {
  mockCatalog({ price: 50, weight: 1 });
  const result = await quote(3);
  assert.equal(result.subtotal, 150);
  assert.equal(result.envio, 0);
  assert.equal(result.tarifa_envio_codigo, 'GRATIS_149');
});

test('un servicio digital no genera peso ni envío', async () => {
  mockCatalog({ price: 200, physical: false });
  const result = await quote(1);
  assert.equal(result.peso_total_kg, 0);
  assert.equal(result.envio, 0);
  assert.equal(result.tarifa_envio_codigo, 'DIGITAL');
});
