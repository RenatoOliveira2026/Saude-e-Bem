-- =============================================================================
-- Saúde & Bem — Fase 2.5: articles, protocols, ebooks, favorites + RLS
-- Execute no Supabase Dashboard → SQL Editor (após 001_profiles_and_preferences)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Enum-like checks via text + constraint
-- -----------------------------------------------------------------------------
create or replace function public.is_published_content(status text)
returns boolean
language sql
immutable
as $$
  select status = 'published';
$$;

-- -----------------------------------------------------------------------------
-- 2. Tabela articles (Blog)
-- -----------------------------------------------------------------------------
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content jsonb not null default '[]'::jsonb,
  category text not null,
  category_label text not null,
  author text not null,
  author_role text not null,
  read_time text not null,
  published_at text not null,
  featured boolean not null default false,
  status text not null default 'published'
    check (status in ('published', 'draft')),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists articles_status_idx on public.articles (status);
create index if not exists articles_category_idx on public.articles (category);
create index if not exists articles_featured_idx on public.articles (featured) where featured = true;

comment on table public.articles is 'Artigos do blog Saúde & Bem';

-- -----------------------------------------------------------------------------
-- 3. Tabela protocols
-- -----------------------------------------------------------------------------
create table if not exists public.protocols (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  objective text not null,
  long_description text not null,
  category text not null,
  category_label text not null,
  duration text not null,
  level text not null
    check (level in ('Iniciante', 'Intermediário', 'Avançado')),
  benefits jsonb not null default '[]'::jsonb,
  steps jsonb not null default '[]'::jsonb,
  is_premium boolean not null default false,
  featured boolean not null default false,
  tag text,
  participants integer not null default 0,
  status text not null default 'published'
    check (status in ('published', 'draft')),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists protocols_status_idx on public.protocols (status);
create index if not exists protocols_category_idx on public.protocols (category);
create index if not exists protocols_featured_idx on public.protocols (featured) where featured = true;

comment on table public.protocols is 'Protocolos de saúde Saúde & Bem';

-- -----------------------------------------------------------------------------
-- 4. Tabela ebooks (Biblioteca)
-- -----------------------------------------------------------------------------
create table if not exists public.ebooks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  long_description text not null,
  category text not null,
  category_label text not null,
  icon text not null default 'leaf',
  format text not null default 'PDF',
  pages integer not null default 0,
  highlights jsonb not null default '[]'::jsonb,
  is_premium boolean not null default false,
  downloads integer not null default 0,
  featured boolean not null default false,
  status text not null default 'published'
    check (status in ('published', 'draft')),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists ebooks_status_idx on public.ebooks (status);
create index if not exists ebooks_category_idx on public.ebooks (category);
create index if not exists ebooks_featured_idx on public.ebooks (featured) where featured = true;

comment on table public.ebooks is 'Materiais da biblioteca (ebooks e guias)';

-- -----------------------------------------------------------------------------
-- 5. Tabela favorites (estrutura para favoritos do usuário)
-- -----------------------------------------------------------------------------
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  content_type text not null
    check (content_type in ('article', 'protocol', 'ebook')),
  content_id uuid not null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  unique (user_id, content_type, content_id)
);

create index if not exists favorites_user_id_idx on public.favorites (user_id);
create index if not exists favorites_content_idx on public.favorites (content_type, content_id);

comment on table public.favorites is 'Favoritos do usuário (artigos, protocolos, ebooks)';

-- -----------------------------------------------------------------------------
-- 6. Triggers updated_at
-- -----------------------------------------------------------------------------
drop trigger if exists articles_updated_at on public.articles;
create trigger articles_updated_at
  before update on public.articles
  for each row execute function public.handle_updated_at();

drop trigger if exists protocols_updated_at on public.protocols;
create trigger protocols_updated_at
  before update on public.protocols
  for each row execute function public.handle_updated_at();

drop trigger if exists ebooks_updated_at on public.ebooks;
create trigger ebooks_updated_at
  before update on public.ebooks
  for each row execute function public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 7. Row Level Security
-- -----------------------------------------------------------------------------
alter table public.articles enable row level security;
alter table public.protocols enable row level security;
alter table public.ebooks enable row level security;
alter table public.favorites enable row level security;

-- Conteúdo publicado: leitura pública (anon + authenticated)
drop policy if exists "Public can read published articles" on public.articles;
create policy "Public can read published articles"
  on public.articles for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists "Public can read published protocols" on public.protocols;
create policy "Public can read published protocols"
  on public.protocols for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists "Public can read published ebooks" on public.ebooks;
create policy "Public can read published ebooks"
  on public.ebooks for select
  to anon, authenticated
  using (status = 'published');

-- Favoritos: usuário gerencia apenas os próprios
drop policy if exists "Users can view own favorites" on public.favorites;
create policy "Users can view own favorites"
  on public.favorites for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own favorites" on public.favorites;
create policy "Users can insert own favorites"
  on public.favorites for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own favorites" on public.favorites;
create policy "Users can delete own favorites"
  on public.favorites for delete
  to authenticated
  using (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 8. Permissões
-- -----------------------------------------------------------------------------
grant select on table public.articles to anon, authenticated;
grant select on table public.protocols to anon, authenticated;
grant select on table public.ebooks to anon, authenticated;
grant select, insert, delete on table public.favorites to authenticated;
