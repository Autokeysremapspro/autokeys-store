const { quoteOrder, money } = require('../lib/order-pricing-server');

function result(quote) {
  return {
    subtotal: quote.subtotal,
    descuento: quote.descuento,
    envio: quote.envio,
    total: quote.total,
    requiere_envio: quote.requiere_envio,
    peso_total_kg: quote.peso_total_kg,
    tarifa: quote.tarifa_envio_codigo,
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return res.status(405).json({ error: 'metodo_no_permitido' });
  try {
    const [digital, airbag, bench] = await Promise.all([
      quoteOrder([{ product_id: 'edc15p-multimap-suite', variant_id: 'licencia', qty: 1 }]),
      quoteOrder([{ product_id: 'airbag-srs-reparacion', variant_id: 'reset-crash', qty: 1 }]),
      quoteOrder([{ product_id: 'pack-autokeys-ecu-bench-starter', variant_id: 'BENCH_STARTER', qty: 1 }]),
    ]);

    const checks = {
      digital_sin_envio: !digital.requiere_envio && digital.envio === 0 && digital.total === digital.subtotal,
      fisico_suma_envio: airbag.requiere_envio && airbag.envio > 0 && airbag.total === money(airbag.subtotal + airbag.envio - airbag.descuento),
      umbral_envio_gratis: bench.requiere_envio && bench.subtotal >= bench.envio_gratis_desde && bench.peso_total_kg <= bench.envio_gratis_peso_max_kg && bench.envio === 0,
    };
    const ok = Object.values(checks).every(Boolean);

    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    if (req.method === 'HEAD') return res.status(ok ? 200 : 503).end();
    return res.status(ok ? 200 : 503).json({
      ok,
      checks,
      samples: { digital: result(digital), airbag: result(airbag), bench: result(bench) },
    });
  } catch (error) {
    console.error('checkout-health:', error);
    return res.status(503).json({ ok: false, error: 'checkout_no_disponible' });
  }
};
