-- Fase 6.0 — Clube Saúde & Bem / Área Premium
-- Catálogo de planos e vínculos de membros (complementa subscriptions existente)

create table if not exists public.membership_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  price numeric(10, 2) not null default 0,
  billing_cycle text not null default 'free'
    check (billing_cycle in ('free', 'monthly', 'quarterly', 'annual')),
  features jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now())
);

comment on table public.membership_plans is
  'Catálogo de planos do Clube Saúde & Bem (Fase 6.0)';

create index if not exists membership_plans_slug_idx
  on public.membership_plans (slug);

create index if not exists membership_plans_active_idx
  on public.membership_plans (is_active)
  where is_active = true;

create table if not exists public.user_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_id uuid not null references public.membership_plans (id) on delete restrict,
  status text not null default 'active'
    check (status in ('active', 'trialing', 'past_due', 'canceled', 'expired', 'pending')),
  started_at timestamptz not null default timezone('utc'::text, now()),
  expires_at timestamptz,
  provider text,
  external_id text,
  created_at timestamptz not null default timezone('utc'::text, now())
);

comment on table public.user_memberships is
  'Histórico e status de assinatura por usuário (Fase 6.0)';

create index if not exists user_memberships_user_id_idx
  on public.user_memberships (user_id);

create index if not exists user_memberships_plan_id_idx
  on public.user_memberships (plan_id);

create index if not exists user_memberships_status_idx
  on public.user_memberships (status);

create unique index if not exists user_memberships_active_user_idx
  on public.user_memberships (user_id)
  where status in ('active', 'trialing');

alter table public.membership_plans enable row level security;
alter table public.user_memberships enable row level security;

drop policy if exists "membership_plans public read active" on public.membership_plans;
create policy "membership_plans public read active"
  on public.membership_plans
  for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "membership_plans admin all" on public.membership_plans;
create policy "membership_plans admin all"
  on public.membership_plans
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "user_memberships read own" on public.user_memberships;
create policy "user_memberships read own"
  on public.user_memberships
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "user_memberships admin all" on public.user_memberships;
create policy "user_memberships admin all"
  on public.user_memberships
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Seed planos (ids fixos para idempotência)
insert into public.membership_plans (
  id, name, slug, description, price, billing_cycle, features, is_active
) values
(
  'f0600006-0006-4006-8006-000000000001',
  'Gratuito',
  'gratuito',
  'Acesso a conteúdos públicos, ferramentas básicas e minha jornada.',
  0,
  'free',
  '["Blog e artigos gratuitos","Protocolos públicos","Ferramentas básicas","Biblioteca digital gratuita","Minha Jornada"]'::jsonb,
  true
),
(
  'f0600006-0006-4006-8006-000000000002',
  'Premium Mensal',
  'premium-mensal',
  'Acesso completo a protocolos, biblioteca e ferramentas premium.',
  29.90,
  'monthly',
  '["Todos os protocolos premium","Biblioteca ampliada","Ferramentas avançadas","Área de membros do Clube","Suporte prioritário"]'::jsonb,
  true
),
(
  'f0600006-0006-4006-8006-000000000003',
  'Premium Anual',
  'premium-anual',
  'Melhor custo-benefício — 12 meses de acesso premium ao Clube.',
  297.00,
  'annual',
  '["Tudo do Premium Mensal","Lives exclusivas gravadas","Acesso antecipado a novidades","Economia vs. plano mensal"]'::jsonb,
  true
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  billing_cycle = excluded.billing_cycle,
  features = excluded.features,
  is_active = excluded.is_active;
