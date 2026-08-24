/* AutoKeys Remaps Pro Store — cart state (localStorage-backed)
   Phase 1: no backend yet, so the cart lives in the browser only.
   Phase 2 swaps akCartGet/akCartSave for real API calls without touching callers. */

const AK_CART_KEY = 'ak_cart_v1';

function akCartGet() {
  try {
    const raw = localStorage.getItem(AK_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function akCartSave(items) {
  try {
    localStorage.setItem(AK_CART_KEY, JSON.stringify(items));
  } catch (e) {
    /* storage unavailable (private mode, quota) — cart just won't persist */
  }
  akCartRenderBadge();
}

function akCartAdd(productId, variantId, qty, extra) {
  qty = qty || 1;
  const items = akCartGet();
  const existing = items.find((i) => i.productId === productId && i.variantId === variantId);
  if (existing) {
    existing.qty += qty;
    if (extra) existing.extra = extra;
  } else {
    items.push(extra ? { productId, variantId, qty, extra } : { productId, variantId, qty });
  }
  akCartSave(items);
  if (typeof akTrack === 'function') akTrack('add_to_cart', { producto_id: productId, variante_id: variantId });
}

function akCartRemove(index) {
  const items = akCartGet();
  const removed = items[index];
  items.splice(index, 1);
  akCartSave(items);
  if (removed && typeof akTrack === 'function') akTrack('remove_from_cart', { producto_id: removed.productId, variante_id: removed.variantId });
}

function akCartSetQty(index, qty) {
  const items = akCartGet();
  if (!items[index]) return;
  items[index].qty = Math.max(1, qty);
  akCartSave(items);
}

function akCartPruneInvalid() {
  const items = akCartGet();
  const valid = items.filter((item) => akFindProduct(item.productId));
  const removidos = items.length - valid.length;
  if (removidos > 0) akCartSave(valid);
  return removidos;
}

function akCartLines() {
  return akCartGet()
    .map((item, index) => {
      const product = akFindProduct(item.productId);
      if (!product) return null;
      const variant = product.variants.find((v) => v.id === item.variantId) || product.variants[0];
      return { index, product, variant, qty: item.qty, lineTotal: variant.price * item.qty, extra: item.extra || null };
    })
    .filter(Boolean);
}

function akCartCount() {
  return akCartGet().reduce((sum, i) => sum + i.qty, 0);
}

function akCartSubtotal() {
  return akCartLines().reduce((sum, l) => sum + l.lineTotal, 0);
}

function akCartRenderBadge() {
  document.querySelectorAll('[data-cart-badge]').forEach((el) => {
    el.textContent = akCartCount();
  });
}

document.addEventListener('DOMContentLoaded', akCartRenderBadge);
