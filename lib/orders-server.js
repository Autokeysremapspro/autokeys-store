'use strict';

const crypto = require('node:crypto');

const SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_UMSdVTexHpOImBBonUJKdw_s7XgKVeq';

function serviceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || '';
}

async function adminRequest(path, init = {}) {
  const key = serviceKey();
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY no configurada');
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
}

async function usuarioDesdeToken(token) {
  if (!token) return null;
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return null;
  const user = await response.json();
  return user?.id ? user : null;
}

function money(value) {
  return Number(Number(value || 0).toFixed(2));
}

function normalizarItems(items) {
  if (!Array.isArray(items) || !items.length || items.length > 100) throw new Error('carrito_no_valido');
  return items.map((item) => {
    const productId = String(item.productId || '').trim();
    const variantId = String(item.variantId || '').trim();
    const qty = Number(item.qty);
    if (!productId || !variantId || !Number.isInteger(qty) || qty < 1 || qty > 99) throw new Error('carrito_no_valido');
    return { productId, variantId, qty, extra: item.extra && typeof item.extra === 'object' ? item.extra : null };
  });
}

function esPenínsula({ pais, codigo_postal }) {
  const country = String(pais || 'España').trim().toLowerCase();
  if (!['españa', 'espana', 'es'].includes(country)) return false;
  const cp = String(codigo_postal || '').replace(/\D/g, '').padStart(5, '0');
  return /^\d{5}$/.test(cp) && !['07', '35', '38', '51', '52'].includes(cp.slice(0, 2));
}

async function leerConfiguracion() {
  const response = await adminRequest('tienda_configuracion?id=eq.true&select=envio_precio_hasta_5kg,envio_precio_hasta_10kg,envio_precio_kg_adicional,envio_gratis_desde,envio_gratis_peso_max_kg,envio_peso_embalaje_kg,envio_peso_fallback_kg');
  if (!response.ok) throw new Error('No se pudo leer la configuración de envíos');
  const [row] = await response.json();
  return row || {
    envio_precio_hasta_5kg: 9.95,
    envio_precio_hasta_10kg: 11.95,
    envio_precio_kg_adicional: 0.75,
    envio_gratis_desde: 149,
    envio_gratis_peso_max_kg: 10,
    envio_peso_embalaje_kg: 0.3,
    envio_peso_fallback_kg: 1,
  };
}

async function obtenerCatalogo(items) {
  const productIds = [...new Set(items.map((item) => item.productId))];
  const variantKeys = [...new Set(items.map((item) => item.variantId))];
  const productFilter = productIds.map(encodeURIComponent).join(',');
  const variantFilter = variantKeys.map(encodeURIComponent).join(',');
  const [productsRes, variantsRes] = await Promise.all([
    adminRequest(`tienda_productos?id=in.(${productFilter})&activo=eq.true&select=id,name,category_id,is_product,is_software,requiere_envio,peso_envio_kg,largo_cm,ancho_cm,alto_cm,voluminoso,excluido_envio_gratis`),
    adminRequest(`tienda_producto_variantes?variant_key=in.(${variantFilter})&select=producto_id,variant_key,name,price,peso_envio_kg`),
  ]);
  if (!productsRes.ok || !variantsRes.ok) throw new Error('No se pudo validar el catálogo');
  const products = await productsRes.json();
  const variants = await variantsRes.json();
  return {
    products: new Map(products.map((p) => [p.id, p])),
    variants: new Map(variants.map((v) => [`${v.producto_id}:${v.variant_key}`, v])),
  };
}

async function validarCupon(codigo, subtotal) {
  if (!codigo) return { codigo: null, descuento: 0 };
  const response = await adminRequest(`tienda_cupones?codigo=eq.${encodeURIComponent(String(codigo).trim())}&activo=eq.true&select=*`);
  if (!response.ok) throw new Error('No se pudo validar el cupón');
  const [cupon] = await response.json();
  const today = new Date().toISOString().slice(0, 10);
  const valid = cupon && (!cupon.fecha_inicio || today >= cupon.fecha_inicio) && (!cupon.fecha_fin || today <= cupon.fecha_fin) &&
    (cupon.usos_maximos === null || Number(cupon.usos_actuales) < Number(cupon.usos_maximos)) && subtotal >= Number(cupon.importe_minimo || 0);
  if (!valid) throw new Error('cupon_no_valido');
  const raw = cupon.tipo === 'porcentaje' ? subtotal * Number(cupon.valor) / 100 : Number(cupon.valor);
  return { codigo: cupon.codigo, descuento: money(Math.min(subtotal, raw)) };
}

