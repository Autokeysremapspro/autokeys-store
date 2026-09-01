create or replace function public.tienda_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Auth se comparte con AK Cloud y AK Core. Sus usuarios no deben aparecer
  -- como clientes de la tienda.
  if coalesce(new.raw_user_meta_data->>'tipo_usuario', '') = 'distribuidor' then
    return new;
  end if;

  if new.raw_app_meta_data ? 'rol' then
    return new;
  end if;

  insert into public.tienda_clientes (
    id,
    email,
    nombre,
    apellidos,
    tipo_cliente,
    razon_social,
    nif_cif
  ) values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nombre', ''),
    nullif(new.raw_user_meta_data->>'apellidos', ''),
    coalesce(nullif(new.raw_user_meta_data->>'tipo_cliente', ''), 'particular'),
    nullif(new.raw_user_meta_data->>'razon_social', ''),
    nullif(new.raw_user_meta_data->>'nif_cif', '')
  )
  on conflict (id) do update set
    email = excluded.email,
    nombre = coalesce(nullif(excluded.nombre, ''), public.tienda_clientes.nombre),
    apellidos = coalesce(excluded.apellidos, public.tienda_clientes.apellidos),
    tipo_cliente = coalesce(excluded.tipo_cliente, public.tienda_clientes.tipo_cliente),
    razon_social = coalesce(excluded.razon_social, public.tienda_clientes.razon_social),
    nif_cif = coalesce(excluded.nif_cif, public.tienda_clientes.nif_cif);

  return new;
end;
$$;

revoke execute on function public.tienda_handle_new_user() from public, anon, authenticated;

drop trigger if exists tienda_on_auth_user_created on auth.users;
create trigger tienda_on_auth_user_created
after insert on auth.users
for each row execute function public.tienda_handle_new_user();
