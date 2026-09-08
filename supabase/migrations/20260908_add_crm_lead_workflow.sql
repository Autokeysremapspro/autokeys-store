alter table public.tienda_leads_calculadora
  add column if not exists motivo_perdida text,
  add column if not exists solicitud_id uuid references public.tienda_solicitudes_reparacion(id) on delete set null,
  drop constraint if exists tienda_leads_calculadora_motivo_perdida_check,
  add constraint tienda_leads_calculadora_motivo_perdida_check
    check (motivo_perdida is null or motivo_perdida in ('precio','sin_respuesta','no_reparable','competencia','duplicado','otro'));

create table if not exists public.tienda_lead_historial (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.tienda_leads_calculadora(id) on delete cascade,
  usuario_id uuid default auth.uid(),
  accion text not null check (accion in ('creado','llamada','whatsapp','email','estado','nota','seguimiento','convertido')),
  detalle text,
  created_at timestamptz not null default now()
);
alter table public.tienda_lead_historial enable row level security;
grant select, insert on table public.tienda_lead_historial to authenticated;
create policy staff_read_lead_history on public.tienda_lead_historial for select to authenticated using ((select is_staff()));
create policy staff_insert_lead_history on public.tienda_lead_historial for insert to authenticated with check ((select is_staff()));
grant insert on table public.tienda_solicitudes_reparacion to authenticated;
create policy staff_crea_solicitud_reparacion on public.tienda_solicitudes_reparacion for insert to authenticated with check ((select is_staff()));
create index if not exists tienda_lead_historial_lead_created_idx on public.tienda_lead_historial(lead_id, created_at desc);
create index if not exists tienda_leads_calculadora_estado_created_idx on public.tienda_leads_calculadora(estado, created_at desc);
