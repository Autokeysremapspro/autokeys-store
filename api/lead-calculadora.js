const { sendEmail } = require('../lib/resend-server');
const SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';
const FROM = 'Autokeys Remaps Pro Store <pedidos@autokeysremapspro.es>';
const UNITS = new Set(['ecu','tcu','abs_esp','airbag_srs','cuadro','uch_bcm','cas_ews_fem_bdc','ezs_elv','j518_kessy','otro']);
const clean = (v, n) => String(v == null ? '' : v).trim().slice(0, n);
const esc = (v) => clean(v, 500).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function key(){ return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || ''; }
async function json(req){ if(req.body && typeof req.body === 'object') return req.body; let raw=''; for await(const c of req){raw+=c;if(raw.length>15000)throw new Error('payload_grande');} return JSON.parse(raw||'{}'); }
module.exports=async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'metodo_no_permitido'});
  try{
    const d=await json(req); if(clean(d.website,100) || Date.now()-Number(d.opened_at)<1800) return res.status(400).json({error:'formulario_invalido'});
    const nombre=clean(d.nombre,120), email=clean(d.email,254).toLowerCase(), telefono=clean(d.telefono,30), unidad=clean(d.tipo_unidad,80), problema=clean(d.problema,160);
    if(nombre.length<2 || !/^\S+@\S+\.\S+$/.test(email) || telefono.replace(/\D/g,'').length<9 || !UNITS.has(unidad) || problema.length<3 || d.acepta_privacidad!==true) return res.status(400).json({error:'datos_incompletos'});
    const recent=await fetch(`${SUPABASE_URL}/rest/v1/tienda_leads_calculadora?email=eq.${encodeURIComponent(email)}&created_at=gte.${encodeURIComponent(new Date(Date.now()-3600000).toISOString())}&select=id&limit=3`,{headers:{apikey:key(),Authorization:`Bearer ${key()}`}});
    if(!recent.ok) throw new Error('rate_check'); if((await recent.json()).length>=2) return res.status(429).json({error:'demasiadas_solicitudes'});
    const lead={nombre,email,telefono,tipo_unidad:unidad,problema,marca_modelo:clean(d.marca_modelo,180)||null,utm_source:clean(d.utm_source,120)||null,utm_medium:clean(d.utm_medium,120)||null,utm_campaign:clean(d.utm_campaign,180)||null,landing_page:clean(d.landing_page,500)||null,referrer_host:clean(d.referrer_host,180)||null};
    const saved=await fetch(`${SUPABASE_URL}/rest/v1/tienda_leads_calculadora`,{method:'POST',headers:{apikey:key(),Authorization:`Bearer ${key()}`,'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify(lead)});
    if(!saved.ok) throw new Error(`insert_${saved.status}`); const [row]=await saved.json();
    const form=`https://www.autokeysremapspro.es/enviar-reparacion.html?unidad=${encodeURIComponent(unidad)}&trabajo=${encodeURIComponent(problema)}`;
    const html=`<h2>Nueva valoración rápida</h2><p><b>${esc(nombre)}</b> · <a href="mailto:${esc(email)}">${esc(email)}</a> · ${esc(telefono)}</p><p><b>Vehículo:</b> ${esc(lead.marca_modelo||'No indicado')}<br><b>Unidad:</b> ${esc(unidad)}<br><b>Necesidad:</b> ${esc(problema)}</p><p><a href="https://wa.me/${telefono.replace(/\D/g,'')}">Responder por WhatsApp</a></p>`;
    await Promise.allSettled([sendEmail({from:FROM,to:'info@autokeyspro.es',subject:`Nueva valoración rápida: ${lead.marca_modelo||unidad}`,html}),sendEmail({from:FROM,to:email,subject:'Hemos recibido tu consulta — Autokeys',html:`<h2>Ya tenemos tus datos</h2><p>Hola ${esc(nombre)}, revisaremos tu caso y te contactaremos para concretar viabilidad, precio y plazo.</p><p>Si quieres acelerar la valoración, completa los datos técnicos:</p><p><a href="${form}">Completar mi solicitud</a></p>`})]);
    return res.status(201).json({ok:true,id:row.id,continuar:form});
  }catch(e){console.error('lead-calculadora:',e);return res.status(500).json({error:'error_interno'});}
};
