const SITE = 'https://www.autokeysremapspro.es';
const SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';

function serviceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || '';
}

function cleanSlug(value) {
  const slug = String(value || '').trim();
  return /^[a-z0-9][a-z0-9-]{0,159}$/.test(slug) ? slug : '';
}

function go(res, path, permanent = true) {
  const status = permanent ? 301 : 302;
  res.setHeader('Location', `${SITE}${path}`);
  res.setHeader('Cache-Control', permanent ? 'public, max-age=86400' : 'no-store');
  return res.status(status).end();
}

async function productKind(id) {
  const key = serviceKey();
  if (!key) throw new Error('missing_service_key');

  const query = new URLSearchParams({
    select: 'id,is_product',
    id: `eq.${id}`,
    limit: '1',
  });

  const response = await fetch(`${SUPABASE_URL}/rest/v1/tienda_productos?${query.toString()}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });

  if (!response.ok) throw new Error(`supabase_${response.status}`);
  const rows = await response.json();
  return rows[0] || null;
}

module.exports = async function handler(req, res) {
  const type = String(req.query.type || '').trim();

  if (type === 'blog') {
    const slug = cleanSlug(req.query.slug);
    if (!slug) return go(res, '/blog.html');
    return go(res, `/guias/${encodeURIComponent(slug)}`);
  }

  if (type === 'product') {
    const id = cleanSlug(req.query.id);
    if (!id) return go(res, '/tienda.html');

    try {
      const row = await productKind(id);
      if (!row) return go(res, '/tienda.html', false);
      const section = row.is_product ? 'productos' : 'servicios';
      return go(res, `/${section}/${encodeURIComponent(id)}`);
    } catch (error) {
      console.error('legacy product redirect:', error);
      // Do not make an incorrect permanent redirect if the lookup is temporarily unavailable.
      return go(res, '/tienda.html', false);
    }
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.status(404).send('Not found');
};
