/* AutoKeys Remaps Pro Store — technical configurator engine + per-category field schemas.
   Renders a conditional technical form inside the buybox, driven by a declarative
   schema per product id (TECH_FORMS). See PROMPT MAESTRO — FICHAS DE PRODUCTO. */

const VEHICLE_BRANDS = [
  'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'SEAT', 'Škoda', 'Renault', 'Peugeot',
  'Citroën', 'Opel', 'Ford', 'Fiat', 'Toyota', 'Volvo', 'Nissan', 'Honda', 'Hyundai',
  'Kia', 'Mazda', 'Land Rover', 'Jaguar', 'MINI', 'Porsche', 'Otra',
];

/* ---------- Field schemas per product id ---------- */
/* Field: { id, label, type: select|text|textarea|yesno|multiselect|note, options, required, placeholder, showIf:{field,in:[]} } */

const TECH_FORMS = {
  'recuperacion-bosch-edc17cp54': {
    groups: [
      { title: 'DATOS DEL VEHÍCULO', fields: [
        { id: 'marca', label: 'Marca', type: 'select', options: VEHICLE_BRANDS, required: true },
        { id: 'modelo', label: 'Modelo', type: 'text' },
        { id: 'anio', label: 'Año', type: 'text', placeholder: 'Ej. 2016' },
        { id: 'motorizacion', label: 'Motorización', type: 'text', placeholder: 'Ej. 2.0 TDI' },
        { id: 'codigo_motor', label: 'Código motor', type: 'text' },
        { id: 'vin', label: 'VIN (opcional)', type: 'text' },
      ]},
      { title: 'DATOS ECU', fields: [
        { id: 'referencia_bosch', label: 'Referencia Bosch', type: 'text', placeholder: 'Ej. 0 281 034 123', required: true },
        { id: 'referencia_fabricante', label: 'Referencia fabricante', type: 'text' },
        { id: 'hw', label: 'HW', type: 'text' },
        { id: 'sw', label: 'SW', type: 'text' },
      ]},
      { title: 'ESTADO DE LA ECU', fields: [
        { id: 'estado_ecu', label: 'Estado de la ECU', type: 'select', required: true,
          options: ['Comunica correctamente', 'Comunicación parcial', 'No comunica', 'Desconocido'] },
      ]},
      { title: 'CAUSA DEL FALLO', fields: [
        { id: 'causa_fallo', label: 'Causa del fallo', type: 'select',
          options: ['Escritura interrumpida', 'Archivo incorrecto', 'Caída de alimentación', 'Bloqueo después de programación', 'ECU manipulada previamente', 'Daño electrónico', 'Desconocida'] },
      ]},
      { title: 'INFORMACIÓN DEL TRABAJO ANTERIOR', fields: [
        { id: 'herramienta_utilizada', label: 'Herramienta utilizada', type: 'text' },
        { id: 'metodo', label: 'Método', type: 'select', options: ['OBD', 'Bench', 'Boot', 'Desconocido'] },
        { id: 'archivo_original', label: '¿Dispone de archivo original?', type: 'yesno' },
        { id: 'backup', label: '¿Dispone de backup?', type: 'yesno' },
        { id: 'ecu_abierta', label: '¿La ECU ha sido abierta?', type: 'yesno' },
        { id: 'dano_fisico', label: '¿Hay daño físico visible?', type: 'yesno' },
      ]},
    ],
  },

  'clonacion-ecu-general': {
    groups: [
      { title: 'VEHÍCULO', fields: [
        { id: 'marca', label: 'Marca', type: 'select', options: VEHICLE_BRANDS, required: true },
        { id: 'modelo', label: 'Modelo', type: 'text' },
        { id: 'anio', label: 'Año', type: 'text' },
        { id: 'motor', label: 'Motor', type: 'text' },
        { id: 'vin', label: 'VIN (opcional)', type: 'text' },
      ]},
      { title: 'ECU ORIGINAL', fields: [
        { id: 'fabricante', label: 'Fabricante', type: 'text' },
        { id: 'familia_ecu', label: 'Familia ECU', type: 'text' },
        { id: 'referencia', label: 'Referencia', type: 'text', required: true },
        { id: 'hw', label: 'HW', type: 'text' },
        { id: 'sw', label: 'SW', type: 'text' },
        { id: 'estado', label: 'Estado', type: 'select', options: ['Comunica', 'No comunica'] },
        { id: 'abierta', label: '¿Ha sido abierta?', type: 'yesno' },
      ]},
      { title: 'ECU DONANTE', fields: [
        { id: 'tiene_donante', label: '¿Dispones ya de ECU donante?', type: 'yesno', required: true },
        { id: 'nota_sin_donante', label: 'Podemos ayudarte a localizar una unidad donante compatible — indícalo en observaciones y te contactamos con opciones.', type: 'note', showIf: { field: 'tiene_donante', in: ['No'] } },
        { id: 'fabricante_donante', label: 'Fabricante (donante)', type: 'text', showIf: { field: 'tiene_donante', in: ['Sí'] } },
        { id: 'referencia_donante', label: 'Referencia (donante)', type: 'text', showIf: { field: 'tiene_donante', in: ['Sí'] } },
        { id: 'hw_donante', label: 'HW (donante)', type: 'text', showIf: { field: 'tiene_donante', in: ['Sí'] } },
        { id: 'sw_donante', label: 'SW (donante)', type: 'text', showIf: { field: 'tiene_donante', in: ['Sí'] } },
        { id: 'estado_donante', label: 'Nueva / usada', type: 'select', options: ['Nueva', 'Usada'], showIf: { field: 'tiene_donante', in: ['Sí'] } },
      ]},
      { title: 'TIPO DE TRABAJO', fields: [
        { id: 'tipo_trabajo', label: 'Tipo de trabajo', type: 'select', required: true,
          options: ['Clonación completa', 'Transferencia EEPROM', 'Transferencia FLASH', 'Adaptación de unidad donante', 'Diagnóstico de compatibilidad'] },
      ]},
    ],
  },

  'bmw-fem-bdc': {
    groups: [
      { title: 'VEHÍCULO', fields: [
        { id: 'serie_bmw', label: 'Serie BMW', type: 'text', placeholder: 'Ej. Serie 3 (F30)' },
        { id: 'modelo', label: 'Modelo', type: 'text' },
        { id: 'anio', label: 'Año', type: 'text' },
        { id: 'motorizacion', label: 'Motorización', type: 'text' },
        { id: 'vin', label: 'VIN (opcional)', type: 'text' },
      ]},
      { title: 'TIPO DE MÓDULO', fields: [
        { id: 'tipo_modulo', label: 'Tipo de módulo', type: 'select', required: true, options: ['FEM', 'FEM Body', 'BDC', 'BDC2', 'No lo sé'] },
      ]},
      { title: 'DATOS DEL MÓDULO', fields: [
        { id: 'referencia_bmw', label: 'Referencia BMW', type: 'text' },
        { id: 'hw', label: 'HW', type: 'text' },
        { id: 'sw', label: 'SW', type: 'text' },
      ]},
      { title: 'ESTADO', fields: [
        { id: 'estado', label: 'Estado', type: 'select',
          options: ['Comunica', 'No comunica', 'Vehículo no arranca', 'Módulo bloqueado', 'Daño después de programación', 'Daño electrónico', 'Sustitución de módulo'] },
      ]},
      { title: 'TRABAJO SOLICITADO', fields: [
        { id: 'trabajo', label: 'Trabajo solicitado', type: 'select', required: true,
          options: ['Reparación', 'Clonación', 'Recuperación', 'Adaptación donante', 'Sincronización', 'Programación'] },
      ]},
      { title: 'MATERIAL DISPONIBLE', fields: [
        { id: 'material', label: 'Material disponible', type: 'multiselect', options: ['FEM/BDC original', 'FEM/BDC donante', 'Llave', 'DME/ECU'] },
        { id: 'numero_llaves', label: 'Número de llaves disponibles', type: 'select', options: ['0', '1', '2+'] },
      ]},
    ],
  },

  'mercedes-ezs-elv': {
    groups: [
      { title: 'VEHÍCULO', fields: [
        { id: 'modelo', label: 'Modelo', type: 'text' },
        { id: 'chasis', label: 'Chasis', type: 'select', options: ['W204', 'W207', 'W212', 'W176', 'W246', 'W166', 'Otro'] },
        { id: 'anio', label: 'Año', type: 'text' },
        { id: 'vin', label: 'VIN (opcional)', type: 'text' },
      ]},
      { title: 'SISTEMA AFECTADO', fields: [
        { id: 'sistema', label: 'Sistema afectado', type: 'select', required: true, options: ['EZS / EIS', 'ELV / ESL', 'Ambos', 'No lo sé'] },
      ]},
      { title: 'SÍNTOMA', fields: [
        { id: 'sintoma', label: 'Síntoma', type: 'select',
          options: ['No gira llave', 'No da contacto', 'No desbloquea dirección', 'Llave no reconocida', 'Arranque intermitente', 'EZS no comunica', 'ELV bloqueado', 'Otro'] },
        { id: 'llave_funciona', label: '¿La llave funciona actualmente?', type: 'yesno', options: ['Sí', 'No', 'Intermitentemente'] },
      ]},
      { title: 'MATERIAL DISPONIBLE', fields: [
        { id: 'material', label: 'Material disponible', type: 'multiselect', options: ['EZS', 'ELV', 'Llave', 'Donante'] },
      ]},
      { title: 'TRABAJO', fields: [
        { id: 'trabajo', label: 'Trabajo', type: 'select', required: true,
          options: ['Diagnóstico', 'Reparación EZS', 'Reparación ELV', 'Clonación', 'Adaptación', 'Sustitución', 'EZS + ELV'] },
      ]},
    ],
  },

  'inmovilizadores-programacion': {
    groups: [
      { title: 'VEHÍCULO', fields: [
        { id: 'marca', label: 'Marca', type: 'select', options: VEHICLE_BRANDS, required: true },
        { id: 'modelo', label: 'Modelo', type: 'text' },
        { id: 'anio', label: 'Año', type: 'text' },
        { id: 'vin', label: 'VIN (opcional)', type: 'text' },
      ]},
      { title: 'TIPO DE SISTEMA', fields: [
        { id: 'tipo_sistema', label: 'Tipo de sistema', type: 'select',
          options: ['ECU', 'CAS', 'FEM', 'BDC', 'EWS', 'EZS', 'ELV', 'UCH', 'BCM', 'BSI', 'Otro'] },
      ]},
      { title: 'LLAVES DISPONIBLES', fields: [
        { id: 'llaves', label: 'Llaves disponibles', type: 'select', required: true, options: ['Ninguna', '1', '2+'] },
      ]},
      { title: 'ESTADO', fields: [
        { id: 'estado', label: 'Estado', type: 'select',
          options: ['Vehículo arranca', 'No arranca', 'Arranca y se para', 'Llave no reconocida', 'Testigo inmovilizador activo', 'Fallo intermitente'] },
      ]},
      { title: 'TRABAJO', fields: [
        { id: 'trabajo', label: 'Trabajo', type: 'select', required: true,
          options: ['Diagnóstico', 'Sincronización', 'Reparación', 'Adaptación módulo', 'Recuperación de datos'] },
      ]},
    ],
  },

  'reparacion-por-envio': {
    groups: [
      { title: 'TIPO DE UNIDAD', fields: [
        { id: 'tipo_unidad', label: 'Tipo de unidad', type: 'select', required: true,
          options: ['ECU', 'TCU', 'ABS', 'Airbag', 'Cuadro', 'UCH', 'BSI', 'BCM', 'CAS', 'FEM / BDC', 'EZS / ELV', 'Otro'] },
      ]},
      { title: 'DATOS DE LA UNIDAD', fields: [
        { id: 'marca', label: 'Marca', type: 'select', options: VEHICLE_BRANDS },
        { id: 'modelo', label: 'Modelo', type: 'text' },
        { id: 'anio', label: 'Año', type: 'text' },
        { id: 'referencia_modulo', label: 'Referencia del módulo', type: 'text' },
        { id: 'fabricante', label: 'Fabricante', type: 'text' },
        { id: 'sintoma', label: 'Síntoma', type: 'textarea', placeholder: 'Describe qué le ocurre a la unidad' },
      ]},
      { title: '¿QUÉ VAS A INCLUIR EN EL PAQUETE?', fields: [
        { id: 'incluye', label: 'Contenido del paquete', type: 'multiselect',
          options: ['Módulo / ECU', 'Conectores', 'Llave', 'Cableado', 'Documento con descripción del fallo', 'Otro'] },
      ]},
    ],
  },

  'bmw-cas-ews-programacion': {
    groups: [
      { title: 'SISTEMA', fields: [
        { id: 'sistema', label: 'Sistema', type: 'select', required: true,
          options: ['EWS2', 'EWS3', 'EWS4', 'CAS1', 'CAS2', 'CAS3', 'CAS3+', 'CAS4', 'CAS4+', 'No lo sé'] },
      ]},
      { title: 'VEHÍCULO', fields: [
        { id: 'serie', label: 'Serie', type: 'text' },
        { id: 'modelo', label: 'Modelo', type: 'text' },
        { id: 'anio', label: 'Año', type: 'text' },
        { id: 'vin', label: 'VIN (opcional)', type: 'text' },
      ]},
      { title: 'ESTADO', fields: [
        { id: 'estado', label: 'Estado', type: 'select',
          options: ['No arranca', 'Motor no gira', 'Llave no reconocida', 'Error sincronización', 'Módulo no comunica', 'Daño por programación'] },
      ]},
      { title: 'TRABAJO', fields: [
        { id: 'trabajo', label: 'Trabajo', type: 'select', required: true,
          options: ['Reparación', 'Clonación', 'Adaptación', 'Sincronización', 'Recuperación', 'Sustitución'] },
      ]},
      { title: 'MATERIAL DISPONIBLE', fields: [
        { id: 'material', label: 'Material disponible', type: 'multiselect', options: ['CAS/EWS original', 'Donante', 'Llave', 'ECU/DME'] },
      ]},
    ],
  },

  'modulos-confort-uch': {
    groups: [
      { title: 'TIPO DE MÓDULO', fields: [
        { id: 'tipo_modulo', label: 'Tipo de módulo', type: 'select', required: true,
          options: ['Renault UCH', 'PSA BSI', 'BCM', 'Body Computer', 'Módulo confort', 'Otro'] },
      ]},
      { title: 'FABRICANTE', fields: [
        { id: 'fabricante', label: 'Fabricante', type: 'select', options: ['Valeo', 'Continental', 'Delphi', 'Siemens', 'Johnson Controls', 'Otro'] },
      ]},
      { title: 'DATOS', fields: [
        { id: 'referencia_oem', label: 'Referencia OEM', type: 'text' },
        { id: 'hw', label: 'HW', type: 'text' },
        { id: 'sw', label: 'SW', type: 'text' },
      ]},
      { title: 'PROBLEMA', fields: [
        { id: 'problema', label: 'Problema', type: 'select',
          options: ['Cierre centralizado', 'Luces', 'Elevalunas', 'Arranque', 'Comunicación', 'Daño por agua', 'Daño eléctrico', 'Otro'] },
      ]},
      { title: 'TRABAJO', fields: [
        { id: 'trabajo', label: 'Trabajo', type: 'select', required: true,
          options: ['Reparación', 'Clonación', 'Adaptación donante', 'Recuperación de datos'] },
      ]},
    ],
  },

  'llaves-copia-programacion': {
    groups: [
      { title: 'VEHÍCULO', fields: [
        { id: 'marca', label: 'Marca', type: 'select', options: VEHICLE_BRANDS, required: true },
        { id: 'modelo', label: 'Modelo', type: 'text' },
        { id: 'anio', label: 'Año', type: 'text' },
        { id: 'vin', label: 'VIN (opcional)', type: 'text' },
      ]},
      { title: 'TIPO DE LLAVE', fields: [
        { id: 'tipo_llave', label: 'Tipo de llave', type: 'select', required: true,
          options: ['Llave convencional', 'Llave con mando', 'Smart Key', 'Keyless', 'Tarjeta'] },
      ]},
      { title: 'SITUACIÓN', fields: [
        { id: 'situacion', label: 'Situación', type: 'select', required: true,
          options: ['Duplicado', 'Añadir llave', 'Llave perdida', 'Pérdida total'] },
        { id: 'llaves', label: 'Número de llaves disponibles', type: 'select', options: ['0', '1', '2+'] },
      ]},
      { title: 'INFORMACIÓN ADICIONAL', fields: [
        { id: 'mando_funciona', label: '¿El mando funciona?', type: 'yesno' },
        { id: 'vehiculo_arranca', label: '¿El vehículo arranca?', type: 'yesno' },
        { id: 'frecuencia', label: 'Frecuencia (si la conoces)', type: 'text', placeholder: 'Ej. 433 MHz' },
        { id: 'vehiculo_disponible', label: '¿El vehículo está disponible físicamente?', type: 'yesno' },
      ]},
    ],
  },

  'airbag-srs-reparacion': {
    groups: [
      { title: 'DATOS', fields: [
        { id: 'marca', label: 'Marca', type: 'select', options: VEHICLE_BRANDS },
        { id: 'modelo', label: 'Modelo', type: 'text' },
        { id: 'anio', label: 'Año', type: 'text' },
        { id: 'vin', label: 'VIN (opcional)', type: 'text' },
        { id: 'fabricante_modulo', label: 'Fabricante del módulo', type: 'text' },
        { id: 'referencia', label: 'Referencia', type: 'text' },
        { id: 'numero_pieza', label: 'Número de pieza', type: 'text' },
      ]},
      { title: 'ESTADO', fields: [
        { id: 'estado', label: 'Estado', type: 'select',
          options: ['Airbags desplegados', 'Pretensores activados', 'Testigo Airbag', 'Crash almacenado', 'Módulo no comunica', 'Error interno'] },
      ]},
      { title: 'TRABAJO', fields: [
        { id: 'trabajo', label: 'Trabajo', type: 'select', required: true,
          options: ['Diagnóstico', 'Crash Data', 'Reparación', 'Clonación', 'Transferencia de datos'] },
      ]},
      { title: 'INFORMACIÓN ADICIONAL', fields: [
        { id: 'vehiculo_accidentado', label: '¿El módulo pertenece al vehículo accidentado?', type: 'yesno' },
      ]},
    ],
  },

  'cuadros-reparacion': {
    groups: [
      { title: 'TIPO', fields: [
        { id: 'tipo', label: 'Tipo de cuadro', type: 'select', required: true, options: ['Analógico', 'Digital', 'TFT', 'Virtual Cockpit', 'Otro'] },
      ]},
      { title: 'DATOS', fields: [
        { id: 'marca', label: 'Marca', type: 'select', options: VEHICLE_BRANDS },
        { id: 'modelo', label: 'Modelo', type: 'text' },
        { id: 'anio', label: 'Año', type: 'text' },
        { id: 'vin', label: 'VIN (opcional)', type: 'text' },
        { id: 'fabricante', label: 'Fabricante', type: 'text' },
        { id: 'referencia_oem', label: 'Referencia OEM', type: 'text' },
        { id: 'hw', label: 'HW', type: 'text' },
        { id: 'sw', label: 'SW', type: 'text' },
      ]},
      { title: 'FALLO', fields: [
        { id: 'fallo', label: 'Fallo', type: 'select',
          options: ['Pantalla', 'Agujas', 'Iluminación', 'No comunica', 'Reinicios', 'Error inmovilizador', 'Datos corruptos', 'Daño electrónico'] },
      ]},
      { title: 'TRABAJO', fields: [
        { id: 'trabajo', label: 'Trabajo', type: 'select', required: true,
          options: ['Reparación', 'Clonación', 'Transferencia de datos', 'Adaptación donante'] },
        { id: 'cuadro_donante', label: '¿Dispones de cuadro donante?', type: 'yesno' },
      ]},
    ],
  },

  'software-licencias': {
    noManipuladoTail: true,
    groups: [
      { title: 'DATOS DE LA LICENCIA', fields: [
        { id: 'producto', label: 'Producto', type: 'select', required: true,
          options: ['WinOLS', 'ECM Titanium', 'Alientech Suite', 'EDC15 Multimap Suite', 'Otro'] },
        { id: 'version', label: 'Versión (opcional)', type: 'text' },
        { id: 'nombre_cliente', label: 'Nombre', type: 'text', required: true },
        { id: 'empresa', label: 'Empresa (opcional)', type: 'text' },
        { id: 'email', label: 'Email de contacto', type: 'text', placeholder: 'tu@email.com', required: true },
        { id: 'pais', label: 'País', type: 'text', placeholder: 'España' },
      ]},
      { title: 'EQUIPO', fields: [
        { id: 'windows', label: 'Windows', type: 'select', options: ['Windows 10', 'Windows 11', 'Otro'] },
        { id: 'cpu', label: 'CPU (opcional)', type: 'text' },
        { id: 'ram', label: 'RAM (opcional)', type: 'text' },
      ]},
      { title: 'PARA EDC15 MULTIMAP SUITE', fields: [
        { id: 'tipo_ecu', label: 'Tipo de ECU', type: 'text', placeholder: 'Ej. EDC15C2, EDC15C7...', showIf: { field: 'producto', in: ['EDC15 Multimap Suite'] } },
        { id: 'uso', label: 'Uso', type: 'select', options: ['Profesional', 'Particular'], showIf: { field: 'producto', in: ['EDC15 Multimap Suite'] } },
        { id: 'requisitos_confirmados', label: 'Confirmo que cumplo los requisitos del sistema', type: 'yesno', showIf: { field: 'producto', in: ['EDC15 Multimap Suite'] } },
      ]},
      { title: 'LICENCIA', fields: [
        { id: 'acepta_licencia', label: 'Acepto los términos de la licencia', type: 'yesno', required: true },
      ]},
    ],
  },

  'programadores-multimarca': {
    noManipuladoTail: true,
    groups: [
      { title: 'PROGRAMADOR', fields: [
        { id: 'marca', label: 'Marca', type: 'select', options: ['Alientech', 'KESS', 'K-TAG', 'CMD', 'Autotuner', 'Otro'], required: true },
        { id: 'modelo', label: 'Modelo', type: 'text' },
        { id: 'master_slave', label: 'Master / Slave', type: 'select', options: ['Master', 'Slave'] },
        { id: 'protocolos', label: 'Protocolos', type: 'text', placeholder: 'Ej. OBD, Bench, Boot' },
        { id: 'activacion_necesaria', label: '¿Necesitas activación?', type: 'yesno' },
      ]},
      { title: 'CONFIGURACIÓN', fields: [
        { id: 'configuracion', label: 'Configuración', type: 'select', required: true,
          options: ['Equipo', 'Equipo + cables', 'Pack completo', 'Formación', 'Soporte'] },
        { id: 'tiene_otro_programador', label: '¿Ya dispones de otro programador?', type: 'yesno' },
      ]},
    ],
  },

  'diagnostico-avanzado': {
    groups: [
      { title: 'VEHÍCULO', fields: [
        { id: 'marca', label: 'Marca', type: 'select', options: VEHICLE_BRANDS, required: true },
        { id: 'modelo', label: 'Modelo', type: 'text' },
        { id: 'anio', label: 'Año', type: 'text' },
        { id: 'vin', label: 'VIN (opcional)', type: 'text' },
        { id: 'motorizacion', label: 'Motorización', type: 'text' },
      ]},
      { title: 'ÁREA AFECTADA', fields: [
        { id: 'area', label: 'Área afectada', type: 'multiselect',
          options: ['Motor', 'Cambio', 'ABS', 'Airbag', 'Inmovilizador', 'CAN', 'Módulos', 'Codificación', 'Problema eléctrico'] },
      ]},
      { title: 'ESTADO', fields: [
        { id: 'estado', label: 'Estado', type: 'select', options: ['Arranca', 'No arranca', 'Arranca y se para', 'No comunica', 'Fallo intermitente'] },
      ]},
      { title: 'DOCUMENTACIÓN', fields: [
        { id: 'documentacion', label: 'Documentación disponible', type: 'multiselect', options: ['Códigos DTC', 'Informe diagnosis', 'Fotos'] },
      ]},
      { title: 'TRABAJO', fields: [
        { id: 'trabajo', label: 'Trabajo', type: 'select', required: true,
          options: ['Diagnóstico presencial', 'Diagnóstico remoto', 'Codificación', 'Programación', 'Investigación avanzada'] },
      ]},
    ],
  },

  'ecu-uce-diagnostico': {
    groups: [
      { title: 'VEHÍCULO', fields: [
        { id: 'marca', label: 'Marca', type: 'select', options: VEHICLE_BRANDS, required: true },
        { id: 'modelo', label: 'Modelo', type: 'text' },
        { id: 'anio', label: 'Año', type: 'text' },
        { id: 'motor', label: 'Motor', type: 'text' },
      ]},
      { title: 'ECU', fields: [
        { id: 'fabricante_ecu', label: 'Fabricante ECU', type: 'text' },
        { id: 'familia_ecu', label: 'Familia ECU', type: 'text' },
        { id: 'referencia', label: 'Referencia', type: 'text' },
        { id: 'hw', label: 'HW', type: 'text' },
        { id: 'sw', label: 'SW', type: 'text' },
      ]},
      { title: 'ESTADO ECU', fields: [
        { id: 'estado', label: 'Estado ECU', type: 'select',
          options: ['Comunica', 'No comunica', 'Consumo anormal', 'Vehículo no arranca', 'Daño físico', 'Manipulada previamente'] },
      ]},
      { title: 'PROBLEMA', fields: [
        { id: 'problema', label: 'Problema', type: 'select',
          options: ['No comunica', 'No activa', 'No arranca', 'Fallo interno', 'Alimentación', 'Driver', 'Software', 'Desconocido'] },
      ]},
      { title: 'AUTORIZACIÓN', fields: [
        { id: 'autorizacion', label: 'Autorización', type: 'select', required: true,
          options: ['Diagnóstico solamente', 'Diagnóstico + autorización de reparación'] },
      ]},
    ],
  },

  'reparacion-garantizada': {
    groups: [
      { title: 'MÓDULO', fields: [
        { id: 'tipo_modulo', label: 'Tipo de módulo', type: 'text', required: true },
        { id: 'marca', label: 'Marca', type: 'select', options: VEHICLE_BRANDS },
        { id: 'modelo', label: 'Modelo', type: 'text' },
        { id: 'anio', label: 'Año', type: 'text' },
        { id: 'referencia', label: 'Referencia', type: 'text' },
        { id: 'fabricante', label: 'Fabricante', type: 'text' },
        { id: 'sintoma', label: 'Síntoma', type: 'textarea', placeholder: 'Describe qué le ocurre a la unidad' },
      ]},
      { title: 'TRABAJO', fields: [
        { id: 'trabajo', label: 'Trabajo', type: 'select', required: true,
          options: ['Diagnóstico + presupuesto', 'Reparación', 'Reparación urgente'] },
        { id: 'nota_precio', label: 'Precio definitivo sujeto a diagnóstico técnico.', type: 'note' },
      ]},
    ],
  },
};

