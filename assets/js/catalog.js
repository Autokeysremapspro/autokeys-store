/* AutoKeys Remaps Pro Store — product/service catalog.
   Datos desde Supabase con recuperación defensiva de la dependencia cliente. */

let CATEGORIES = [];
let BRANDS = [];
let CATALOG = [];

const SERVICE_TYPES = [
  { id: 'taller', label: 'Presencial / Taller' },
  { id: 'remoto', label: 'Remoto' },
  { id: 'envio', label: 'Por envío' },
];

const GENERIC_PROCESS = [
  { title: 'Cuéntanos el caso', desc: 'Completa la solicitud y adjunta fotos de la unidad.' },
  { title: 'Revisamos la información', desc: 'Confirmamos qué elementos necesitamos antes del envío.' },
  { title: 'Recibimos y diagnosticamos', desc: 'Registramos la unidad y preparamos el presupuesto.' },
  { title: 'Reparamos y probamos', desc: 'Analizamos, recuperamos y verificamos en banco.' },
  { title: 'Devolución rápida', desc: 'Recibes la unidad lista, con garantía por escrito.' },
];

const GENERIC_FAQS = [
  { q: '¿Podéis recuperar una unidad que no comunica?', a: 'Depende del daño y del estado de la memoria. La compatibilidad se revisa antes de procesar el trabajo.' },
  { q: '¿Necesitáis el vehículo?', a: 'En muchos casos el trabajo puede realizarse sobre la unidad enviada, pero algunos procesos pueden requerir información adicional.' },
  { q: '¿Incluye garantía?', a: 'Los trabajos validados incluyen garantía según el servicio realizado y el material recibido.' },
];

/*
 * Algunas páginas SEO se generan desde funciones y no siempre incluyen los
 * scripts de Supabase en el HTML original. Un fallo de carga no debe romper
 * cabecera, footer, catálogo ni tracking. Dejamos un cliente nulo temporal y
 * cargamos la dependencia real cuando falta. supabase-config.js sustituye el
 * fallback al cargarse.
 */
(function akBootstrapSupabase() {
  if (typeof window === 'undefined') return;

  function nullQueryResult() {
    return { data: null, error: { message: 'Supabase no disponible temporalmente' } };
  }

  function makeNullQuery() {
    const target = {};
    const proxy = new Proxy(target, {
      get(_obj, prop) {
        if (prop === 'then') {
          return (resolve, reject) => Promise.resolve(nullQueryResult()).then(resolve, reject);
        }
        return () => proxy;
      },
    });
    return proxy;
  }

  if (typeof window.akSupabase !== 'function') {
    const fallback = function () {
      return {
        auth: {
          getUser: async () => ({ data: { user: null }, error: null }),
          getSession: async () => ({ data: { session: null }, error: null }),
          signOut: async () => ({ error: null }),
        },
        rpc: async () => nullQueryResult(),
        from: () => makeNullQuery(),
      };
    };
    fallback.__akFallback = true;
    window.akSupabase = fallback;
  }

  function scriptPresent(part) {
    return Array.from(document.scripts || []).some((s) => String(s.src || '').includes(part));
  }

  function loadScript(src, marker) {
    return new Promise((resolve, reject) => {
      if (marker && scriptPresent(marker)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.dataset.akAutoload = '1';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('No se pudo cargar ' + src));
      document.head.appendChild(script);
    });
  }

  window.__akSupabaseBoot = (async () => {
    try {
      if (!window.supabase) {
        if (scriptPresent('supabase-js-2.112.3.min.js')) {
          const started = Date.now();
          while (!window.supabase && Date.now() - started < 5000) {
            await new Promise((resolve) => setTimeout(resolve, 25));
          }
        } else {
          await loadScript('/assets/js/vendor/supabase-js-2.112.3.min.js', 'supabase-js-2.112.3.min.js');
        }
      }

      if (typeof window.akSupabase !== 'function' || window.akSupabase.__akFallback) {
        if (scriptPresent('supabase-config.js')) {
          const started = Date.now();
          while ((typeof window.akSupabase !== 'function' || window.akSupabase.__akFallback) && Date.now() - started < 5000) {
            await new Promise((resolve) => setTimeout(resolve, 25));
          }
        } else {
          await loadScript('/assets/js/supabase-config.js', 'supabase-config.js');
        }
      }
      return typeof window.akSupabase === 'function' && !window.akSupabase.__akFallback;
    } catch (error) {
      console.warn('Supabase no disponible en esta página:', error && error.message ? error.message : error);
      return false;
    }
  })();
}());

