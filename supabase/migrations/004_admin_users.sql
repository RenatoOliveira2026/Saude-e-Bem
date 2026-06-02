-- =============================================================================
-- Saúde & Bem — Fase 2.6: admin_users + controle de acesso administrativo
-- Execute após 002_content_and_favorites.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Tabela admin_users
-- -----------------------------------------------------------------------------
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null unique,
  email text not null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists admin_users_user_id_idx on public.admin_users (user_id);

comment on table public.admin_users is 'Usuários com acesso ao painel /admin';

-- -----------------------------------------------------------------------------
-- 2. Função is_admin() — usada nas políticas RLS
-- -----------------------------------------------------------------------------
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

grant execute on function public.is_admin() to authenticated;

-- -----------------------------------------------------------------------------
-- 3. RLS admin_users
-- -----------------------------------------------------------------------------
alter table public.admin_users enable row level security;

drop policy if exists "Admins can view own admin record" on public.admin_users;
create policy "Admins can view own admin record"
  on public.admin_users for select
  to authenticated
  using (auth.uid() = user_id);

-- Inserção/remoção de admins: apenas via SQL Editor (service role) ou Dashboard

grant select on table public.admin_users to authenticated;

-- -----------------------------------------------------------------------------
-- 4. Políticas admin — conteúdo (CRUD completo)
-- -----------------------------------------------------------------------------
drop policy if exists "Admins manage articles" on public.articles;
create policy "Admins manage articles"
  on public.articles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins manage protocols" on public.protocols;
create policy "Admins manage protocols"
  on public.protocols for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins manage ebooks" on public.ebooks;
create policy "Admins manage ebooks"
  on public.ebooks for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- 5. Políticas admin — leitura de usuários e favoritos (dashboard)
-- -----------------------------------------------------------------------------
drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can view all favorites" on public.favorites;
create policy "Admins can view all favorites"
  on public.favorites for select
  to authenticated
  using (public.is_admin());

-- -----------------------------------------------------------------------------
-- 6. Promover primeiro administrador
-- Ver migration 005_bootstrap_admin.sql (renatoao2013@gmail.com)
-- -----------------------------------------------------------------------------
