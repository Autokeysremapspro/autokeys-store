/* Medición propia y respetuosa: no guarda IP, user-agent ni datos personales anónimos. */
(function () {
  const KEY = 'ak_conversion_session_v1';
  function sessionId() {
    let id = localStorage.getItem(KEY);
    if (!/^[0-9a-f-]{36}$/i.test(id || '')) { id = crypto.randomUUID(); localStorage.setItem(KEY, id); }
    return id;
  }
  async function token() {
    try { const result = await akSupabase().auth.getSession(); return result.data.session && result.data.session.access_token; } catch (_) { return null; }
  }
  function cartSnapshot(consent) {
    if (typeof akCartGet !== 'function') return null;
    return { items: akCartGet(), subtotal: typeof akCartSubtotal === 'function' ? akCartSubtotal() : 0, consentimiento_recordatorio: consent === true };
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
  const init = () => window.akTrack('page_view', { carrito: false });
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
}());
