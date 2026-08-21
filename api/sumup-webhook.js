const { pagosConfigurados, reverificarYActualizarPago } = require('../lib/sumup-server');

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let data = '';
  for await (const chunk of req) data += chunk;
  try {
    return JSON.parse(data || '{}');
  } catch {
    return {};
  }
}

module.exports = async function handler(req, res) {
  // SumUp espera una respuesta 2xx rápida y trata cualquier otra cosa como
  // fallo (reintenta); por eso este handler nunca deja escapar un error.
  if (req.method !== 'POST' || !pagosConfigurados()) {
    res.status(204).end();
    return;
  }

  const body = await readJsonBody(req);
  const checkoutId = body.id || body.checkout_id || (body.checkout && body.checkout.id);
  if (!checkoutId) {
    res.status(204).end();
    return;
  }

  try {
    // Nunca se confía en el payload del webhook por sí solo: se reverifica
    // el estado directamente contra la API de SumUp con nuestra propia
    // clave antes de tocar la base de datos (mismo patrón ya probado en
    // producción en autokeys-file-service).
    await reverificarYActualizarPago(checkoutId);
  } catch (err) {
    console.error('sumup-webhook error:', err);
  }

  res.status(204).end();
};
