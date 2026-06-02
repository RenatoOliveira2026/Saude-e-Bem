-- =============================================================================
-- Saúde & Bem — Afiliados: destaque na home (Fase 3.1)
-- Execute após 009_home_public.sql
-- =============================================================================

alter table public.affiliate_links
  add column if not exists featured boolean not null default false;

create index if not exists affiliate_links_featured_idx
  on public.affiliate_links (featured)
  where active = true and featured = true;

comment on column public.affiliate_links.featured is 'Exibir na home pública (ativos + destacados)';