const COMMON_TAIL_GROUP = {
  title: 'INFORMACIÓN ADICIONAL',
  fields: [
    { id: '_manipulado_previamente', label: '¿Ha sido manipulado anteriormente?', type: 'yesno' },
    { id: '_trabajo_anterior', label: 'Trabajo realizado anteriormente', type: 'textarea', placeholder: 'Describe brevemente qué se hizo antes, si lo sabes', showIf: { field: '_manipulado_previamente', in: ['Sí'] } },
  ],
};

/* ---------- Engine state ---------- */

let TF = { product: null, values: {}, photos: [], compatMode: false, urgente: false, fieldDefs: {}, hasDraftBanner: false };

function akTfReset(product) {
  TF = { product: product, values: {}, photos: [], compatMode: false, urgente: false, fieldDefs: {}, hasDraftBanner: false };
}

function akTfDraftKey(product) {
  return 'ak_tf_draft_' + product.id;
}

function akTfSaveDraft(product) {
  try { localStorage.setItem(akTfDraftKey(product), JSON.stringify(TF.values)); } catch (e) { /* storage unavailable */ }
}

function akTfLoadDraftValues(product) {
  try {
    const raw = localStorage.getItem(akTfDraftKey(product));
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

function akTfClearDraft(product) {
  try { localStorage.removeItem(akTfDraftKey(product)); } catch (e) { /* ignore */ }
}

function akTfInit(product) {
  akTfReset(product);
  const draft = akTfLoadDraftValues(product);
  if (draft && Object.keys(draft).length) {
    TF.values = draft;
    TF.hasDraftBanner = true;
  }
}

function akTfIsCompatMode() {
  return !!TF.compatMode;
}

function akTfHasUrgentVariant(product) {
  return product.variants.some((v) => /urgente/i.test(v.name));
}

/* ---------- Rendering ---------- */

function akTfFieldWrap(f, inner) {
  const full = (f.type === 'textarea' || f.type === 'multiselect' || f.type === 'note') ? ' full' : '';
  return '<div class="field' + full + '" data-tf-wrap="' + f.id + '">' +
    (f.type !== 'note' ? '<label>' + f.label + (f.required ? ' *' : '') + '</label>' : '') +
    inner +
  '</div>';
}

function akTfFieldHTML(f) {
  TF.fieldDefs[f.id] = f;
  let inner = '';
  if (f.type === 'select') {
    inner = '<select data-tf="' + f.id + '"><option value="">Selecciona...</option>' +
      f.options.map((o) => '<option value="' + o + '">' + o + '</option>').join('') +
      '</select>';
  } else if (f.type === 'text') {
    inner = '<input type="text" data-tf="' + f.id + '" placeholder="' + (f.placeholder || '') + '">';
  } else if (f.type === 'textarea') {
    inner = '<textarea data-tf="' + f.id + '" placeholder="' + (f.placeholder || '') + '"></textarea>';
  } else if (f.type === 'yesno') {
    const opts = f.options || ['Sí', 'No'];
    inner = '<div class="yn-toggle" data-tf-yn="' + f.id + '">' +
      opts.map((o) => '<button type="button" data-val="' + o + '">' + o + '</button>').join('') +
    '</div>';
  } else if (f.type === 'multiselect') {
    inner = '<div class="tf-multiselect" data-tf-ms="' + f.id + '">' +
      f.options.map((o) => '<label class="tf-chip"><input type="checkbox" value="' + o + '">' + o + '</label>').join('') +
    '</div>';
  } else if (f.type === 'note') {
    inner = '<div class="tf-note">' + f.label + '</div>';
  }
  return akTfFieldWrap(f, inner);
}

function akTfGroupsHTML(groups) {
  return groups.map((g) =>
    '<div class="tf-group-title">' + g.title + '</div><div class="field-row">' + g.fields.map(akTfFieldHTML).join('') + '</div>'
  ).join('');
}

function akTfRenderConfigurator(product) {
  TF.fieldDefs = {};
  const schema = TECH_FORMS[product.id];
  let html = '';

  if (TF.hasDraftBanner) {
    html += '<div class="tf-draft-banner">' + akIcon('checkCircle') +
      '<span style="flex:1">Hemos recuperado tu borrador guardado.</span>' +
      '<button type="button" id="tf-discard-draft">Descartar</button></div>';
  }

  html += '<div class="tf-compat-toggle' + (TF.compatMode ? ' active' : '') + '" id="tf-compat-toggle">' +
    akIcon('help') + ' ' + (TF.compatMode ? 'Volver al formulario técnico' : 'No sé qué opción elegir — Solicitar revisión de compatibilidad') +
  '</div>';

  if (TF.compatMode) {
    html += '<div class="tf-group-title">CUÉNTANOS QUÉ TE OCURRE</div><div class="field-row">' +
      akTfFieldHTML({ id: '_compat_desc', label: 'Describe el problema o la unidad', type: 'textarea', required: true, placeholder: 'Marca, modelo, referencia si la tienes, y qué le ocurre' }) +
    '</div>';
  } else if (schema) {
    html += akTfGroupsHTML(schema.groups);
    if (!schema.noManipuladoTail) {
      html += akTfGroupsHTML([COMMON_TAIL_GROUP]);
    }
  }

  html += '<div class="tf-group-title">FOTOGRAFÍAS <span class="req-note">' +
    (TF.compatMode ? '(mínimo 1 — etiqueta o módulo)' : '(opcional, hasta 5)') + '</span></div>' +
    '<div class="tf-photos-zone" id="tf-photos-zone">' + akIcon('camera') +
    '<div>Toca para añadir fotos<br>(etiqueta, módulo, daños visibles)</div></div>' +
    '<input type="file" id="tf-photos-input" accept="image/*" multiple style="display:none">' +
    '<div class="tf-photo-grid" id="tf-photo-grid"></div>';

  if (!TF.compatMode && !akTfHasUrgentVariant(product)) {
    TF.fieldDefs['_urgente'] = { id: '_urgente', type: 'yesno' };
    html += '<div class="tf-group-title">SERVICIO</div>' +
      '<div class="yn-toggle" data-tf-yn="_urgente">' +
        '<button type="button" data-val="normal">Normal</button>' +
        '<button type="button" data-val="urgente">Urgente (24/48h)</button>' +
      '</div>';
  }

  html += '<div class="tf-group-title">OBSERVACIONES</div><div class="field-row">' +
    akTfFieldHTML({ id: '_observaciones', label: 'Observaciones (opcional)', type: 'textarea', placeholder: 'Cualquier detalle adicional que debamos saber' }) +
  '</div>';

  return html;
}

/* ---------- Wiring ---------- */

function akTfUpdateVisibility() {
  Object.keys(TF.fieldDefs).forEach((id) => {
    const f = TF.fieldDefs[id];
    if (!f.showIf) return;
    const wrap = document.querySelector('[data-tf-wrap="' + id + '"]');
    if (!wrap) return;
    const visible = f.showIf.in.indexOf(TF.values[f.showIf.field]) !== -1;
    wrap.toggleAttribute('data-tf-hidden', !visible);
  });
}

function akTfApplyValues(container) {
  container.querySelectorAll('[data-tf]').forEach((el) => {
    const v = TF.values[el.dataset.tf];
    if (v !== undefined && v !== null) el.value = v;
  });
  container.querySelectorAll('[data-tf-yn]').forEach((el) => {
    const v = TF.values[el.dataset.tfYn];
    el.querySelectorAll('button').forEach((b) => b.classList.toggle('selected', b.dataset.val === v));
  });
  container.querySelectorAll('[data-tf-ms]').forEach((el) => {
    const arr = Array.isArray(TF.values[el.dataset.tfMs]) ? TF.values[el.dataset.tfMs] : [];
    el.querySelectorAll('input[type=checkbox]').forEach((cb) => {
      const checked = arr.indexOf(cb.value) !== -1;
      cb.checked = checked;
      cb.closest('.tf-chip').classList.toggle('selected', checked);
    });
  });
  akTfRenderPhotoGrid();
  akTfUpdateVisibility();
}

function akTfWire(container, product, onRerender) {
  container.querySelectorAll('[data-tf]').forEach((el) => {
    el.addEventListener('input', () => {
      TF.values[el.dataset.tf] = el.value;
      akTfUpdateVisibility();
    });
  });

  container.querySelectorAll('[data-tf-yn]').forEach((el) => {
    const id = el.dataset.tfYn;
    el.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        TF.values[id] = btn.dataset.val;
        el.querySelectorAll('button').forEach((b) => b.classList.toggle('selected', b === btn));
        if (id === '_urgente') TF.urgente = (btn.dataset.val === 'urgente');
        akTfUpdateVisibility();
      });
    });
  });

  container.querySelectorAll('[data-tf-ms]').forEach((el) => {
    const id = el.dataset.tfMs;
    if (!Array.isArray(TF.values[id])) TF.values[id] = [];
    el.querySelectorAll('input[type=checkbox]').forEach((cb) => {
      cb.addEventListener('change', () => {
        cb.closest('.tf-chip').classList.toggle('selected', cb.checked);
        const arr = TF.values[id];
        const idx = arr.indexOf(cb.value);
        if (cb.checked && idx === -1) arr.push(cb.value);
        if (!cb.checked && idx !== -1) arr.splice(idx, 1);
      });
    });
  });

  const compatToggle = container.querySelector('#tf-compat-toggle');
  if (compatToggle) compatToggle.addEventListener('click', () => {
    TF.compatMode = !TF.compatMode;
    onRerender();
  });

  const discardBtn = container.querySelector('#tf-discard-draft');
  if (discardBtn) discardBtn.addEventListener('click', () => {
    akTfClearDraft(product);
    TF.values = {};
    TF.hasDraftBanner = false;
    onRerender();
  });

  const zone = container.querySelector('#tf-photos-zone');
  const input = container.querySelector('#tf-photos-input');
  if (zone && input) {
    zone.addEventListener('click', () => input.click());
    input.addEventListener('change', () => {
      akTfAddPhotos(input.files);
      input.value = '';
    });
  }
}

