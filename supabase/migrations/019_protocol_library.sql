-- =============================================================================
-- Fase 4.2 — Biblioteca Inteligente de Protocolos
-- Execute após migrations 001–018
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Categorias oficiais da biblioteca
-- -----------------------------------------------------------------------------
create table if not exists public.protocol_categories (
  slug text primary key,
  label text not null,
  description text,
  icon text not null default 'sparkle',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now())
);

comment on table public.protocol_categories is 'Taxonomia da biblioteca inteligente de protocolos (Fase 4.2)';

insert into public.protocol_categories (slug, label, description, icon, sort_order) values
  ('saude-mental', 'Saúde Mental', 'Equilíbrio emocional e bem-estar psicológico', 'brain', 10),
  ('ansiedade', 'Ansiedade', 'Protocolos para acalmar mente e corpo', 'heart-leaf', 20),
  ('sono', 'Sono', 'Higiene do sono e ritmo circadiano', 'moon', 30),
  ('alimentacao-saudavel', 'Alimentação Saudável', 'Nutrição funcional e hábitos alimentares', 'leaf', 40),
  ('exercicios', 'Exercícios', 'Movimento e condicionamento com segurança', 'activity', 50),
  ('controle-estresse', 'Controle de Estresse', 'Técnicas para reduzir sobrecarga', 'vitality', 60),
  ('saude-feminina', 'Saúde Feminina', 'Ciclos, hormônios e autocuidado feminino', 'heart-leaf', 70),
  ('saude-masculina', 'Saúde Masculina', 'Vitalidade e prevenção masculina', 'bolt', 80),
  ('saude-idoso', 'Saúde do Idoso', 'Longevidade e qualidade de vida 60+', 'sparkle', 90),
  ('bem-estar-geral', 'Bem-Estar Geral', 'Hábitos integrados para o dia a dia', 'star', 100)
on conflict (slug) do update set
  label = excluded.label,
  description = excluded.description,
  icon = excluded.icon,
  sort_order = excluded.sort_order;

-- Vincula protocols.category à taxonomia (slug textual existente)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'protocols_category_fkey'
  ) then
    alter table public.protocols
      add constraint protocols_category_fkey
      foreign key (category) references public.protocol_categories (slug)
      on update cascade
      not valid;
  end if;
exception
  when others then null;
end $$;

-- Mapeia categorias legadas para a taxonomia 4.2
update public.protocols set category = 'sono', category_label = 'Sono'
  where category in ('sono') and category_label ilike '%sono%';
update public.protocols set category = 'saude-mental', category_label = 'Saúde Mental'
  where category in ('mente');
update public.protocols set category = 'alimentacao-saudavel', category_label = 'Alimentação Saudável'
  where category in ('nutricao', 'intestinal');
update public.protocols set category = 'saude-feminina', category_label = 'Saúde Feminina'
  where category in ('menopausa');
update public.protocols set category = 'saude-idoso', category_label = 'Saúde do Idoso'
  where category in ('longevidade');
update public.protocols set category = 'bem-estar-geral', category_label = 'Bem-Estar Geral'
  where category in ('energia', 'detox');

-- -----------------------------------------------------------------------------
-- 2. Histórico dedicado de protocolos
-- -----------------------------------------------------------------------------
create table if not exists public.user_protocol_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  protocol_id uuid not null references public.protocols (id) on delete cascade,
  view_count integer not null default 1 check (view_count >= 1),
  first_viewed_at timestamptz not null default timezone('utc'::text, now()),
  last_viewed_at timestamptz not null default timezone('utc'::text, now()),
  unique (user_id, protocol_id)
);

create index if not exists user_protocol_history_user_idx
  on public.user_protocol_history (user_id, last_viewed_at desc);

comment on table public.user_protocol_history is 'Visualizações de protocolos por usuário (Fase 4.2)';

-- -----------------------------------------------------------------------------
-- 3. View user_favorites (favoritos unificados — tabela base: favorites)
-- -----------------------------------------------------------------------------
create or replace view public.user_favorites as
select
  id,
  user_id,
  content_type,
  content_id,
  created_at
from public.favorites;

comment on view public.user_favorites is 'Alias de public.favorites para integrações da biblioteca';

-- -----------------------------------------------------------------------------
-- 4. RPC — registrar visualização de protocolo
-- -----------------------------------------------------------------------------
create or replace function public.record_protocol_view(
  p_user_id uuid,
  p_protocol_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_user_id is null or p_protocol_id is null then
    return;
  end if;

  insert into public.user_protocol_history (user_id, protocol_id, view_count, first_viewed_at, last_viewed_at)
  values (p_user_id, p_protocol_id, 1, timezone('utc'::text, now()), timezone('utc'::text, now()))
  on conflict (user_id, protocol_id) do update set
    view_count = public.user_protocol_history.view_count + 1,
    last_viewed_at = timezone('utc'::text, now());
end;
$$;

-- -----------------------------------------------------------------------------
-- 5. RLS
-- -----------------------------------------------------------------------------
alter table public.protocol_categories enable row level security;
alter table public.user_protocol_history enable row level security;

drop policy if exists "Protocol categories are public read" on public.protocol_categories;
create policy "Protocol categories are public read"
  on public.protocol_categories for select
  using (is_active = true);

drop policy if exists "Users manage own protocol history" on public.user_protocol_history;
create policy "Users manage own protocol history"
  on public.user_protocol_history for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select on public.protocol_categories to anon, authenticated;
grant select, insert, update, delete on public.user_protocol_history to authenticated;
grant select on public.user_favorites to authenticated;
grant execute on function public.record_protocol_view(uuid, uuid) to authenticated;
