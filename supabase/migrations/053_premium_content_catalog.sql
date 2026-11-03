-- 053 — T-05 (parte 1 de 2): catálogos públicos de conteúdo (SECURITY_STATUS S-04)
--
-- Só ADICIONA três views; não muda nenhuma permissão existente. Aplicar ANTES
-- do deploy do código da T-05, que passa a ler as listagens destas views.
-- A parte 2 (054) fecha as tabelas e deve ser aplicada DEPOIS do deploy.
--
-- articles_public, protocols_public e ebooks_public listam todas as linhas
-- publicadas com as MESMAS colunas das tabelas, mas com o corpo vazio nas
-- linhas premium:
--   articles  → content
--   protocols → content, steps, benefits
--   ebooks    → content, highlights, pdf_url
-- Título, resumo, objetivo, capa, categoria e SEO continuam públicos
-- (listagens, cards, sitemap e a página com o convite para assinar).
--
-- As views rodam com os privilégios do dono (security_invoker = false) para
-- enxergar as linhas premium e devolver só a parte pública. Por isso recebem
-- apenas SELECT: o Supabase concede ALL por padrão a objetos novos em public,
-- e uma view simples é atualizável — sem o REVOKE, anon poderia alterar a
-- tabela através dela.

create or replace view public.articles_public
with (security_invoker = false, security_barrier = true)
as
select
  a.id, a.slug, a.title, a.excerpt,
  case when coalesce(a.is_premium, false) then '[]'::jsonb else a.content end as content,
  a.category, a.category_label, a.author, a.author_role, a.read_time,
  a.published_at, a.featured, a.status, a.created_at, a.updated_at,
  a.cover_image_url, a.seo_title, a.seo_description, a.seo_keywords,
  a.og_image_url, a.is_premium
from public.articles a
where a.status = 'published';

create or replace view public.protocols_public
with (security_invoker = false, security_barrier = true)
as
select
  p.id, p.slug, p.title, p.description, p.objective, p.long_description,
  p.category, p.category_label, p.duration, p.level,
  case when coalesce(p.is_premium, false) then '[]'::jsonb else p.benefits end as benefits,
  case when coalesce(p.is_premium, false) then '[]'::jsonb else p.steps end as steps,
  p.is_premium, p.featured, p.tag, p.participants, p.status,
  p.created_at, p.updated_at, p.cover_image_url, p.seo_title,
  p.seo_description, p.seo_keywords, p.og_image_url,
  case when coalesce(p.is_premium, false) then '[]'::jsonb else p.content end as content
from public.protocols p
where p.status = 'published';

create or replace view public.ebooks_public
with (security_invoker = false, security_barrier = true)
as
select
  e.id, e.slug, e.title, e.description, e.long_description,
  e.category, e.category_label, e.icon, e.format, e.pages,
  case when coalesce(e.is_premium, false) then '[]'::jsonb else e.highlights end as highlights,
  e.is_premium, e.downloads, e.featured, e.status, e.created_at, e.updated_at,
  e.cover_image_url,
  case when coalesce(e.is_premium, false) then null else e.pdf_url end as pdf_url,
  e.seo_title, e.seo_description, e.seo_keywords, e.og_image_url,
  case when coalesce(e.is_premium, false) then '[]'::jsonb else e.content end as content
from public.ebooks e
where e.status = 'published';

revoke all on public.articles_public, public.protocols_public, public.ebooks_public
  from public, anon, authenticated;
grant select on public.articles_public, public.protocols_public, public.ebooks_public
  to anon, authenticated, service_role;

comment on view public.articles_public is
  'T-05: catálogo público de artigos publicados; corpo vazio nas linhas premium.';
comment on view public.protocols_public is
  'T-05: catálogo público de protocolos publicados; content/steps/benefits vazios nas linhas premium.';
comment on view public.ebooks_public is
  'T-05: catálogo público de e-books publicados; content/highlights/pdf_url vazios nas linhas premium.';
