-- Las solicitudes públicas se validan e insertan exclusivamente desde la API
-- del servidor. RLS sigue impidiendo lectura o escritura anónima directa.
alter table public.tienda_solicitudes_reparacion
  alter column cliente_id drop not null;

comment on column public.tienda_solicitudes_reparacion.cliente_id is
  'Usuario autenticado asociado; NULL para solicitudes públicas validadas por el servidor.';
