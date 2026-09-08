alter table public.tienda_leads_calculadora
  add column if not exists session_id uuid,
  add column if not exists recordatorio_incompleto_at timestamptz;
create unique index if not exists tienda_leads_calculadora_session_id_uidx
  on public.tienda_leads_calculadora(session_id) where session_id is not null;
