/* AutoKeys Remaps Pro Store — product/service catalog (static data)
   In a future phase this file is replaced by calls to a real backend/API;
   every page reads through the same shape so that swap stays localized here. */

const CATEGORIES = [
  { id: 'recuperacion-ecu', label: 'Recuperación ECU' },
  { id: 'clonacion-ecu', label: 'Clonación ECU' },
  { id: 'modulos', label: 'Módulos y centralitas' },
  { id: 'inmovilizadores', label: 'Inmovilizadores' },
  { id: 'programadores', label: 'Programadores' },
  { id: 'software', label: 'Software y licencias' },
  { id: 'diagnostico', label: 'Diagnóstico' },
  { id: 'reparacion-envio', label: 'Reparación por envío' },
];

const BRANDS = [
  { id: 'bmw', label: 'BMW' },
  { id: 'mercedes', label: 'Mercedes-Benz' },
  { id: 'audi', label: 'Audi' },
  { id: 'vw', label: 'Volkswagen' },
  { id: 'bosch', label: 'Bosch' },
  { id: 'multi', label: 'Todas las marcas' },
];

const SERVICE_TYPES = [
  { id: 'taller', label: 'Presencial / Taller' },
  { id: 'remoto', label: 'Remoto' },
  { id: 'envio', label: 'Por envío' },
];

const GENERIC_PROCESS = [
  { title: 'Realiza tu pedido', desc: 'Configura el servicio con los datos básicos.' },
  { title: 'Envíanos tu unidad', desc: 'Prepara la unidad para el envío al laboratorio.' },
  { title: 'Diagnosticamos', desc: 'Confirmamos el fallo y te damos presupuesto sin compromiso.' },
  { title: 'Reparamos y probamos', desc: 'Analizamos, recuperamos y verificamos en banco.' },
  { title: 'Devolución rápida', desc: 'Recibes la unidad lista, con garantía por escrito.' },
];

const GENERIC_FAQS = [
  { q: '¿Podéis recuperar una unidad que no comunica?', a: 'Depende del daño y del estado de la memoria. La compatibilidad se revisa antes de procesar el trabajo.' },
  { q: '¿Necesitáis el vehículo?', a: 'En muchos casos el trabajo puede realizarse sobre la unidad enviada, pero algunos procesos pueden requerir información adicional.' },
  { q: '¿Incluye garantía?', a: 'Los trabajos validados incluyen garantía según el servicio realizado y el material recibido.' },
];

