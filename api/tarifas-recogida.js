const SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';

function serviceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || '';
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'metodo_no_permitido' });
  const key = serviceKey();
  if (!key) return res.status(503).json({ error: 'configuracion_no_disponible' });
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/tienda_configuracion?id=eq.true&select=recogida_precio_hasta_5kg,recogida_precio_hasta_10kg,recogida_precio_kg_adicional`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!response.ok) throw new Error(`supabase_${response.status}`);
    const [row] = await response.json();
    if (!row) throw new Error('tarifas_no_encontradas');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=900');
    return res.status(200).json({
      hasta5: Number(row.recogida_precio_hasta_5kg),
      hasta10: Number(row.recogida_precio_hasta_10kg),
      adicional: Number(row.recogida_precio_kg_adicional),
    });
  } catch (error) {
    console.error('tarifas-recogida:', error);
    return res.status(500).json({ error: 'no_se_pudieron_cargar_las_tarifas' });
  }
};
