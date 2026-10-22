/* Subida privada para solicitudes sin cuenta. La autorización es el token de
   seguimiento aleatorio recibido únicamente al crear la solicitud. */
const { randomUUID } = require('node:crypto');
const SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';
const BUCKET = 'solicitudes-reparacion';
const MAX_BYTES = 3 * 1024 * 1024;
const MAX_FILES = 3;
const MAX_PAYLOAD = 4.2 * 1024 * 1024;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
};

function key() { return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || ''; }
function json(res,code,data) { res.setHeader('Cache-Control','no-store'); return res.status(code).json(data); }
function signature(bytes) {
  if (bytes.length < 16) return '';
  if (bytes[0]===0xff && bytes[1]===0xd8 && bytes[2]===0xff) return 'image/jpeg';
  if (bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return 'image/png';
  if (bytes.toString('ascii',0,4)==='RIFF' && bytes.toString('ascii',8,12)==='WEBP') return 'image/webp';
  if (bytes.toString('ascii',4,8)==='ftyp' && ['heic','heix','hevc','mif1'].includes(bytes.toString('ascii',8,12))) return 'image/heic';
  return '';
}

async function readBody(req) {
  if (req.body && typeof req.body==='object') return req.body;
  if (typeof req.body==='string') {
    if (req.body.length>MAX_PAYLOAD) throw new Error('archivo_grande');
    return JSON.parse(req.body);
  }
  let body='';
  for await (const part of req) {
    body+=part;
    if (body.length>MAX_PAYLOAD) throw new Error('archivo_grande');
  }
  return JSON.parse(body||'{}');
}
async function db(path,options={}) {
  const secret=key();
  const response=await fetch(`${SUPABASE_URL}/rest/v1/${path}`,{
    ...options,
    headers: {apikey:secret,Authorization:`Bearer ${secret}`,'Content-Type':'application/json',...(options.headers||{})}
  });
  if (!response.ok) throw new Error(`db_${response.status}`);
  return response.status===204?null:response.json();
}
async function removeObject(path) {
  const secret=key();
  return fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`,{
    method:'DELETE',headers:{apikey:secret,Authorization:`Bearer ${secret}`}
  });
}
async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  if(req.method!=='POST') return json(res,405,{error:'metodo_no_permitido'});
  try {
    if(!key()) throw new Error('configuracion');
    if(Number(req.headers?.['content-length']||0)>MAX_PAYLOAD) return json(res,413,{error:'archivo_grande'});
    const d=await readBody(req);
    const id=String(d.solicitud_id||''),token=String(d.seguimiento_token||'');
    if(!UUID.test(id)||!UUID.test(token)) return json(res,400,{error:'solicitud_invalida'});
    const declared=String(d.mime_type||'').toLowerCase();
    if(!TYPES[declared]) return json(res,415,{error:'tipo_no_admitido'});
    const encoded=String(d.base64||'');
    if(encoded.length<20||encoded.length>MAX_PAYLOAD||!(/^[A-Za-z0-9+/]+={0,2}$/.test(encoded))) return json(res,413,{error:'archivo_grande'});
    const bytes=Buffer.from(encoded,'base64');
    if(bytes.length===0||bytes.length>MAX_BYTES) return json(res,413,{error:'archivo_grande'});
    if(signature(bytes)!==declared) return json(res,415,{error:'formato_no_valido'});
    const rows=await db(`tienda_solicitudes_reparacion?id=eq.${id}&seguimiento_token=eq.${token}&select=id,cliente_id,estado,created_at&limit=1`);
    const solicitud=rows[0];
    if(!solicitud||solicitud.cliente_id!==null||solicitud.estado!=='pendiente_revision') return json(res,403,{error:'solicitud_no_permitida'});
    if(Date.now()-Date.parse(solicitud.created_at)>24*3600000 || Date.parse(solicitud.created_at)>Date.now()) return json(res,403,{error:'plazo_adjuntos_terminado'});
    const stored=await db(`tienda_solicitud_reparacion_archivos?solicitud_id=eq.${id}&select=id&limit=${MAX_FILES}`);
    if(stored.length>=MAX_FILES) return json(res,429,{error:'limite_adjuntos'});
    const filename=String(d.nombre||'').replace(/[^a-zA-Z0-9._-]/g,'_').slice(0,90) || 'foto';
    const storagePath=`invitado/${id}/${randomUUID()}.${TYPES[declared]}`;
    const secret=key();
    const uploaded=await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${storagePath}`,{
      method:'POST',headers:{apikey:secret,Authorization:`Bearer ${secret}`,'Content-Type':declared,'Cache-Control':'no-store','x-upsert':'false'},body:bytes
    });
    if(!uploaded.ok) throw new Error(`storage_${uploaded.status}`);
    try {
      await db('tienda_solicitud_reparacion_archivos?select=id',{
        method:'POST',headers:{Prefer:'return=representation'},
        body:JSON.stringify({solicitud_id:id,cliente_id:null,nombre:filename,storage_path:storagePath,mime_type:declared,size_bytes:bytes.length})
      });
    } catch(error) {
      await removeObject(storagePath).catch(()=>{});
      throw error;
    }
    return json(res,201,{ok:true,nombre:filename});
  } catch(error) {
    if(error.message==='archivo_grande') return json(res,413,{error:'archivo_grande'});
    console.error('adjuntar-foto-solicitud:',error.message);
    return json(res,500,{error:'error_interno'});
  }
}
module.exports=handler;
module.exports._test={signature,MAX_BYTES,MAX_FILES,TYPES};
