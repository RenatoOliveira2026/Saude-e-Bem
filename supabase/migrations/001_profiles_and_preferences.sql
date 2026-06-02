-- =============================================================================
-- Saúde & Bem — Setup completo: profiles + user_preferences + RLS + triggers
-- Execute no Supabase Dashboard → SQL Editor → Run
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Tabela profiles
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  name text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

comment on table public.profiles is 'Perfil público do usuário Saúde & Bem';

-- -----------------------------------------------------------------------------
-- 2. Tabela user_preferences
-- -----------------------------------------------------------------------------
create table if not exists public.user_preferences (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  goal text,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create unique index if not exists user_preferences_user_id_idx
  on public.user_preferences (user_id);

comment on table public.user_preferences is 'Preferências e objetivo de saúde do usuário';

-- -----------------------------------------------------------------------------
-- 3. Row Level Security (RLS)
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;

-- Remover políticas antigas (permite reexecutar o script com segurança)
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can view own preferences" on public.user_preferences;
drop policy if exists "Users can insert own preferences" on public.user_preferences;
drop policy if exists "Users can update own preferences" on public.user_preferences;

-- profiles: usuário autenticado lê e atualiza apenas o próprio registro
create policy "Users can view own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- user_preferences: usuário autenticado gerencia apenas as próprias preferências
create policy "Users can view own preferences"
  on public.user_preferences
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own preferences"
  on public.user_preferences
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own preferences"
  on public.user_preferences
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 4. Permissões (authenticated precisa acessar as tabelas via RLS)
-- -----------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;

grant select, update on table public.profiles to authenticated;
grant select, insert, update on table public.user_preferences to authenticated;

-- -----------------------------------------------------------------------------
-- 5. Trigger: criar profile + preferences automaticamente no cadastro
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

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 6. Trigger: atualizar updated_at em profiles
-- -----------------------------------------------------------------------------
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;

create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 7. Verificação rápida (opcional — confirma que as tabelas existem)
-- -----------------------------------------------------------------------------
select
  'profiles' as table_name,
  count(*) as row_count
from public.profiles
union all
select
  'user_preferences' as table_name,
  count(*) as row_count
from public.user_preferences;
