const { sendEmail } = require('../lib/resend-server');

const SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';
const FROM = 'Autokeys Remaps Pro Store <pedidos@autokeysremapspro.es>';
const UNITS = new Set(['ecu', 'tcu', 'abs_esp', 'airbag_srs', 'cuadro', 'uch_bcm', 'cas_ews_fem_bdc', 'ezs_elv', 'j518_kessy', 'otro']);

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
  if (!UNITS.has(data.tipo_unidad)) throw new Error('unidad_invalida');
  if (text(data.trabajo_solicitado, 120).length < 3) throw new Error('trabajo_invalido');
  if (text(data.marca, 80).length < 2 || text(data.modelo, 100).length < 1) throw new Error('vehiculo_incompleto');
  if (text(data.descripcion_averia, 4000).length < 20) throw new Error('averia_incompleta');
  if (text(data.nombre, 120).length < 2 || !/^\S+@\S+\.\S+$/.test(email) || telefono.replace(/\D/g, '').length < 9) throw new Error('contacto_incompleto');
  if (data.acepta_diagnostico !== true || data.acepta_condiciones !== true || data.acepta_privacidad !== true) throw new Error('consentimiento_necesario');
  return { email, telefono };
}

async function recentRequests(email) {
  const key = serviceKey();
  const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const response = await fetch(`${SUPABASE_URL}/rest/v1/tienda_solicitudes_reparacion?email=eq.${encodeURIComponent(email)}&created_at=gte.${encodeURIComponent(since)}&select=id&limit=4`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!response.ok) throw new Error('supabase_rate_check');
  return response.json();
}

async function insertRequest(payload) {
  const key = serviceKey();
  const response = await fetch(`${SUPABASE_URL}/rest/v1/tienda_solicitudes_reparacion`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`supabase_insert_${response.status}`);
  const rows = await response.json();
  return rows[0];
}

function emailBody(request) {
  return `<!doctype html><html><body style="margin:0;background:#08080a;font-family:Arial,sans-serif"><table role="presentation" width="100%"><tr><td align="center" style="padding:32px 14px"><table role="presentation" width="540" style="max-width:540px;width:100%;background:#111114;border:1px solid #29292f;border-radius:14px"><tr><td style="padding:30px;color:#f5f5f7"><p style="color:#ef3641;font-size:11px;font-weight:800;letter-spacing:1.5px">SOLICITUD RECIBIDA</p><h1 style="font-size:25px;margin:0 0 16px">${html(request.numero)}</h1><p style="color:#b4b4bc;line-height:1.7">Hola ${html(request.nombre)}, hemos recibido tu caso. <b style="color:#fff">No envíes todavía la unidad.</b> Primero comprobaremos la información y te indicaremos el siguiente paso.</p><div style="background:#19191d;border-radius:10px;padding:16px;margin:20px 0;color:#ddd"><p><b>Vehículo:</b> ${html(request.marca)} ${html(request.modelo)}</p><p><b>Unidad:</b> ${html(request.tipo_unidad)}</p><p><b>Solicitud:</b> ${html(request.trabajo_solicitado)}</p></div><p style="color:#8d8d96;font-size:12px;line-height:1.6">Conserva la referencia ${html(request.numero)}. Puedes responder a este correo o escribir por WhatsApp indicando ese número.</p></td></tr></table></td></tr></table></body></html>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'metodo_no_permitido' });
  try {
    if (!serviceKey()) throw new Error('configuracion_incompleta');
    const data = await readJson(req);
    const contact = validate(data);
    if ((await recentRequests(contact.email)).length >= 3) return res.status(429).json({ error: 'demasiadas_solicitudes' });
    const user = await authenticatedUser(req);
    const pickup = data.metodo_envio === 'recogida_autokeys';
    const request = await insertRequest({
      cliente_id: user ? user.id : null,
      tipo_cliente: ['taller', 'empresa'].includes(data.tipo_cliente) ? data.tipo_cliente : 'particular',
      nombre: text(data.nombre, 120), email: contact.email, telefono: contact.telefono,
      tipo_unidad: data.tipo_unidad, trabajo_solicitado: text(data.trabajo_solicitado, 120),
      marca: text(data.marca, 80), modelo: text(data.modelo, 100),
      anio: Number(data.anio) >= 1950 && Number(data.anio) <= 2100 ? Number(data.anio) : null,
      motorizacion: optional(data.motorizacion, 120), matricula: optional(data.matricula, 20),
      vin: optional(data.vin, 40), referencia_modulo: optional(data.referencia_modulo, 160),
      descripcion_averia: text(data.descripcion_averia, 4000), vehiculo_arranca: typeof data.vehiculo_arranca === 'boolean' ? data.vehiculo_arranca : null,
      codigos_averia: optional(data.codigos_averia, 1500), manipulado_antes: data.manipulado_antes === true,
      elementos_envio: Array.isArray(data.elementos_envio) ? data.elementos_envio.slice(0, 6).map((item) => text(item, 100)).filter(Boolean) : [],
      metodo_envio: pickup ? 'recogida_autokeys' : 'cuenta_cliente',
      direccion_recogida: pickup ? optional(data.direccion_recogida, 220) : null,
      codigo_postal: pickup ? optional(data.codigo_postal, 12) : null,
      poblacion: pickup ? optional(data.poblacion, 100) : null, provincia: pickup ? optional(data.provincia, 100) : null,
      persona_contacto_recogida: pickup ? optional(data.persona_contacto_recogida, 120) : null,
      telefono_recogida: pickup ? contact.telefono : null,
      peso_recogida_kg: pickup ? Math.max(0.1, Math.min(30, Number(data.peso_recogida_kg) || 1)) : null,
      precio_recogida: pickup && Number.isFinite(Number(data.precio_recogida)) ? Number(data.precio_recogida) : null,
      tarifa_recogida_codigo: pickup ? optional(data.tarifa_recogida_codigo, 80) : null,
      acepta_diagnostico: true, acepta_condiciones: true, acepta_privacidad: true,
      notas_cliente: user ? null : 'Solicitud enviada sin cuenta de cliente.',
    });
    const notifications = await Promise.allSettled([
      sendEmail({ from: FROM, to: request.email, subject: `${request.numero} recibida — Autokeys Remaps Pro`, html: emailBody(request) }),
      sendEmail({ from: FROM, to: 'info@autokeyspro.es', subject: `Nueva solicitud ${request.numero}: ${request.marca.replace(/[\r\n]+/g, ' ')} ${request.modelo.replace(/[\r\n]+/g, ' ')}`, html: emailBody(request) }),
    ]);
    return res.status(201).json({ id: request.id, numero: request.numero, vinculada: !!user, email_enviado: !!process.env.RESEND_API_KEY && notifications[0].status === 'fulfilled' });
  } catch (error) {
    const known = ['spam', 'formulario_caducado', 'unidad_invalida', 'trabajo_invalido', 'vehiculo_incompleto', 'averia_incompleta', 'contacto_incompleto', 'consentimiento_necesario'];
    if (known.includes(error.message)) return res.status(400).json({ error: error.message });
    console.error('solicitud-reparacion:', error);
    return res.status(500).json({ error: 'error_interno' });
  }
};
