const { sendEmail } = require('../lib/resend-server');

const SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';
const FROM = 'Autokeys Remaps Pro Store <pedidos@autokeysremapspro.es>';
const SERVICIOS = new Set(['duplicado_llave', 'reprogramacion', 'reparacion_modulo', 'otro']);
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

function text(value, max) {
  return String(value == null ? '' : value).trim().slice(0, max);
}

function optional(value, max) {
  return text(value, max) || null;
}

function html(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[char]));
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 50000) throw new Error('payload_grande');
  }
  return JSON.parse(raw || '{}');
}

async function authenticatedUser(req) {
  const authorization = String(req.headers.authorization || '');
  if (!authorization.startsWith('Bearer ')) return null;
  const key = serviceKey();
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: { apikey: key, Authorization: authorization } });
  return response.ok ? response.json() : null;
}

function validate(data) {
  if (text(data.website, 200)) throw new Error('spam');
  const openedAt = Number(data.opened_at);
  if (!openedAt || Date.now() - openedAt < 2000 || Date.now() - openedAt > 24 * 60 * 60 * 1000) throw new Error('formulario_caducado');
  const email = text(data.email, 254).toLowerCase();
  const telefono = text(data.telefono, 30);
  if (!SERVICIOS.has(data.tipo_servicio)) throw new Error('servicio_invalido');
  if (text(data.marca, 80).length < 2 || text(data.modelo, 100).length < 1) throw new Error('vehiculo_incompleto');
  const fecha = text(data.fecha_preferida, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) throw new Error('fecha_invalida');
  if (text(data.nombre, 120).length < 2 || !/^\S+@\S+\.\S+$/.test(email) || telefono.replace(/\D/g, '').length < 9) throw new Error('contacto_incompleto');
  if (data.acepta_condiciones !== true || data.acepta_privacidad !== true) throw new Error('consentimiento_necesario');
  return { email, telefono, fecha };
}

async function recentRequests(email) {
  const key = serviceKey();
  const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const response = await fetch(`${SUPABASE_URL}/rest/v1/tienda_citas?email=eq.${encodeURIComponent(email)}&created_at=gte.${encodeURIComponent(since)}&select=id&limit=4`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!response.ok) throw new Error('supabase_rate_check');
  return response.json();
}

async function insertCita(payload) {
  const key = serviceKey();
  const response = await fetch(`${SUPABASE_URL}/rest/v1/tienda_citas`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`supabase_insert_${response.status}`);
  const rows = await response.json();
  return rows[0];
}

function fechaPreferidaLarga(value) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

function emailHtml(cita) {
  return `<!doctype html><html><body style="margin:0;background:#08080a;font-family:Arial,sans-serif"><table role="presentation" width="100%"><tr><td align="center" style="padding:36px 14px"><table role="presentation" width="520" style="max-width:520px;width:100%;background:#111114;border:1px solid #29292f;border-radius:14px"><tr><td style="padding:28px 30px;border-bottom:1px solid #29292f;text-align:center"><img src="https://www.autokeysremapspro.es/assets/img/logo.png" width="170" alt="Autokeys Remaps Pro"></td></tr><tr><td style="padding:32px 30px;color:#f5f5f7"><p style="color:#ef3641;font-size:10px;font-weight:800;letter-spacing:2px;margin:0 0 12px">SOLICITUD DE CITA RECIBIDA</p><h1 style="font-size:24px;margin:0 0 14px">${html(cita.numero)}</h1><p style="color:#a6a6ae;font-size:14px;line-height:1.7">Hola ${html(cita.nombre)}, hemos recibido tu solicitud de cita. <b style="color:#fff">Todavía no está confirmada.</b> Nuestro equipo te llamará o escribirá para acordar el día y la hora exactos.</p><table role="presentation" width="100%" style="background:#19191d;border-radius:10px;padding:14px;color:#ddd;font-size:13px"><tr><td style="padding:5px;color:#85858e">Servicio</td><td style="padding:5px;text-align:right">${html(TIPO_SERVICIO_LABEL[cita.tipo_servicio] || cita.tipo_servicio)}</td></tr><tr><td style="padding:5px;color:#85858e">Vehículo</td><td style="padding:5px;text-align:right">${html(`${cita.marca} ${cita.modelo}`)}</td></tr><tr><td style="padding:5px;color:#85858e">Fecha preferida</td><td style="padding:5px;text-align:right">${html(fechaPreferidaLarga(cita.fecha_preferida))}</td></tr><tr><td style="padding:5px;color:#85858e">Franja preferida</td><td style="padding:5px;text-align:right">${html(FRANJA_LABEL[cita.franja_horaria] || cita.franja_horaria)}</td></tr></table><p style="color:#85858e;font-size:12px;line-height:1.6;margin-top:22px">Conserva el número ${html(cita.numero)} para cualquier consulta. Puedes responder a este correo o contactar por WhatsApp indicando esa referencia.</p></td></tr></table></td></tr></table></body></html>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'metodo_no_permitido' });
  try {
    if (!serviceKey()) throw new Error('configuracion_incompleta');
    const data = await readJson(req);
    const contact = validate(data);
    if ((await recentRequests(contact.email)).length >= 3) return res.status(429).json({ error: 'demasiadas_solicitudes' });
    const user = await authenticatedUser(req);
    const cita = await insertCita({
      cliente_id: user ? user.id : null,
      tipo_servicio: data.tipo_servicio,
      descripcion: optional(data.descripcion, 1000),
      marca: text(data.marca, 80), modelo: text(data.modelo, 100),
      anio: Number(data.anio) >= 1950 && Number(data.anio) <= 2100 ? Number(data.anio) : null,
      matricula: optional(data.matricula, 20),
      fecha_preferida: contact.fecha,
      franja_horaria: ['manana', 'tarde', 'cualquiera'].includes(data.franja_horaria) ? data.franja_horaria : 'cualquiera',
      tipo_cliente: ['taller', 'empresa'].includes(data.tipo_cliente) ? data.tipo_cliente : 'particular',
      nombre: text(data.nombre, 120), email: contact.email, telefono: contact.telefono,
      acepta_condiciones: true, acepta_privacidad: true,
      notas_internas: user ? null : 'Solicitud enviada sin cuenta de cliente.',
    });
    const notifications = await Promise.allSettled([
      sendEmail({ from: FROM, to: cita.email, subject: `${cita.numero} recibida — Autokeys Remaps Pro`, html: emailHtml(cita) }),
      sendEmail({ from: FROM, to: 'info@autokeyspro.es', subject: `Nueva cita ${cita.numero}: ${cita.marca} ${cita.modelo}`, html: emailHtml(cita) }),
    ]);
    return res.status(201).json({ id: cita.id, numero: cita.numero, vinculada: !!user, email_enviado: !!process.env.RESEND_API_KEY && notifications[0].status === 'fulfilled' });
  } catch (error) {
    const known = ['spam', 'formulario_caducado', 'servicio_invalido', 'vehiculo_incompleto', 'fecha_invalida', 'contacto_incompleto', 'consentimiento_necesario'];
    if (known.includes(error.message)) return res.status(400).json({ error: error.message });
    console.error('solicitud-cita:', error);
    return res.status(500).json({ error: 'error_interno' });
  }
};
