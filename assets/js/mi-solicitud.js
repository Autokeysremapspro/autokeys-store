(function () {
  'use strict';

  const STORAGE_KEY = 'ak_repair_portal_token';
  const STATES = {
    pendiente_revision: ['Solicitud recibida', 0],
    informacion_solicitada: ['Necesitamos información', 0],
    aceptada_pendiente_envio: ['Lista para enviar', 1],
    recogida_solicitada: ['Recogida solicitada', 1],
    en_transito_entrada: ['En camino al laboratorio', 1],
    unidad_recibida: ['Unidad recibida', 2],
    en_diagnostico: ['En diagnóstico', 2],
    presupuesto_enviado: ['Presupuesto disponible', 3],
    pendiente_pago: ['Presupuesto aceptado', 3],
    presupuesto_aceptado: ['Presupuesto aceptado y pagado', 4],
    en_reparacion: ['En reparación', 4],
    pruebas_finales: ['Pruebas finales', 4],
    preparando_devolucion: ['Preparando devolución', 5],
    enviado_cliente: ['Enviado al cliente', 5],
    finalizado: ['Finalizada', 6],
    no_reparable: ['No reparable', 6],
    cancelado: ['Cancelada', 6],
  };
  const STEPS = ['Solicitud', 'Envío', 'Diagnóstico', 'Presupuesto', 'Reparación', 'Devolución'];
  let token = '';
  let current = null;

  function readToken() {
    const hash = new URLSearchParams(location.hash.replace(/^#/, ''));
    const fromUrl = hash.get('token') || '';
    if (fromUrl) {
      try { sessionStorage.setItem(STORAGE_KEY, fromUrl); } catch (_) {}
      history.replaceState(null, '', location.pathname + location.search);
      return fromUrl;
    }
    try { return sessionStorage.getItem(STORAGE_KEY) || ''; } catch (_) { return ''; }
  }

  async function call(action) {
    const response = await fetch('/api/portal-solicitud', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, token }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'error_interno');
    return data;
  }

  function money(value) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(Number(value));
  }

  function date(value) {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function timeline(state) {
    const index = (STATES[state] || ['', 0])[1];
    return '<div class="repair-timeline">' + STEPS.map((label, i) => {
      const cls = i < index ? 'done' : i === Math.min(index, STEPS.length - 1) ? 'current' : '';
      return '<div class="' + cls + '"><i>' + (i < index ? '✓' : i + 1) + '</i><span><b>' + label + '</b><small>' + (i < index ? 'Completado' : i === index ? 'Estado actual' : 'Pendiente') + '</small></span></div>';
    }).join('') + '</div>';
  }

  function quoteCard(s) {
    const hasQuote = Number(s.presupuesto_total) > 0 && ['presupuesto_enviado', 'pendiente_pago', 'presupuesto_aceptado', 'en_reparacion', 'pruebas_finales', 'preparando_devolucion', 'enviado_cliente', 'finalizado'].includes(s.estado);
    if (!hasQuote) return '<div class="portal-card"><h3>Presupuesto</h3><p class="portal-copy">Todavía no hay un presupuesto disponible. Te avisaremos por email cuando terminemos la valoración.</p><div class="portal-alert">No realices ningún pago hasta recibir el presupuesto en este portal.</div></div>';
    const paid = s.pago_estado === 'pagado';
    const accepted = !!s.presupuesto_aceptado_at;
    const lines = Array.isArray(s.presupuesto_lineas) ? s.presupuesto_lineas : [];
    const breakdown = lines.length ? '<div class="portal-quote-lines">' + lines.map((line) => '<div><span><b>' + akEscapeHtml(line.concepto || '') + '</b><small>' + Number(line.cantidad || 1) + ' × ' + money(line.precio_unitario || 0) + '</small></span><strong>' + money(line.total || Number(line.cantidad || 1) * Number(line.precio_unitario || 0)) + '</strong></div>').join('') + '</div>' : '';
    const validDays = Number(s.presupuesto_validez_dias || 15);
    const sentAt = s.presupuesto_enviado_at ? new Date(s.presupuesto_enviado_at) : null;
    const validUntil = sentAt ? new Date(sentAt.getTime() + validDays * 86400000) : null;
    return '<div class="portal-card"><div class="eyebrow">PRESUPUESTO</div><div class="portal-price">' + money(s.presupuesto_total) + ' <small>IVA incluido</small></div>' +
      (s.plazo_estimado ? '<p><b>Plazo estimado:</b> ' + akEscapeHtml(s.plazo_estimado) + '</p>' : '') +
      (validUntil ? '<p><b>Presupuesto válido hasta:</b> ' + date(validUntil) + '</p>' : '<p><b>Validez:</b> ' + validDays + ' días desde el envío</p>') +
      breakdown + '<p class="portal-copy">' + akEscapeHtml(s.presupuesto_observaciones || s.presupuesto_detalle || 'Trabajo indicado en la valoración técnica de la solicitud.') + '</p>' +
      '<div class="portal-alert"><b>Garantía y disponibilidad.</b> La garantía se aplica al trabajo indicado. El plazo comienza cuando recibimos lo necesario y puede variar si aparece un daño adicional; te avisaremos antes.</div>' +
      (paid ? '<div class="portal-alert ok"><b>Pago confirmado.</b> Ya podemos continuar con el trabajo.</div>' : accepted ? '<div class="portal-alert">Presupuesto aceptado. El pago todavía no está confirmado.</div>' : '<label class="request-consents"><span><input id="quote-consent" type="checkbox"> He revisado el trabajo, el importe y el plazo; acepto este presupuesto.</span></label>') +
      (!paid ? '<div class="portal-actions"><button id="pay-quote" class="btn btn-primary"' + (!accepted ? ' disabled' : '') + '>' + (accepted ? 'Reintentar pago seguro' : 'Aceptar y pagar con SumUp') + '</button><small style="color:var(--muted)">El pago se completa en la página segura de SumUp.</small></div>' : '') + '</div>';
  }

  function render(s) {
    current = s;
    const state = STATES[s.estado] || [s.estado || 'En revisión', 0];
    document.title = s.numero + ' — Mi solicitud de reparación';
    document.getElementById('portal-root').className = '';
    document.getElementById('portal-root').innerHTML =
      '<div class="portal-head"><div><div class="eyebrow">SEGUIMIENTO PRIVADO</div><h1>' + akEscapeHtml(s.numero) + '</h1><p>Solicitud creada el ' + date(s.created_at) + '</p></div><span class="status-pill info">' + akEscapeHtml(state[0]) + '</span></div>' +
      '<div class="portal-grid"><div><div class="portal-card"><h2>' + akEscapeHtml(s.marca + ' ' + s.modelo) + '</h2><div class="portal-summary"><div><small>Unidad</small><b>' + akEscapeHtml(s.tipo_unidad) + '</b></div><div><small>Trabajo solicitado</small><b>' + akEscapeHtml(s.trabajo_solicitado) + '</b></div><div><small>Motorización</small><b>' + akEscapeHtml(s.motorizacion || 'No indicada') + '</b></div><div><small>Última actualización</small><b>' + date(s.updated_at) + '</b></div></div>' + timeline(s.estado) + '</div></div><aside>' + quoteCard(s) + '<div class="portal-card" style="margin-top:18px"><h3>¿Necesitas ayuda?</h3><p class="portal-copy">Indica siempre la referencia <b>' + akEscapeHtml(s.numero) + '</b>.</p><div class="portal-actions"><a class="btn btn-secondary" target="_blank" rel="noopener" href="https://wa.me/34632982646?text=' + encodeURIComponent('Hola, necesito ayuda con la solicitud ' + s.numero) + '">Contactar por WhatsApp</a></div></div></aside></div>';

    const consent = document.getElementById('quote-consent');
    const pay = document.getElementById('pay-quote');
    if (consent && pay) consent.addEventListener('change', () => { pay.disabled = !consent.checked; });
    if (pay) pay.addEventListener('click', startPayment);
  }

  async function startPayment() {
    const button = document.getElementById('pay-quote');
    button.disabled = true;
    button.textContent = 'Abriendo pago seguro…';
    try {
      const data = await call('aceptar_y_pagar');
      location.assign(data.hosted_checkout_url);
    } catch (error) {
      button.disabled = false;
      button.textContent = current && current.presupuesto_aceptado_at ? 'Reintentar pago seguro' : 'Aceptar y pagar con SumUp';
      akToast(error.message === 'pagos_no_configurados' ? 'El pago online no está disponible ahora. Contacta con nosotros.' : 'No se pudo abrir el pago. Inténtalo de nuevo.');
    }
  }

  function renderError() {
    document.getElementById('portal-root').className = 'portal-card';
    document.getElementById('portal-root').innerHTML = '<div class="empty-state">' + akIcon('shield') + '<h2>El enlace no es válido</h2><p>Abre el enlace completo que recibiste por email. Si sigue sin funcionar, te ayudamos por WhatsApp.</p><a class="btn btn-primary" target="_blank" rel="noopener" href="https://wa.me/34632982646">Pedir ayuda</a></div>';
  }

  document.addEventListener('DOMContentLoaded', async () => {
    token = readToken();
    if (!token) return renderError();
    try {
      const returned = new URLSearchParams(location.search).get('pago') === 'retorno';
      const data = await call(returned ? 'confirmar_pago' : 'consultar');
      render(data.solicitud);
      if (returned) history.replaceState(null, '', location.pathname);
    } catch (_) {
      renderError();
    }
  });
})();