/* Aviso de urgencia por stock bajo — solo para productos físicos. */
function akStockUrgencia(product) {
  if (!product || !product.isProduct) return null;
  const actual = product.stockActual;
  if (actual === null || actual === undefined) return null;
  const umbral = product.stockMinimo || 5;
  if (actual <= 0) return null;
  if (actual <= umbral) return actual === 1 ? '¡Última unidad!' : `¡Quedan solo ${actual} unidades!`;
  return null;
}

function akMapProducto(row, variantesByProducto, valoracionesByProducto) {
  const valoracion = (valoracionesByProducto || {})[row.id];
  const rawVariants = (variantesByProducto && variantesByProducto[row.id]) || [];
  const variants = rawVariants.map((v) => ({
    id: v.variant_key,
    name: v.name,
    desc: v.description || '',
    price: Number(v.price) || 0,
  }));

  /* Nunca dejar selectedVariant undefined: si una ficha activa no tiene aún
     fila en tienda_producto_variantes, usamos price_from como opción base. */
  if (!variants.length) {
    variants.push({
      id: 'base',
      name: row.is_product ? 'Producto' : 'Servicio',
      desc: '',
      price: Number(row.price_from) || 0,
    });
  }

  return {
    id: row.id,
    name: row.name,
    category: row.category_id,
    brand: row.brand_id,
    type: row.type,
    icon: row.icon,
    image: row.image,
    images: row.images || [],
    badge: row.badge,
    priceFrom: Number(row.price_from) || 0,
    popularity: row.popularity || 0,
    stock: row.stock,
    stockActual: row.stock_actual,
    stockMinimo: row.stock_minimo,
    plazoEntrega: row.plazo_entrega,
    rating: valoracion ? Number(valoracion.media) : null,
    ratingCount: valoracion ? Number(valoracion.total) : 0,
    isProduct: !!row.is_product,
    isSoftware: !!row.is_software,
    keywords: row.keywords || [],
    shortDesc: row.short_desc || '',
    longDesc: row.long_desc || '',
    features: row.features || [],
    compatibility: row.compatibility || [],
    license: row.license,
    requirements: row.requirements || [],
    support: row.support,
    whatWeFix: row.what_we_fix || [],
    symptoms: row.symptoms || [],
    whatToSend: row.what_to_send || [],
    turnaround: row.turnaround,
    warranty: row.warranty,
    faqs: row.faqs || [],
    related: row.related || [],
    variants,
  };
}

let _akCatalogPromise = null;
const AK_CATALOG_CACHE_KEY = 'ak_catalog_public_v1';
const AK_CATALOG_CACHE_TTL = 15 * 60 * 1000;

function akApplyCatalogPayload(payload) {
  if (!payload || !Array.isArray(payload.products)) return false;

  CATEGORIES = Array.isArray(payload.categories) ? payload.categories : [];
  BRANDS = Array.isArray(payload.brands) ? payload.brands : [];

  const variantesByProducto = {};
  (payload.variants || []).forEach((v) => {
    (variantesByProducto[v.producto_id] = variantesByProducto[v.producto_id] || []).push(v);
  });

  const valoracionesByProducto = {};
  (payload.ratings || []).forEach((v) => { valoracionesByProducto[v.producto_id] = v; });
  CATALOG = payload.products.map((p) => akMapProducto(p, variantesByProducto, valoracionesByProducto));
  return CATALOG.length > 0;
}

function akReadCatalogCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(AK_CATALOG_CACHE_KEY) || 'null');
    if (!cached || !cached.savedAt || Date.now() - cached.savedAt > AK_CATALOG_CACHE_TTL) return null;
    return cached.payload || null;
  } catch (_) {
    return null;
  }
}

function akWriteCatalogCache(payload) {
  try {
    localStorage.setItem(AK_CATALOG_CACHE_KEY, JSON.stringify({ savedAt: Date.now(), payload }));
  } catch (_) {}
}

