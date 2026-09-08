const {
  pagosConfigurados,
  createHostedCheckout,
  getSolicitudByToken,
  updateSolicitud,
  reverificarYActualizarPago,
} = require('../lib/sumup-server');

const SITE_URL = 'https://www.autokeysremapspro.es';
const TOKEN_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PUBLIC_FIELDS = [
  'numero', 'estado', 'created_at', 'updated_at', 'tipo_unidad', 'trabajo_solicitado',
  'marca', 'modelo', 'anio', 'motorizacion', 'metodo_envio', 'plazo_estimado',
  'presupuesto_total', 'presupuesto_detalle', 'presupuesto_aceptado_at',
  'presupuesto_lineas', 'presupuesto_validez_dias', 'presupuesto_observaciones',
  'presupuesto_enviado_at',
  'pago_estado', 'pago_confirmado_at',
];

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 12000) throw new Error('payload_grande');
  }
  try { return JSON.parse(raw || '{}'); } catch { return {}; }
}

function publicRequest(solicitud) {
  return Object.fromEntries(PUBLIC_FIELDS.map((key) => [key, solicitud[key]]));
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Referrer-Policy', 'no-referrer');
  if (req.method !== 'POST') return res.status(405).json({ error: 'metodo_no_permitido' });

  try {
    const body = await readJson(req);
    const token = String(body.token || '').trim();
    const action = String(body.action || 'consultar');
    if (!TOKEN_RE.test(token)) return res.status(400).json({ error: 'enlace_invalido' });

    let solicitud = await getSolicitudByToken(token);
    if (!solicitud) return res.status(404).json({ error: 'solicitud_no_encontrada' });

    if (action === 'consultar') return res.status(200).json({ solicitud: publicRequest(solicitud) });

    if (action === 'confirmar_pago') {
      if (solicitud.pago_referencia && solicitud.pago_estado !== 'pagado' && pagosConfigurados()) {
        await reverificarYActualizarPago(solicitud.pago_referencia);
        solicitud = await getSolicitudByToken(token);
      }
      return res.status(200).json({ solicitud: publicRequest(solicitud) });
    }

    if (action !== 'aceptar_y_pagar') return res.status(400).json({ error: 'accion_invalida' });
    if (!pagosConfigurados()) return res.status(503).json({ error: 'pagos_no_configurados' });
    if (solicitud.pago_estado === 'pagado') return res.status(409).json({ error: 'presupuesto_ya_pagado' });
    if (solicitud.estado !== 'presupuesto_enviado' && solicitud.estado !== 'pendiente_pago') {
      return res.status(409).json({ error: 'presupuesto_no_disponible' });
    }
    const total = Number(solicitud.presupuesto_total);
    if (!Number.isFinite(total) || total <= 0) return res.status(409).json({ error: 'importe_no_disponible' });

    const checkout = await createHostedCheckout({
      checkoutReference: `SOL-${solicitud.numero}-${Date.now()}`.slice(0, 64),
      amount: total,
      description: `Reparación ${solicitud.numero} — Autokeys Remaps Pro`,
      redirectUrl: `${SITE_URL}/mi-solicitud.html?pago=retorno`,
      returnUrl: `${SITE_URL}/api/sumup-webhook`,
    });
    if (!checkout?.id || !checkout?.hosted_checkout_url) throw new Error('sumup_sin_url');

    await updateSolicitud(solicitud.id, {
      estado: 'pendiente_pago',
      pago_estado: 'pendiente',
      pago_referencia: checkout.id,
      presupuesto_aceptado_at: solicitud.presupuesto_aceptado_at || new Date().toISOString(),
    });
    return res.status(200).json({ hosted_checkout_url: checkout.hosted_checkout_url });
  } catch (error) {
    console.error('portal-solicitud:', error);
    return res.status(500).json({ error: 'error_interno' });
  }
};
