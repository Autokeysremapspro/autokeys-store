const crypto = require('crypto');
const { SUPABASE_URL, serviceKey, adminRequest, quoteOrder } = require('../lib/order-pricing-server');

const SUPABASE_ANON_KEY = 'sb_publishable_UMSdVTexHpOImBBonUJKdw_s7XgKVeq';
const PAYMENT_METHODS = new Set(['tarjeta', 'paypal', 'bizum']);

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let data = '';
  for await (const chunk of req) {
    data += chunk;
    if (data.length > 500000) throw new Error('payload_demasiado_grande');
  }
  try { return JSON.parse(data || '{}'); } catch { return {}; }
}

function text(value, max = 255, required = false) {
  const v = String(value ?? '').trim().replace(/[\u0000-\u001F\u007F]/g, ' ');
  if (required && !v) throw new Error('faltan_datos_cliente');
  return v ? v.slice(0, max) : null;
}

function safeExtra(value, max) {
  const v = String(value ?? '').trim().replace(/[\u0000-\u001F\u007F]/g, ' ');
  return v ? v.slice(0, max) : null;
}

function isPeninsulaPostalCode(value) {
  const cp = String(value || '').replace(/\D/g, '');
  if (!/^\d{5}$/.test(cp)) return false;
  return !['07', '35', '38', '51', '52'].includes(cp.slice(0, 2));
}

async function authenticatedUser(req) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return null;
  const user = await response.json();
  return user?.id ? user : null;
}

async function jsonOrThrow(response, code) {
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    console.error(code, response.status, body.slice(0, 500));
    throw new Error(code);
  }
  if (response.status === 204) return null;
  const body = await response.text();
  return body ? JSON.parse(body) : null;
}

async function vehicleForUser(vehicleId, userId) {
  const id = String(vehicleId || '').trim();
  if (!id) return null;
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new Error('vehiculo_no_valido');
  const response = await adminRequest(
    `tienda_vehiculos?id=eq.${encodeURIComponent(id)}&cliente_id=eq.${encodeURIComponent(userId)}&select=id,marca,modelo,anio,matricula&limit=1`
  );
  const rows = await jsonOrThrow(response, 'vehiculo_no_disponible');
  return rows?.[0] || null;
}

function vehicleReference(vehicle) {
  if (!vehicle) return null;
  return `${vehicle.marca || ''} ${vehicle.modelo || ''}${vehicle.anio ? ` (${vehicle.anio})` : ''}${vehicle.matricula ? ` — ${vehicle.matricula}` : ''}`.trim();
}

function clientExtras(items) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({
    referencia_pieza: safeExtra(item?.extra?.referencia_pieza, 200),
    descripcion_problema: safeExtra(item?.extra?.descripcion_problema, 2000),
    observaciones: safeExtra(item?.extra?.observaciones, 2000),
  }));
}