const CATALOG = [
  {
    id: 'recuperacion-bosch-edc17cp54',
    name: 'Recuperación Bosch EDC17CP54',
    category: 'recuperacion-ecu',
    brand: 'bosch',
    type: 'envio',
    icon: 'ecu',
    badge: 'SERVICIO ESPECIALIZADO',
    priceFrom: 349,
    popularity: 98,
    stock: 'envio',
    shortDesc: 'Recuperación de centralitas con fallo interno, clonado y reparación de memoria.',
    longDesc: 'Recuperamos tu centralita Bosch EDC17CP54 con fallo interno, clonación, lectura, escritura y reparación a nivel de componente.',
    features: ['Reparación a nivel de componente', 'Clonación y respaldo de datos', 'Garantía de reparación', 'Pruebas en banco y verificación'],
    variants: [
      { id: 'estandar', name: 'Recuperación estándar', desc: 'Diagnóstico y reparación del fallo. Pruebas y verificación.', price: 349 },
      { id: 'clonacion', name: 'Clonación + Recuperación', desc: 'Clonamos datos completos y reparamos la centralita.', price: 499 },
      { id: 'urgente', name: 'Recuperación urgente 24/48h', desc: 'Prioridad en el proceso. Entrega en 24/48h.', price: 599 },
    ],
    whatWeFix: ['Fallo de arranque / No comunica', 'Fallo interno de la ECU', 'Corrupción de memoria / Software dañado', 'Fallo de alimentación interna', 'Daños por tensión / Picos de voltaje', 'Centralita bloqueada / Inmovilizada'],
    symptoms: ['El vehículo no arranca o se para', 'Testigo de avería encendido', 'Pérdida de potencia', 'Modo emergencia', 'Consumo elevado', 'Fallos intermitentes'],
    whatToSend: ['Centralita Bosch EDC17CP54', 'Número de parte legible', 'Descripción del fallo', 'Datos del vehículo (opcional)', 'Llave / ficha si aplica'],
    turnaround: '2 a 4 días laborables',
    warranty: '6 meses de garantía',
    faqs: [
      { q: '¿La centralita queda como nueva?', a: 'Sí, se restaura a un estado funcional completo, con pruebas en banco antes del envío.' },
      { q: '¿Perderé la programación de mi vehículo?', a: 'No, preservamos los datos originales siempre que sea posible; si no, te lo indicamos antes de proceder.' },
      { q: '¿Qué pasa si mi centralita no tiene reparación?', a: 'Si tras el diagnóstico no es reparable, no se cobra el servicio y te proponemos alternativas (clonación o sustitución).' },
      { q: '¿Hacéis clonación de la centralita?', a: 'Sí, disponemos de la opción de clonación + recuperación como servicio adicional.' },
    ],
    related: ['clonacion-ecu-general', 'reparacion-garantizada', 'inmovilizadores-programacion', 'programadores-multimarca'],
  },
  {
    id: 'clonacion-ecu-general',
    name: 'Clonación ECU',
    category: 'clonacion-ecu',
    brand: 'bosch',
    type: 'envio',
    icon: 'ecu',
    badge: 'SERVICIO',
    priceFrom: 249,
    popularity: 82,
    stock: 'envio',
    shortDesc: 'Clonación de centralitas originales y de reemplazo. Datos 100% preservados.',
    longDesc: 'Transferencia de datos entre unidad original y unidad donante compatible, sin pérdida de configuración ni códigos.',
    features: ['Plug & Play', 'Sin pérdida de datos', 'Compatibilidad total'],
    variants: [
      { id: 'estandar', name: 'Clonación estándar', desc: 'Transferencia completa de datos a unidad donante.', price: 249 },
      { id: 'urgente', name: 'Clonación urgente 24/48h', desc: 'Prioridad en el proceso. Entrega en 24/48h.', price: 349 },
    ],
    whatWeFix: ['Sustitución de centralita dañada', 'Cambio por unidad donante', 'Pérdida total de comunicación'],
    symptoms: ['Centralita no reparable', 'Unidad quemada o con daño físico', 'Sustitución tras accidente'],
    whatToSend: ['Centralita original', 'Centralita donante compatible', 'Datos del vehículo'],
    turnaround: '2 a 3 días laborables',
    warranty: '6 meses de garantía',
    related: ['recuperacion-bosch-edc17cp54', 'reparacion-garantizada', 'bmw-fem-bdc'],
  },
  {
    id: 'bmw-fem-bdc',
    name: 'BMW FEM / BDC',
    category: 'modulos',
    brand: 'bmw',
    type: 'envio',
    icon: 'module',
    priceFrom: 349,
    popularity: 76,
    stock: 'envio',
    shortDesc: 'Reparación y clonación de módulos FEM / BDC. Codificación incluida.',
    longDesc: 'Programación, clonación y sustitución de módulos BMW FEM / BDC / CAS con codificación incluida en el servicio.',
    features: ['FEM / BDC / CAS', 'Codificación incluida', 'Servicio por envío'],
    variants: [
      { id: 'reparacion', name: 'Reparación del módulo', desc: 'Diagnóstico y reparación del fallo detectado.', price: 349 },
      { id: 'clonacion', name: 'Clonación a módulo nuevo', desc: 'Transferencia completa a módulo de reemplazo.', price: 449 },
    ],
    whatWeFix: ['Módulo FEM/BDC bloqueado', 'Fallo de arranque tras batería a 0V', 'Corrupción tras actualización'],
    symptoms: ['No arranca / EWS/CAS error', 'Testigo de llave en el cuadro', 'Pérdida de comunicación con el bus'],
    whatToSend: ['Módulo FEM/BDC', 'VIN del vehículo', 'Llave original si está disponible'],
    turnaround: '3 a 5 días laborables',
    warranty: '12 meses de garantía',
    related: ['mercedes-ezs-elv', 'inmovilizadores-programacion', 'recuperacion-bosch-edc17cp54'],
  },
  {
    id: 'mercedes-ezs-elv',
    name: 'Mercedes EZS / ELV',
    category: 'modulos',
    brand: 'mercedes',
    type: 'envio',
    icon: 'module',
    priceFrom: 299,
    popularity: 70,
    stock: 'envio',
    shortDesc: 'Reparación de unidades EZS / ELV y solución a fallos de arranque.',
    longDesc: 'Reparación de unidades EZS / ELV / ESL con solución a fallos de arranque, comunicación y bloqueo de dirección.',
    features: ['EZS / ELV / ESL', 'Reparación garantizada', 'Envío 24/48h'],
    variants: [
      { id: 'estandar', name: 'Reparación estándar', desc: 'Diagnóstico y reparación de la unidad.', price: 299 },
      { id: 'urgente', name: 'Reparación urgente 24/48h', desc: 'Prioridad en el proceso.', price: 399 },
    ],
    whatWeFix: ['Bloqueo de columna de dirección', 'No arranca / sin contacto', 'Fallo de comunicación con central de confort'],
    symptoms: ['Volante bloqueado', 'Testigo de llave parpadeando', 'No enciende el cuadro'],
    whatToSend: ['Unidad EZS/ELV', 'VIN del vehículo', 'Descripción del fallo'],
    turnaround: '2 a 4 días laborables',
    warranty: '12 meses de garantía',
    related: ['bmw-fem-bdc', 'inmovilizadores-programacion', 'clonacion-ecu-general'],
  },
  {
    id: 'inmovilizadores-programacion',
    name: 'Inmovilizadores',
    category: 'inmovilizadores',
    brand: 'multi',
    type: 'taller',
    icon: 'key',
    priceFrom: 149,
    popularity: 88,
    stock: 'stock',
    shortDesc: 'Programación, reparación y anulación de inmovilizadores y llaves.',
    longDesc: 'Programación de llaves, AKL (all keys lost), anulación y sincronización de sistemas inmovilizadores para todas las marcas.',
    features: ['Llaves y mandos', 'Anulación IMMO', 'Todas las marcas'],
    variants: [
      { id: 'programacion', name: 'Programación de llave', desc: 'Añadir o sustituir una llave existente.', price: 149 },
      { id: 'akl', name: 'AKL — pérdida total de llaves', desc: 'Generación de llave nueva sin unidad original.', price: 249 },
    ],
    whatWeFix: ['Pérdida total de llaves (AKL)', 'Llave que no arranca el vehículo', 'Inmovilizador no sincronizado'],
    symptoms: ['El vehículo no reconoce la llave', 'Arranca y se cala al momento', 'Testigo de inmovilizador fijo'],
    whatToSend: ['No requiere envío: servicio presencial en taller / a domicilio según zona'],
    turnaround: 'Mismo día (cita previa)',
    warranty: '24 meses de garantía',
    related: ['bmw-fem-bdc', 'mercedes-ezs-elv', 'programadores-multimarca'],
  },
  {
    id: 'software-licencias',
    name: 'Software y Licencias',
    category: 'software',
    brand: 'multi',
    type: 'remoto',
    icon: 'laptop',
    priceFrom: 199,
    popularity: 64,
    stock: 'stock',
    isProduct: true,
    shortDesc: 'Software profesional para diagnóstico, codificación y reparación.',
    longDesc: 'Licencias originales de WinOLS, ECM Titanium, Alientech y otras herramientas profesionales, con soporte técnico incluido.',
    features: ['Licencias originales', 'Actualizaciones', 'Soporte incluido'],
    variants: [
      { id: 'anual', name: 'Licencia anual', desc: 'Acceso completo durante 12 meses.', price: 199 },
      { id: 'permanente', name: 'Licencia permanente', desc: 'Sin renovación, actualizaciones incluidas 1 año.', price: 499 },
    ],
    related: ['programadores-multimarca', 'diagnostico-avanzado'],
  },
  {
    id: 'programadores-multimarca',
    name: 'Programadores',
    category: 'programadores',
    brand: 'multi',
    type: 'taller',
    icon: 'programmer',
    priceFrom: 499,
    popularity: 58,
    stock: 'encargo',
    isProduct: true,
    shortDesc: 'Programadores y herramientas para lectura, escritura y clonación.',
    longDesc: 'Equipos profesionales de programación multi-marca para lectura, escritura, clonación y diagnóstico avanzado.',
    features: ['Multi-marca', 'Actualizable', 'Soporte técnico'],
    variants: [
      { id: 'basico', name: 'Kit básico', desc: 'Programador + cables esenciales.', price: 499 },
      { id: 'pro', name: 'Kit profesional', desc: 'Programador + set completo de cables y adaptadores.', price: 899 },
    ],
    related: ['software-licencias', 'diagnostico-avanzado'],
  },
  {
    id: 'reparacion-por-envio',
    name: 'Reparación por envío',
    category: 'reparacion-envio',
    brand: 'multi',
    type: 'envio',
    icon: 'box',
    priceFrom: 149,
    popularity: 90,
    stock: 'envio',
    shortDesc: 'Reparamos tu unidad con garantía y la devolvemos en 24/48h.',
    longDesc: 'Servicio general de reparación por envío: nos mandas la unidad, la diagnosticamos, reparamos y devolvemos con garantía.',
    features: ['Envío rápido', 'Garantía 6-24 meses', 'Seguimiento online'],
    variants: [
      { id: 'estandar', name: 'Reparación estándar', desc: 'Diagnóstico + reparación con envío incluido.', price: 149 },
    ],
    related: ['recuperacion-bosch-edc17cp54', 'reparacion-garantizada', 'diagnostico-avanzado'],
  },
  {
    id: 'diagnostico-avanzado',
    name: 'Diagnóstico avanzado',
    category: 'diagnostico',
    brand: 'multi',
    type: 'remoto',
    icon: 'diag',
    priceFrom: 79,
    popularity: 55,
    stock: 'stock',
    shortDesc: 'Diagnóstico avanzado y codificación online para todas las marcas.',
    longDesc: 'Diagnóstico remoto avanzado, codificación SCN y asistencia técnica online para talleres y particulares.',
    features: ['Diagnóstico online', 'Codificación SCN', 'Asistencia remota'],
    variants: [
      { id: 'estandar', name: 'Sesión de diagnóstico', desc: 'Conexión remota y diagnóstico completo.', price: 79 },
    ],
    related: ['software-licencias', 'reparacion-por-envio'],
  },
  {
    id: 'reparacion-garantizada',
    name: 'Reparación garantizada',
    category: 'recuperacion-ecu',
    brand: 'multi',
    type: 'envio',
    icon: 'ecu',
    priceFrom: 149,
    popularity: 60,
    stock: 'envio',
    shortDesc: 'Reparamos tu unidad con repuestos de calidad y garantía profesional.',
    longDesc: 'Reparación general de centralitas y módulos con repuestos de calidad OEM y garantía profesional por escrito.',
    features: ['Repuestos de calidad', 'Garantía escrita', 'Más de 10 años de experiencia'],
    variants: [
      { id: 'estandar', name: 'Reparación estándar', desc: 'Diagnóstico y reparación con garantía.', price: 149 },
    ],
    related: ['recuperacion-bosch-edc17cp54', 'clonacion-ecu-general'],
  },
];

function akFindProduct(id) {
  return CATALOG.find((p) => p.id === id) || null;
}

function akFindCategory(id) {
  return CATEGORIES.find((c) => c.id === id) || null;
}

function akFindBrand(id) {
  return BRANDS.find((b) => b.id === id) || null;
}

function akFormatPrice(n) {
  return n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}