/* ---------- Photos ---------- */

function akTfAddPhotos(fileList) {
  const remaining = 5 - TF.photos.length;
  Array.from(fileList).slice(0, remaining).forEach((f) => TF.photos.push(f));
  akTfRenderPhotoGrid();
}

function akTfRemovePhoto(idx) {
  TF.photos.splice(idx, 1);
  akTfRenderPhotoGrid();
}

function akTfRenderPhotoGrid() {
  const grid = document.getElementById('tf-photo-grid');
  if (!grid) return;
  grid.innerHTML = TF.photos.map((file, i) =>
    '<div class="tf-photo-thumb"><img src="' + URL.createObjectURL(file) + '"><button type="button" data-remove-photo="' + i + '">' + akIcon('close') + '</button></div>'
  ).join('');
  grid.querySelectorAll('[data-remove-photo]').forEach((btn) => {
    btn.addEventListener('click', () => akTfRemovePhoto(Number(btn.dataset.removePhoto)));
  });
  const zone = document.getElementById('tf-photos-zone');
  if (zone) zone.style.display = TF.photos.length >= 5 ? 'none' : '';
}

async function akTfUploadPhotos() {
  if (!TF.photos.length) return [];
  if (typeof akSupabase !== 'function') return [];
  let client;
  try { client = akSupabase(); } catch (e) { return []; }
  const urls = [];
  for (const file of TF.photos) {
    try {
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
      const path = crypto.randomUUID() + '.' + ext;
      const { error } = await client.storage.from('pedido-fotos').upload(path, file, { upsert: false });
      if (error) { console.error('Foto no subida:', error); continue; }
      const { data } = client.storage.from('pedido-fotos').getPublicUrl(path);
      if (data && data.publicUrl) urls.push(data.publicUrl);
    } catch (e) { console.error('Foto no subida:', e); }
  }
  return urls;
}

