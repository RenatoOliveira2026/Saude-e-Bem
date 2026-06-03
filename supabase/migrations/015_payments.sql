-- =============================================================================
-- Saúde & Bem — Fase 3.6: Pagamentos e Mercado Pago
-- Execute após 014_clube_premium.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Estender provider em subscriptions (Mercado Pago)
-- -----------------------------------------------------------------------------
alter table public.subscriptions
  drop constraint if exists subscriptions_provider_check;

alter table public.subscriptions
  add constraint subscriptions_provider_check
  check (provider in ('manual', 'stripe', 'internal', 'mercadopago'));

alter table public.subscriptions
  add column if not exists mercadopago_preapproval_id text;

comment on column public.subscriptions.mercadopago_preapproval_id is 'ID de assinatura/preapproval no Mercado Pago (futuro)';

-- -----------------------------------------------------------------------------
-- 2. Tabela payments
-- -----------------------------------------------------------------------------
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  subscription_id uuid references public.subscriptions on delete set null,
  provider text not null default 'mercadopago'
    check (provider in ('mercadopago', 'manual', 'stripe', 'internal')),
  external_id text,
  preference_id text,
  external_reference text not null,
  status text not null default 'pending'
    check (status in (
      'pending', 'approved', 'authorized', 'in_process', 'in_mediation',
      'rejected', 'cancelled', 'refunded', 'charged_back'
    )),
  payment_method text
    check (payment_method is null or payment_method in (
      'pix', 'credit_card', 'debit_card', 'ticket', 'account_money', 'unknown'
    )),
  amount_cents integer not null,
  currency text not null default 'BRL',
  description text,
  metadata jsonb not null default '{}'::jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create unique index if not exists payments_external_reference_idx
  on public.payments (external_reference);

create index if not exists payments_user_id_idx on public.payments (user_id);
create index if not exists payments_status_idx on public.payments (status);
create index if not exists payments_external_id_idx
  on public.payments (external_id)
  where external_id is not null;
create index if not exists payments_preference_id_idx
  on public.payments (preference_id)
  where preference_id is not null;

comment on table public.payments is 'Pagamentos do Clube Premium (Mercado Pago e outros provedores)';

-- -----------------------------------------------------------------------------
-- 3. Triggers updated_at
-- -----------------------------------------------------------------------------
drop trigger if exists payments_updated_at on public.payments;
create trigger payments_updated_at
  before update on public.payments
  for each row execute function public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 4. Row Level Security
-- -----------------------------------------------------------------------------
alter table public.payments enable row level security;

drop policy if exists "Users can view own payments" on public.payments;
create policy "Users can view own payments"
  on public.payments for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Admins can view all payments" on public.payments;
create policy "Admins can view all payments"
  on public.payments for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins manage payments" on public.payments;
create policy "Admins manage payments"
  on public.payments for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Inserção/atualização via service role (webhook) — sem policy para authenticated insert

-- -----------------------------------------------------------------------------
-- 5. Permissões
-- -----------------------------------------------------------------------------
grant select on table public.payments to authenticated;
