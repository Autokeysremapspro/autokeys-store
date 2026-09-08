const { sendEmail } = require('../lib/resend-server');
const { generateRepairQuotePdf } = require('../lib/repair-quote-pdf');

const SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_UMSdVTexHpOImBBonUJKdw_s7XgKVeq';
const FROM = 'Autokeys Remaps Pro Store <pedidos@autokeysremapspro.es>';
const STAFF_ROLES = new Set(['admin', 'desarrollo', 'laboratorio', 'atencion_cliente']);

function serviceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || '';
}

function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let raw = '';
  for await (const chunk of req) raw += chunk;
  try { return JSON.parse(raw || '{}'); } catch { return {}; }
}

async function getUser(req) {
  const authorization = String(req.headers.authorization || '');
  if (!authorization.startsWith('Bearer ')) return null;
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: authorization } });
  return response.ok ? response.json() : null;
}

async function isStaff(userId) {
  const key = serviceKey();
  const response = await fetch(`${SUPABASE_URL}/rest/v1/usuarios_app?auth_user_id=eq.${encodeURIComponent(userId)}&activo=eq.true&select=rol&limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!response.ok) return false;
  const [profile] = await response.json();
  return !!profile && STAFF_ROLES.has(profile.rol);
}

async function getRequest(id) {
  const key = serviceKey();
  const response = await fetch(`${SUPABASE_URL}/rest/v1/tienda_solicitudes_reparacion?id=eq.${encodeURIComponent(id)}&select=*`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!response.ok) throw new Error('supabase_request_failed');
  const [request] = await response.json();
  return request || null;
}

function emailHtml(s) {
  const url = `https://www.autokeysremapspro.es/mi-solicitud.html#token=${encodeURIComponent(s.seguimiento_token)}`;
  const total = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(Number(s.presupuesto_total));
  return `<!doctype html><html><body style="margin:0;background:#08080a;font-family:Arial,sans-serif"><table role="presentation" width="100%"><tr><td align="center" style="padding:32px 14px"><table role="presentation" width="540" style="max-width:540px;width:100%;background:#111114;border:1px solid #29292f;border-radius:14px"><tr><td style="padding:30px;color:#f5f5f7"><p style="color:#ef3641;font-size:11px;font-weight:800;letter-spacing:1.5px">PRESUPUESTO DISPONIBLE</p><h1 style="font-size:25px;margin:0 0 12px">${escapeHtml(s.numero)}</h1><p style="color:#b4b4bc;line-height:1.7">Hola ${escapeHtml(s.nombre)}, ya puedes revisar la valoración de tu ${escapeHtml(s.tipo_unidad)}. Te adjuntamos el presupuesto detallado en PDF.</p><div style="background:#19191d;border-radius:10px;padding:18px;margin:20px 0"><div style="font-size:28px;font-weight:900">${escapeHtml(total)}</div><p style="color:#ddd;white-space:pre-line;line-height:1.6">${escapeHtml(s.presupuesto_detalle || 'Consulta el desglose completo en el PDF adjunto.')}</p>${s.plazo_estimado ? `<p style="color:#aaa"><b style="color:#fff">Plazo estimado:</b> ${escapeHtml(s.plazo_estimado)}</p>` : ''}</div><p><a href="${escapeHtml(url)}" style="display:inline-block;background:#e52531;color:#fff;text-decoration:none;padding:13px 19px;border-radius:8px;font-weight:800">Revisar y aceptar presupuesto</a></p><p style="color:#8d8d96;font-size:12px;line-height:1.6">El enlace es privado. El pago, si aceptas, se completa en la página segura de SumUp.</p></td></tr></table></td></tr></table></body></html>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'metodo_no_permitido' });
  try {
    if (!serviceKey() || !process.env.RESEND_API_KEY) return res.status(503).json({ error: 'servicio_no_configurado' });
    const user = await getUser(req);
    if (!user || !(await isStaff(user.id))) return res.status(403).json({ error: 'no_autorizado' });
    const body = await readJson(req);
    const request = await getRequest(String(body.solicitud_id || ''));
    if (!request) return res.status(404).json({ error: 'solicitud_no_encontrada' });
    if (request.estado !== 'presupuesto_enviado' || Number(request.presupuesto_total) <= 0) return res.status(409).json({ error: 'presupuesto_incompleto' });
    const pdf = generateRepairQuotePdf(request);
    await sendEmail({ from: FROM, to: request.email, subject: `${request.numero}: presupuesto disponible`, html: emailHtml(request), attachments: [{ filename: `Presupuesto-${request.numero}.pdf`, content: pdf.toString('base64') }] });
    return res.status(200).json({ enviado: true });
  } catch (error) {
    console.error('notificar-presupuesto-reparacion:', error);
    return res.status(500).json({ error: 'error_interno' });
  }
};
