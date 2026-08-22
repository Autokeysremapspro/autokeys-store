/* Autokeys Remaps Pro Store — módulo de mensajería, listo para conectar.
   Cada transportista se activa poniendo su API key como variable de entorno
   en Vercel; hasta entonces, crearEnvio() lanza un error claro explicando
   qué falta, en vez de fallar de forma confusa. La integración real de
   cada API se completa cuando se disponga de contrato y documentación,
   ya que cada transportista tiene un formato distinto. */

const TRANSPORTISTAS = [
  { id: 'correos', label: 'Correos Express', envVar: 'CORREOS_API_KEY' },
  { id: 'seur', label: 'SEUR', envVar: 'SEUR_API_KEY' },
  { id: 'mrw', label: 'MRW', envVar: 'MRW_API_KEY' },
  { id: 'nacex', label: 'Nacex', envVar: 'NACEX_API_KEY' },
];

function getTransportista(id) {
  return TRANSPORTISTAS.find((t) => t.id === id) || null;
}

function estaConfigurado(id) {
  const t = getTransportista(id);
  return Boolean(t && process.env[t.envVar]);
}

/**
 * Crea un envío para el pedido dado con el transportista indicado.
 * Devuelve { numero_seguimiento, etiqueta_url } cuando la integración esté
 * implementada. Hasta entonces, lanza un error explicando qué falta.
 */
async function crearEnvio(transportistaId, pedido) {
  const t = getTransportista(transportistaId);
  if (!t) throw new Error(`Transportista desconocido: ${transportistaId}`);
  if (!process.env[t.envVar]) {
    throw new Error(`${t.label} todavía no está configurado (falta la variable ${t.envVar} en Vercel).`);
  }
  // Punto de conexión de la API real de cada transportista, pendiente de
  // implementar contra su documentación/contrato definitivo.
  throw new Error(`La integración con ${t.label} está pendiente de completar contra su API real.`);
}

module.exports = { TRANSPORTISTAS, getTransportista, estaConfigurado, crearEnvio };
