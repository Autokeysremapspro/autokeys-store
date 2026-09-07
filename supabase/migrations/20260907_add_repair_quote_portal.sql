-- Portal privado de seguimiento, aceptación de presupuestos y pago de reparaciones.
alter table public.tienda_solicitudes_reparacion
  add column if not exists seguimiento_token uuid not null default gen_random_uuid(),
  add column if not exists presupuesto_detalle text,
  add column if not exists presupuesto_aceptado_at timestamptz,
  add column if not exists pago_estado text not null default 'no_requerido',
  add column if not exists pago_referencia text,
  add column if not exists pago_confirmado_at timestamptz;

create unique index if not exists tienda_solicitudes_reparacion_seguimiento_token_key
  on public.tienda_solicitudes_reparacion (seguimiento_token);

create unique index if not exists tienda_solicitudes_reparacion_pago_referencia_key
  on public.tienda_solicitudes_reparacion (pago_referencia)
  where pago_referencia is not null;

alter table public.tienda_solicitudes_reparacion
  drop constraint if exists tienda_solicitudes_reparacion_pago_estado_check;

alter table public.tienda_solicitudes_reparacion
  add constraint tienda_solicitudes_reparacion_pago_estado_check
  check (pago_estado in ('no_requerido', 'pendiente', 'pagado', 'fallido'));

alter table public.tienda_solicitudes_reparacion
  drop constraint if exists tienda_solicitudes_reparacion_presupuesto_detalle_check;

alter table public.tienda_solicitudes_reparacion
  add constraint tienda_solicitudes_reparacion_presupuesto_detalle_check
  check (presupuesto_detalle is null or char_length(presupuesto_detalle) <= 4000);

comment on column public.tienda_solicitudes_reparacion.seguimiento_token is
  'Token secreto para el portal de seguimiento sin cuenta; nunca se expone en listados públicos.';
comment on column public.tienda_solicitudes_reparacion.presupuesto_detalle is
  'Resumen visible para el cliente de los trabajos incluidos en el presupuesto.';
comment on column public.tienda_solicitudes_reparacion.pago_referencia is
  'Identificador del checkout alojado de SumUp, verificado siempre desde servidor.';
