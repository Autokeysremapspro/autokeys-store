export const config = {
  matcher: ['/producto.html', '/blog-post.html'],
};

function cleanSlug(value) {
  const slug = String(value || '').trim();
  return /^[a-z0-9][a-z0-9-]{0,159}$/.test(slug) ? slug : '';
}

export default async function middleware(request) {
  const url = new URL(request.url);

  if (url.pathname === '/blog-post.html') {
    const slug = cleanSlug(url.searchParams.get('slug'));
    const destination = new URL(slug ? `/guias/${encodeURIComponent(slug)}` : '/blog.html', url.origin);
    return Response.redirect(destination, 301);
  }

  if (url.pathname === '/producto.html') {
    const id = cleanSlug(url.searchParams.get('id'));
    if (!id) return Response.redirect(new URL('/tienda.html', url.origin), 301);

    const endpoint = new URL('/api/legacy-seo-redirect', url.origin);
    endpoint.searchParams.set('type', 'product');
    endpoint.searchParams.set('id', id);

    try {
      const upstream = await fetch(endpoint, {
        method: 'GET',
        redirect: 'manual',
        headers: { 'x-ak-legacy-middleware': '1' },
      });

      return new Response(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers: upstream.headers,
      });
    } catch (error) {
      console.error('legacy middleware product redirect:', error);
      return Response.redirect(new URL('/tienda.html', url.origin), 302);
    }
  }

  return new Response('Not found', { status: 404 });
}
