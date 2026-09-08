const { sendEmail } = require('../lib/resend-server');

const SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';
const STORE_URL = 'https://www.autokeysremapspro.es';
const FROM = 'Autokeys Remaps Pro Store <pedidos@autokeysremapspro.es>';

function serviceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || '';
}

async function db(path, options = {}) {
  const key = serviceKey();
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  if (!response.ok) throw new Error(`supabase_${response.status}`);
  return response.status === 204 ? null : response.json();
}

function money(value) {
  return Number(value || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}
function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])); }

function emailHtml(cart) {
  const link = `${STORE_URL}/carrito.html?recuperar=${encodeURIComponent(cart.recovery_token)}`;
  return `<!doctype html><html><body style="margin:0;background:#070708;font-family:Arial,Helvetica,sans-serif"><table role="presentation" width="100%"><tr><td align="center" style="padding:40px 16px"><table role="presentation" width="500" style="max-width:500px;width:100%;background:#111113;border:1px solid #29292f;border-radius:14px"><tr><td style="padding:26px 32px;text-align:center;border-bottom:1px solid #29292f"><img src="${STORE_URL}/assets/img/logo.png" width="160" alt="Autokeys Remaps Pro Store"></td></tr><tr><td style="padding:32px;color:#f6f6f7"><p style="margin:0 0 12px;color:#ef1f2b;font-size:11px;font-weight:900;letter-spacing:2px">TU CARRITO TE ESPERA</p><h1 style="font-size:23px;margin:0 0 14px">¿Quieres terminar tu pedido?</h1><p style="color:#a8a8b0;font-size:14px;line-height:1.65;margin:0">Guardamos los productos que dejaste en el carrito. El importe estimado era de <b style="color:#fff">${money(cart.subtotal)}</b>; al volver comprobaremos automáticamente su disponibilidad y precio actual.</p><table role="presentation" width="100%" style="margin-top:26px"><tr><td align="center"><a href="${link}" style="display:inline-block;background:#dc1823;color:#fff;text-decoration:none;font-size:14px;font-weight:800;padding:14px 26px;border-radius:9px">Recuperar mi carrito</a></td></tr></table><p style="color:#777780;font-size:11px;line-height:1.5;margin:25px 0 0">Recibes este único aviso porque lo autorizaste al revisar el carrito. El enlace caduca a los 7 días. No volveremos a recordártelo.</p></td></tr></table></td></tr></table></body></html>`;
}

function quoteEmail(s, stage) {
  const link = `${STORE_URL}/mi-solicitud.html#token=${encodeURIComponent(s.seguimiento_token)}`;
  const title = stage === '72h' ? '¿Necesitas que aclaremos algo del presupuesto?' : 'Tu presupuesto sigue disponible';
  return `<!doctype html><html><body style="margin:0;background:#08080a;font-family:Arial,sans-serif"><table role="presentation" width="100%"><tr><td align="center" style="padding:32px 14px"><table role="presentation" width="540" style="max-width:540px;width:100%;background:#111114;border:1px solid #29292f;border-radius:14px"><tr><td style="padding:30px;color:#f5f5f7"><p style="color:#ef3641;font-size:11px;font-weight:800;letter-spacing:1.5px">PRESUPUESTO ${esc(s.numero)}</p><h1 style="font-size:24px">${esc(title)}</h1><p style="color:#b4b4bc;line-height:1.7">Hola ${esc(s.nombre)}, la valoración de tu ${esc(s.tipo_unidad)} sigue disponible. Puedes revisar el desglose, la validez y el plazo antes de aceptar.</p><div style="font-size:27px;font-weight:900;margin:22px 0">${money(s.presupuesto_total)}</div><p><a href="${link}" style="display:inline-block;background:#e52531;color:#fff;text-decoration:none;padding:13px 19px;border-radius:8px;font-weight:800">Revisar presupuesto</a></p><p style="color:#8d8d96;font-size:12px">Si tienes alguna duda, responde a este correo o escríbenos por WhatsApp indicando ${esc(s.numero)}.</p></td></tr></table></td></tr></table></body></html>`;
}

