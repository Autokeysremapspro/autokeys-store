const { sendEmail } = require('../lib/resend-server');

const SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';
const STORE_URL = 'https://www.autokeysremapspro.es';
const FROM = 'Autokeys Remaps Pro Store <pedidos@autokeysremapspro.es>';

function serviceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || '';
}

async function db(path, options = {}) {
  const key = serviceKey();
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  if (!response.ok) throw new Error(`supabase_${response.status}`);
  return response.status === 204 ? null : response.json();
}

function money(value) {
  return Number(value || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}

function emailHtml(cart) {
  const link = `${STORE_URL}/carrito.html?recuperar=${encodeURIComponent(cart.recovery_token)}`;
  return `<!doctype html><html><body style="margin:0;background:#070708;font-family:Arial,Helvetica,sans-serif"><table role="presentation" width="100%"><tr><td align="center" style="padding:40px 16px"><table role="presentation" width="500" style="max-width:500px;width:100%;background:#111113;border:1px solid #29292f;border-radius:14px"><tr><td style="padding:26px 32px;text-align:center;border-bottom:1px solid #29292f"><img src="${STORE_URL}/assets/img/logo.png" width="160" alt="Autokeys Remaps Pro Store"></td></tr><tr><td style="padding:32px;color:#f6f6f7"><p style="margin:0 0 12px;color:#ef1f2b;font-size:11px;font-weight:900;letter-spacing:2px">TU CARRITO TE ESPERA</p><h1 style="font-size:23px;margin:0 0 14px">¿Quieres terminar tu pedido?</h1><p style="color:#a8a8b0;font-size:14px;line-height:1.65;margin:0">Guardamos los productos que dejaste en el carrito. El importe estimado era de <b style="color:#fff">${money(cart.subtotal)}</b>; al volver comprobaremos automáticamente su disponibilidad y precio actual.</p><table role="presentation" width="100%" style="margin-top:26px"><tr><td align="center"><a href="${link}" style="display:inline-block;background:#dc1823;color:#fff;text-decoration:none;font-size:14px;font-weight:800;padding:14px 26px;border-radius:9px">Recuperar mi carrito</a></td></tr></table><p style="color:#777780;font-size:11px;line-height:1.5;margin:25px 0 0">Recibes este único aviso porque lo autorizaste al revisar el carrito. El enlace caduca a los 7 días. No volveremos a recordártelo.</p></td></tr></table></td></tr></table></body></html>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return res.status(405).json({ error: 'metodo_no_permitido' });
  if (!process.env.CRON_SECRET) return res.status(503).json({ error: 'cron_no_configurado' });
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) return res.status(401).json({ error: 'no_autorizado' });
  if (!process.env.RESEND_API_KEY || !serviceKey()) return res.status(503).json({ error: 'servicio_no_configurado' });
  if (req.method === 'HEAD') return res.status(204).end();

  const before = new Date(Date.now() - 4 * 3600000).toISOString();
  const after = new Date(Date.now() - 7 * 86400000).toISOString();
  const query = `tienda_carritos?estado=eq.activo&consentimiento_recordatorio=eq.true&recordatorio_enviado_at=is.null&ultimo_evento_at=lte.${encodeURIComponent(before)}&ultimo_evento_at=gte.${encodeURIComponent(after)}&select=id,email,items,subtotal,recovery_token&order=ultimo_evento_at.asc&limit=50`;
  try {
    const carts = (await db(query)) || [];
    let sent = 0;
    for (const cart of carts) {
      if (!cart.email || !cart.recovery_token || !Array.isArray(cart.items) || !cart.items.length) continue;
      const now = new Date().toISOString();
      const claimed = await db(`tienda_carritos?id=eq.${encodeURIComponent(cart.id)}&estado=eq.activo&recordatorio_enviado_at=is.null&select=id`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ recordatorio_enviado_at: now, updated_at: now }) });
      if (!claimed || !claimed.length) continue;
      try {
        await sendEmail({ from: FROM, to: cart.email, subject: 'Tu carrito de Autokeys sigue disponible', html: emailHtml(cart) });
        sent += 1;
      } catch (error) {
        await db(`tienda_carritos?id=eq.${encodeURIComponent(cart.id)}&recordatorio_enviado_at=eq.${encodeURIComponent(now)}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ recordatorio_enviado_at: null, updated_at: new Date().toISOString() }) });
        console.error('No se pudo enviar recordatorio:', error);
      }
    }
    res.status(200).json({ revisados: carts.length, enviados: sent });
  } catch (error) {
    console.error('recordar-carritos error:', error);
    res.status(500).json({ error: 'error_interno' });
  }
};
