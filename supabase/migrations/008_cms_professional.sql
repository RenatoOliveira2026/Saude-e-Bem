-- =============================================================================
-- Saúde & Bem — CMS profissional: SEO, arquivado, conteúdo rico, afiliados
-- Execute após 007_cms_storage.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Status arquivado
-- -----------------------------------------------------------------------------
alter table public.articles drop constraint if exists articles_status_check;
alter table public.articles
  add constraint articles_status_check
  check (status in ('published', 'draft', 'archived'));

alter table public.protocols drop constraint if exists protocols_status_check;
alter table public.protocols
  add constraint protocols_status_check
  check (status in ('published', 'draft', 'archived'));

alter table public.ebooks drop constraint if exists ebooks_status_check;
alter table public.ebooks
  add constraint ebooks_status_check
  check (status in ('published', 'draft', 'archived'));

-- -----------------------------------------------------------------------------
-- 2. SEO (artigos, protocolos, ebooks)
-- -----------------------------------------------------------------------------
alter table public.articles
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists seo_keywords text,
  add column if not exists og_image_url text;

alter table public.protocols
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists seo_keywords text,
  add column if not exists og_image_url text,
  add column if not exists content jsonb not null default '[]'::jsonb;

alter table public.ebooks
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists seo_keywords text,
  add column if not exists og_image_url text,
  add column if not exists content jsonb not null default '[]'::jsonb;

-- -----------------------------------------------------------------------------
-- 3. Links de afiliados (admin only — sem uso público nesta fase)
-- -----------------------------------------------------------------------------
create table if not exists public.affiliate_links (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  description text not null default '',
  url text not null,
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists affiliate_links_active_idx on public.affiliate_links (active);
create index if not exists affiliate_links_category_idx on public.affiliate_links (category);

comment on table public.affiliate_links is 'Links de afiliados — gestão interna (Fase 2.9)';

alter table public.affiliate_links enable row level security;

drop policy if exists "affiliate_links admin all" on public.affiliate_links;
create policy "affiliate_links admin all"
  on public.affiliate_links
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
