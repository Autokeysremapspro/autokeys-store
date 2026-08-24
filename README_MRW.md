# Configuración de MRW

El conector vive en `lib/transportistas/mrw.js` y se utiliza desde
`POST /api/generar-envio`. Las credenciales se guardan exclusivamente como
variables de entorno del proyecto `autokeys-store` en Vercel.

## Datos que hay que pedir a MRW

- URL base de sandbox/pruebas y de producción.
- Tipo de autenticación: Basic, Bearer o cabecera API key.
- Usuario y contraseña o API key.
- Código de abonado/cliente.
- Código de franquicia.
- Código del servicio contratado (24H, urgente, etc.).
- Ruta para probar la conexión sin crear una expedición.
- Ruta para crear expediciones.
- Nombre/ruta del campo de seguimiento en la respuesta JSON.
- Nombre/ruta del campo de etiqueta en la respuesta JSON.

## Variables de Vercel

Copiar las variables de `.env.example` y completar los valores entregados por
MRW. Empezar siempre con `MRW_ENVIRONMENT=sandbox`.

Autenticación admitida:

- `MRW_AUTH_TYPE=basic`: requiere `MRW_USERNAME` y `MRW_PASSWORD`.
- `MRW_AUTH_TYPE=bearer`: requiere `MRW_API_KEY`.
- `MRW_AUTH_TYPE=api-key`: requiere `MRW_API_KEY` y, si procede,
  `MRW_API_KEY_HEADER`.
- `MRW_AUTH_TYPE=none`: solo si MRW confirma que no utiliza autenticación.

Los campos anidados de la respuesta se escriben con puntos. Ejemplos:

```text
MRW_TRACKING_FIELD=data.expedicion.numero
MRW_LABEL_FIELD=data.documentos.etiqueta_url
```

## Probar la configuración

La petición debe llevar el token de sesión de un administrador:

```http
POST /api/generar-envio
Authorization: Bearer <token>
Content-Type: application/json

{
  "accion": "probar_conexion",
  "transportista": "mrw"
}
```

La respuesta indica si faltan variables, si solo está configurado el conector
o si MRW ha confirmado realmente la conexión.

## Crear un envío

```http
POST /api/generar-envio
Authorization: Bearer <token>
Content-Type: application/json

{
  "accion": "crear",
  "transportista": "mrw",
  "pedido_id": "<uuid-del-pedido>"
}
```

Al recibir el seguimiento, la API actualiza `tienda_pedidos` con el
transportista, número de seguimiento, estado y fecha de envío.

> Si la documentación definitiva de MRW usa SOAP/XML en lugar de HTTP/JSON,
> habrá que adaptar únicamente `lib/transportistas/mrw.js`; el panel, la
> autenticación y la actualización del pedido ya quedan preparados.
