-- =============================================================================
-- Saúde & Bem — Fase 5.4: Monetização Real (histórico financeiro + relatórios)
-- Execute após 028_crm_automation.sql
-- =============================================================================

-- Plano de cobrança denormalizado em payments (relatórios admin)
alter table public.payments
  add column if not exists billing_plan_id text;

comment on column public.payments.billing_plan_id is
  'premium_monthly | premium_annual — espelho do plano no checkout';

create index if not exists payments_billing_plan_idx
  on public.payments (billing_plan_id);

create index if not exists payments_approved_paid_at_idx
  on public.payments (paid_at desc)
  where status = 'approved';

create index if not exists payments_created_status_idx
  on public.payments (created_at desc, status);

-- Histórico financeiro auditável (usuário + admin)
create table if not exists public.financial_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  payment_id uuid references public.payments on delete set null,
  subscription_id uuid references public.subscriptions on delete set null,
  event_type text not null,
  title text not null,
  description text,
  amount_cents integer,
  currency text not null default 'BRL',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.financial_events
  drop constraint if exists financial_events_event_type_check;

alter table public.financial_events
  add constraint financial_events_event_type_check
  check (event_type in (
    'checkout_started',
    'payment_pending',
    'payment_approved',
    'payment_rejected',
    'subscription_activated',
    'subscription_renewed',
    'subscription_canceled',
    'subscription_expired',
    'preapproval_authorized'
  ));

comment on table public.financial_events is
  'Linha do tempo financeira — checkout, pagamentos e ciclo de assinatura';

create index if not exists financial_events_user_id_idx
  on public.financial_events (user_id, created_at desc);

create index if not exists financial_events_event_type_idx
  on public.financial_events (event_type, created_at desc);

create index if not exists financial_events_payment_id_idx
  on public.financial_events (payment_id)
  where payment_id is not null;

-- RLS
alter table public.financial_events enable row level security;

drop policy if exists "Users view own financial events" on public.financial_events;
create policy "Users view own financial events"
  on public.financial_events
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Admins view all financial events" on public.financial_events;
create policy "Admins view all financial events"
  on public.financial_events
  for select
  to authenticated
  using (public.is_admin());

grant select on table public.financial_events to authenticated;

-- KPIs agregados para dashboard admin (security definer)
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

grant execute on function public.get_finance_dashboard_stats() to authenticated;