async function akFetchCatalogEndpoint() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 22000);
  try {
    const response = await fetch('/api/catalogo', {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error('catalogo_endpoint_' + response.status);
    const payload = await response.json();
    if (!payload || !Array.isArray(payload.products)) throw new Error('catalogo_respuesta_invalida');
    return payload;
  } finally {
    clearTimeout(timeout);
  }
}

async function akFetchCatalogDirect() {
  if (!(await akWaitForSupabase())) throw new Error('supabase_no_disponible');
  const client = window.akSupabase();
  const [catsResult, brandsResult, productsResult, variantsResult, ratingsResult] = await Promise.all([
    client.from('tienda_categorias').select('id, label').order('sort_order'),
    client.from('tienda_marcas').select('id, label').order('sort_order'),
    client.from('tienda_productos').select('*').eq('activo', true).order('sort_order'),
    client.from('tienda_producto_variantes').select('*').order('sort_order'),
    client.from('tienda_producto_valoraciones').select('*'),
  ]);
  const criticalError = catsResult.error || brandsResult.error || productsResult.error || variantsResult.error;
  if (criticalError) throw criticalError;
  return {
    categories: catsResult.data || [],
    brands: brandsResult.data || [],
    products: productsResult.data || [],
    variants: variantsResult.data || [],
    ratings: ratingsResult.data || [],
  };
}

async function akWaitForSupabase() {
  try {
    if (window.__akSupabaseBoot) await window.__akSupabaseBoot;
  } catch (_) {}

  const started = Date.now();
  while (
    (typeof window.akSupabase !== 'function' || window.akSupabase.__akFallback) &&
    Date.now() - started < 5000
  ) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return typeof window.akSupabase === 'function' && !window.akSupabase.__akFallback;
}

function akCatalogReady() {
  if (!_akCatalogPromise) {
    _akCatalogPromise = (async () => {
      const cached = akReadCatalogCache();
      if (cached && akApplyCatalogPayload(cached)) return;

      try {
        const payload = await akFetchCatalogEndpoint();
        if (!akApplyCatalogPayload(payload)) throw new Error('catalogo_vacio');
        akWriteCatalogCache(payload);
        return;
      } catch (endpointError) {
        console.warn('Ruta rápida del catálogo no disponible; usando conexión directa.', endpointError);
      }

      try {
        const payload = await akFetchCatalogDirect();
        if (!akApplyCatalogPayload(payload)) throw new Error('catalogo_vacio');
        akWriteCatalogCache(payload);
      } catch (directError) {
        console.error('No se pudo cargar el catálogo:', directError);
      }
    })();
  }
  return _akCatalogPromise;
}

function akFindProduct(id) {
  return CATALOG.find((p) => p.id === id) || null;
}

function akFindCategory(id) {
  return CATEGORIES.find((c) => c.id === id) || null;
}

function akFindBrand(id) {
  return BRANDS.find((b) => b.id === id) || null;
}

function akFormatPrice(n) {
  const value = Number(n);
  const safe = Number.isFinite(value) ? value : 0;
  return safe.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function akStarSvg(filled) {
  return '<svg viewBox="0 0 24 24" width="14" height="14" fill="' + (filled ? '#ef1f2b' : 'none') + '" stroke="' +
    (filled ? '#ef1f2b' : '#5f5f66') + '" stroke-width="1.6"><polygon points="12,2.5 15,9 22,10 16.8,14.7 18.2,21.5 12,18 5.8,21.5 7.2,14.7 2,10 9,9"/></svg>';
}

function akStarsHtml(rating, count) {
  if (!rating || !count) return '';
  const llenas = Math.round(rating);
  let stars = '';
  for (let i = 1; i <= 5; i++) stars += akStarSvg(i <= llenas);
  return '<span class="stars-row">' + stars +
    '<span class="stars-count">' + rating.toFixed(1) + ' (' + count + ')</span></span>';
}

function akStarsPlain(n) {
  let stars = '';
  for (let i = 1; i <= 5; i++) stars += akStarSvg(i <= n);
  return '<span class="stars-row">' + stars + '</span>';
}
