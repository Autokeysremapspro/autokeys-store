const { sendEmail } = require('../lib/resend-server');

const SUPABASE_URL = 'https://pbldwfzzyofpbpojzsjg.supabase.co';
const FROM = 'Autokeys Remaps Pro Store <pedidos@autokeysremapspro.es>';

const METODO_PAGO_LABEL = {
  tarjeta: 'Tarjeta (SumUp)',
  transferencia: 'Transferencia bancaria',
  contrarreembolso: 'Contrarreembolso',
};

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let data = '';
  for await (const chunk of req) data += chunk;
  try {
    return JSON.parse(data || '{}');
  } catch {
    return {};
  }
}

function getServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || '';
}

async function supabaseAdminRequest(path) {
  const key = getServiceRoleKey();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('No se pudo leer el pedido en Supabase');
  return res.json();
}

function formatPrice(n) {
  return Number(n || 0).toFixed(2).replace('.', ',') + ' €';
}

function lineaHtml(l) {
  const nombre = l.variante_nombre && l.variante_nombre !== l.producto_nombre
    ? `${l.producto_nombre} — ${l.variante_nombre}`
    : l.producto_nombre;
  return `<tr>
    <td style="padding:9px 0;border-bottom:1px solid #1f1f24;color:#f6f6f7;font-size:13px">${nombre}${l.referencia_vehiculo ? `<br><span style="color:#85858e;font-size:11.5px">${l.referencia_vehiculo}</span>` : ''}</td>
    <td style="padding:9px 0;border-bottom:1px solid #1f1f24;color:#85858e;font-size:13px;text-align:center">x${l.cantidad}</td>
    <td style="padding:9px 0;border-bottom:1px solid #1f1f24;color:#f6f6f7;font-size:13px;text-align:right">${formatPrice(l.precio_unitario * l.cantidad)}</td>
  </tr>`;
}

function emailShell(eyebrow, titulo, bodyHtml) {
  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#070708;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px">
    <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:#111113;border:1px solid #29292f;border-radius:14px;overflow:hidden">
      <tr><td style="padding:26px 32px;text-align:center;border-bottom:1px solid #1f1f24">
        <img src="https://www.autokeysremapspro.es/assets/img/logo.png" alt="Autokeys Remaps Pro Store" width="150" style="display:block;margin:0 auto;height:auto;max-width:150px">
      </td></tr>
      <tr><td style="padding:32px">
        <p style="font-size:10px;letter-spacing:2px;color:#f13a44;font-weight:900;text-transform:uppercase;margin:0 0 14px">${eyebrow}</p>
        <h1 style="font-size:21px;margin:0 0 14px;color:#f6f6f7;line-height:1.3">${titulo}</h1>
        ${bodyHtml}
      </td></tr>
      <tr><td style="padding:20px 32px;background:#0c0c0e;border-top:1px solid #1f1f24;text-align:center">
        <p style="font-size:11.5px;color:#85858e;margin:0 0 6px;font-weight:800;letter-spacing:.5px">AUTOKEYS REMAPS PRO STORE</p>
        <p style="font-size:11.5px;color:#85858e;margin:0;line-height:1.7">
          <a href="tel:+34632982646" style="color:#85858e;text-decoration:none">+34 632 98 26 46</a> &middot;
          <a href="mailto:info@autokeyspro.es" style="color:#85858e;text-decoration:none">info@autokeyspro.es</a>
        </p>
      </td></tr>
    </table>
  </td></tr></table>
</body>
</html>`;
}

function emailButton(href, label) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:26px"><tr><td align="center">
    <a href="${href}" style="display:inline-block;background-color:#d9131e;background-image:linear-gradient(180deg,#e51e29,#d9131e);color:#fff;font-size:13px;font-weight:800;text-decoration:none;padding:13px 28px;border-radius:10px">${label}</a>
  </td></tr></table>`;
}

function pedidoHtml(pedido, lineas) {
  const filas = lineas.map(lineaHtml).join('');
  const metodo = METODO_PAGO_LABEL[pedido.metodo_pago] || pedido.metodo_pago;
  const notaPago = pedido.metodo_pago === 'tarjeta'
    ? 'En cuanto se confirme el cobro con la tarjeta, te lo notificaremos.'
    : 'Nuestro equipo te contactará en breve para confirmar el pago y los detalles.';

  const body = `
        <p style="font-size:14px;color:#a8a8b0;line-height:1.6;margin:0 0 24px">Hemos recibido tu pedido <b style="color:#f6f6f7">#${pedido.numero}</b> correctamente. ${notaPago}</p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px">${filas}</table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;color:#f6f6f7">
          <tr><td style="padding:2px 0;color:#a8a8b0">Subtotal</td><td style="text-align:right">${formatPrice(pedido.subtotal)}</td></tr>
          ${Number(pedido.descuento) > 0 ? `<tr><td style="padding:2px 0;color:#39d17d">Descuento${pedido.cupon ? ` (${pedido.cupon})` : ''}</td><td style="text-align:right;color:#39d17d">-${formatPrice(pedido.descuento)}</td></tr>` : ''}
          <tr><td style="padding:10px 0 0;font-weight:800;color:#f6f6f7;border-top:1px solid #1f1f24">Total</td><td style="text-align:right;padding:10px 0 0;font-weight:800;color:#f6f6f7;border-top:1px solid #1f1f24">${formatPrice(pedido.total)}</td></tr>
        </table>

        <p style="font-size:12px;color:#85858e;margin:24px 0 0">Método de pago: ${metodo}</p>
        <p style="font-size:12px;color:#85858e;margin:4px 0 0">Envío a: ${pedido.direccion}, ${pedido.codigo_postal} ${pedido.ciudad}, ${pedido.provincia}</p>

        ${emailButton(`https://www.autokeysremapspro.es/seguimiento.html?id=${pedido.id}`, 'Seguir mi pedido')}`;

  return emailShell('Pedido recibido', '¡Gracias por tu pedido!', body);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'metodo_no_permitido' });
    return;
  }

  const body = await readJsonBody(req);
  const pedidoId = body.pedido_id;
  if (!pedidoId) {
    res.status(400).json({ error: 'falta_pedido_id' });
    return;
  }

  try {
    const [pedidos, lineas] = await Promise.all([
      supabaseAdminRequest(`tienda_pedidos?id=eq.${encodeURIComponent(pedidoId)}&select=*`),
      supabaseAdminRequest(`tienda_pedido_lineas?pedido_id=eq.${encodeURIComponent(pedidoId)}&select=*&order=created_at`),
    ]);
    const pedido = pedidos[0];
    if (!pedido || !pedido.email) {
      res.status(404).json({ error: 'pedido_no_encontrado' });
      return;
    }

    await sendEmail({
      from: FROM,
      to: pedido.email,
      subject: `Pedido #${pedido.numero} recibido — Autokeys Remaps Pro Store`,
      html: pedidoHtml(pedido, lineas),
    });

    res.status(200).json({ enviado: true });
  } catch (err) {
    console.error('enviar-confirmacion-pedido error:', err);
    res.status(500).json({ error: 'error_interno' });
  }
};
