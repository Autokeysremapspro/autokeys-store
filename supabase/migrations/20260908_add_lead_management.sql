alter table public.tienda_leads_calculadora
  add column if not exists estado text not null default 'nuevo',
  add column if not exists notas text,
  add column if not exists proximo_seguimiento_at timestamptz,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists landing_page text,
  add column if not exists referrer_host text,
  drop constraint if exists tienda_leads_calculadora_estado_check,
  add constraint tienda_leads_calculadora_estado_check check (estado in ('nuevo','contactado','presupuesto','seguimiento','convertido','perdido'));

grant select, update on table public.tienda_leads_calculadora to authenticated;
drop policy if exists staff_read_calculator_leads on public.tienda_leads_calculadora;
drop policy if exists staff_update_calculator_leads on public.tienda_leads_calculadora;
create policy staff_read_calculator_leads on public.tienda_leads_calculadora for select to authenticated using ((select is_staff()));
create policy staff_update_calculator_leads on public.tienda_leads_calculadora for update to authenticated using ((select is_staff())) with check ((select is_staff()));
