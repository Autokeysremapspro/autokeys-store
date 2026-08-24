const { sendEmail } = require('../lib/resend-server');

const SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';
const FROM = 'Autokeys Remaps Pro Store <pedidos@autokeysremapspro.es>';

function serviceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || '';
}

function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let raw = '';
  for await (const chunk of req) raw += chunk;
  try { return JSON.parse(raw || '{}'); } catch { return {}; }
}

async function authenticatedUser(req) {
  const authorization = req.headers.authorization || '';
  if (!authorization.startsWith('Bearer ')) return null;
  const key = serviceKey();
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: key, Authorization: authorization },
  });
  if (!response.ok) return null;
  return response.json();
}

async function getRequest(id) {
  const key = serviceKey();
  const response = await fetch(`${SUPABASE_URL}/rest/v1/tienda_solicitudes_reparacion?id=eq.${encodeURIComponent(id)}&select=*`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!response.ok) throw new Error('supabase_request_failed');
  const rows = await response.json();
  return rows[0] || null;
}

function emailHtml(s) {
  return `<!doctype html><html><body style="margin:0;background:#08080a;font-family:Arial,sans-serif">
  <table role="presentation" width="100%"><tr><td align="center" style="padding:36px 14px">
    <table role="presentation" width="520" style="max-width:520px;width:100%;background:#111114;border:1px solid #29292f;border-radius:14px">
      <tr><td style="padding:28px 30px;border-bottom:1px solid #29292f;text-align:center"><img src="https://autokeys-store.vercel.app/assets/img/logo.png" width="170" alt="Autokeys Remaps Pro"></td></tr>
      <tr><td style="padding:32px 30px;color:#f5f5f7">
        <p style="color:#ef3641;font-size:10px;font-weight:800;letter-spacing:2px;margin:0 0 12px">SOLICITUD RECIBIDA</p>
        <h1 style="font-size:24px;margin:0 0 14px">${escapeHtml(s.numero)}</h1>
        <p style="color:#a6a6ae;font-size:14px;line-height:1.7">Hola ${escapeHtml(s.nombre)}, hemos recibido la información correctamente. <b style="color:#fff">No envíes todavía la unidad.</b> Nuestro equipo revisará el caso y te confirmará qué elementos necesitamos y cómo realizar el envío.</p>
        <table role="presentation" width="100%" style="background:#19191d;border-radius:10px;padding:14px;color:#ddd;font-size:13px">
          <tr><td style="padding:5px;color:#85858e">Unidad</td><td style="padding:5px;text-align:right">${escapeHtml(s.tipo_unidad)}</td></tr>
          <tr><td style="padding:5px;color:#85858e">Trabajo solicitado</td><td style="padding:5px;text-align:right">${escapeHtml(s.trabajo_solicitado)}</td></tr>
          <tr><td style="padding:5px;color:#85858e">Vehículo</td><td style="padding:5px;text-align:right">${escapeHtml(`${s.marca} ${s.modelo}`)}</td></tr>
        </table>
        <p style="color:#85858e;font-size:12px;line-height:1.6;margin-top:22px">Conserva el número ${escapeHtml(s.numero)} para cualquier consulta. Puedes responder a este correo o contactar por WhatsApp indicando esa referencia.</p>
      </td></tr>
    </table>
  </td></tr></table></body></html>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'metodo_no_permitido' });
  try {
    const user = await authenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'no_autorizado' });
    const body = await readJson(req);
    if (!body.solicitud_id) return res.status(400).json({ error: 'falta_solicitud_id' });
    const solicitud = await getRequest(body.solicitud_id);
    if (!solicitud || solicitud.cliente_id !== user.id) return res.status(404).json({ error: 'solicitud_no_encontrada' });

    await Promise.all([
      sendEmail({ from: FROM, to: solicitud.email, subject: `${solicitud.numero} recibida — Autokeys Remaps Pro`, html: emailHtml(solicitud) }),
      sendEmail({ from: FROM, to: 'info@autokeyspro.es', subject: `Nueva solicitud ${solicitud.numero}: ${solicitud.marca} ${solicitud.modelo}`, html: emailHtml(solicitud) }),
    ]);
    return res.status(200).json({ enviado: true });
  } catch (error) {
    console.error('enviar-confirmacion-reparacion:', error);
    return res.status(500).json({ error: 'error_interno' });
  }
};
