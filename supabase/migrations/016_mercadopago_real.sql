-- =============================================================================
-- Saúde & Bem — Fase 3.7: Mercado Pago Real (webhooks, renovação, cancelamento)
-- Execute após 015_payments.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Campos extras em subscriptions
-- -----------------------------------------------------------------------------
alter table public.subscriptions
  add column if not exists billing_plan_id text;

alter table public.subscriptions
  add column if not exists auto_renew boolean not null default true;

alter table public.subscriptions
  add column if not exists cancel_at_period_end boolean not null default false;

alter table public.subscriptions
  add column if not exists mercadopago_payer_id text;

comment on column public.subscriptions.billing_plan_id is 'premium_monthly | premium_annual';
comment on column public.subscriptions.auto_renew is 'Renovação automática via preapproval MP (mensal)';
comment on column public.subscriptions.cancel_at_period_end is 'Cancelamento agendado ao fim do período';

create index if not exists subscriptions_period_expiry_idx
  on public.subscriptions (status, current_period_end)
  where status in ('active', 'trialing', 'past_due');

-- -----------------------------------------------------------------------------
-- 2. Eventos de webhook (idempotência)
-- -----------------------------------------------------------------------------
create table if not exists public.payment_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'mercadopago'
    check (provider in ('mercadopago')),
  event_key text not null,
  topic text not null,
  resource_id text,
  payload jsonb not null default '{}'::jsonb,
  processed_at timestamptz not null default timezone('utc'::text, now()),
  result_message text,
  unique (provider, event_key)
);

create index if not exists payment_webhook_events_topic_idx
  on public.payment_webhook_events (topic, processed_at desc);

comment on table public.payment_webhook_events is 'Log idempotente de webhooks Mercado Pago';

-- -----------------------------------------------------------------------------
-- 3. RLS webhook events (admin only)
-- -----------------------------------------------------------------------------
alter table public.payment_webhook_events enable row level security;

drop policy if exists "Admins can view webhook events" on public.payment_webhook_events;
create policy "Admins can view webhook events"
  on public.payment_webhook_events for select
  to authenticated
  using (public.is_admin());

grant select on table public.payment_webhook_events to authenticated;

-- -----------------------------------------------------------------------------
-- 4. Expirar assinaturas vencidas (cron / manual)
-- -----------------------------------------------------------------------------
create or replace function public.expire_due_subscriptions()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  expired_count integer := 0;
  canceled_count integer := 0;
begin
  update public.subscriptions
  set
    status = 'expired',
    updated_at = timezone('utc', now())
  where status in ('active', 'trialing', 'past_due')
    and current_period_end is not null
    and current_period_end <= timezone('utc', now())
    and cancel_at_period_end = false;

  get diagnostics expired_count = row_count;

  update public.subscriptions
  set
    status = 'canceled',
    canceled_at = coalesce(canceled_at, timezone('utc', now())),
    updated_at = timezone('utc', now())
  where status in ('active', 'trialing')
    and cancel_at_period_end = true
    and current_period_end is not null
    and current_period_end <= timezone('utc', now());

  get diagnostics canceled_count = row_count;

  return expired_count + canceled_count;
end;
$$;

grant execute on function public.expire_due_subscriptions() to authenticated;
