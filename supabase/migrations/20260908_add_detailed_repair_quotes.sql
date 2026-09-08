alter table public.tienda_solicitudes_reparacion
  add column if not exists presupuesto_lineas jsonb not null default '[]'::jsonb,
  add column if not exists presupuesto_validez_dias integer not null default 15,
  add column if not exists presupuesto_observaciones text;

alter table public.tienda_solicitudes_reparacion
  drop constraint if exists tienda_solicitudes_reparacion_presupuesto_lineas_check,
  drop constraint if exists tienda_solicitudes_reparacion_presupuesto_validez_check,
  drop constraint if exists tienda_solicitudes_reparacion_presupuesto_observaciones_check;

alter table public.tienda_solicitudes_reparacion
  add constraint tienda_solicitudes_reparacion_presupuesto_lineas_check
    check (jsonb_typeof(presupuesto_lineas) = 'array' and jsonb_array_length(presupuesto_lineas) <= 30),
  add constraint tienda_solicitudes_reparacion_presupuesto_validez_check
    check (presupuesto_validez_dias between 1 and 90),
  add constraint tienda_solicitudes_reparacion_presupuesto_observaciones_check
    check (presupuesto_observaciones is null or char_length(presupuesto_observaciones) <= 2000);

comment on column public.tienda_solicitudes_reparacion.presupuesto_lineas is
  'Líneas visibles en portal y PDF: concepto, cantidad, precio_unitario y total.';
comment on column public.tienda_solicitudes_reparacion.presupuesto_validez_dias is
  'Días de validez del presupuesto desde su envío.';
