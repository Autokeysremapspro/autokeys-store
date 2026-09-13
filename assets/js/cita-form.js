/* Solicitud de cita presencial. No reserva un hueco real: el equipo confirma
   día y hora por teléfono o email antes de que el cliente venga al taller. */
(function () {
  const DRAFT_KEY = 'ak_cita_draft_v1';
  const SERVICIOS = [
    ['duplicado_llave', 'key', 'Duplicado de llave'],
    ['reprogramacion', 'programmer', 'Reprogramación'],
    ['reparacion_modulo', 'module', 'Reparación de módulo'],
    ['otro', 'box', 'Otro'],
  ];
  const IDS = ['marca', 'modelo', 'anio', 'matricula', 'descripcion', 'fecha', 'franja', 'tipo-cliente', 'nombre', 'email', 'telefono'];
  let selectedServicio = '';
  const openedAt = Date.now();
  let citaTrackedStart = false;
  function trackCitaStart() {
    if (citaTrackedStart) return;
    citaTrackedStart = true;
    if (typeof akTrack === 'function') akTrack('cita_form_start', { carrito: false });
  }

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    document.getElementById('servicio-grid').innerHTML = SERVICIOS.map(([id, icon, label]) =>
      '<button class="unit-card" type="button" data-servicio="' + id + '">' + akIcon(icon) + '<span>' + label + '</span></button>'
    ).join('');
    document.getElementById('fecha').min = new Date().toISOString().slice(0, 10);
    restoreDraft();
    wireEvents();
    applyUrlIntent();
    await loadSession();
  }

  function applyUrlIntent() {
    const params = new URLSearchParams(window.location.search);
    const requestedServicio = params.get('servicio');
    if (requestedServicio && SERVICIOS.some((s) => s[0] === requestedServicio)) selectServicio(requestedServicio);
    saveDraft();
  }

  function wireEvents() {
    document.querySelectorAll('[data-servicio]').forEach((btn) => btn.addEventListener('click', () => selectServicio(btn.dataset.servicio)));
    document.getElementById('cita-form').addEventListener('submit', submitCita);
    document.querySelectorAll('#cita-form input,#cita-form select,#cita-form textarea').forEach((el) => el.addEventListener('change', saveDraft));
  }

  function selectServicio(id) {
    selectedServicio = id;
    document.querySelectorAll('[data-servicio]').forEach((b) => b.classList.toggle('active', b.dataset.servicio === id));
    trackCitaStart();
    saveDraft();
  }

  function fail(message) { akToast(message); return false; }
  function value(id) { return document.getElementById(id).value.trim(); }

  function validate() {
    if (!selectedServicio) return fail('Elige qué servicio necesitas');
    if (!value('marca') || !value('modelo')) return fail('Indica al menos la marca y el modelo del vehículo');
    if (!value('fecha')) return fail('Elige una fecha preferida');
    return true;
  }

  function saveDraft() {
    const draft = { selectedServicio, fields: {} };
    IDS.forEach((id) => { const el = document.getElementById(id); if (el) draft.fields[id] = el.value; });
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch (_) {}
  }

  function restoreDraft() {
    try {
      const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'); if (!draft) return;
      if (draft.selectedServicio) selectServicio(draft.selectedServicio);
      Object.entries(draft.fields || {}).forEach(([id, val]) => { const el = document.getElementById(id); if (el) el.value = val; });
    } catch (_) {}
  }

  async function loadSession() {
    const { data: { session } } = await akSupabase().auth.getSession();
    const notice = document.getElementById('auth-notice');
    if (!session) {
      notice.hidden = false;
      notice.innerHTML = akIcon('check') + '<span><b>No necesitas crear una cuenta.</b> Enviaremos la confirmación de la cita a tu email. Si ya tienes cuenta, puedes iniciar sesión para asociarla a tu historial.</span>';
      return;
    }
    const { data: profile } = await akSupabase().from('tienda_clientes').select('nombre,apellidos,email,telefono,tipo_cliente,razon_social').eq('id', session.user.id).maybeSingle();
    if (profile) {
      if (!value('nombre')) document.getElementById('nombre').value = profile.razon_social || [profile.nombre, profile.apellidos].filter(Boolean).join(' ');
      if (!value('email')) document.getElementById('email').value = profile.email || session.user.email || '';
      if (!value('telefono')) document.getElementById('telefono').value = profile.telefono || '';
      document.getElementById('tipo-cliente').value = profile.tipo_cliente === 'empresa' ? 'empresa' : 'particular';
    }
  }

  async function submitCita(e) {
    e.preventDefault();
    if (!validate() || !document.getElementById('cita-form').checkValidity()) { document.getElementById('cita-form').reportValidity(); return; }
    let session = null;
    try { session = (await akSupabase().auth.getSession()).data.session; } catch (_) {}
    const btn = document.getElementById('submit-cita'); btn.disabled = true; btn.textContent = 'Enviando solicitud…';
    const payload = {
      website: value('website'), opened_at: openedAt, tipo_servicio: selectedServicio, descripcion: value('descripcion') || null,
      marca: value('marca'), modelo: value('modelo'), anio: value('anio') ? Number(value('anio')) : null, matricula: value('matricula') || null,
      fecha_preferida: value('fecha'), franja_horaria: value('franja') || 'cualquiera',
      tipo_cliente: value('tipo-cliente'), nombre: value('nombre'), email: value('email'), telefono: value('telefono'),
      acepta_condiciones: document.getElementById('acepta-condiciones').checked, acepta_privacidad: document.getElementById('acepta-privacidad').checked,
    };
    let response;
    try {
      response = await fetch('/api/solicitud-cita', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(session ? { Authorization: 'Bearer ' + session.access_token } : {}) },
        body: JSON.stringify(payload),
      });
    } catch (_) {
      btn.disabled = false; btn.innerHTML = 'Solicitar cita' + akIcon('check'); akToast('No se pudo conectar. Tu borrador sigue guardado.'); return;
    }
    const cita = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = response.status === 429 ? 'Ya hemos recibido varias solicitudes con este email. Escríbenos por WhatsApp si necesitas añadir información.' : 'No se pudo crear la solicitud. Revisa los datos o inténtalo de nuevo.';
      btn.disabled = false; btn.innerHTML = 'Solicitar cita' + akIcon('check'); akToast(message); return;
    }
    if (typeof akTrack === 'function') akTrack('cita_request', { carrito: false, metadata: { label: selectedServicio } });
    try { localStorage.removeItem(DRAFT_KEY); } catch (_) {}
    document.getElementById('request-shell').hidden = true;
    const success = document.getElementById('cita-success'); success.hidden = false;
    success.innerHTML = '<div class="success-icon">' + akIcon('check') + '</div><div class="eyebrow">SOLICITUD RECIBIDA</div><h2>' + cita.numero + '</h2><p>Ya aparece en nuestro panel. ' + (cita.email_enviado ? 'También hemos enviado la confirmación a tu email. ' : '') + 'Te llamaremos o escribiremos para confirmar el día y la hora exactos.</p><div class="success-next"><b>¿Qué ocurre ahora?</b><span>1. Revisamos tu disponibilidad y la nuestra.</span><span>2. Te confirmamos día y hora por teléfono o email.</span><span>3. Te esperamos en el taller ese día.</span></div><div class="btn-row"><a class="btn btn-secondary" href="https://wa.me/34632982646?text=' + encodeURIComponent('Hola, acabo de solicitar la cita ' + cita.numero) + '" target="_blank" rel="noopener">WhatsApp</a><a class="btn btn-secondary" href="index.html">Volver al inicio</a></div>';
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }
})();