async function incrementCouponUse(coupon) {
  if (!coupon?.id) return;
  const next = Number(coupon.usos_actuales || 0) + 1;
  const response = await adminRequest(`tienda_cupones?id=eq.${encodeURIComponent(coupon.id)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ usos_actuales: next, updated_at: new Date().toISOString() }),
  });
  if (!response.ok) console.error('No se pudo incrementar uso del cupón', coupon.codigo, response.status);
}

async function cleanupOrder(orderId) {
  try {
    await adminRequest(`tienda_pedido_lineas?pedido_id=eq.${encodeURIComponent(orderId)}`, { method: 'DELETE' });
    await adminRequest(`tienda_pedidos?id=eq.${encodeURIComponent(orderId)}`, { method: 'DELETE' });
  } catch (_) {}
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'metodo_no_permitido' });
  if (!serviceKey()) return res.status(503).json({ error: 'configuracion_no_disponible' });

  try {
    const user = await authenticatedUser(req);
    if (!user) return res.status(401).json({ error: 'no_autorizado' });

    const body = await readJsonBody(req);
    const method = String(body.metodo_pago || '').trim().toLowerCase();
    if (!PAYMENT_METHODS.has(method)) return res.status(400).json({ error: 'metodo_pago_no_valido' });

    const quote = await quoteOrder(body.items, body.cupon);
    const extras = clientExtras(body.items);
    const vehicle = await vehicleForUser(body.vehiculo_id, user.id);
    const referenciaVehiculo = vehicleReference(vehicle);

    const nombre = text(body.nombre, 120, true);
    const apellidos = text(body.apellidos, 160, true);
    const telefono = text(body.telefono, 40, true);
    const direccion = text(body.direccion, 220, quote.requiere_envio);
    const codigoPostal = text(body.codigo_postal, 20, quote.requiere_envio);
    const ciudad = text(body.ciudad, 120, quote.requiere_envio);
    const provincia = text(body.provincia, 120, quote.requiere_envio);
    const pais = text(body.pais || 'España', 80, quote.requiere_envio) || 'España';

    if (quote.requiere_envio) {
      const normalizedCountry = pais.toLowerCase();
      if (!['españa', 'espana', 'es'].includes(normalizedCountry)) {
        return res.status(400).json({ error: 'envio_fuera_peninsula_no_disponible' });
      }
      if (!isPeninsulaPostalCode(codigoPostal)) {
        return res.status(400).json({ error: 'envio_fuera_peninsula_no_disponible' });
      }
    }

    const orderId = crypto.randomUUID();
    const numero = `WEB-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    const order = {
      id: orderId,
      numero,
      usuario_id: user.id,
      nombre,
      apellidos,
      email: String(user.email || body.email || '').trim().slice(0, 254),
      telefono,
      direccion,
      codigo_postal: codigoPostal,
      ciudad,
      provincia,
      pais,
      nif_cif: text(body.nif_cif, 40),
      razon_social: text(body.razon_social, 180),
      metodo_pago: method,
      cupon: quote.coupon?.codigo || null,
      subtotal: quote.subtotal,
      envio: quote.envio,
      descuento: quote.descuento,
      iva_importe: quote.iva_importe,
      total: quote.total,
      peso_total_kg: quote.peso_total_kg,
      numero_bultos: quote.requiere_envio ? 1 : 1,
      tarifa_envio_codigo: quote.tarifa_envio_codigo,
      envio_gratis_motivo: quote.envio_gratis_motivo,
      origen: 'tienda-online',
    };

    const orderResponse = await adminRequest('tienda_pedidos', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(order),
    });
    await jsonOrThrow(orderResponse, 'no_se_pudo_crear_pedido');

    const lineRows = quote.lines.map((line, index) => ({
      pedido_id: orderId,
      producto_id: line.producto_id,
      producto_nombre: line.producto_nombre,
      categoria: line.categoria,
      variante_id: line.variante_id,
      variante_nombre: line.variante_nombre,
      cantidad: line.cantidad,
      precio_unitario: line.precio_unitario,
      requiere_envio: line.requiere_envio,
      peso_unitario_kg: line.peso_unitario_kg,
      vehiculo_id: vehicle?.id || null,
      referencia_vehiculo: referenciaVehiculo,
      referencia_pieza: extras[index]?.referencia_pieza || null,
      descripcion_problema: extras[index]?.descripcion_problema || null,
      observaciones: extras[index]?.observaciones || null,
    }));

    const linesResponse = await adminRequest('tienda_pedido_lineas', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify(lineRows),
    });
    if (!linesResponse.ok) {
      await cleanupOrder(orderId);
      await jsonOrThrow(linesResponse, 'no_se_pudieron_crear_lineas');
    }

    await incrementCouponUse(quote.coupon);

    res.setHeader('Cache-Control', 'no-store');
    return res.status(201).json({
      pedido_id: orderId,
      numero,
      subtotal: quote.subtotal,
      descuento: quote.descuento,
      envio: quote.envio,
      iva_importe: quote.iva_importe,
      total: quote.total,
      peso_total_kg: quote.peso_total_kg,
      tarifa_envio_codigo: quote.tarifa_envio_codigo,
    });
  } catch (error) {
    const code = String(error?.message || 'error_interno');
    const clientErrors = new Set([
      'payload_demasiado_grande','faltan_datos_cliente','metodo_pago_no_valido','carrito_no_valido',
      'producto_no_valido','cantidad_no_valida','producto_no_disponible','variante_no_disponible',
      'precio_no_valido','cupon_no_valido','cupon_no_activo','cupon_caducado','cupon_agotado',
      'cupon_importe_minimo','vehiculo_no_valido','envio_fuera_peninsula_no_disponible',
    ]);
    if (!clientErrors.has(code)) console.error('crear-pedido:', error);
    return res.status(clientErrors.has(code) ? 400 : 500).json({ error: code });
  }
};
