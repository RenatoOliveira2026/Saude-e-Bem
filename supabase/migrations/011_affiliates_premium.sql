-- =============================================================================
-- Saúde & Bem — Afiliados Premium (Fase 3.2)
-- Execute após 010_affiliate_featured.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Campos premium em affiliate_links
-- -----------------------------------------------------------------------------
alter table public.affiliate_links
  add column if not exists slug text,
  add column if not exists product_type text not null default 'outro',
  add column if not exists brand text not null default '',
  add column if not exists producer_name text not null default '',
  add column if not exists rating numeric(3, 2),
  add column if not exists reviews_count integer not null default 0,
  add column if not exists editor_choice boolean not null default false,
  add column if not exists benefits text not null default '',
  add column if not exists target_audience text not null default '',
  add column if not exists contraindications text not null default '',
  add column if not exists current_price numeric(12, 2),
  add column if not exists old_price numeric(12, 2),
  add column if not exists installments text not null default '',
  add column if not exists affiliate_platform text not null default '',
  add column if not exists affiliate_url text,
  add column if not exists official_url text,
  add column if not exists commission_type text not null default '',
  add column if not exists commission_value text not null default '',
  add column if not exists cookie_duration text not null default '',
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists seo_keywords text,
  add column if not exists testimonial_1 text not null default '',
  add column if not exists testimonial_2 text not null default '',
  add column if not exists testimonial_3 text not null default '',
  add column if not exists video_url text;

-- Migrar URL legada → affiliate_url
update public.affiliate_links
set affiliate_url = url
where affiliate_url is null and url is not null;

-- Slugs a partir do título (registros existentes)
update public.affiliate_links
set slug = lower(
  regexp_replace(
    regexp_replace(
      trim(
        translate(
          title,
          'áàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ',
          'aaaaaeeeeiiiiooooouuuucnAAAAAEEEEIIIIOOOOOUUUUCN'
        )
      ),
      '[^a-zA-Z0-9]+',
      '-',
      'g'
    ),
    '(^-|-$)',
    '',
    'g'
  )
)
where slug is null or slug = '';

-- Garantir slugs únicos
do $$
declare
  r record;
  base_slug text;
  candidate text;
  n int;
begin
  for r in
    select id, slug from public.affiliate_links where slug is not null
  loop
    base_slug := r.slug;
    candidate := base_slug;
    n := 1;
    while exists (
      select 1 from public.affiliate_links
      where slug = candidate and id <> r.id
    ) loop
      n := n + 1;
      candidate := base_slug || '-' || n::text;
    end loop;
    if candidate <> r.slug then
      update public.affiliate_links set slug = candidate where id = r.id;
    end if;
  end loop;
end $$;

alter table public.affiliate_links
  alter column slug set not null;

create unique index if not exists affiliate_links_slug_key
  on public.affiliate_links (slug);

create index if not exists affiliate_links_product_type_idx
  on public.affiliate_links (product_type);

create index if not exists affiliate_links_editor_choice_idx
  on public.affiliate_links (editor_choice)
  where active = true;

comment on column public.affiliate_links.affiliate_url is 'URL de rastreamento do afiliado (CTA público)';
comment on column public.affiliate_links.official_url is 'Site oficial do produto (referência)';

-- -----------------------------------------------------------------------------
-- 2. Tracking de cliques
-- -----------------------------------------------------------------------------
create table if not exists public.affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliate_links (id) on delete cascade,
  source_page text not null default '',
  source_type text not null default 'direct',
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists affiliate_clicks_affiliate_id_idx
  on public.affiliate_clicks (affiliate_id);

create index if not exists affiliate_clicks_created_at_idx
  on public.affiliate_clicks (created_at desc);

comment on table public.affiliate_clicks is 'Cliques em CTAs de afiliados (portal público)';

alter table public.affiliate_clicks enable row level security;

drop policy if exists "affiliate_clicks insert public" on public.affiliate_clicks;
create policy "affiliate_clicks insert public"
  on public.affiliate_clicks
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "affiliate_clicks admin read" on public.affiliate_clicks;
create policy "affiliate_clicks admin read"
  on public.affiliate_clicks
  for select
  to authenticated
  using (public.is_admin());
