const SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';

const SHIPPING_FALLBACKS = {
  hasta5: 9.95,
  hasta10: 11.95,
  adicional: 0.75,
  gratisDesde: 160,
  gratisPesoMax: 10,
  embalaje: 0.3,
  pesoFallback: 1,
};

function serviceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || '';
}

function money(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round((n + Number.EPSILON) * 100) / 100 : 0;
}

function positive(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

/* Divisor volumétrico estándar del sector (DHL/UPS/paquetería europea):
   peso_volumetrico_kg = (largo_cm * ancho_cm * alto_cm) / 5000. Un paquete
   grande y ligero puede costarle más a la transportista que uno pequeño del
   mismo peso, así que se cobra el mayor de los dos pesos. Se revisará el
   divisor exacto cuando esté confirmada la tarifa real de MRW. */
const VOLUMETRIC_DIVISOR = 5000;

function volumetricWeight(product) {
  const largo = Number(product.largo_cm);
  const ancho = Number(product.ancho_cm);
  const alto = Number(product.alto_cm);
  if (!(largo > 0) || !(ancho > 0) || !(alto > 0)) return 0;
  return (largo * ancho * alto) / VOLUMETRIC_DIVISOR;
}

async function adminRequest(path, init = {}) {
  const key = serviceKey();
  if (!key) throw new Error('configuracion_no_disponible');
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
}

async function jsonOrThrow(response, code) {
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    console.error(code, response.status, body.slice(0, 500));
    throw new Error(code);
  }
  return response.json();
}

function normalizeItems(items) {
  if (!Array.isArray(items) || items.length < 1 || items.length > 50) {
    throw new Error('carrito_no_valido');
  }
  return items.map((item) => {
    const productId = String(item?.product_id || '').trim();
    const variantId = String(item?.variant_id || '').trim();
    const qty = Number(item?.qty);
    if (!/^[a-zA-Z0-9_-]{1,160}$/.test(productId) || !/^[a-zA-Z0-9_-]{1,160}$/.test(variantId)) {
      throw new Error('producto_no_valido');
    }
    if (!Number.isInteger(qty) || qty < 1 || qty > 20) throw new Error('cantidad_no_valida');
    return { productId, variantId, qty };
  });
}

async function loadCatalogPricing() {
  const [productsRes, variantsRes, configRes] = await Promise.all([
    adminRequest('tienda_productos?activo=eq.true&select=id,name,category_id,price_from,requiere_envio,peso_envio_kg,largo_cm,ancho_cm,alto_cm,excluido_envio_gratis,es_digital,digital_gratis'),
    adminRequest('tienda_producto_variantes?select=producto_id,variant_key,name,price,peso_envio_kg'),
    adminRequest('tienda_configuracion?id=eq.true&select=envio_precio_hasta_5kg,envio_precio_hasta_10kg,envio_precio_kg_adicional,envio_gratis_desde,envio_gratis_peso_max_kg,envio_peso_embalaje_kg,envio_peso_fallback_kg'),
  ]);

  const [products, variants, configRows] = await Promise.all([
    jsonOrThrow(productsRes, 'productos_no_disponibles'),
    jsonOrThrow(variantsRes, 'variantes_no_disponibles'),
    jsonOrThrow(configRes, 'tarifas_no_disponibles'),
  ]);

  const config = configRows[0] || {};
  const rates = {
    hasta5: positive(config.envio_precio_hasta_5kg, SHIPPING_FALLBACKS.hasta5),
    hasta10: positive(config.envio_precio_hasta_10kg, SHIPPING_FALLBACKS.hasta10),
    adicional: positive(config.envio_precio_kg_adicional, SHIPPING_FALLBACKS.adicional),
    gratisDesde: positive(config.envio_gratis_desde, SHIPPING_FALLBACKS.gratisDesde),
    gratisPesoMax: positive(config.envio_gratis_peso_max_kg, SHIPPING_FALLBACKS.gratisPesoMax),
    embalaje: positive(config.envio_peso_embalaje_kg, SHIPPING_FALLBACKS.embalaje),
    pesoFallback: positive(config.envio_peso_fallback_kg, SHIPPING_FALLBACKS.pesoFallback),
  };

  const productMap = new Map(products.map((p) => [p.id, p]));
  const variantMap = new Map(variants.map((v) => [`${v.producto_id}::${v.variant_key}`, v]));
  const variantsByProduct = new Map();
  for (const variant of variants) {
    const list = variantsByProduct.get(variant.producto_id) || [];
    list.push(variant);
    variantsByProduct.set(variant.producto_id, list);
  }
  return { productMap, variantMap, variantsByProduct, rates };
}

async function loadCoupon(code) {
  const couponCode = String(code || '').trim().toUpperCase();
  if (!couponCode) return null;
  if (!/^[A-Z0-9_-]{1,64}$/.test(couponCode)) throw new Error('cupon_no_valido');
  const response = await adminRequest(
    `tienda_cupones?codigo=eq.${encodeURIComponent(couponCode)}&activo=eq.true&select=id,codigo,tipo,valor,fecha_inicio,fecha_fin,importe_minimo,usos_maximos,usos_actuales&limit=1`
  );
  const rows = await jsonOrThrow(response, 'cupon_no_disponible');
  const coupon = rows[0] || null;
  if (!coupon) throw new Error('cupon_no_valido');
  return coupon;
}

