const {sendEmail}=require('../lib/resend-server');
const SUPABASE_URL='https://pbldwfzzyofpbpojzsjg.supabase.co';
const FROM='Autokeys Remaps Pro Store <pedidos@autokeysremapspro.es>';
const clean=(v,n)=>String(v==null?'':v).trim().slice(0,n);
const esc=v=>clean(v,700).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const key=()=>process.env.SUPABASE_SERVICE_ROLE_KEY||process.env.SUPABASE_SERVICE_ROLE||'';
async function json(req){if(req.body&&typeof req.body==='object')return req.body;let raw='';for await(const c of req){raw+=c;if(raw.length>18000)throw new Error('payload_grande');}return JSON.parse(raw||'{}');}
module.exports=async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'metodo_no_permitido'});
 try{
  const d=await json(req);if(clean(d.website,100)||Date.now()-Number(d.opened_at)<1800)return res.status(400).json({error:'formulario_invalido'});
  const nombre=clean(d.nombre,120),empresa=clean(d.empresa,140),telefono=clean(d.telefono,30),email=clean(d.email,254).toLowerCase(),provincia=clean(d.provincia,80),volumen=clean(d.volumen,40),necesidad=clean(d.necesidad,600);
  if(nombre.length<2||empresa.length<2||telefono.replace(/\D/g,'').length<9||!/^\S+@\S+\.\S+$/.test(email)||provincia.length<2||necesidad.length<5||d.acepta_privacidad!==true)return res.status(400).json({error:'datos_incompletos'});
  const recent=await fetch(`${SUPABASE_URL}/rest/v1/tienda_leads_calculadora?email=eq.${encodeURIComponent(email)}&created_at=gte.${encodeURIComponent(new Date(Date.now()-3600000).toISOString())}&select=id&limit=3`,{headers:{apikey:key(),Authorization:`Bearer ${key()}`}});if(!recent.ok)throw new Error('rate_check');if((await recent.json()).length>=2)return res.status(429).json({error:'demasiadas_solicitudes'});
  const notes=`Taller: ${empresa}. Provincia: ${provincia}. Volumen mensual: ${volumen||'Por confirmar'}. Necesidad: ${necesidad}`;
  const lead={nombre,email,telefono,tipo_unidad:'otro',problema:'Colaboración profesional',marca_modelo:empresa,notas:notes,origen:'profesionales',es_taller:true,utm_source:clean(d.utm_source,120)||null,utm_medium:clean(d.utm_medium,120)||null,utm_campaign:clean(d.utm_campaign,180)||null,landing_page:'/profesionales.html',referrer_host:clean(d.referrer_host,180)||null};
  const saved=await fetch(`${SUPABASE_URL}/rest/v1/tienda_leads_calculadora`,{method:'POST',headers:{apikey:key(),Authorization:`Bearer ${key()}`,'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify(lead)});if(!saved.ok)throw new Error(`insert_${saved.status}`);const [row]=await saved.json();
  const whatsapp=`https://wa.me/${telefono.replace(/\D/g,'')}?text=${encodeURIComponent(`Hola ${nombre}, te escribimos de Autokeys sobre la colaboración con ${empresa}.`)}`;
  await Promise.allSettled([sendEmail({from:FROM,to:'info@autokeyspro.es',subject:`Nuevo taller interesado: ${empresa}`,html:`<h2>Nuevo contacto profesional</h2><p><b>${esc(empresa)}</b> · ${esc(provincia)}</p><p>${esc(nombre)} · <a href="mailto:${esc(email)}">${esc(email)}</a> · ${esc(telefono)}</p><p><b>Volumen:</b> ${esc(volumen||'Por confirmar')}<br><b>Necesidad:</b> ${esc(necesidad)}</p><p><a href="${whatsapp}">Responder por WhatsApp</a></p>`}),sendEmail({from:FROM,to:email,subject:'Hemos recibido tu solicitud profesional — Autokeys',html:`<h2>Gracias por contactar con nuestro laboratorio</h2><p>Hola ${esc(nombre)}, hemos recibido la información de ${esc(empresa)}. Revisaremos lo que necesitas y te contactaremos para explicarte el funcionamiento y resolver tus dudas.</p><p>No necesitas enviar ninguna unidad hasta que confirmemos contigo el material necesario.</p>`})]);
  return res.status(201).json({ok:true,id:row.id});
 }catch(e){console.error('lead-profesional:',e);return res.status(500).json({error:'error_interno'});}
};
