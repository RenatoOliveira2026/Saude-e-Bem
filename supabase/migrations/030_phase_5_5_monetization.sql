-- =============================================================================
-- Saúde & Bem — Fase 5.5: Plano trimestral + estrutura de cupons
-- Execute após 029_monetization_real.sql
-- =============================================================================

-- Plano trimestral em profiles.plan
alter table public.profiles
  drop constraint if exists profiles_plan_check;

alter table public.profiles
  add constraint profiles_plan_check
  check (plan in ('free', 'premium_monthly', 'premium_quarterly', 'premium_annual', 'admin'));

comment on column public.profiles.plan is
  'Plano do usuário: free, premium_monthly, premium_quarterly, premium_annual ou admin';

-- Sincroniza plan ao alterar assinatura (preserva admin)
create or replace function public.sync_profile_membership_tier()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  is_active boolean;
  new_tier text;
  new_plan text;
  current_plan text;
begin
  is_active := NEW.status in ('active', 'trialing')
    and NEW.plan = 'premium'
    and (NEW.current_period_end is null or NEW.current_period_end > timezone('utc', now()));

  new_tier := case when is_active then 'premium' else 'free' end;

  new_plan := case
    when is_active and NEW.billing_plan_id = 'premium_annual' then 'premium_annual'
    when is_active and NEW.billing_plan_id = 'premium_quarterly' then 'premium_quarterly'
    when is_active and NEW.billing_plan_id = 'premium_monthly' then 'premium_monthly'
    when is_active then 'premium_monthly'
    else 'free'
  end;

  select p.plan into current_plan from public.profiles p where p.id = NEW.user_id;

  update public.profiles
  set
    membership_tier = new_tier,
    plan = case when current_plan = 'admin' then 'admin' else new_plan end,
    club_joined_at = coalesce(club_joined_at, timezone('utc', now()))
  where id = NEW.user_id;

  return NEW;
end;
$$;

-- Premium ativo via plan ou assinatura
create or replace function public.user_has_active_premium(p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select p.plan in ('premium_monthly', 'premium_quarterly', 'premium_annual', 'admin')
      from public.profiles p
      where p.id = coalesce(p_user_id, auth.uid())
    ),
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
    false
  );
$$;

-- KPIs admin — inclui assinantes trimestrais
create or replace function public.get_finance_dashboard_stats()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  if not public.is_admin() then
    raise exception 'Acesso negado';
  end if;

  select jsonb_build_object(
    'total_revenue_cents', coalesce((
      select sum(amount_cents)::bigint
      from public.payments
      where status = 'approved'
    ), 0),
    'revenue_last_30_days_cents', coalesce((
      select sum(amount_cents)::bigint
      from public.payments
      where status = 'approved'
        and paid_at >= timezone('utc', now()) - interval '30 days'
    ), 0),
    'active_subscriptions', coalesce((
      select count(*)::int
      from public.subscriptions
      where status in ('active', 'trialing')
    ), 0),
    'pending_payments', coalesce((
      select count(*)::int
      from public.payments
      where status in ('pending', 'in_process', 'in_mediation')
    ), 0),
    'monthly_subscribers', coalesce((
      select count(*)::int
      from public.subscriptions
      where status in ('active', 'trialing')
        and billing_plan_id = 'premium_monthly'
    ), 0),
    'quarterly_subscribers', coalesce((
      select count(*)::int
      from public.subscriptions
      where status in ('active', 'trialing')
        and billing_plan_id = 'premium_quarterly'
    ), 0),
    'annual_subscribers', coalesce((
      select count(*)::int
      from public.subscriptions
      where status in ('active', 'trialing')
        and billing_plan_id = 'premium_annual'
    ), 0)
  ) into result;

  return result;
end;
$$;

-- Cupons de desconto (estrutura futura — Fase 5.5)
create table if not exists public.discount_coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  description text,
  discount_type text not null,
  discount_value integer not null,
  currency text not null default 'BRL',
  valid_from timestamptz,
  valid_until timestamptz,
  max_redemptions integer,
  redemption_count integer not null default 0,
  applies_to_plans text[] not null default '{}'::text[],
  min_amount_cents integer,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.discount_coupons
  drop constraint if exists discount_coupons_code_key;

alter table public.discount_coupons
  add constraint discount_coupons_code_key unique (code);

alter table public.discount_coupons
  drop constraint if exists discount_coupons_discount_type_check;

alter table public.discount_coupons
  add constraint discount_coupons_discount_type_check
  check (discount_type in ('percent', 'fixed'));

alter table public.discount_coupons
  drop constraint if exists discount_coupons_discount_value_check;

alter table public.discount_coupons
  add constraint discount_coupons_discount_value_check
  check (discount_value > 0);

comment on table public.discount_coupons is
  'Cupons promocionais — validação e aplicação no checkout (futuro)';

create index if not exists discount_coupons_code_idx
  on public.discount_coupons (lower(code))
  where active = true;

create table if not exists public.discount_coupon_redemptions (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references public.discount_coupons on delete restrict,
  user_id uuid not null references auth.users on delete cascade,
  payment_id uuid references public.payments on delete set null,
  discount_cents integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now())
);

comment on table public.discount_coupon_redemptions is
  'Histórico de resgates de cupom por usuário/pagamento';

create index if not exists discount_coupon_redemptions_user_idx
  on public.discount_coupon_redemptions (user_id, created_at desc);

create index if not exists discount_coupon_redemptions_coupon_idx
  on public.discount_coupon_redemptions (coupon_id);

-- Campos opcionais em payments para cupom (checkout futuro)
alter table public.payments
  add column if not exists coupon_code text;

alter table public.payments
  add column if not exists discount_cents integer not null default 0;

comment on column public.payments.coupon_code is
  'Código de cupom aplicado no checkout (quando suportado)';

comment on column public.payments.discount_cents is
  'Desconto aplicado em centavos via cupom';

-- RLS cupons — apenas admin gerencia; usuários veem próprios resgates
alter table public.discount_coupons enable row level security;
alter table public.discount_coupon_redemptions enable row level security;

drop policy if exists "Admins manage discount coupons" on public.discount_coupons;
create policy "Admins manage discount coupons"
  on public.discount_coupons
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Users view own coupon redemptions" on public.discount_coupon_redemptions;
create policy "Users view own coupon redemptions"
  on public.discount_coupon_redemptions
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Admins view all coupon redemptions" on public.discount_coupon_redemptions;
create policy "Admins view all coupon redemptions"
  on public.discount_coupon_redemptions
  for select
  to authenticated
  using (public.is_admin());

grant select on table public.discount_coupons to authenticated;
grant select on table public.discount_coupon_redemptions to authenticated;
