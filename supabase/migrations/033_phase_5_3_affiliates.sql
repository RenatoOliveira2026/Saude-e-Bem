-- Fase 5.3 — Central de recomendações e afiliados

-- -----------------------------------------------------------------------------
-- 1. Campos extras em affiliate_clicks (user_agent, referrer)
-- -----------------------------------------------------------------------------
alter table public.affiliate_clicks
  add column if not exists user_agent text,
  add column if not exists referrer text;

comment on column public.affiliate_clicks.user_agent is
  'User-Agent do navegador no clique';
comment on column public.affiliate_clicks.referrer is
  'Referrer HTTP no clique';

create index if not exists affiliate_clicks_created_at_idx
  on public.affiliate_clicks (created_at desc);

-- -----------------------------------------------------------------------------
-- 2. Normalizar categorias (taxonomia Fase 5.3)
-- -----------------------------------------------------------------------------
update public.affiliate_links
set category = 'saude-mental'
where category in ('mente', 'saude-mental', 'saúde-mental');

update public.affiliate_links
set category = 'alimentacao-saudavel'
where category in ('alimentacao', 'nutricao', 'alimentação', 'alimentacao-saudavel');

update public.affiliate_links
set category = 'suplementos'
where category in ('suplemento', 'suplementos');

update public.affiliate_links
set category = 'livros'
where category in ('livro', 'livros');

update public.affiliate_links
set category = 'exercicios'
where category in ('exercicio', 'exercicios', 'movimento');

update public.affiliate_links
set category = 'equipamentos-saude'
where category in ('equipamento', 'equipamentos', 'dispositivo', 'equipamentos-saude');

update public.affiliate_links
set category = 'bem-estar'
where category in (
  'energia', 'intestinal', 'detox', 'longevidade', 'menopausa', 'bem-estar', 'wellness'
);

-- -----------------------------------------------------------------------------
-- 3. View affiliate_products (alias de affiliate_links — spec Fase 5.3)
-- -----------------------------------------------------------------------------
create or replace view public.affiliate_products as
select
  id,
  title,
  slug,
  description,
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

comment on view public.affiliate_products is
  'Alias de leitura sobre affiliate_links — Fase 5.3 Central de Recomendações';

grant select on public.affiliate_products to anon, authenticated;