function reviewEmail(s) {
  const review = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Autokeys Remaps Pro, Avenida Andalucía 125, Puente de Génave');
  return `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#222"><h2>¿Qué tal ha ido tu reparación?</h2><p>Hola ${esc(s.nombre)}, hemos marcado como finalizada la solicitud <b>${esc(s.numero)}</b>. Tu opinión sincera ayuda a otros clientes a conocer el servicio y también nos ayuda a mejorar.</p><p><a href="${review}" style="display:inline-block;background:#e52531;color:#fff;text-decoration:none;padding:13px 19px;border-radius:8px;font-weight:800">Escribir una reseña en Google</a></p><p>Si necesitas que revisemos cualquier detalle, también puedes responder directamente a este correo.</p></body></html>`;
}

function incompleteEmail(lead) {
  const params = new URLSearchParams({ unidad: lead.tipo_unidad || '', trabajo: lead.problema || '' });
  const link = `${STORE_URL}/enviar-reparacion.html?${params.toString()}`;
  return `<!doctype html><html><body style="margin:0;background:#08080a;font-family:Arial,sans-serif"><table role="presentation" width="100%"><tr><td align="center" style="padding:32px 14px"><table role="presentation" width="540" style="max-width:540px;width:100%;background:#111114;border:1px solid #29292f;border-radius:14px"><tr><td style="padding:30px;color:#f5f5f7"><p style="color:#ef3641;font-size:11px;font-weight:800;letter-spacing:1.5px">SOLICITUD SIN TERMINAR</p><h1 style="font-size:24px">¿Quieres terminar tu solicitud?</h1><p style="color:#b4b4bc;line-height:1.7">Hola ${esc(lead.nombre)}, vimos que empezaste una solicitud para ${esc(lead.tipo_unidad)} por ${esc(lead.problema)}, pero no llegó a enviarse. Puedes continuarla en menos de un minuto.</p><p><a href="${link}" style="display:inline-block;background:#e52531;color:#fff;text-decoration:none;padding:13px 19px;border-radius:8px;font-weight:800">Terminar solicitud</a></p><p style="color:#8d8d96;font-size:12px">Este es un único recordatorio relacionado con la solicitud que empezaste. Si ya no lo necesitas, puedes ignorarlo.</p></td></tr></table></td></tr></table></body></html>`;
}

async function processIncompleteLeads() {
  const before = new Date(Date.now() - 4 * 3600000).toISOString();
  const after = new Date(Date.now() - 7 * 86400000).toISOString();
  const rows = await db(`tienda_leads_calculadora?origen=eq.formulario_incompleto&estado=eq.nuevo&recordatorio_incompleto_at=is.null&created_at=lte.${encodeURIComponent(before)}&created_at=gte.${encodeURIComponent(after)}&select=id,nombre,email,tipo_unidad,problema&order=created_at.asc&limit=50`) || [];
  let sent = 0;
  for (const lead of rows) {
    if (!lead.email) continue;
    const claimedAt = new Date().toISOString();
    const claimed = await db(`tienda_leads_calculadora?id=eq.${encodeURIComponent(lead.id)}&recordatorio_incompleto_at=is.null&select=id`, { method:'PATCH', headers:{Prefer:'return=representation'}, body:JSON.stringify({recordatorio_incompleto_at:claimedAt}) });
    if (!claimed || !claimed.length) continue;
    try {
      await sendEmail({ from:FROM, to:lead.email, subject:'¿Quieres terminar tu solicitud de reparación?', html:incompleteEmail(lead) });
      sent++;
    } catch (error) {
      await db(`tienda_leads_calculadora?id=eq.${encodeURIComponent(lead.id)}&recordatorio_incompleto_at=eq.${encodeURIComponent(claimedAt)}`, { method:'PATCH', headers:{Prefer:'return=minimal'}, body:JSON.stringify({recordatorio_incompleto_at:null}) });
      console.error('recordatorio solicitud incompleta:', error);
    }
  }
  return {revisados:rows.length,enviados:sent};
}