async function calcularPedido({ items: rawItems, codigo_postal, pais, cupon }) {
  const items = normalizarItems(rawItems);
  const [config, catalog] = await Promise.all([leerConfiguracion(), obtenerCatalogo(items)]);
  const lineas = [];
  let subtotal = 0;
  let pesoProductos = 0;
  let requiereEnvio = false;
  let bloqueaGratis = false;
  let voluminoso = false;

  for (const item of items) {
    const product = catalog.products.get(item.productId);
    const variant = catalog.variants.get(`${item.productId}:${item.variantId}`);
    if (!product || !variant) throw new Error('producto_no_disponible');
    const precio = money(variant.price);
    const physical = Boolean(product.requiere_envio);
    const configuredWeight = variant.peso_envio_kg == null ? Number(product.peso_envio_kg) : Number(variant.peso_envio_kg);
    const largo = Number(product.largo_cm) || 0;
    const ancho = Number(product.ancho_cm) || 0;
    const alto = Number(product.alto_cm) || 0;
    const pesoVolumetrico = largo > 0 && ancho > 0 && alto > 0 ? (largo * ancho * alto) / 5000 : 0;
    const pesoReal = configuredWeight > 0 ? configuredWeight : Number(config.envio_peso_fallback_kg);
    const unitWeight = physical ? Math.max(pesoReal, pesoVolumetrico) : 0;
    subtotal = money(subtotal + precio * item.qty);
    pesoProductos += unitWeight * item.qty;
    requiereEnvio ||= physical;
    bloqueaGratis ||= physical && Boolean(product.excluido_envio_gratis);
    voluminoso ||= physical && Boolean(product.voluminoso);
    lineas.push({
      item,
      product,
      variant,
      precio,
      requiere_envio: physical,
      peso_real_kg: physical ? pesoReal : 0,
      peso_volumetrico_kg: physical ? Number(pesoVolumetrico.toFixed(3)) : 0,
      peso_unitario_kg: Number(unitWeight.toFixed(3)),
    });
  }

  const coupon = await validarCupon(cupon, subtotal);
  const baseTrasDescuento = money(subtotal - coupon.descuento);
  const pesoTotal = requiereEnvio ? Number((pesoProductos + Number(config.envio_peso_embalaje_kg)).toFixed(3)) : 0;
  if (voluminoso) throw new Error('envio_requiere_presupuesto');
  if (requiereEnvio && !esPenínsula({ pais, codigo_postal })) throw new Error('destino_fuera_peninsula');

  let envio = 0;
  let tarifa = requiereEnvio ? 'PENINSULA_ESTANDAR' : 'DIGITAL';
  let envioGratisMotivo = requiereEnvio ? null : 'SIN_PRODUCTOS_FISICOS';
  const gratis = requiereEnvio && !bloqueaGratis && pesoTotal <= Number(config.envio_gratis_peso_max_kg) && baseTrasDescuento >= Number(config.envio_gratis_desde);
  if (gratis) {
    tarifa = 'GRATIS_149';
    envioGratisMotivo = `PEDIDO_DESDE_${Number(config.envio_gratis_desde).toFixed(2)}`;
  } else if (requiereEnvio && pesoTotal <= 5) {
    envio = Number(config.envio_precio_hasta_5kg);
    tarifa = 'PENINSULA_HASTA_5KG';
  } else if (requiereEnvio && pesoTotal <= 10) {
    envio = Number(config.envio_precio_hasta_10kg);
    tarifa = 'PENINSULA_HASTA_10KG';
  } else if (requiereEnvio) {
    envio = Number(config.envio_precio_hasta_10kg) + Math.ceil(pesoTotal - 10) * Number(config.envio_precio_kg_adicional);
    tarifa = 'PENINSULA_MAS_10KG';
  }
  envio = money(envio);
  const total = money(baseTrasDescuento + envio);
  return { lineas, subtotal, descuento: coupon.descuento, cupon: coupon.codigo, envio, total, iva_importe: money(total - total / 1.21), peso_total_kg: pesoTotal, numero_bultos: 1, tarifa_envio_codigo: tarifa, envio_gratis_motivo: envioGratisMotivo };
}

async function crearPedido({ user, body, calculo }) {
  const id = crypto.randomUUID();
  const numero = `WEB-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
  const pedido = {
    id, numero, usuario_id: user.id, nombre: String(body.nombre || '').trim(), apellidos: String(body.apellidos || '').trim(),
    email: user.email, telefono: String(body.telefono || '').trim(), direccion: String(body.direccion || '').trim(),
    codigo_postal: String(body.codigo_postal || '').trim(), ciudad: String(body.ciudad || '').trim(), provincia: String(body.provincia || '').trim(),
    pais: String(body.pais || 'España').trim(), nif_cif: body.nif_cif || null, razon_social: body.razon_social || null,
    metodo_pago: body.metodo_pago || 'tarjeta', cupon: calculo.cupon, subtotal: calculo.subtotal, envio: calculo.envio,
    descuento: calculo.descuento, iva_importe: calculo.iva_importe, total: calculo.total, peso_total_kg: calculo.peso_total_kg,
    numero_bultos: calculo.numero_bultos, tarifa_envio_codigo: calculo.tarifa_envio_codigo, envio_gratis_motivo: calculo.envio_gratis_motivo,
  };
  if (!pedido.nombre || !pedido.apellidos || !pedido.telefono || !pedido.direccion || !pedido.codigo_postal || !pedido.ciudad || !pedido.provincia) throw new Error('faltan_datos_cliente');
  const insert = await adminRequest('tienda_pedidos', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(pedido) });
  if (!insert.ok) throw new Error('No se pudo crear el pedido');
  const lineas = calculo.lineas.map(({ item, product, variant, precio, requiere_envio, peso_unitario_kg }) => ({
    pedido_id: id, producto_id: product.id, producto_nombre: product.name, categoria: product.category_id, variante_id: item.variantId,
    variante_nombre: variant.name, cantidad: item.qty, precio_unitario: precio, requiere_envio, peso_unitario_kg,
    vehiculo_id: body.vehiculo_id || null, referencia_vehiculo: body.referencia_vehiculo || null,
    referencia_pieza: item.extra?.referencia_pieza || null, descripcion_problema: item.extra?.descripcion_problema || null,
    observaciones: item.extra?.observaciones || null,
  }));
  const insertLines = await adminRequest('tienda_pedido_lineas', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(lineas) });
  if (!insertLines.ok) {
    await adminRequest(`tienda_pedidos?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
    throw new Error('No se pudieron crear las líneas del pedido');
  }
  return { id, numero, ...calculo };
}

module.exports = { calcularPedido, crearPedido, usuarioDesdeToken };
