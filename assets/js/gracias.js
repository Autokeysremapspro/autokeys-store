(function () {
  const STORAGE_KEY = 'ak_ultima_confirmacion';

  function escape(value) {
    return typeof akEscapeHtml === 'function'
      ? akEscapeHtml(String(value || ''))
      : String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }

  document.addEventListener('DOMContentLoaded', () => {
    let data = null;
    try { data = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null'); } catch (_) {}
    if (!data || !data.tipo) return;

    const content = document.getElementById('thanks-content');
    const reference = data.numero ? '<h1>' + escape(data.numero) + '</h1>' : '<h1>Gracias. Ya tenemos tus datos.</h1>';
    const emailText = data.emailEnviado ? ' También hemos enviado la confirmación a tu email.' : '';
    const portalButton = data.portalHref
      ? '<a class="btn btn-primary" href="' + escape(data.portalHref) + '">Ver mi solicitud</a>'
      : '';
    const whatsappText = data.numero
      ? 'Hola, acabo de enviar la solicitud ' + data.numero
      : 'Hola, acabo de enviar una solicitud desde la web';

    let message = 'Revisaremos la información y contactaremos contigo para concretar el caso.';
    let steps = '<span>1. Revisamos los datos enviados.</span><span>2. Te contactamos por teléfono o email.</span><span>3. Confirmamos el siguiente paso.</span>';
    if (data.tipo === 'cita') {
      message = 'Tu solicitud de cita ya aparece en nuestro panel.' + emailText + ' Te contactaremos para confirmar el día y la hora exactos.';
      steps = '<span>1. Revisamos tu disponibilidad y la nuestra.</span><span>2. Te confirmamos día y hora.</span><span>3. Te esperamos en el taller el día acordado.</span>';
    } else if (data.tipo === 'reparacion') {
      message = 'Tu solicitud ya aparece en nuestro panel.' + emailText + ' No envíes la unidad hasta recibir nuestras indicaciones.';
      steps = '<span>1. Revisamos los datos y archivos.</span><span>2. Te confirmamos qué debes enviar.</span><span>3. Podrás consultar el estado y el presupuesto.</span>';
      if (data.uploadWarning) message += ' Algún archivo no pudo adjuntarse; te lo pediremos si es necesario.';
    } else if (data.tipo === 'calculadora') {
      message = 'Hemos recibido tu consulta. Te contactaremos para concretar el caso y confirmar el siguiente paso.';
      steps = '<span>1. Revisamos el tipo de unidad y la avería.</span><span>2. Te pedimos la referencia o diagnosis si hace falta.</span><span>3. Confirmamos qué necesitamos para valorarlo.</span>';
    }

    content.innerHTML = '<div class="success-icon">' + akIcon('check') + '</div><div class="eyebrow">SOLICITUD RECIBIDA</div>' + reference + '<p>' + message + '</p><div class="success-next"><b>¿Qué ocurre ahora?</b>' + steps + '</div><div class="btn-row">' + portalButton + '<a class="btn btn-secondary" href="https://wa.me/34632982646?text=' + encodeURIComponent(whatsappText) + '" target="_blank" rel="noopener">WhatsApp</a><a class="btn btn-secondary" href="/">Volver al inicio</a></div>';

    const trackedKey = 'ak_gracias_medido_' + (data.numero || data.tipo);
    let attempts = 0;
    const measureConversion = () => {
      if (sessionStorage.getItem(trackedKey)) return;
      if (typeof akTrack !== 'function' && typeof fbq !== 'function' && typeof gtag !== 'function' && attempts++ < 20) {
        window.setTimeout(measureConversion, 250);
        return;
      }
      if (typeof akTrack === 'function') akTrack('thank_you_view', { carrito: false, metadata: { label: data.tipo, referencia: data.numero || null } });
      if (typeof fbq === 'function') fbq('track', 'Lead', { content_name: data.tipo });
      if (typeof gtag === 'function') gtag('event', 'generate_lead', { lead_type: data.tipo });
      sessionStorage.setItem(trackedKey, '1');
    };
    measureConversion();
  });
})();
