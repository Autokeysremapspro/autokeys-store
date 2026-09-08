alter table public.tienda_leads_calculadora
  add column if not exists es_taller boolean not null default false,
  add column if not exists taller_activo_at timestamptz,
  add column if not exists recordatorio_taller_24h_at timestamptz;

update public.tienda_leads_calculadora set es_taller = true
where origen = 'profesionales' and es_taller = false;

alter table public.tienda_leads_calculadora
  drop constraint if exists tienda_leads_calculadora_estado_check,
  add constraint tienda_leads_calculadora_estado_check
  check (estado in ('nuevo','contactado','presupuesto','seguimiento','convertido','perdido','taller_activo'));

create index if not exists tienda_leads_taller_estado_idx
  on public.tienda_leads_calculadora(es_taller, estado, created_at desc);
