const { sendEmail } = require('../lib/resend-server');

const SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';
const FROM = 'Autokeys Remaps Pro Store <pedidos@autokeysremapspro.es>';

const TIPO_SERVICIO_LABEL = {
  duplicado_llave: 'Duplicado de llave',
  reprogramacion: 'Reprogramación',
  reparacion_modulo: 'Reparación de módulo',
  otro: 'Otro',
};
const FRANJA_LABEL = { manana: 'Mañana', tarde: 'Tarde', cualquiera: 'Indiferente' };

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

async function getCita(id) {
  const key = serviceKey();
  const response = await fetch(`${SUPABASE_URL}/rest/v1/tienda_citas?id=eq.${encodeURIComponent(id)}&select=*`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!response.ok) throw new Error('supabase_request_failed');
  const rows = await response.json();
  return rows[0] || null;
}

function fechaPreferidaLarga(value) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

function emailHtml(c) {
  return `<!doctype html><html><body style="margin:0;background:#08080a;font-family:Arial,sans-serif">
  <table role="presentation" width="100%"><tr><td align="center" style="padding:36px 14px">
    <table role="presentation" width="520" style="max-width:520px;width:100%;background:#111114;border:1px solid #29292f;border-radius:14px">
      <tr><td style="padding:28px 30px;border-bottom:1px solid #29292f;text-align:center"><img src="https://autokeys-store.vercel.app/assets/img/logo.png" width="170" alt="Autokeys Remaps Pro"></td></tr>
      <tr><td style="padding:32px 30px;color:#f5f5f7">
        <p style="color:#ef3641;font-size:10px;font-weight:800;letter-spacing:2px;margin:0 0 12px">SOLICITUD DE CITA RECIBIDA</p>
        <h1 style="font-size:24px;margin:0 0 14px">${escapeHtml(c.numero)}</h1>
        <p style="color:#a6a6ae;font-size:14px;line-height:1.7">Hola ${escapeHtml(c.nombre)}, hemos recibido tu solicitud de cita. <b style="color:#fff">Todavía no está confirmada.</b> Nuestro equipo te llamará o escribirá para acordar el día y la hora exactos.</p>
        <table role="presentation" width="100%" style="background:#19191d;border-radius:10px;padding:14px;color:#ddd;font-size:13px">
          <tr><td style="padding:5px;color:#85858e">Servicio</td><td style="padding:5px;text-align:right">${escapeHtml(TIPO_SERVICIO_LABEL[c.tipo_servicio] || c.tipo_servicio)}</td></tr>
          <tr><td style="padding:5px;color:#85858e">Vehículo</td><td style="padding:5px;text-align:right">${escapeHtml(`${c.marca} ${c.modelo}`)}</td></tr>
          <tr><td style="padding:5px;color:#85858e">Fecha preferida</td><td style="padding:5px;text-align:right">${escapeHtml(fechaPreferidaLarga(c.fecha_preferida))}</td></tr>
          <tr><td style="padding:5px;color:#85858e">Franja preferida</td><td style="padding:5px;text-align:right">${escapeHtml(FRANJA_LABEL[c.franja_horaria] || c.franja_horaria)}</td></tr>
        </table>
        <p style="color:#85858e;font-size:12px;line-height:1.6;margin-top:22px">Conserva el número ${escapeHtml(c.numero)} para cualquier consulta. Puedes responder a este correo o contactar por WhatsApp indicando esa referencia.</p>
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
    if (!body.cita_id) return res.status(400).json({ error: 'falta_cita_id' });
    const cita = await getCita(body.cita_id);
    if (!cita || cita.cliente_id !== user.id) return res.status(404).json({ error: 'cita_no_encontrada' });

    await Promise.all([
      sendEmail({ from: FROM, to: cita.email, subject: `${cita.numero} recibida — Autokeys Remaps Pro`, html: emailHtml(cita) }),
      sendEmail({ from: FROM, to: 'info@autokeyspro.es', subject: `Nueva cita ${cita.numero}: ${cita.marca} ${cita.modelo}`, html: emailHtml(cita) }),
    ]);
    return res.status(200).json({ enviado: true });
  } catch (error) {
    console.error('enviar-confirmacion-cita:', error);
    return res.status(500).json({ error: 'error_interno' });
  }
};
