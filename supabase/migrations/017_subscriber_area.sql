-- =============================================================================
-- Saúde & Bem — Fase 3.8: Área do Assinante Premium
-- Execute após 016_mercadopago_real.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Protocolos salvos (progresso do assinante)
-- -----------------------------------------------------------------------------
create table if not exists public.user_saved_protocols (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  protocol_id uuid not null,
  status text not null default 'saved'
    check (status in ('saved', 'in_progress', 'completed')),
  notes text,
  saved_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  unique (user_id, protocol_id)
);

create index if not exists user_saved_protocols_user_idx
  on public.user_saved_protocols (user_id, updated_at desc);

create index if not exists user_saved_protocols_status_idx
  on public.user_saved_protocols (user_id, status);

comment on table public.user_saved_protocols is 'Protocolos salvos pelo membro com status de progresso';

-- -----------------------------------------------------------------------------
-- 2. Histórico de acessos a conteúdo
-- -----------------------------------------------------------------------------
create table if not exists public.user_content_access (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  content_type text not null
    check (content_type in ('article', 'protocol', 'ebook')),
  content_id uuid not null,
  content_title text not null,
  content_slug text,
  source_path text,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists user_content_access_user_created_idx
  on public.user_content_access (user_id, created_at desc);

create index if not exists user_content_access_content_idx
  on public.user_content_access (user_id, content_type, content_id);

comment on table public.user_content_access is 'Histórico de visualização de conteúdo pelo membro';

-- -----------------------------------------------------------------------------
-- 3. Triggers updated_at
-- -----------------------------------------------------------------------------
drop trigger if exists user_saved_protocols_updated_at on public.user_saved_protocols;
create trigger user_saved_protocols_updated_at
  before update on public.user_saved_protocols
  for each row execute function public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 4. RLS
-- -----------------------------------------------------------------------------
alter table public.user_saved_protocols enable row level security;
alter table public.user_content_access enable row level security;

drop policy if exists "Users manage own saved protocols" on public.user_saved_protocols;
create policy "Users manage own saved protocols"
  on public.user_saved_protocols for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users manage own content access" on public.user_content_access;
create policy "Users manage own content access"
  on public.user_content_access for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update, delete on public.user_saved_protocols to authenticated;
grant select, insert on public.user_content_access to authenticated;
