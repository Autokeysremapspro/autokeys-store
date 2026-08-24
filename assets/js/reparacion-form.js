/* Solicitud guiada de reparación física. Los datos comerciales viven en la tienda;
   solo el admin puede decidir posteriormente si crea una orden interna en el ERP. */
(function () {
  const DRAFT_KEY = 'ak_repair_request_draft_v1';
  const UNIT_TYPES = [
    ['ecu', 'ecu', 'ECU / centralita motor'], ['tcu', 'gear', 'TCU / cambio automático'],
    ['abs_esp', 'diag', 'ABS / ESP'], ['airbag_srs', 'shield', 'Airbag / SRS'],
    ['cuadro', 'chart', 'Cuadro de instrumentos'], ['uch_bcm', 'module', 'UCH / BCM / confort'],
    ['cas_ews_fem_bdc', 'key', 'CAS / EWS / FEM / BDC'], ['ezs_elv', 'lock', 'EZS / ELV'],
    ['j518_kessy', 'car', 'J518 / Kessy'], ['otro', 'box', 'Otro módulo'],
  ];
  const WORKS = {
    ecu: ['Diagnóstico / comprobación', 'Reparación', 'Clonación', 'Recuperación de datos', 'Sustitución mediante donante', 'IMMO OFF', 'Programación / adaptación', 'No lo sé, necesito asesoramiento'],
    tcu: ['Diagnóstico / comprobación', 'Reparación', 'Clonación', 'Recuperación de datos', 'Programación / adaptación', 'No lo sé, necesito asesoramiento'],
    abs_esp: ['Diagnóstico', 'Reparación electrónica', 'Clonación / sustitución', 'Codificación / adaptación', 'No lo sé, necesito asesoramiento'],
    airbag_srs: ['Borrado de crash data', 'Reparación electrónica', 'Clonación / sustitución', 'Diagnóstico', 'No lo sé, necesito asesoramiento'],
    cuadro: ['Diagnóstico', 'Reparación', 'Clonación', 'Corrección / recuperación de datos', 'No lo sé, necesito asesoramiento'],
    uch_bcm: ['Diagnóstico', 'Reparación', 'Clonación', 'Sustitución mediante donante', 'Programación / sincronización', 'No lo sé, necesito asesoramiento'],
    cas_ews_fem_bdc: ['Diagnóstico', 'Reparación', 'Clonación', 'Programación de llave', 'Sustitución / sincronización', 'No lo sé, necesito asesoramiento'],
    ezs_elv: ['Diagnóstico', 'Reparación', 'Clonación', 'Sustitución mediante donante', 'Instalación de emulador', 'No lo sé, necesito asesoramiento'],
    j518_kessy: ['Diagnóstico', 'Reparación', 'Clonación', 'Sustitución mediante donante', 'Instalación de emulador', 'No lo sé, necesito asesoramiento'],
    otro: ['Diagnóstico', 'Reparación', 'Clonación', 'Programación / adaptación', 'No lo sé, necesito asesoramiento'],
  };
  const SEND_ITEMS = ['Solo módulo original', 'Original y donante', 'Módulo y llave', 'Módulo, llave y clausor', 'Juego completo', 'Todavía no lo sé'];
  const IDS = ['trabajo','marca','modelo','anio','motor','matricula','vin','referencia','averia','arranca','manipulado','dtcs','direccion','cp','poblacion','provincia','contacto-recogida','tipo-cliente','nombre','email','telefono'];
  let step = 1;
  let selectedUnit = '';

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    renderProgress();
    document.getElementById('unit-grid').innerHTML = UNIT_TYPES.map(([id, icon, label]) =>
      '<button class="unit-card" type="button" data-unit="' + id + '">' + akIcon(icon) + '<span>' + label + '</span></button>'
    ).join('');
    document.getElementById('send-items').innerHTML = SEND_ITEMS.map((label, i) =>
      '<label><input type="checkbox" value="' + label + '"' + (i === 0 ? ' checked' : '') + '><span>' + label + '</span></label>'
    ).join('');
    restoreDraft(); wireEvents(); await loadSession(); showStep();
  }

  function wireEvents() {
    document.querySelectorAll('[data-unit]').forEach((btn) => btn.addEventListener('click', () => selectUnit(btn.dataset.unit)));
    document.getElementById('next-step').addEventListener('click', nextStep);
    document.getElementById('prev-step').addEventListener('click', () => { step--; showStep(); window.scrollTo({ top: 140, behavior: 'smooth' }); });
    document.getElementById('repair-request-form').addEventListener('submit', submitRequest);
    document.getElementById('averia').addEventListener('input', updateCount);
    document.getElementById('archivos').addEventListener('change', renderFiles);
    document.querySelectorAll('input[name="metodo_envio"]').forEach((radio) => radio.addEventListener('change', togglePickup));
    document.querySelectorAll('#repair-request-form input,#repair-request-form select,#repair-request-form textarea').forEach((el) => el.addEventListener('change', saveDraft));
    document.querySelectorAll('.method-card').forEach((card) => card.addEventListener('click', () => {
      document.querySelectorAll('.method-card').forEach((x) => x.classList.remove('active')); card.classList.add('active');
    }));
  }

  function selectUnit(id) {
    selectedUnit = id;
    document.querySelectorAll('[data-unit]').forEach((b) => b.classList.toggle('active', b.dataset.unit === id));
    const select = document.getElementById('trabajo');
    const oldValue = select.value;
    select.innerHTML = '<option value="">Selecciona una opción</option>' + WORKS[id].map((w) => '<option value="' + w + '">' + w + '</option>').join('');
    if (WORKS[id].includes(oldValue)) select.value = oldValue;
    saveDraft();
  }

  function renderProgress() {
    const names = ['Unidad', 'Vehículo', 'Avería', 'Envío', 'Confirmación'];
    document.getElementById('request-progress').innerHTML = names.map((name, i) =>
      '<div class="' + (i + 1 < step ? 'done' : i + 1 === step ? 'active' : '') + '"><span>' + (i + 1 < step ? akIcon('check') : i + 1) + '</span><b>' + name + '</b></div>'
    ).join('');
  }

  function showStep() {
    document.querySelectorAll('.request-step').forEach((s) => s.classList.toggle('active', Number(s.dataset.step) === step));
    document.getElementById('prev-step').hidden = step === 1;
    document.getElementById('next-step').hidden = step === 5;
    document.getElementById('submit-request').hidden = step !== 5;
    if (step === 5) renderSummary();
    renderProgress();
  }

  function nextStep() {
    if (!validateStep(step)) return;
    saveDraft(); step++; showStep(); window.scrollTo({ top: 140, behavior: 'smooth' });
  }

  function validateStep(n) {
    if (n === 1 && (!selectedUnit || !document.getElementById('trabajo').value)) return fail('Selecciona la unidad y el trabajo que necesitas');
    if (n === 2 && (!value('marca') || !value('modelo'))) return fail('Indica al menos la marca y el modelo del vehículo');
    if (n === 3 && value('averia').length < 20) return fail('Describe la avería con al menos 20 caracteres');
    if (n === 4) {
      if (!document.querySelectorAll('#send-items input:checked').length) return fail('Indica qué elementos tienes previsto enviar');
      if (shippingMethod() === 'recogida_autokeys' && (!value('direccion') || !value('cp') || !value('poblacion') || !value('provincia'))) return fail('Completa la dirección de recogida');
    }
    return true;
  }

  function fail(message) { akToast(message); return false; }
  function value(id) { return document.getElementById(id).value.trim(); }
  function shippingMethod() { return document.querySelector('input[name="metodo_envio"]:checked').value; }
  function togglePickup() { document.getElementById('pickup-fields').hidden = shippingMethod() !== 'recogida_autokeys'; saveDraft(); }
  function updateCount() { document.getElementById('averia-count').textContent = value('averia').length + ' / 4000 caracteres'; }

  function renderFiles() {
    const input = document.getElementById('archivos'); let files = Array.from(input.files || []);
    if (files.length > 5) { akToast('Puedes adjuntar un máximo de 5 archivos'); input.value = ''; files = []; }
    const bad = files.find((f) => f.size > 5 * 1024 * 1024);
    if (bad) { akToast(bad.name + ' supera el máximo de 5 MB'); input.value = ''; files = []; }
    document.getElementById('file-list').innerHTML = files.map((f) => '<span>' + akIcon('file') + akEscapeHtml(f.name) + '<small>' + (f.size / 1024 / 1024).toFixed(1) + ' MB</small></span>').join('');
  }

  function saveDraft() {
    const draft = { selectedUnit, fields: {}, sendItems: Array.from(document.querySelectorAll('#send-items input:checked')).map((x) => x.value), metodoEnvio: shippingMethod() };
    IDS.forEach((id) => { const el = document.getElementById(id); if (el) draft.fields[id] = el.value; });
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch (_) {}
  }

  function restoreDraft() {
    try {
      const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'); if (!draft) return;
      if (draft.selectedUnit) selectUnit(draft.selectedUnit);
      Object.entries(draft.fields || {}).forEach(([id, val]) => { const el = document.getElementById(id); if (el) el.value = val; });
      if (draft.selectedUnit && draft.fields && draft.fields.trabajo) document.getElementById('trabajo').value = draft.fields.trabajo;
      if (draft.sendItems) document.querySelectorAll('#send-items input').forEach((x) => { x.checked = draft.sendItems.includes(x.value); });
      if (draft.metodoEnvio) { const radio = document.querySelector('input[name="metodo_envio"][value="' + draft.metodoEnvio + '"]'); if (radio) { radio.checked = true; radio.closest('.method-card').click(); } }
      updateCount(); togglePickup();
    } catch (_) {}
  }

  async function loadSession() {
    const { data: { session } } = await akSupabase().auth.getSession(); const notice = document.getElementById('auth-notice');
    if (!session) { notice.hidden = false; notice.innerHTML = akIcon('user') + '<span><b>Puedes completar el formulario ahora.</b> Para enviarlo necesitarás iniciar sesión o crear una cuenta. Guardaremos el borrador.</span>'; return; }
    const { data: profile } = await akSupabase().from('tienda_clientes').select('nombre,apellidos,email,telefono,tipo_cliente,razon_social,direccion,codigo_postal,ciudad,provincia').eq('id', session.user.id).maybeSingle();
    if (profile) {
      if (!value('nombre')) document.getElementById('nombre').value = profile.razon_social || [profile.nombre, profile.apellidos].filter(Boolean).join(' ');
      if (!value('email')) document.getElementById('email').value = profile.email || session.user.email || '';
      if (!value('telefono')) document.getElementById('telefono').value = profile.telefono || '';
      document.getElementById('tipo-cliente').value = profile.tipo_cliente === 'empresa' ? 'empresa' : 'particular';
      if (!value('direccion')) document.getElementById('direccion').value = profile.direccion || '';
      if (!value('cp')) document.getElementById('cp').value = profile.codigo_postal || '';
      if (!value('poblacion')) document.getElementById('poblacion').value = profile.ciudad || '';
      if (!value('provincia')) document.getElementById('provincia').value = profile.provincia || '';
    }
  }

  function renderSummary() {
    const unitLabel = (UNIT_TYPES.find((u) => u[0] === selectedUnit) || [,'',''])[2];
    document.getElementById('request-summary').innerHTML = '<h3>Resumen de la solicitud</h3><div>' +
      '<span><small>Unidad</small><b>' + akEscapeHtml(unitLabel) + '</b></span><span><small>Trabajo</small><b>' + akEscapeHtml(value('trabajo')) + '</b></span>' +
      '<span><small>Vehículo</small><b>' + akEscapeHtml(value('marca') + ' ' + value('modelo')) + '</b></span><span><small>Envío</small><b>' + (shippingMethod() === 'cuenta_cliente' ? 'Por cuenta del cliente' : 'Solicitar recogida') + '</b></span>' +
      '</div><p>Revisaremos los datos antes de indicarte que envíes la unidad. Esta solicitud no es todavía un presupuesto ni una orden del laboratorio.</p>';
  }

  async function submitRequest(e) {
    e.preventDefault();
    if (!validateStep(4) || !document.getElementById('repair-request-form').checkValidity()) { document.getElementById('repair-request-form').reportValidity(); return; }
    const { data: { session } } = await akSupabase().auth.getSession();
    if (!session) { saveDraft(); window.location.href = 'login.html?redirect=enviar-reparacion.html'; return; }
    const btn = document.getElementById('submit-request'); btn.disabled = true; btn.textContent = 'Enviando solicitud…';
    const payload = {
      cliente_id: session.user.id, tipo_cliente: value('tipo-cliente'), nombre: value('nombre'), email: value('email'), telefono: value('telefono'), tipo_unidad: selectedUnit, trabajo_solicitado: value('trabajo'), marca: value('marca'), modelo: value('modelo'), anio: value('anio') ? Number(value('anio')) : null,
      motorizacion: value('motor') || null, matricula: value('matricula') || null, vin: value('vin') || null, referencia_modulo: value('referencia') || null, descripcion_averia: value('averia'), vehiculo_arranca: value('arranca') === '' ? null : value('arranca') === 'true', codigos_averia: value('dtcs') || null,
      manipulado_antes: value('manipulado') === 'true', elementos_envio: Array.from(document.querySelectorAll('#send-items input:checked')).map((x) => x.value), metodo_envio: shippingMethod(), direccion_recogida: shippingMethod() === 'recogida_autokeys' ? value('direccion') : null, codigo_postal: shippingMethod() === 'recogida_autokeys' ? value('cp') : null,
      poblacion: shippingMethod() === 'recogida_autokeys' ? value('poblacion') : null, provincia: shippingMethod() === 'recogida_autokeys' ? value('provincia') : null, persona_contacto_recogida: shippingMethod() === 'recogida_autokeys' ? value('contacto-recogida') || value('nombre') : null, telefono_recogida: shippingMethod() === 'recogida_autokeys' ? value('telefono') : null,
      acepta_diagnostico: document.getElementById('acepta-diagnostico').checked, acepta_condiciones: document.getElementById('acepta-condiciones').checked, acepta_privacidad: document.getElementById('acepta-privacidad').checked,
    };
    const { data: request, error } = await akSupabase().from('tienda_solicitudes_reparacion').insert(payload).select('id,numero').single();
    if (error) { btn.disabled = false; btn.innerHTML = 'Enviar solicitud' + akIcon('check'); akToast('No se pudo crear la solicitud: ' + error.message); return; }
    let uploadWarning = false;
    for (const file of Array.from(document.getElementById('archivos').files || [])) {
      const safeName = file.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9._-]/g, '-').slice(-120);
      const path = session.user.id + '/' + request.id + '/' + crypto.randomUUID() + '-' + safeName;
      const { error: upError } = await akSupabase().storage.from('solicitudes-reparacion').upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type });
      if (upError) { uploadWarning = true; continue; }
      const { error: metaError } = await akSupabase().from('tienda_solicitud_reparacion_archivos').insert({ solicitud_id: request.id, cliente_id: session.user.id, nombre: file.name, storage_path: path, mime_type: file.type, size_bytes: file.size });
      if (metaError) uploadWarning = true;
    }
    try { await fetch('/api/enviar-confirmacion-reparacion', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + session.access_token }, body: JSON.stringify({ solicitud_id: request.id }) }); } catch (_) {}
    try { localStorage.removeItem(DRAFT_KEY); } catch (_) {}
    document.getElementById('request-shell').hidden = true; const success = document.getElementById('request-success'); success.hidden = false;
    success.innerHTML = '<div class="success-icon">' + akIcon('check') + '</div><div class="eyebrow">SOLICITUD RECIBIDA</div><h2>' + request.numero + '</h2><p>Ya aparece en nuestro panel de administración. Revisaremos el caso antes de que envíes ninguna unidad.</p>' + (uploadWarning ? '<div class="request-notice warning">Algunos archivos no pudieron adjuntarse. La solicitud está creada y te pediremos las imágenes si son necesarias.</div>' : '') + '<div class="success-next"><b>¿Qué ocurre ahora?</b><span>1. Revisamos los datos.</span><span>2. Te confirmamos qué debes enviar.</span><span>3. Recibes instrucciones y dirección o propuesta de recogida.</span></div><div class="btn-row"><a class="btn btn-primary" href="cuenta.html">Ver mi cuenta</a><a class="btn btn-secondary" href="index.html">Volver al inicio</a></div>';
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }
})();
