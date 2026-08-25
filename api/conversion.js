const SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';

const EVENTOS = new Set([
  'page_view', 'view_item', 'add_to_cart', 'remove_from_cart',
  'view_cart', 'begin_checkout', 'order_created', 'purchase', 'repair_request',
  'whatsapp_click', 'phone_click', 'repair_cta_click',
]);

async function body(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 50000) throw new Error('payload_grande');
  }
  return JSON.parse(raw || '{}');
}

function serviceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || '';
}

async function request(path, options = {}) {
  const key = serviceKey();
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=minimal,resolution=merge-duplicates', ...(options.headers || {}) },
  });
  if (!response.ok) throw new Error(`supabase_${response.status}`);
}

async function currentUser(req) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: { apikey: serviceKey(), Authorization: `Bearer ${token}` } });
  return response.ok ? response.json() : null;
}

function cleanItems(items) {
  if (!Array.isArray(items)) return [];
  return items.slice(0, 50).map((item) => ({
    productId: String(item.productId || '').slice(0, 120),
    variantId: String(item.variantId || '').slice(0, 120),
    qty: Math.max(1, Math.min(99, Number(item.qty) || 1)),
  })).filter((item) => item.productId && item.variantId);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'metodo_no_permitido' });
  try {
    const data = await body(req);
    if (!EVENTOS.has(data.evento) || !/^[0-9a-f-]{36}$/i.test(data.session_id || '')) return res.status(400).json({ error: 'evento_invalido' });
    const user = await currentUser(req);
    const event = {
      session_id: data.session_id,
      cliente_id: user && user.id || null,
      evento: data.evento,
      pagina: String(data.pagina || '').slice(0, 500),
      producto_id: data.producto_id ? String(data.producto_id).slice(0, 120) : null,
      variante_id: data.variante_id ? String(data.variante_id).slice(0, 120) : null,
      valor: Number.isFinite(Number(data.valor)) ? Number(data.valor) : null,
      metadata: {},
    };
    await request('tienda_conversion_eventos', { method: 'POST', body: JSON.stringify(event) });

    if (user && data.carrito) {
      const items = cleanItems(data.carrito.items);
      const estado = data.evento === 'order_created' || data.evento === 'purchase' ? 'convertido' : (items.length ? 'activo' : 'descartado');
      await request('tienda_carritos?on_conflict=session_id', {
        method: 'POST',
        body: JSON.stringify({
          session_id: data.session_id, cliente_id: user.id, email: user.email,
          items, subtotal: Math.max(0, Number(data.carrito.subtotal) || 0), estado,
          consentimiento_recordatorio: data.carrito.consentimiento_recordatorio === true,
          pedido_id: data.pedido_id || null, ultimo_evento_at: new Date().toISOString(),
        }),
      });
    }
    res.status(204).end();
  } catch (error) {
    console.error('conversion error:', error);
    res.status(500).json({ error: 'error_interno' });
  }
};