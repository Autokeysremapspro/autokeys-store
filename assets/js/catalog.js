/* AutoKeys Remaps Pro Store — product/service catalog.
   Loaded from Supabase (tienda_categorias / tienda_marcas / tienda_productos /
   tienda_producto_variantes, public anon key, RLS: solo lectura pública de
   productos activos) so it can be managed from autokeys-admin. Every page
   must `await akCatalogReady()` before reading CATEGORIES / CATALOG / BRANDS —
   the shape of each product object is unchanged from the old static file, so
   nothing else in index.html / tienda.html / producto.html needs to change. */

let CATEGORIES = [];
let BRANDS = [];
let CATALOG = [];

const SERVICE_TYPES = [
  { id: 'taller', label: 'Presencial / Taller' },
  { id: 'remoto', label: 'Remoto' },
  { id: 'envio', label: 'Por envío' },
];

const GENERIC_PROCESS = [
  { title: 'Realiza tu pedido', desc: 'Configura el servicio con los datos básicos.' },
  { title: 'Envíanos tu unidad', desc: 'Prepara la unidad para el envío al laboratorio.' },
  { title: 'Diagnosticamos', desc: 'Confirmamos el fallo y te damos presupuesto sin compromiso.' },
  { title: 'Reparamos y probamos', desc: 'Analizamos, recuperamos y verificamos en banco.' },
  { title: 'Devolución rápida', desc: 'Recibes la unidad lista, con garantía por escrito.' },
];

const GENERIC_FAQS = [
  { q: '¿Podéis recuperar una unidad que no comunica?', a: 'Depende del daño y del estado de la memoria. La compatibilidad se revisa antes de procesar el trabajo.' },
  { q: '¿Necesitáis el vehículo?', a: 'En muchos casos el trabajo puede realizarse sobre la unidad enviada, pero algunos procesos pueden requerir información adicional.' },
  { q: '¿Incluye garantía?', a: 'Los trabajos validados incluyen garantía según el servicio realizado y el material recibido.' },
];

/* Aviso de urgencia por stock bajo — solo para productos físicos con
   stock_actual numérico, no para servicios (que no tienen unidades). */
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
    requiereEnvio: !!row.requiere_envio,
    pesoEnvioKg: Number(row.peso_envio_kg) || 0,
    voluminoso: !!row.voluminoso,
    excluidoEnvioGratis: !!row.excluido_envio_gratis,
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
    variants: (variantesByProducto[row.id] || []).map((v) => ({
      id: v.variant_key,
      name: v.name,
      desc: v.description || '',
      price: Number(v.price) || 0,
      pesoEnvioKg: v.peso_envio_kg === null || v.peso_envio_kg === undefined ? null : Number(v.peso_envio_kg),
    })),
  };
}

let _akCatalogPromise = null;

/* Carga (una sola vez) categorías/marcas/productos/variantes desde Supabase
   y rellena CATEGORIES/BRANDS/CATALOG. Todas las páginas que lean esas
   variables deben esperar esta promesa primero. */
function akCatalogReady() {
  if (!_akCatalogPromise) {
    _akCatalogPromise = (async () => {
      const client = akSupabase();
      const [{ data: cats, error: e1 }, { data: brands, error: e2 }, { data: productos, error: e3 }, { data: variantes, error: e4 }, { data: valoraciones }] =
        await Promise.all([
          client.from('tienda_categorias').select('id, label').order('sort_order'),
          client.from('tienda_marcas').select('id, label').order('sort_order'),
          client.from('tienda_productos').select('*').eq('activo', true).order('sort_order'),
          client.from('tienda_producto_variantes').select('*').order('sort_order'),
          client.from('tienda_producto_valoraciones').select('*'),
        ]);
      if (e1 || e2 || e3 || e4) {
        console.error('No se pudo cargar el catálogo:', e1 || e2 || e3 || e4);
        return;
      }
      CATEGORIES = cats || [];
      BRANDS = brands || [];
      const variantesByProducto = {};
      (variantes || []).forEach((v) => {
        (variantesByProducto[v.producto_id] = variantesByProducto[v.producto_id] || []).push(v);
      });
      const valoracionesByProducto = {};
      (valoraciones || []).forEach((v) => { valoracionesByProducto[v.producto_id] = v; });
      CATALOG = (productos || []).map((p) => akMapProducto(p, variantesByProducto, valoracionesByProducto));
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
  return n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function akStarSvg(filled) {
  return '<svg viewBox="0 0 24 24" width="14" height="14" fill="' + (filled ? '#ef1f2b' : 'none') + '" stroke="' +
    (filled ? '#ef1f2b' : '#5f5f66') + '" stroke-width="1.6"><polygon points="12,2.5 15,9 22,10 16.8,14.7 18.2,21.5 12,18 5.8,21.5 7.2,14.7 2,10 9,9"/></svg>';
}

/* Fila de estrellas + nº de reseñas, o cadena vacía si el producto no tiene ninguna. */
function akStarsHtml(rating, count) {
  if (!rating || !count) return '';
  const llenas = Math.round(rating);
  let stars = '';
  for (let i = 1; i <= 5; i++) stars += akStarSvg(i <= llenas);
  return '<span class="stars-row">' + stars +
    '<span class="stars-count">' + rating.toFixed(1) + ' (' + count + ')</span></span>';
}

/* Igual que akStarsHtml pero para una puntuación fija (1-5), sin contador —
   usado en cada reseña individual y en el selector al escribir una nueva. */
function akStarsPlain(n) {
  let stars = '';
  for (let i = 1; i <= 5; i++) stars += akStarSvg(i <= n);
  return '<span class="stars-row">' + stars + '</span>';
}
