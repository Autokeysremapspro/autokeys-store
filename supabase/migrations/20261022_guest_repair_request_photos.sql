-- Las fotos de solicitudes públicas se suben mediante una API de servidor
-- validada con el token privado de seguimiento, nunca con el rol anon.
-- El bucket solicitudes-reparacion ya es privado; sus políticas de lectura
-- exigen ser personal autorizado o cliente propietario para solicitudes con cuenta.
alter table public.tienda_solicitud_reparacion_archivos
  alter column cliente_id drop not null;

comment on column public.tienda_solicitud_reparacion_archivos.cliente_id is
  'ID del cliente autenticado; NULL cuando se trata de una foto de solicitud sin cuenta, insertada exclusivamente desde la API validada del servidor.';
