const { TRANSPORTISTAS, estaConfigurado, crearEnvio } = require('../lib/transportistas');

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

function getServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || '';
}

async function esStaffAutenticado(req) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return false;
  const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` },
  });
  if (!userRes.ok) return false;
  const user = await userRes.json();
  if (!user?.id) return false;
  const staffRes = await supabaseAdminRequest(
    `usuarios_app?auth_user_id=eq.${encodeURIComponent(user.id)}&activo=eq.true&select=rol`
  );
  const staff = await staffRes.json();
  return Array.isArray(staff) && staff.length > 0;
}

async function supabaseAdminRequest(path, init = {}) {
  const key = getServiceRoleKey();
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
}

const ORIGENES_PERMITIDOS = ['https://autokeysremapspro.online', 'https://www.autokeysremapspro.online'];

module.exports = async function handler(req, res) {
  // Llamado desde el panel admin, en un dominio distinto (autokeysremapspro.online).
  const origin = req.headers.origin;
  if (ORIGENES_PERMITIDOS.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method === 'GET') {
    // Lista qué transportistas están ya configurados, para que el panel
    // admin solo ofrezca los que de verdad se pueden usar.
    res.status(200).json({
      transportistas: TRANSPORTISTAS.map((t) => ({ id: t.id, label: t.label, configurado: estaConfigurado(t.id) })),
    });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'metodo_no_permitido' });
    return;
  }

  if (!(await esStaffAutenticado(req))) {
    res.status(401).json({ error: 'no_autorizado' });
    return;
  }

  const body = await readJsonBody(req);
  const { pedido_id, transportista } = body;
  if (!pedido_id || !transportista) {
    res.status(400).json({ error: 'faltan_datos' });
    return;
  }

  try {
    const res1 = await supabaseAdminRequest(`tienda_pedidos?id=eq.${encodeURIComponent(pedido_id)}&select=*`);
    if (!res1.ok) throw new Error('No se pudo leer el pedido');
    const [pedido] = await res1.json();
    if (!pedido) {
      res.status(404).json({ error: 'pedido_no_encontrado' });
      return;
    }

    const envio = await crearEnvio(transportista, pedido);

    const res2 = await supabaseAdminRequest(`tienda_pedidos?id=eq.${encodeURIComponent(pedido_id)}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({
        transportista,
        numero_seguimiento: envio.numero_seguimiento,
        envio_estado: 'enviado',
        fecha_envio: new Date().toISOString(),
      }),
    });
    if (!res2.ok) throw new Error('No se pudo actualizar el pedido');

    res.status(200).json({ numero_seguimiento: envio.numero_seguimiento, etiqueta_url: envio.etiqueta_url || null });
  } catch (err) {
    res.status(502).json({ error: err.message || 'error_transportista' });
  }
};
