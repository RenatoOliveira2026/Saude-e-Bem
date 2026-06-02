-- =============================================================================
-- Saúde & Bem — Fase 3.5: Clube Premium (profiles, subscriptions, downloads)
-- Execute após 013_analytics_events.sql
-- Sem integração Stripe — estrutura preparada para billing futuro.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Estender profiles (tier do clube)
-- -----------------------------------------------------------------------------
alter table public.profiles
  add column if not exists membership_tier text not null default 'free'
    check (membership_tier in ('free', 'premium'));

alter table public.profiles
  add column if not exists club_joined_at timestamptz;

comment on column public.profiles.membership_tier is 'Plano atual do membro: free ou premium';
comment on column public.profiles.club_joined_at is 'Data de entrada na área de membros do clube';

-- -----------------------------------------------------------------------------
-- 2. is_premium em artigos (protocolos/ebooks já possuem)
-- -----------------------------------------------------------------------------
alter table public.articles
  add column if not exists is_premium boolean not null default false;

create index if not exists articles_is_premium_idx
  on public.articles (is_premium)
  where is_premium = true;

-- -----------------------------------------------------------------------------
-- 3. Tabela subscriptions
-- -----------------------------------------------------------------------------
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  plan text not null default 'premium'
    check (plan in ('free', 'premium')),
  status text not null default 'pending'
    check (status in ('active', 'trialing', 'past_due', 'canceled', 'expired', 'pending')),
  provider text not null default 'manual'
    check (provider in ('manual', 'stripe', 'internal')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  canceled_at timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists subscriptions_status_idx on public.subscriptions (status);
create index if not exists subscriptions_period_end_idx
  on public.subscriptions (current_period_end)
  where current_period_end is not null;

comment on table public.subscriptions is 'Assinaturas do Clube Saúde & Bem (manual ou Stripe futuro)';

-- -----------------------------------------------------------------------------
-- 4. Tabela user_downloads (histórico na área de membros)
-- -----------------------------------------------------------------------------
create table if not exists public.user_downloads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  content_type text not null
    check (content_type in ('article', 'protocol', 'ebook')),
  content_id uuid not null,
  content_title text not null,
  content_slug text,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists user_downloads_user_id_idx on public.user_downloads (user_id);
create index if not exists user_downloads_created_at_idx
  on public.user_downloads (user_id, created_at desc);

comment on table public.user_downloads is 'Downloads registrados por membros (biblioteca e materiais)';

-- -----------------------------------------------------------------------------
-- 5. Triggers updated_at
-- -----------------------------------------------------------------------------
drop trigger if exists subscriptions_updated_at on public.subscriptions;
create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.handle_updated_at();

-- Sincroniza membership_tier no profile quando assinatura muda
create or replace function public.sync_profile_membership_tier()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  is_active boolean;
  new_tier text;
begin
  is_active := NEW.status in ('active', 'trialing')
    and NEW.plan = 'premium'
    and (NEW.current_period_end is null or NEW.current_period_end > timezone('utc', now()));

  new_tier := case when is_active then 'premium' else 'free' end;

  update public.profiles
  set
    membership_tier = new_tier,
    club_joined_at = coalesce(club_joined_at, timezone('utc', now()))
  where id = NEW.user_id;

  return NEW;
end;
$$;

drop trigger if exists subscriptions_sync_profile on public.subscriptions;
create trigger subscriptions_sync_profile
  after insert or update of status, plan, current_period_end on public.subscriptions
  for each row execute function public.sync_profile_membership_tier();

-- Marca club_joined_at no primeiro acesso autenticado à área (via app)
create or replace function public.touch_club_joined(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set club_joined_at = coalesce(club_joined_at, timezone('utc', now()))
  where id = p_user_id;
end;
$$;

grant execute on function public.touch_club_joined(uuid) to authenticated;

-- -----------------------------------------------------------------------------
-- 6. Função: usuário com premium ativo
-- -----------------------------------------------------------------------------
create or replace function public.user_has_active_premium(p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select true
      from public.subscriptions s
      where s.user_id = coalesce(p_user_id, auth.uid())
        and s.plan = 'premium'
        and s.status in ('active', 'trialing')
        and (
          s.current_period_end is null
          or s.current_period_end > timezone('utc', now())
        )
      limit 1
    ),
    (
      select p.membership_tier = 'premium'
      from public.profiles p
      where p.id = coalesce(p_user_id, auth.uid())
    ),
    false
  );
$$;

grant execute on function public.user_has_active_premium(uuid) to authenticated, anon;

-- -----------------------------------------------------------------------------
-- 7. Row Level Security
-- -----------------------------------------------------------------------------
alter table public.subscriptions enable row level security;
alter table public.user_downloads enable row level security;

-- subscriptions: membro lê a própria; admin lê todas
drop policy if exists "Users can view own subscriptions" on public.subscriptions;
create policy "Users can view own subscriptions"
  on public.subscriptions for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Admins can view all subscriptions" on public.subscriptions;
create policy "Admins can view all subscriptions"
  on public.subscriptions for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins manage subscriptions" on public.subscriptions;
create policy "Admins manage subscriptions"
  on public.subscriptions for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- user_downloads: membro gerencia os próprios; admin lê todos
drop policy if exists "Users can view own downloads" on public.user_downloads;
create policy "Users can view own downloads"
  on public.user_downloads for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own downloads" on public.user_downloads;
create policy "Users can insert own downloads"
  on public.user_downloads for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Admins can view all downloads" on public.user_downloads;
create policy "Admins can view all downloads"
  on public.user_downloads for select
  to authenticated
  using (public.is_admin());

-- profiles: permitir leitura do próprio tier (políticas existentes em 001/004)
-- Admins já podem ver todos os profiles via migration 004

-- -----------------------------------------------------------------------------
-- 8. Permissões
-- -----------------------------------------------------------------------------
grant select on table public.subscriptions to authenticated;
grant select, insert on table public.user_downloads to authenticated;

-- -----------------------------------------------------------------------------
-- 9. Conceder premium manualmente (exemplo — substituir UUID)
-- -----------------------------------------------------------------------------
-- insert into public.subscriptions (user_id, plan, status, provider, current_period_start, current_period_end)
-- values (
--   '00000000-0000-0000-0000-000000000000'::uuid,
--   'premium',
--   'active',
--   'manual',
--   timezone('utc', now()),
--   timezone('utc', now()) + interval '365 days'
-- );