async function processRepairFollowups() {
  const now = Date.now();
  const rows = await db(`tienda_solicitudes_reparacion?presupuesto_enviado_at=not.is.null&select=id,numero,nombre,email,telefono,tipo_unidad,presupuesto_total,seguimiento_token,estado,pago_estado,presupuesto_enviado_at,presupuesto_recordatorio_24h_at,presupuesto_recordatorio_72h_at,resena_solicitada_at,updated_at&order=presupuesto_enviado_at.desc&limit=100`) || [];
  let quoteSent=0, reviewsSent=0;
  for(const s of rows){
    const age=now-new Date(s.presupuesto_enviado_at).getTime();
    if(['presupuesto_enviado','pendiente_pago'].includes(s.estado) && s.pago_estado!=='pagado'){
      let stage=null,field=null;
      if(age>=72*3600000 && !s.presupuesto_recordatorio_72h_at){stage='72h';field='presupuesto_recordatorio_72h_at';}
      else if(age>=24*3600000 && !s.presupuesto_recordatorio_24h_at){stage='24h';field='presupuesto_recordatorio_24h_at';}
      if(stage){
        try{await sendEmail({from:FROM,to:s.email,subject:`${s.numero}: tu presupuesto sigue disponible`,html:quoteEmail(s,stage)});const change={[field]:new Date().toISOString()};await db(`tienda_solicitudes_reparacion?id=eq.${encodeURIComponent(s.id)}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify(change)});quoteSent++;if(stage==='72h')await sendEmail({from:FROM,to:'info@autokeyspro.es',subject:`Seguimiento pendiente ${s.numero}`,html:`<p>El presupuesto lleva 72 horas sin pago.</p><p><a href="https://wa.me/${String(s.telefono||'').replace(/\D/g,'')}?text=${encodeURIComponent('Hola, te escribimos sobre el presupuesto '+s.numero)}">Contactar al cliente por WhatsApp</a></p>`});}catch(e){console.error('recordatorio presupuesto:',e);}
      }
    }
    if(s.estado==='finalizado' && s.pago_estado==='pagado' && !s.resena_solicitada_at && now-new Date(s.updated_at).getTime()>=24*3600000){
      try{await sendEmail({from:FROM,to:s.email,subject:`${s.numero}: ¿qué tal ha ido la reparación?`,html:reviewEmail(s)});await db(`tienda_solicitudes_reparacion?id=eq.${encodeURIComponent(s.id)}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({resena_solicitada_at:new Date().toISOString()})});reviewsSent++;}catch(e){console.error('solicitud reseña:',e);}
    }
  }
  return {presupuestos:quoteSent,resenas:reviewsSent};
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return res.status(405).json({ error: 'metodo_no_permitido' });
  if (!process.env.CRON_SECRET) return res.status(503).json({ error: 'cron_no_configurado' });
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) return res.status(401).json({ error: 'no_autorizado' });
  if (!process.env.RESEND_API_KEY || !serviceKey()) return res.status(503).json({ error: 'servicio_no_configurado' });
  if (req.method === 'HEAD') return res.status(204).end();

  const before = new Date(Date.now() - 4 * 3600000).toISOString();
  const after = new Date(Date.now() - 7 * 86400000).toISOString();
  const query = `tienda_carritos?estado=eq.activo&consentimiento_recordatorio=eq.true&recordatorio_enviado_at=is.null&ultimo_evento_at=lte.${encodeURIComponent(before)}&ultimo_evento_at=gte.${encodeURIComponent(after)}&select=id,email,items,subtotal,recovery_token&order=ultimo_evento_at.asc&limit=50`;
  try {
    const carts = (await db(query)) || [];
    let sent = 0;
    for (const cart of carts) {
      if (!cart.email || !cart.recovery_token || !Array.isArray(cart.items) || !cart.items.length) continue;
      const now = new Date().toISOString();
      const claimed = await db(`tienda_carritos?id=eq.${encodeURIComponent(cart.id)}&estado=eq.activo&recordatorio_enviado_at=is.null&select=id`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ recordatorio_enviado_at: now, updated_at: now }) });
      if (!claimed || !claimed.length) continue;
      try {
        await sendEmail({ from: FROM, to: cart.email, subject: 'Tu carrito de Autokeys sigue disponible', html: emailHtml(cart) });
        sent += 1;
      } catch (error) {
        await db(`tienda_carritos?id=eq.${encodeURIComponent(cart.id)}&recordatorio_enviado_at=eq.${encodeURIComponent(now)}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ recordatorio_enviado_at: null, updated_at: new Date().toISOString() }) });
        console.error('No se pudo enviar recordatorio:', error);
      }
    }
    const reparaciones = await processRepairFollowups();
    const solicitudesIncompletas = await processIncompleteLeads();
    res.status(200).json({ revisados: carts.length, enviados: sent, reparaciones, solicitudesIncompletas });
  } catch (error) {
    console.error('recordar-carritos error:', error);
    res.status(500).json({ error: 'error_interno' });
  }
};
