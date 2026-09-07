(function () {
  'use strict';
  let client;
  let session;
  let requests = [];

  function card(s) {
    return '<article class="portal-card" data-id="' + s.id + '" style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap"><div><div class="eyebrow">' + akEscapeHtml(s.numero) + '</div><h2 style="margin:7px 0">' + akEscapeHtml(s.marca + ' ' + s.modelo) + '</h2><p style="color:var(--muted);margin:0">' + akEscapeHtml(s.nombre) + ' · ' + akEscapeHtml(s.tipo_unidad) + ' · ' + akEscapeHtml(s.trabajo_solicitado) + '</p></div><span class="status-pill info">' + akEscapeHtml(s.estado) + '</span></div><div class="request-form-grid" style="margin-top:20px"><div class="field"><label>IMPORTE TOTAL (IVA INCLUIDO)</label><input data-field="presupuesto_total" type="number" min="0.01" step="0.01" value="' + (s.presupuesto_total || '') + '" placeholder="0,00"></div><div class="field"><label>PLAZO ESTIMADO</label><input data-field="plazo_estimado" maxlength="120" value="' + akEscapeHtml(s.plazo_estimado || '') + '" placeholder="Ej.: 3–5 días laborables"></div><div class="field full"><label>TRABAJOS INCLUIDOS</label><textarea data-field="presupuesto_detalle" maxlength="4000" rows="4" placeholder="Describe de forma clara qué incluye el presupuesto">' + akEscapeHtml(s.presupuesto_detalle || '') + '</textarea></div></div><div class="btn-row" style="margin-top:16px"><button class="btn btn-primary" data-action="save">Guardar y avisar al cliente</button><a class="btn btn-secondary" target="_blank" rel="noopener" href="mailto:' + encodeURIComponent(s.email) + '">Escribir email</a></div></article>';
  }

  function render() {
    const root = document.getElementById('staff-root');
    root.className = '';
    root.innerHTML = requests.length ? requests.map(card).join('') : '<div class="portal-card empty-state">' + akIcon('check') + '<h2>No hay solicitudes pendientes</h2><p>Las nuevas solicitudes aparecerán aquí.</p></div>';
  }

  async function save(button) {
    const cardEl = button.closest('[data-id]');
    const id = cardEl.dataset.id;
    const total = Number(cardEl.querySelector('[data-field="presupuesto_total"]').value);
    const plazo = cardEl.querySelector('[data-field="plazo_estimado"]').value.trim();
    const detalle = cardEl.querySelector('[data-field="presupuesto_detalle"]').value.trim();
    if (!Number.isFinite(total) || total <= 0 || detalle.length < 10) return akToast('Indica un importe y una descripción clara del trabajo.');
    button.disabled = true; button.textContent = 'Guardando…';
    const { error } = await client.from('tienda_solicitudes_reparacion').update({ presupuesto_total: total, plazo_estimado: plazo || null, presupuesto_detalle: detalle, estado: 'presupuesto_enviado', pago_estado: 'pendiente' }).eq('id', id);
    if (error) { button.disabled = false; button.textContent = 'Guardar y avisar al cliente'; return akToast('No se pudo guardar el presupuesto.'); }
    const response = await fetch('/api/notificar-presupuesto-reparacion', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + session.access_token }, body: JSON.stringify({ solicitud_id: id }) });
    button.disabled = false;
    button.textContent = response.ok ? 'Presupuesto enviado ✓' : 'Guardado; reenviar aviso';
    akToast(response.ok ? 'Presupuesto guardado y cliente avisado.' : 'Presupuesto guardado, pero el email no se pudo enviar.');
  }

  document.addEventListener('DOMContentLoaded', async () => {
    client = akSupabase();
    session = (await client.auth.getSession()).data.session;
    if (!session) return location.replace('login.html?redirect=presupuestos-reparacion.html');
    const { data: allowed } = await client.rpc('is_staff');
    if (!allowed) {
      document.getElementById('staff-root').innerHTML = '<div class="portal-card empty-state"><h2>Acceso restringido</h2><p>Esta pantalla es solo para el equipo de Autokeys.</p></div>';
      return;
    }
    const { data, error } = await client.from('tienda_solicitudes_reparacion').select('id,numero,nombre,email,tipo_unidad,trabajo_solicitado,marca,modelo,estado,presupuesto_total,presupuesto_detalle,plazo_estimado,pago_estado,created_at').not('estado', 'in', '(finalizado,cancelado,no_reparable)').order('created_at', { ascending: false }).limit(100);
    if (error) return akToast('No se pudieron cargar las solicitudes.');
    requests = data || [];
    render();
    document.getElementById('staff-root').addEventListener('click', (event) => { const button = event.target.closest('[data-action="save"]'); if (button) save(button); });
  });
})();
