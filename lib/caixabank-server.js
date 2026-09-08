/* Autokeys Remaps Pro Store — módulo de pago con CaixaBank, preparado pero
   inactivo hasta que se configuren credenciales reales.

   IMPORTANTE: CaixaBank no ofrece una API tipo "checkout alojado" como SumUp.
   El comercio se integra normalmente vía Redsys (TPV Virtual), con un modelo
   de notificación firmada (el banco envía el resultado del pago a una URL
   propia, firmado con una clave HMAC SHA-256), no con una consulta de estado
   tipo GET. Implementar esa verificación de firma sin la documentación y las
   claves reales del comercio sería adivinar un mecanismo de seguridad crítico
   — por eso este módulo expone la misma forma que lib/sumup-server.js
   (para que api/crear-pago.js pueda elegir proveedor sin cambios), pero
   createHostedCheckout lanza un error controlado en vez de intentar una
   integración no verificada. pagosConfigurados() devuelve false mientras no
   existan las variables de entorno, así que el checkout con CaixaBank queda
   deshabilitado de forma segura aunque se seleccione como método activo en
   el admin. */

function isPreview() {
  return process.env.VERCEL_ENV === 'preview';
}

function getCaixaBankMerchantId() {
  return isPreview() ? process.env.CAIXABANK_SANDBOX_MERCHANT_ID : process.env.AK_CAIXABANK_LIVE_MERCHANT_ID;
}

function getCaixaBankSecretKey() {
  return isPreview() ? process.env.CAIXABANK_SANDBOX_SECRET_KEY : process.env.AK_CAIXABANK_LIVE_SECRET_KEY;
}

function getServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE || '';
}

function pagosConfigurados() {
  return Boolean(getCaixaBankMerchantId() && getCaixaBankSecretKey() && getServiceRoleKey());
}

async function createHostedCheckout() {
  // No se llega aquí en producción: api/crear-pago.js comprueba
  // pagosConfigurados() antes de invocar esta función.
  throw new Error(
    'caixabank_no_implementado: falta integrar Redsys/CaixaBank con documentación y credenciales reales antes de aceptar pagos.'
  );
}

const { getPedido, updatePedido } = require('./sumup-server');

module.exports = {
  pagosConfigurados,
  createHostedCheckout,
  getPedido,
  updatePedido,
};
