const { pagosConfigurados, createHostedCheckout, getPedido, updatePedido } = require('../lib/sumup-server');

const SITE_URL = 'https://www.autokeysremapspro.es';
const SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_UMSdVTexHpOImBBonUJKdw_s7XgKVeq';

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

async function authenticatedUser(req) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return null;
  const user = await response.json();
  return user?.id ? user : null;
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

  const user = await authenticatedUser(req);
  if (!user) {
    res.status(401).json({ error: 'no_autorizado' });
    return;
  }

  const body = await readJsonBody(req);
  const pedidoId = body.pedido_id;
  if (!pedidoId) {
    res.status(400).json({ error: 'falta_pedido_id' });
    return;
  }

  try {
    // El importe se lee del pedido creado y recalculado en servidor. Además,
    // solo el propietario autenticado puede abrir un checkout para ese pedido.
    const pedido = await getPedido(pedidoId);
    if (!pedido) {
      res.status(404).json({ error: 'pedido_no_encontrado' });
      return;
    }
    if (pedido.usuario_id !== user.id) {
      res.status(403).json({ error: 'pedido_no_pertenece_al_usuario' });
      return;
    }
    if (pedido.pago_estado === 'pagado') {
      res.status(409).json({ error: 'pedido_ya_pagado' });
      return;
    }

    const checkout = await createHostedCheckout({
      checkoutReference: pedido.numero,
      amount: pedido.total,
      description: `Pedido ${pedido.numero} — Autokeys Remaps Pro Store`,
      redirectUrl: `${SITE_URL}/carrito.html?pedido=${pedido.id}&pago=retorno`,
      returnUrl: `${SITE_URL}/api/sumup-webhook`,
    });

    if (!checkout?.id || !checkout?.hosted_checkout_url) {
      console.error('SumUp no devolvió la URL del checkout alojado:', checkout);
      res.status(502).json({ error: 'sumup_error' });
      return;
    }

    await updatePedido(pedido.id, { pago_referencia: checkout.id });

    res.status(200).json({ hosted_checkout_url: checkout.hosted_checkout_url });
  } catch (err) {
    console.error('crear-pago error:', err);
    res.status(500).json({ error: 'error_interno' });
  }
};
