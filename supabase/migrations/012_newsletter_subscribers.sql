-- =============================================================================
-- Saúde & Bem — Fase 3.3: Newsletter e captura de leads
-- Execute após 011_affiliates_premium.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Tabela newsletter_subscribers
-- -----------------------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  source text not null default 'home'
    check (source in ('home', 'blog', 'biblioteca', 'clube', 'other')),
  status text not null default 'active'
    check (status in ('active', 'unsubscribed', 'bounced')),
  provider text
    check (provider is null or provider in ('brevo', 'mailerlite')),
  external_id text,
  synced_at timestamptz,
  sync_error text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  constraint newsletter_subscribers_email_key unique (email)
);

create index if not exists newsletter_subscribers_email_idx
  on public.newsletter_subscribers (email);

create index if not exists newsletter_subscribers_source_idx
  on public.newsletter_subscribers (source);

create index if not exists newsletter_subscribers_status_idx
  on public.newsletter_subscribers (status);

create index if not exists newsletter_subscribers_created_at_idx
  on public.newsletter_subscribers (created_at desc);

create index if not exists newsletter_subscribers_sync_pending_idx
  on public.newsletter_subscribers (created_at)
  where synced_at is null and status = 'active';

comment on table public.newsletter_subscribers is
  'Inscritos na newsletter — captura pública, sync futuro Brevo/MailerLite';

comment on column public.newsletter_subscribers.provider is
  'Provedor externo após sync: brevo | mailerlite';
comment on column public.newsletter_subscribers.external_id is
  'ID do contato no provedor externo';
comment on column public.newsletter_subscribers.synced_at is
  'Timestamp da última sincronização bem-sucedida';

-- -----------------------------------------------------------------------------
-- 2. Migrar dados legados de newsletter_leads (se existir)
-- -----------------------------------------------------------------------------
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'newsletter_leads'
  ) then
    insert into public.newsletter_subscribers (name, email, source, created_at)
    select
      nl.name,
      lower(trim(nl.email)),
      case
        when nl.source in ('home', 'blog', 'biblioteca', 'clube', 'other') then nl.source
        else 'other'
      end,
      nl.created_at
    from public.newsletter_leads nl
    on conflict (email) do nothing;
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- 3. Trigger updated_at
-- -----------------------------------------------------------------------------
drop trigger if exists newsletter_subscribers_updated_at on public.newsletter_subscribers;
create trigger newsletter_subscribers_updated_at
  before update on public.newsletter_subscribers
  for each row execute function public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 4. Row Level Security
-- -----------------------------------------------------------------------------
alter table public.newsletter_subscribers enable row level security;

drop policy if exists "newsletter_subscribers insert public" on public.newsletter_subscribers;
create policy "newsletter_subscribers insert public"
  on public.newsletter_subscribers
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "newsletter_subscribers admin read" on public.newsletter_subscribers;
create policy "newsletter_subscribers admin read"
  on public.newsletter_subscribers
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "newsletter_subscribers admin update" on public.newsletter_subscribers;
create policy "newsletter_subscribers admin update"
  on public.newsletter_subscribers
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select, insert on table public.newsletter_subscribers to anon, authenticated;
grant update on table public.newsletter_subscribers to authenticated;
