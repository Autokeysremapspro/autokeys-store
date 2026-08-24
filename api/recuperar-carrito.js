const SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';

function serviceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || '';
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'metodo_no_permitido' });
  const token = String(req.query && req.query.token || '');
  if (!/^[0-9a-f-]{36}$/i.test(token)) return res.status(400).json({ error: 'enlace_invalido' });
  try {
    const key = serviceKey();
    const path = `tienda_carritos?recovery_token=eq.${encodeURIComponent(token)}&estado=eq.activo&select=items,ultimo_evento_at&limit=1`;
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    if (!response.ok) throw new Error(`supabase_${response.status}`);
    const rows = await response.json();
    const cart = rows[0];
    if (!cart || Date.now() - new Date(cart.ultimo_evento_at).getTime() > 7 * 86400000) return res.status(410).json({ error: 'enlace_caducado' });
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ items: Array.isArray(cart.items) ? cart.items : [] });
  } catch (error) {
    console.error('recuperar-carrito error:', error);
    res.status(500).json({ error: 'error_interno' });
  }
};
