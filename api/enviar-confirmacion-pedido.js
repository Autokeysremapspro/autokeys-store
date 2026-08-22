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
    <td style="padding:8px 0;border-bottom:1px solid #27272a;color:#e4e4e7;font-size:13px">${nombre}${l.referencia_vehiculo ? `<br><span style="color:#a1a1aa;font-size:12px">${l.referencia_vehiculo}</span>` : ''}</td>
    <td style="padding:8px 0;border-bottom:1px solid #27272a;color:#a1a1aa;font-size:13px;text-align:center">x${l.cantidad}</td>
    <td style="padding:8px 0;border-bottom:1px solid #27272a;color:#e4e4e7;font-size:13px;text-align:right">${formatPrice(l.precio_unitario * l.cantidad)}</td>
  </tr>`;
}

function pedidoHtml(pedido, lineas) {
  const filas = lineas.map(lineaHtml).join('');
  const metodo = METODO_PAGO_LABEL[pedido.metodo_pago] || pedido.metodo_pago;
  const notaPago = pedido.metodo_pago === 'tarjeta'
    ? 'En cuanto se confirme el cobro con la tarjeta, te lo notificaremos.'
    : 'Nuestro equipo te contactará en breve para confirmar el pago y los detalles.';

  return `<!doctype html>
<html>
<body style="font-family:Arial,Helvetica,sans-serif;background:#f4f4f5;padding:32px 0;margin:0;">
  <table role="presentation" width="100%"><tr><td align="center">
    <table role="presentation" width="480" style="background:#111113;border-radius:8px;padding:32px;">
      <tr><td>
        <p style="font-size:13px;letter-spacing:1px;color:#ef1f2b;font-weight:700;text-transform:uppercase;margin:0 0 16px">Autokeys Remaps Pro Store</p>
        <h1 style="font-size:20px;margin:0 0 8px;color:#fff">¡Gracias por tu pedido!</h1>
        <p style="font-size:14px;color:#a1a1aa;line-height:1.5;margin:0 0 24px">Hemos recibido tu pedido <b style="color:#fff">#${pedido.numero}</b> correctamente. ${notaPago}</p>

        <table role="presentation" width="100%" style="margin-bottom:16px">${filas}</table>

        <table role="presentation" width="100%" style="font-size:13px;color:#e4e4e7">
          <tr><td style="padding:2px 0">Subtotal</td><td style="text-align:right">${formatPrice(pedido.subtotal)}</td></tr>
          ${Number(pedido.descuento) > 0 ? `<tr><td style="padding:2px 0;color:#22c55e">Descuento${pedido.cupon ? ` (${pedido.cupon})` : ''}</td><td style="text-align:right;color:#22c55e">-${formatPrice(pedido.descuento)}</td></tr>` : ''}
          <tr><td style="padding:8px 0 0;font-weight:700;color:#fff;border-top:1px solid #27272a">Total</td><td style="text-align:right;padding:8px 0 0;font-weight:700;color:#fff;border-top:1px solid #27272a">${formatPrice(pedido.total)}</td></tr>
        </table>

        <p style="font-size:12px;color:#71717a;margin:24px 0 0">Método de pago: ${metodo}</p>
        <p style="font-size:12px;color:#71717a;margin:4px 0 0">Envío a: ${pedido.direccion}, ${pedido.codigo_postal} ${pedido.ciudad}, ${pedido.provincia}</p>
      </td></tr>
    </table>
  </td></tr></table>
</body>
</html>`;
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
