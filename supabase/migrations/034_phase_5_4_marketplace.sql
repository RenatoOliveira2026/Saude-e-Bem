-- Fase 5.4 — Marketplace de ofertas reais

alter table public.affiliate_links
  add column if not exists short_description text not null default '';

comment on column public.affiliate_links.short_description is
  'Descrição curta para cards, listagens e meta tags';

update public.affiliate_links
set short_description = left(trim(description), 160)
where (short_description is null or short_description = '')
  and description is not null
  and trim(description) <> '';

create or replace view public.affiliate_products as
select
  id,
  title,
  slug,
  coalesce(nullif(trim(short_description), ''), left(trim(description), 160)) as description,
  image_url,
  category,
  coalesce(nullif(trim(affiliate_url), ''), nullif(trim(url), '')) as affiliate_url,
  coalesce(
    nullif(trim(brand), ''),
    nullif(trim(affiliate_platform), ''),
    ''
  ) as partner,
  featured as is_featured,
  created_at
from public.affiliate_links;
