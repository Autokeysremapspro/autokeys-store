/* Medición propia y respetuosa: no guarda IP, user-agent ni datos personales anónimos. */
(function () {
  const KEY = 'ak_conversion_session_v1';
  const REMINDER_KEY = 'ak_cart_reminder_consent_v1';
  function sessionId() {
    let id = localStorage.getItem(KEY);
    if (!/^[0-9a-f-]{36}$/i.test(id || '')) { id = crypto.randomUUID(); localStorage.setItem(KEY, id); }
    return id;
  }
  async function token() {
    try { const result = await akSupabase().auth.getSession(); return result.data.session && result.data.session.access_token; } catch (_) { return null; }
  }
  function reminderConsent() {
    return localStorage.getItem(REMINDER_KEY) === '1';
  }
  window.akCartReminderConsent = reminderConsent;
  window.akSetCartReminderConsent = function (value) {
    if (value) localStorage.setItem(REMINDER_KEY, '1');
    else localStorage.removeItem(REMINDER_KEY);
  };
  function cartSnapshot(consent) {
    if (typeof akCartGet !== 'function') return null;
    if (typeof consent === 'boolean') window.akSetCartReminderConsent(consent);
    return { items: akCartGet(), subtotal: typeof akCartSubtotal === 'function' ? akCartSubtotal() : 0, consentimiento_recordatorio: reminderConsent() };
  }
  window.akTrack = async function (evento, details) {
    details = details || {};
    const accessToken = await token();
    const payload = {
      session_id: sessionId(), evento, pagina: location.pathname + location.search,
      producto_id: details.producto_id || null, variante_id: details.variante_id || null,
      valor: details.valor == null ? null : details.valor,
      carrito: details.carrito === false ? null : cartSnapshot(details.consentimiento_recordatorio),
      pedido_id: details.pedido_id || null,
    };
    fetch('/api/conversion', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) }, body: JSON.stringify(payload), keepalive: true }).catch(() => {});
  };

  function trackCommercialClick(event) {
    const link = event.target && event.target.closest ? event.target.closest('a[href]') : null;
    if (!link) return;
    const href = String(link.getAttribute('href') || '').trim();
    if (/^https?:\/\/(?:wa\.me|api\.whatsapp\.com)(?:\/|$)/i.test(href)) {
      window.akTrack('whatsapp_click', { carrito: false });
      return;
    }
    if (/^tel:/i.test(href)) {
      window.akTrack('phone_click', { carrito: false });
      return;
    }
    if (/(?:^|\/)enviar-reparacion\.html(?:[?#]|$)/i.test(href)) {
      window.akTrack('repair_cta_click', { carrito: false });
    }
  }

  document.addEventListener('click', trackCommercialClick, true);
  const init = () => window.akTrack('page_view', { carrito: false });
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
}());