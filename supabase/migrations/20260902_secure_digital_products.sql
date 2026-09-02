-- Productos digitales con configuración privada y entrega auditada.
alter table public.tienda_productos
  add column if not exists es_digital boolean not null default false,
  add column if not exists digital_gratis boolean not null default false,
  add column if not exists digital_version text,
  add column if not exists digital_instrucciones text;

alter table public.tienda_productos
  drop constraint if exists tienda_productos_digital_gratis_valid,
  add constraint tienda_productos_digital_gratis_valid
    check (not digital_gratis or es_digital);

alter table public.tienda_pedido_lineas
  add column if not exists es_digital boolean not null default false;

create table if not exists public.tienda_producto_digital (
  producto_id text primary key references public.tienda_productos(id) on delete cascade,
  entrega_tipo text not null check (entrega_tipo in ('archivo', 'enlace')),
  archivo_path text,
  enlace_externo text,
  nombre_archivo text,
  max_descargas integer check (max_descargas is null or max_descargas between 1 and 1000),
  enlace_duracion_segundos integer not null default 300 check (enlace_duracion_segundos between 60 and 3600),
  updated_at timestamptz not null default now(),
  constraint tienda_producto_digital_origen_valid check (
    (entrega_tipo = 'archivo' and nullif(btrim(archivo_path), '') is not null and enlace_externo is null)
    or
    (entrega_tipo = 'enlace' and nullif(btrim(enlace_externo), '') is not null and archivo_path is null)
  ),
  constraint tienda_producto_digital_enlace_https check (
    enlace_externo is null or enlace_externo ~* '^https://'
  )
);

create table if not exists public.tienda_descargas (
  id bigint generated always as identity primary key,
  usuario_id uuid references auth.users(id) on delete set null,
  producto_id text not null references public.tienda_productos(id) on delete restrict,
  pedido_id uuid references public.tienda_pedidos(id) on delete set null,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists tienda_descargas_usuario_producto_idx
  on public.tienda_descargas(usuario_id, producto_id, pedido_id, created_at desc);

alter table public.tienda_producto_digital enable row level security;
alter table public.tienda_descargas enable row level security;

revoke all on public.tienda_producto_digital from anon, authenticated;
revoke all on public.tienda_descargas from anon, authenticated;
grant select, insert, update, delete on public.tienda_producto_digital to authenticated;
grant select on public.tienda_descargas to authenticated;

drop policy if exists "staff gestiona entrega digital" on public.tienda_producto_digital;
create policy "staff gestiona entrega digital"
on public.tienda_producto_digital
for all to authenticated
using ((select public.is_staff()))
with check ((select public.is_staff()));

drop policy if exists "cliente ve sus descargas" on public.tienda_descargas;
create policy "cliente ve sus descargas"
on public.tienda_descargas
for select to authenticated
using ((select auth.uid()) = usuario_id);

drop policy if exists "staff ve historial de descargas" on public.tienda_descargas;
create policy "staff ve historial de descargas"
on public.tienda_descargas
for select to authenticated
using ((select public.is_staff()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'productos-digitales',
  'productos-digitales',
  false,
  262144000,
  array['application/octet-stream','application/zip','application/x-zip-compressed','application/pdf','text/plain']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "staff lee productos digitales" on storage.objects;
create policy "staff lee productos digitales"
on storage.objects for select to authenticated
using (bucket_id = 'productos-digitales' and (select public.is_staff()));

drop policy if exists "staff sube productos digitales" on storage.objects;
create policy "staff sube productos digitales"
on storage.objects for insert to authenticated
with check (bucket_id = 'productos-digitales' and (select public.is_staff()));

drop policy if exists "staff actualiza productos digitales" on storage.objects;
create policy "staff actualiza productos digitales"
on storage.objects for update to authenticated
using (bucket_id = 'productos-digitales' and (select public.is_staff()))
with check (bucket_id = 'productos-digitales' and (select public.is_staff()));

drop policy if exists "staff borra productos digitales" on storage.objects;
create policy "staff borra productos digitales"
on storage.objects for delete to authenticated
using (bucket_id = 'productos-digitales' and (select public.is_staff()));
