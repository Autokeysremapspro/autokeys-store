(function(){
  'use strict';
  const form=document.getElementById('professional-lead-form');
  if(!form)return;
  const status=document.getElementById('professional-lead-status');
  const openedAt=Date.now();
  form.addEventListener('submit',async function(event){
    event.preventDefault();
    if(!form.reportValidity())return;
    const button=form.querySelector('button[type="submit"]');
    const data=new FormData(form);let attribution={};
    try{attribution=JSON.parse(sessionStorage.getItem('ak_visit_attribution_v1')||'{}')||{};}catch(_){}
    button.disabled=true;button.textContent='Enviando…';status.className='pro-lead-status';status.textContent='Enviando tus datos…';
    try{
      const response=await fetch('/api/lead-profesional',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({website:data.get('website'),opened_at:openedAt,nombre:data.get('nombre'),empresa:data.get('empresa'),telefono:data.get('telefono'),email:data.get('email'),provincia:data.get('provincia'),volumen:data.get('volumen'),necesidad:data.get('necesidad'),acepta_privacidad:data.get('privacidad')==='on',utm_source:attribution.utm_source,utm_medium:attribution.utm_medium,utm_campaign:attribution.utm_campaign,referrer_host:attribution.referrer_host})});
      const result=await response.json();if(!response.ok)throw new Error(result.error||'error');
      form.reset();button.hidden=true;status.className='pro-lead-status success';status.innerHTML='<b>Solicitud recibida.</b> Revisaremos la información y te contactaremos personalmente.';
      if(typeof akTrack==='function')akTrack('professional_lead',{metadata:{label:'taller'}});
    }catch(_){button.disabled=false;button.textContent='Solicitar contacto profesional';status.className='pro-lead-status error';status.textContent='No se pudo enviar. Revisa los datos o contacta por WhatsApp.';}
  });
})();
