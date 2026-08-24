'use strict';

const DEFAULT_TIMEOUT_MS = 15000;

function env(name, fallback = '') {
  const value = process.env[name];
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function getConfig() {
  const authType = env('MRW_AUTH_TYPE', env('MRW_API_KEY') ? 'bearer' : 'basic').toLowerCase();
  return {
    environment: env('MRW_ENVIRONMENT', 'sandbox').toLowerCase(),
    baseUrl: env('MRW_API_BASE_URL').replace(/\/$/, ''),
    createPath: env('MRW_CREATE_PATH', '/shipments'),
    testPath: env('MRW_TEST_PATH', ''),
    authType,
    apiKey: env('MRW_API_KEY'),
    apiKeyHeader: env('MRW_API_KEY_HEADER', 'X-API-Key'),
    username: env('MRW_USERNAME'),
    password: env('MRW_PASSWORD'),
    customerCode: env('MRW_CUSTOMER_CODE'),
    franchiseCode: env('MRW_FRANCHISE_CODE'),
    serviceCode: env('MRW_SERVICE_CODE', '24H'),
    trackingField: env('MRW_TRACKING_FIELD', 'numero_seguimiento'),
    labelField: env('MRW_LABEL_FIELD', 'etiqueta_url'),
    timeoutMs: Number(env('MRW_TIMEOUT_MS', String(DEFAULT_TIMEOUT_MS))) || DEFAULT_TIMEOUT_MS,
  };
}

function configuracionMrw() {
  const cfg = getConfig();
  const missing = [];
  if (!cfg.baseUrl) missing.push('MRW_API_BASE_URL');
  if (!cfg.customerCode) missing.push('MRW_CUSTOMER_CODE');
  if (cfg.authType === 'basic' && (!cfg.username || !cfg.password)) {
    if (!cfg.username) missing.push('MRW_USERNAME');
    if (!cfg.password) missing.push('MRW_PASSWORD');
  }
  if (['bearer', 'api-key'].includes(cfg.authType) && !cfg.apiKey) missing.push('MRW_API_KEY');
  if (!['basic', 'bearer', 'api-key', 'none'].includes(cfg.authType)) missing.push('MRW_AUTH_TYPE');
  return { configurado: missing.length === 0, faltan: missing, entorno: cfg.environment };
}

function authHeaders(cfg) {
  if (cfg.authType === 'basic') {
    return { Authorization: `Basic ${Buffer.from(`${cfg.username}:${cfg.password}`).toString('base64')}` };
  }
  if (cfg.authType === 'bearer') return { Authorization: `Bearer ${cfg.apiKey}` };
  if (cfg.authType === 'api-key') return { [cfg.apiKeyHeader]: cfg.apiKey };
  return {};
}

function endpoint(baseUrl, path) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${baseUrl}/${String(path || '').replace(/^\//, '')}`;
}

async function mrwRequest(path, init = {}) {
  const cfg = getConfig();
  const status = configuracionMrw();
  if (!status.configurado) throw new Error(`MRW no está configurado. Faltan: ${status.faltan.join(', ')}`);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), cfg.timeoutMs);
  try {
    const response = await fetch(endpoint(cfg.baseUrl, path), {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...authHeaders(cfg),
        ...(init.headers || {}),
      },
    });
    const raw = await response.text();
    let data = {};
    try { data = raw ? JSON.parse(raw) : {}; } catch { data = { raw }; }
    if (!response.ok) {
      const detail = data.message || data.error || raw || `HTTP ${response.status}`;
      throw new Error(`MRW respondió ${response.status}: ${String(detail).slice(0, 300)}`);
    }
    return { status: response.status, data };
  } catch (error) {
    if (error && error.name === 'AbortError') throw new Error(`MRW no respondió en ${cfg.timeoutMs} ms`);
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function getByPath(object, path) {
  return String(path || '').split('.').filter(Boolean).reduce((value, key) => value == null ? undefined : value[key], object);
}

function construirSolicitud(pedido) {
  const cfg = getConfig();
  return {
    referencia: pedido.numero || pedido.id,
    abonado: cfg.customerCode,
    franquicia: cfg.franchiseCode || undefined,
    servicio: cfg.serviceCode,
    destinatario: {
      nombre: [pedido.nombre, pedido.apellidos].filter(Boolean).join(' ') || pedido.razon_social || '',
      empresa: pedido.razon_social || undefined,
      direccion: pedido.direccion || '',
      codigo_postal: pedido.codigo_postal || '',
      poblacion: pedido.ciudad || '',
      provincia: pedido.provincia || '',
      pais: pedido.pais || 'ES',
      telefono: pedido.telefono || '',
      email: pedido.email || '',
    },
    bultos: Number(pedido.numero_bultos || 1),
    peso_kg: Number(pedido.peso_kg || env('MRW_DEFAULT_WEIGHT_KG', '1')),
    observaciones: pedido.observaciones || '',
  };
}

async function probarConexion() {
  const cfg = getConfig();
  const status = configuracionMrw();
  if (!status.configurado) return { ok: false, ...status };
  if (!cfg.testPath) {
    return { ok: true, configurado: true, entorno: cfg.environment, conexion_verificada: false, aviso: 'Falta MRW_TEST_PATH para verificar la conexión sin crear un envío.' };
  }
  const result = await mrwRequest(cfg.testPath, { method: 'GET' });
  return { ok: true, configurado: true, conexion_verificada: true, entorno: cfg.environment, http_status: result.status };
}

async function crearEnvioMrw(pedido) {
  const cfg = getConfig();
  const result = await mrwRequest(cfg.createPath, {
    method: 'POST',
    body: JSON.stringify(construirSolicitud(pedido)),
  });
  const numeroSeguimiento = getByPath(result.data, cfg.trackingField);
  const etiquetaUrl = getByPath(result.data, cfg.labelField);
  if (!numeroSeguimiento) {
    throw new Error(`MRW aceptó la petición, pero no devolvió el seguimiento en “${cfg.trackingField}”. Revisa MRW_TRACKING_FIELD.`);
  }
  return { numero_seguimiento: String(numeroSeguimiento), etiqueta_url: etiquetaUrl ? String(etiquetaUrl) : null };
}

module.exports = { configuracionMrw, construirSolicitud, crearEnvioMrw, probarConexion };
