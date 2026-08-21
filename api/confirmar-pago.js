const { pagosConfigurados, getPedido, reverificarYActualizarPago } = require('../lib/sumup-server');

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
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'metodo_no_permitido' });
    return;
  }
  if (!pagosConfigurados()) {
    res.status(503).json({ error: 'pagos_no_configurados' });
    return;
  }

  const body = await readJsonBody(req);
  const pedidoId = body.pedido_id;
  if (!pedidoId) {
    res.status(400).json({ error: 'falta_pedido_id' });
    return;
  }

  try {
    const pedido = await getPedido(pedidoId);
    if (!pedido) {
      res.status(404).json({ error: 'pedido_no_encontrado' });
      return;
    }
    if (!pedido.pago_referencia) {
      res.status(200).json({ pago_estado: pedido.pago_estado });
      return;
    }
    const actualizado = await reverificarYActualizarPago(pedido.pago_referencia);
    res.status(200).json({ pago_estado: actualizado ? actualizado.pago_estado : pedido.pago_estado });
  } catch (err) {
    console.error('confirmar-pago error:', err);
    res.status(500).json({ error: 'error_interno' });
  }
};
