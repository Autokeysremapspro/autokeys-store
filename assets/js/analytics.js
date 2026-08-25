/* Medición propia y respetuosa: no guarda IP, user-agent ni datos personales anónimos. */
if (!document.querySelector('script[data-ak-growth-conversion]')) {
  const growthScript = document.createElement('script');
  growthScript.src = '/assets/js/growth-conversion.js';
  growthScript.defer = true;
  growthScript.dataset.akGrowthConversion = '1';
  document.head.appendChild(growthScript);
}

(function () {
  const KEY = 'ak_conversion_session_v1';
  const REMINDER_KEY = 'ak_cart_reminder_consent_v1';
  const ATTR_KEY = 'ak_visit_attribution_v1';

  function sessionId() {
    let id = localStorage.getItem(KEY);
    if (!/^[0-9a-f-]{36}$/i.test(id || '')) { id = crypto.randomUUID(); localStorage.setItem(KEY, id); }
    return id;
  }

  function visitAttribution() {
    try {
      const stored = JSON.parse(sessionStorage.getItem(ATTR_KEY) || 'null');
      if (stored && /^[0-9a-f-]{36}$/i.test(stored.visit_id || '')) return stored;
    } catch (_) {}

    const params = new URLSearchParams(location.search);
    let referrerHost = '';
    try { referrerHost = document.referrer ? new URL(document.referrer).hostname : ''; } catch (_) {}
    const attr = {
      visit_id: crypto.randomUUID(),
      landing_page: location.pathname + location.search,
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_content: params.get('utm_content') || '',
      utm_term: params.get('utm_term') || '',
      referrer_host: referrerHost,
    };
    try { sessionStorage.setItem(ATTR_KEY, JSON.stringify(attr)); } catch (_) {}
    return attr;
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
      metadata: visitAttribution(),
    };
    fetch('/api/conversion', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) }, body: JSON.stringify(payload), keepalive: true }).catch(() => {});
  };

  function trackOnce(key, evento) {
    const storageKey = 'ak_once_' + key;
    try {
      if (sessionStorage.getItem(storageKey) === '1') return;
      sessionStorage.setItem(storageKey, '1');
    } catch (_) {}
    window.akTrack(evento, { carrito: false });
  }

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

  function setupRepairFunnelTracking() {
    const form = document.getElementById('repair-request-form');
    if (!form) return;
    form.addEventListener('click', (event) => {
      if (event.target && event.target.closest && event.target.closest('[data-unit]')) {
        trackOnce('repair_form_start', 'repair_form_start');
      }
    }, true);

    const notice = document.getElementById('auth-notice');
    if (notice) {
      const checkGate = () => {
        const text = notice.textContent || '';
        if (!notice.hidden && /iniciar sesión|crear una cuenta/i.test(text)) {
          trackOnce('repair_login_gate', 'repair_login_gate');
        }
      };
      checkGate();
      new MutationObserver(checkGate).observe(notice, { attributes: true, childList: true, subtree: true });
    }
  }

  function setupCheckoutGateTracking() {
    if (!/(?:^|\/)carrito\.html$/i.test(location.pathname)) return;
    const root = document.getElementById('cart-root');
    if (!root) return;
    const checkGate = () => {
      if (/INICIA SESIÓN PARA CONTINUAR|TU CARRITO ESTÁ GUARDADO/i.test(root.textContent || '')) {
        trackOnce('checkout_login_gate', 'checkout_login_gate');
      }
    };
    checkGate();
    new MutationObserver(checkGate).observe(root, { childList: true, subtree: true, characterData: true });
  }

  function setupRepairRequestObserver() {
    const success = document.getElementById('request-success');
    if (!success) return;
    let tracked = false;
    const check = () => {
      if (!tracked && success.hidden === false) {
        tracked = true;
        window.akTrack('repair_request', { carrito: false });
      }
    };
    check();
    new MutationObserver(check).observe(success, { attributes: true, attributeFilter: ['hidden'] });
  }

  function setupPurchaseObserver() {
    if (!/(?:^|\/)carrito\.html$/i.test(location.pathname)) return;
    const params = new URLSearchParams(location.search);
    const pedidoId = params.get('pedido');
    if (params.get('pago') !== 'retorno' || !pedidoId) return;
    const root = document.getElementById('cart-root');
    if (!root) return;
    const purchaseKey = 'ak_purchase_tracked_' + pedidoId;
    const check = () => {
      if (localStorage.getItem(purchaseKey) === '1') return;
      if (/Pago confirmado/i.test(root.textContent || '')) {
        localStorage.setItem(purchaseKey, '1');
        window.akTrack('purchase', { pedido_id: pedidoId, carrito: false });
      }
    };
    check();
    new MutationObserver(check).observe(root, { childList: true, subtree: true, characterData: true });
  }

  document.addEventListener('click', trackCommercialClick, true);
  const init = () => {
    visitAttribution();
    window.akTrack('page_view', { carrito: false });
    setupRepairFunnelTracking();
    setupCheckoutGateTracking();
    setupRepairRequestObserver();
    setupPurchaseObserver();
  };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
}());