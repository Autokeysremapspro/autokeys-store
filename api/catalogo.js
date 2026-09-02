const SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_UMSdVTexHpOImBBonUJKdw_s7XgKVeq';

async function readPublicTable(path, { optional = false } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        Accept: 'application/json',
      },
      signal: controller.signal,
    });
    if (!response.ok) {
      if (optional) return [];
      throw new Error(`catalogo_upstream_${response.status}`);
    }
    const payload = await response.json();
    return Array.isArray(payload) ? payload : [];
  } catch (error) {
    if (optional) return [];
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).json({ error: 'metodo_no_permitido' });
  }

  try {
    const [categories, brands, products, variants, ratings] = await Promise.all([
      readPublicTable('tienda_categorias?select=id,label&order=sort_order'),
      readPublicTable('tienda_marcas?select=id,label&order=sort_order'),
      readPublicTable('tienda_productos?select=*&activo=eq.true&order=sort_order'),
      readPublicTable('tienda_producto_variantes?select=*&order=sort_order'),
      readPublicTable('tienda_producto_valoraciones?select=*', { optional: true }),
    ]);

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    res.setHeader('CDN-Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    if (req.method === 'HEAD') return res.status(200).end();
    return res.status(200).json({ categories, brands, products, variants, ratings });
  } catch (error) {
    console.error('catalogo:', error);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).json({ error: 'catalogo_temporalmente_no_disponible' });
  }
};
