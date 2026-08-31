/* AutoKeys Remaps Pro Store — Supabase connection (public/publishable key only). */

const AK_SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';
const AK_SUPABASE_ANON_KEY = 'sb_publishable_UMSdVTexHpOImBBonUJKdw_s7XgKVeq';

let _akSupabaseClient = null;
function akSupabase() {
  if (!_akSupabaseClient) {
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      throw new Error('Supabase JS no está disponible');
    }
    _akSupabaseClient = window.supabase.createClient(AK_SUPABASE_URL, AK_SUPABASE_ANON_KEY);
  }
  return _akSupabaseClient;
}

/* Sobrescribe explícitamente cualquier fallback temporal creado por catalog.js. */
akSupabase.__akFallback = false;
window.akSupabase = akSupabase;

/*
 * Checkout endurecido.
 *
 * carrito.html conserva su UI histórica, pero el total visible y la creación
 * real del pedido se validan contra endpoints server-side. El navegador solo
 * envía IDs, cantidades y datos del cliente: precios, pesos, descuentos, IVA
 * y envío vuelven a calcularse con los valores actuales de Supabase.
 */
if (/\/carrito\.html$/i.test(window.location.pathname)) {
  let _akQuoteSeq = 0;
  let _akLastQuote = null;

  function akCheckoutItems() {
    if (typeof akCartLines !== 'function') return [];
    return akCartLines().map((line) => ({
      product_id: line.product.id,
      variant_id: line.variant.id,
      qty: line.qty,
      extra: line.extra || null,
    }));
  }

  function akCheckoutCouponCode() {
    try { return appliedCupon && appliedCupon.codigo ? appliedCupon.codigo : null; } catch (_) { return null; }
  }

  async function akFetchCheckoutQuote() {
    const response = await fetch('/api/cotizar-pedido', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: akCheckoutItems(), cupon: akCheckoutCouponCode() }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || 'cotizacion_no_disponible');
    return payload;
  }

  function akShippingLabel(quote) {
    if (!quote.requiere_envio) return 'No requiere envío';
    if (Number(quote.envio) === 0) return 'Gratis';
    return akFormatPrice(Number(quote.envio));
  }

  function akPatchCheckoutTotals(quote) {
    if (!quote || !document.getElementById('cart-root')) return;
    _akLastQuote = quote;

    const totals = document.querySelector('#cart-root .totals');
    if (totals) {
      totals.innerHTML =
        '<div class="row"><span>Subtotal</span><span>' + akFormatPrice(Number(quote.subtotal)) + '</span></div>' +
        (Number(quote.descuento) > 0
          ? '<div class="row" style="color:var(--red)"><span>Descuento</span><span>−' + akFormatPrice(Number(quote.descuento)) + '</span></div>'
          : '') +
        '<div class="row"><span>Envío</span><span>' + akShippingLabel(quote) + '</span></div>' +
        '<div class="row"><span>IVA (21%, incluido)</span><span>' + akFormatPrice(Number(quote.iva_importe)) + '</span></div>' +
        '<div class="row total"><span>Total</span><span>' + akFormatPrice(Number(quote.total)) + '</span></div>';
    }

    const shippingNotice = document.querySelector('#cart-root .cart-layout > div:first-child .cart-panel .notice');
    if (shippingNotice) {
      if (!quote.requiere_envio) {
        shippingNotice.innerHTML = akIcon('checkCircle') + 'Este pedido no requiere transporte físico.';
      } else if (Number(quote.envio) === 0) {
        shippingNotice.innerHTML = akIcon('truck') + 'Envío gratuito según importe y peso configurados para el pedido.';
      } else {
        shippingNotice.innerHTML = akIcon('truck') + 'Envío calculado por peso: ' + akFormatPrice(Number(quote.envio)) + ' · ' + Number(quote.peso_total_kg || 0).toLocaleString('es-ES', { maximumFractionDigits: 3 }) + ' kg.';
      }
    }

    const finishBtn = document.getElementById('finish-btn');
    if (finishBtn && finishBtn.parentElement) {
      const totalNode = finishBtn.parentElement.querySelector('div > div[style*="font-size:24px"]');
      if (totalNode) totalNode.textContent = akFormatPrice(Number(quote.total));
    }
  }

  function akMarkQuotePending() {
    const totals = document.querySelector('#cart-root .totals');
    if (totals) {
      const shippingRows = Array.from(totals.querySelectorAll('.row')).filter((row) => /Envío/.test(row.textContent || ''));
      shippingRows.forEach((row) => {
        const value = row.querySelector('span:last-child');
        if (value) value.textContent = 'Calculando…';
      });
      const totalRow = totals.querySelector('.row.total span:last-child');
      if (totalRow) totalRow.textContent = 'Calculando…';
    }
  }

  async function akRefreshCheckoutQuote() {
    const seq = ++_akQuoteSeq;
    const items = akCheckoutItems();
    if (!items.length) { _akLastQuote = null; return null; }
    akMarkQuotePending();
    try {
      const quote = await akFetchCheckoutQuote();
      if (seq === _akQuoteSeq) akPatchCheckoutTotals(quote);
      return quote;
    } catch (error) {
      if (seq === _akQuoteSeq) {
        _akLastQuote = null;
        const totals = document.querySelector('#cart-root .totals');
        if (totals) totals.insertAdjacentHTML('afterend', '<div class="notice" style="margin-top:10px">' + akIcon('info') + 'No se pudo validar el total. No podrás finalizar el pedido hasta que se recalcule correctamente.</div>');
      }
      console.error('Cotización segura no disponible:', error);
      return null;
    }
  }

  function akCheckoutErrorMessage(code) {
    const messages = {
      no_autorizado: 'Tu sesión ha caducado. Inicia sesión de nuevo.',
      carrito_no_valido: 'El carrito no es válido. Revísalo e inténtalo de nuevo.',
      producto_no_disponible: 'Uno de los productos ya no está disponible.',
      variante_no_disponible: 'Una opción del pedido ya no está disponible.',
      cupon_no_valido: 'El cupón ya no es válido.',
      cupon_no_activo: 'El cupón todavía no está activo.',
      cupon_caducado: 'El cupón ha caducado.',
      cupon_agotado: 'El cupón ha alcanzado su límite de usos.',
      cupon_importe_minimo: 'El pedido no alcanza el importe mínimo del cupón.',
      envio_fuera_peninsula_no_disponible: 'El envío online está disponible para España peninsular. Escríbenos para otros destinos.',
      faltan_datos_cliente: 'Faltan datos obligatorios del pedido.',
    };
    return messages[code] || 'No hemos podido validar el pedido. Inténtalo de nuevo o contacta con nosotros.';
  }

  /* Las funciones de carrito ya han sido declaradas por el script inline de
     carrito.html cuando este archivo defer se ejecuta. Las envolvemos antes
     de DOMContentLoaded, de modo que cada render vuelva a pedir una cotización
     autoritativa al servidor. */
  if (typeof render === 'function') {
    const legacyRender = render;
    render = function secureRender() {
      const result = legacyRender();
      if (typeof akCartLines === 'function' && akCartLines().length) akRefreshCheckoutQuote();
      return result;
    };
  }

  if (typeof submitOrder === 'function') {
    submitOrder = async function secureSubmitOrder() {
      if (!CURRENT_USER) {
        akToast('Inicia sesión para completar el pedido');
        window.location.href = 'login.html?redirect=carrito.html';
        return;
      }

      const required = [
        ['f-nombre', 'Nombre'], ['f-apellidos', 'Apellidos'], ['f-telefono', 'Teléfono'],
        ['f-direccion', 'Dirección'], ['f-cp', 'Código postal'], ['f-ciudad', 'Ciudad'], ['f-provincia', 'Provincia'],
      ];
      const missing = required.find(([id]) => !fieldVal(id));
      if (missing) {
        akToast('Falta un campo obligatorio: ' + missing[1]);
        const el = document.getElementById(missing[0]);
        if (el) el.focus();
        return;
      }

      const quote = await akRefreshCheckoutQuote();
      if (!quote) {
        akToast('No se ha podido validar el total del pedido. Inténtalo de nuevo.');
        return;
      }

      let session = null;
      try {
        const result = await akSupabase().auth.getSession();
        session = result?.data?.session || null;
      } catch (_) {}
      if (!session?.access_token) {
        akToast('Tu sesión ha caducado. Inicia sesión de nuevo.');
        window.location.href = 'login.html?redirect=carrito.html';
        return;
      }

      const btn = document.getElementById('finish-btn');
      if (!btn) return;
      btn.disabled = true;
      const originalHtml = btn.innerHTML;
      btn.textContent = 'Validando pedido…';

      try {
        let vehiculo = { id: null };
        if (typeof resolveVehiculo === 'function') vehiculo = await resolveVehiculo();

        const body = {
          items: akCheckoutItems(),
          cupon: akCheckoutCouponCode(),
          nombre: fieldVal('f-nombre'),
          apellidos: fieldVal('f-apellidos'),
          telefono: fieldVal('f-telefono'),
          direccion: fieldVal('f-direccion'),
          codigo_postal: fieldVal('f-cp'),
          ciudad: fieldVal('f-ciudad'),
          provincia: fieldVal('f-provincia'),
          pais: fieldVal('f-pais') || 'España',
          nif_cif: fieldVal('f-nif') || null,
          razon_social: fieldVal('f-razon') || null,
          metodo_pago: payMethod,
          vehiculo_id: vehiculo?.id || null,
        };

        const response = await fetch('/api/crear-pedido', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + session.access_token,
          },
          body: JSON.stringify(body),
        });
        const pedido = await response.json().catch(() => ({}));
        if (!response.ok) {
          if (response.status === 401) {
            akToast(akCheckoutErrorMessage('no_autorizado'));
            window.location.href = 'login.html?redirect=carrito.html';
            return;
          }
          throw new Error(pedido.error || 'pedido_no_validado');
        }

        akCartSave([]);
        appliedCupon = null;
        _akLastQuote = null;
        if (typeof akTrack === 'function') akTrack('order_created', { valor: Number(pedido.total), pedido_id: pedido.pedido_id, consentimiento_recordatorio: false });

        fetch('/api/enviar-confirmacion-pedido', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pedido_id: pedido.pedido_id }),
        }).catch((e) => console.error('No se pudo enviar el email de confirmación:', e));

        if (payMethod === 'tarjeta') {
          try {
            const pagoRes = await fetch('/api/crear-pago', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ pedido_id: pedido.pedido_id }),
            });
            const pagoData = await pagoRes.json().catch(() => ({}));
            if (pagoRes.ok && pagoData.hosted_checkout_url) {
              window.location.href = pagoData.hosted_checkout_url;
              return;
            }
            console.error('No se pudo iniciar el pago:', pagoData);
          } catch (error) {
            console.error('No se pudo iniciar el pago online:', error);
          }
        }

        showConfirmation(pedido.numero, Number(pedido.total));
      } catch (error) {
        console.error('Pedido seguro:', error);
        akToast(akCheckoutErrorMessage(error?.message));
        btn.disabled = false;
        btn.innerHTML = originalHtml;
        akRefreshCheckoutQuote();
      }
    };
  }
}
