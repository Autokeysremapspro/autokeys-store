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

function akMapProducto(row, variantesByProducto) {
  return {
    id: row.id,
    name: row.name,
    category: row.category_id,
    brand: row.brand_id,
    type: row.type,
    icon: row.icon,
    image: row.image,
    badge: row.badge,
    priceFrom: Number(row.price_from) || 0,
    popularity: row.popularity || 0,
    stock: row.stock,
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
      const [{ data: cats, error: e1 }, { data: brands, error: e2 }, { data: productos, error: e3 }, { data: variantes, error: e4 }] =
        await Promise.all([
          client.from('tienda_categorias').select('id, label').order('sort_order'),
          client.from('tienda_marcas').select('id, label').order('sort_order'),
          client.from('tienda_productos').select('*').eq('activo', true).order('sort_order'),
          client.from('tienda_producto_variantes').select('*').order('sort_order'),
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
      CATALOG = (productos || []).map((p) => akMapProducto(p, variantesByProducto));
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
