-- =============================================================================
-- Saúde & Bem — Bootstrap: primeiro administrador
-- Execute após 004_admin_users.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Função idempotente: promove renatoao2013@gmail.com se existir em auth.users
-- -----------------------------------------------------------------------------
create or replace function public.ensure_bootstrap_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.admin_users (user_id, email)
  select id, email
  from auth.users
  where email = 'renatoao2013@gmail.com'
  on conflict (user_id) do update set email = excluded.email;
end;
$$;

-- Executa imediatamente (usuário já cadastrado)
select public.ensure_bootstrap_admin();

-- -----------------------------------------------------------------------------
-- 2. Auto-promover no cadastro (não cria usuário — só concede privilégio)
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );

  insert into public.user_preferences (user_id, goal)
  values (new.id, new.raw_user_meta_data->>'goal');

  if new.email = 'renatoao2013@gmail.com' then
    insert into public.admin_users (user_id, email)
    values (new.id, new.email)
    on conflict (user_id) do update set email = excluded.email;
  end if;

  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- 3. Verificação
-- -----------------------------------------------------------------------------
select
  au.id,
  au.user_id,
  au.email,
  au.created_at
from public.admin_users au
where au.email = 'renatoao2013@gmail.com';
