-- =============================================================================
-- Saúde & Bem — Home pública: newsletter leads + leitura de afiliados ativos
-- Execute após 008_cms_professional.sql
-- =============================================================================

create table if not exists public.newsletter_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  source text not null default 'home',
  created_at timestamptz not null default timezone('utc'::text, now()),
  unique (email)
);

create index if not exists newsletter_leads_email_idx on public.newsletter_leads (email);

comment on table public.newsletter_leads is 'Captura de leads da home e newsletter';

alter table public.newsletter_leads enable row level security;

drop policy if exists "newsletter_leads insert public" on public.newsletter_leads;
create policy "newsletter_leads insert public"
  on public.newsletter_leads
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "affiliate_links public read active" on public.affiliate_links;
create policy "affiliate_links public read active"
  on public.affiliate_links
  for select
  to anon, authenticated
  using (active = true);