/* ---------- Validation + data collection ---------- */

function akTfValidate() {
  if (TF.compatMode) {
    if (!TF.values._compat_desc || !TF.values._compat_desc.trim()) {
      return { ok: false, message: 'Describe brevemente el problema o la unidad', focusId: '_compat_desc' };
    }
    if (TF.photos.length === 0) {
      return { ok: false, message: 'Sube al menos una fotografía (etiqueta o módulo)' };
    }
    return { ok: true };
  }
  for (const id in TF.fieldDefs) {
    const f = TF.fieldDefs[id];
    if (!f.required) continue;
    const wrap = document.querySelector('[data-tf-wrap="' + id + '"]');
    if (wrap && wrap.hasAttribute('data-tf-hidden')) continue;
    const val = TF.values[id];
    const empty = f.type === 'multiselect' ? !(Array.isArray(val) && val.length) : !val || !String(val).trim();
    if (empty) {
      return { ok: false, message: 'Falta un campo obligatorio: ' + f.label, focusId: id };
    }
  }
  return { ok: true };
}

function akTfCollectData(product) {
  const campos = {};
  Object.keys(TF.values).forEach((k) => {
    if (k.indexOf('_') === 0) return;
    campos[k] = TF.values[k];
  });
  return {
    productoId: product.id,
    compatibilidad: !!TF.compatMode,
    urgente: !!TF.urgente,
    observaciones: TF.values._observaciones || '',
    manipuladoPreviamente: TF.values._manipulado_previamente || null,
    trabajoAnterior: TF.values._trabajo_anterior || null,
    descripcionCompatibilidad: TF.values._compat_desc || null,
    campos: campos,
  };
}
