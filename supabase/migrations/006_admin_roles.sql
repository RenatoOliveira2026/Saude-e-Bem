-- =============================================================================
-- Saúde & Bem — Perfis administrativos (super_admin | admin)
-- Execute após 005_bootstrap_admin.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Enum e coluna role
-- -----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'admin_role') then
    create type public.admin_role as enum ('super_admin', 'admin');
  end if;
end $$;

alter table public.admin_users
  add column if not exists role public.admin_role not null default 'admin';

comment on column public.admin_users.role is 'super_admin: acesso total; admin: conteúdo sem gerir administradores';

-- -----------------------------------------------------------------------------
-- 2. Bootstrap: renatoao2013@gmail.com = super_admin
-- -----------------------------------------------------------------------------
update public.admin_users
set role = 'super_admin'
where email = 'renatoao2013@gmail.com';

create or replace function public.ensure_bootstrap_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.admin_users (user_id, email, role)
  select id, email, 'super_admin'::public.admin_role
  from auth.users
  where email = 'renatoao2013@gmail.com'
  on conflict (user_id) do update
    set email = excluded.email,
        role = 'super_admin'::public.admin_role;
end;
$$;

select public.ensure_bootstrap_admin();

-- -----------------------------------------------------------------------------
-- 3. Funções auxiliares
-- -----------------------------------------------------------------------------
create or replace function public.get_admin_role()
returns public.admin_role
language sql
security definer
set search_path = public
stable
as $$
  select role from public.admin_users where user_id = auth.uid() limit 1;
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid() and role = 'super_admin'
  );
$$;

grant execute on function public.get_admin_role() to authenticated;
grant execute on function public.is_super_admin() to authenticated;

-- is_admin() permanece: qualquer registro em admin_users
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

-- -----------------------------------------------------------------------------
-- 4. RLS admin_users — super_admin gere administradores
-- -----------------------------------------------------------------------------
drop policy if exists "Super admins can view all admin records" on public.admin_users;
create policy "Super admins can view all admin records"
  on public.admin_users for select
  to authenticated
  using (public.is_super_admin());

drop policy if exists "Super admins manage admin users" on public.admin_users;
create policy "Super admins manage admin users"
  on public.admin_users for all
  to authenticated
  using (public.is_super_admin())
  with check (public.is_super_admin());

-- -----------------------------------------------------------------------------
-- 5. Trigger: novo usuário renato = super_admin
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
    insert into public.admin_users (user_id, email, role)
    values (new.id, new.email, 'super_admin'::public.admin_role)
    on conflict (user_id) do update
      set email = excluded.email,
          role = 'super_admin'::public.admin_role;
  end if;

  return new;
end;
$$;
