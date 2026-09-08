alter table public.tienda_solicitudes_reparacion
  add column if not exists presupuesto_enviado_at timestamptz,
  add column if not exists presupuesto_recordatorio_24h_at timestamptz,
  add column if not exists presupuesto_recordatorio_72h_at timestamptz,
  add column if not exists resena_solicitada_at timestamptz;

create table if not exists public.tienda_leads_calculadora (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(nombre) between 2 and 120),
  email text not null check (char_length(email) <= 254),
  telefono text not null check (char_length(telefono) between 9 and 30),
  tipo_unidad text not null check (char_length(tipo_unidad) <= 80),
  problema text not null check (char_length(problema) <= 160),
  marca_modelo text check (marca_modelo is null or char_length(marca_modelo) <= 180),
  origen text not null default 'calculadora',
  atendido_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.tienda_leads_calculadora enable row level security;
revoke all on table public.tienda_leads_calculadora from anon, authenticated;
create index if not exists tienda_leads_calculadora_created_at_idx on public.tienda_leads_calculadora (created_at desc);
create index if not exists tienda_solicitudes_presupuesto_reminders_idx
  on public.tienda_solicitudes_reparacion (estado, presupuesto_enviado_at)
  where presupuesto_enviado_at is not null;