function couponDiscount(coupon, subtotal) {
  if (!coupon) return 0;
  const today = new Date().toISOString().slice(0, 10);
  if (coupon.fecha_inicio && today < coupon.fecha_inicio) throw new Error('cupon_no_activo');
  if (coupon.fecha_fin && today > coupon.fecha_fin) throw new Error('cupon_caducado');
  if (coupon.usos_maximos !== null && Number(coupon.usos_actuales) >= Number(coupon.usos_maximos)) {
    throw new Error('cupon_agotado');
  }
  if (subtotal < Number(coupon.importe_minimo || 0)) throw new Error('cupon_importe_minimo');
  const value = Number(coupon.valor || 0);
  const raw = coupon.tipo === 'porcentaje' ? subtotal * value / 100 : value;
  return money(Math.min(Math.max(raw, 0), subtotal));
}

function shippingFor(lines, netMerchandise, rates) {
  const shippingLines = lines.filter((line) => line.requiere_envio);
  if (!shippingLines.length) {
    return {
      requiereEnvio: false,
      pesoTotal: 0,
      envio: 0,
      tarifaCodigo: 'NO_APLICA',
      gratisMotivo: 'sin_envio_fisico',
    };
  }

  let weight = rates.embalaje;
  let excludedFromFree = false;
  for (const line of shippingLines) {
    weight += line.peso_unitario_kg * line.cantidad;
    if (line.excluido_envio_gratis) excludedFromFree = true;
  }
  weight = Math.max(0.1, Math.round(weight * 1000) / 1000);

  const canBeFree = !excludedFromFree
    && rates.gratisDesde > 0
    && netMerchandise >= rates.gratisDesde
    && weight <= rates.gratisPesoMax;
  if (canBeFree) {
    return {
      requiereEnvio: true,
      pesoTotal: weight,
      envio: 0,
      tarifaCodigo: 'ENVIO_GRATIS',
      gratisMotivo: `pedido_desde_${money(rates.gratisDesde)}`,
    };
  }

  let price;
  let code;
  if (weight <= 5) {
    price = rates.hasta5;
    code = 'PENINSULA_HASTA_5KG';
  } else if (weight <= 10) {
    price = rates.hasta10;
    code = 'PENINSULA_HASTA_10KG';
  } else {
    price = rates.hasta10 + Math.ceil(weight - 10) * rates.adicional;
    code = 'PENINSULA_MAS_10KG';
  }
  return {
    requiereEnvio: true,
    pesoTotal: weight,
    envio: money(price),
    tarifaCodigo: code,
    gratisMotivo: null,
  };
}

async function quoteOrder(items, couponCode) {
  const normalizedItems = normalizeItems(items);
  const [{ productMap, variantMap, variantsByProduct, rates }, coupon] = await Promise.all([
    loadCatalogPricing(),
    loadCoupon(couponCode),
  ]);

  const lines = normalizedItems.map(({ productId, variantId, qty }) => {
    const product = productMap.get(productId);
    if (!product) throw new Error('producto_no_disponible');

    let variant = variantMap.get(`${productId}::${variantId}`);
    if (!variant && variantId === 'base' && !(variantsByProduct.get(productId) || []).length) {
      variant = { variant_key: 'base', name: product.name, price: product.price_from, peso_envio_kg: null };
    }
    if (!variant) throw new Error('variante_no_disponible');

    const price = money(variant.price);
    if (price < 0) throw new Error('precio_no_valido');
    const requiresShipping = Boolean(product.requiere_envio);
    const variantWeight = Number(variant.peso_envio_kg);
    const productWeight = Number(product.peso_envio_kg);
    const realWeight = Number.isFinite(variantWeight) && variantWeight > 0
      ? variantWeight
      : Number.isFinite(productWeight) && productWeight > 0
        ? productWeight
        : rates.pesoFallback;
    const volWeight = volumetricWeight(product);
    const unitWeight = requiresShipping ? Math.max(realWeight, volWeight) : 0;

    return {
      producto_id: product.id,
      producto_nombre: product.name,
      categoria: product.category_id,
      variante_id: variant.variant_key,
      variante_nombre: variant.name || variant.variant_key,
      cantidad: qty,
      precio_unitario: price,
      line_total: money(price * qty),
      requiere_envio: requiresShipping,
      peso_real_kg: requiresShipping ? Math.round(realWeight * 1000) / 1000 : 0,
      peso_volumetrico_kg: requiresShipping ? Math.round(volWeight * 1000) / 1000 : 0,
      peso_unitario_kg: Math.round(unitWeight * 1000) / 1000,
      excluido_envio_gratis: Boolean(product.excluido_envio_gratis),
      es_digital: Boolean(product.es_digital),
    };
  });

  const subtotal = money(lines.reduce((sum, line) => sum + line.line_total, 0));
  const descuento = couponDiscount(coupon, subtotal);
  const netMerchandise = money(subtotal - descuento);
  const shipping = shippingFor(lines, netMerchandise, rates);
  const total = money(netMerchandise + shipping.envio);
  const ivaImporte = money(total - total / 1.21);

  return {
    subtotal,
    descuento,
    envio: shipping.envio,
    iva_importe: ivaImporte,
    total,
    requiere_envio: shipping.requiereEnvio,
    peso_total_kg: shipping.pesoTotal,
    tarifa_envio_codigo: shipping.tarifaCodigo,
    envio_gratis_motivo: shipping.gratisMotivo,
    envio_gratis_desde: money(rates.gratisDesde),
    envio_gratis_peso_max_kg: rates.gratisPesoMax,
    lines,
    coupon,
  };
}

module.exports = {
  SUPABASE_URL,
  serviceKey,
  adminRequest,
  money,
  quoteOrder,
  SHIPPING_FALLBACKS,
};
