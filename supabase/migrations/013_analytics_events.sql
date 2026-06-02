-- =============================================================================
-- Saúde & Bem — Fase 3.4: Analytics & Inteligência
-- Execute após 012_newsletter_subscribers.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Tabela analytics_events
-- -----------------------------------------------------------------------------
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null
    check (event_type in (
      'page_view',
      'lead_submitted',
      'affiliate_click',
      'ebook_download',
      'protocol_view',
      'article_view'
    )),
  source_page text not null default '',
  source_type text not null default 'direct',
  content_id text,
  content_title text,
  user_id uuid references auth.users on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists analytics_events_event_type_idx
  on public.analytics_events (event_type);

create index if not exists analytics_events_created_at_idx
  on public.analytics_events (created_at desc);

create index if not exists analytics_events_content_idx
  on public.analytics_events (event_type, content_id)
  where content_id is not null;

create index if not exists analytics_events_user_id_idx
  on public.analytics_events (user_id)
  where user_id is not null;

comment on table public.analytics_events is
  'Eventos comportamentais do portal — sem dados sensíveis ou médicos';

comment on column public.analytics_events.metadata is
  'Contexto técnico (slug, categoria). Integrações futuras: ga4, meta_pixel, gtm, search_console (flags apenas)';

-- -----------------------------------------------------------------------------
-- 2. Row Level Security
-- -----------------------------------------------------------------------------
alter table public.analytics_events enable row level security;

drop policy if exists "analytics_events insert public" on public.analytics_events;
create policy "analytics_events insert public"
  on public.analytics_events
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "analytics_events admin read" on public.analytics_events;
create policy "analytics_events admin read"
  on public.analytics_events
  for select
  to authenticated
  using (public.is_admin());

grant insert on table public.analytics_events to anon, authenticated;
grant select on table public.analytics_events to authenticated;
