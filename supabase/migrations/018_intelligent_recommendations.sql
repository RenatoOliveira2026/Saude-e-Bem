-- =============================================================================
-- Saúde & Bem — Fase 3.9: IA de Recomendações Inteligentes
-- Execute após 017_subscriber_area.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Histórico consolidado por conteúdo (continuar lendo)
-- -----------------------------------------------------------------------------
create table if not exists public.user_content_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  content_type text not null
    check (content_type in ('article', 'protocol', 'ebook')),
  content_id uuid not null,
  content_title text not null,
  content_slug text,
  source_path text,
  access_count integer not null default 1,
  completed boolean not null default false,
  first_accessed_at timestamptz not null default timezone('utc'::text, now()),
  last_accessed_at timestamptz not null default timezone('utc'::text, now()),
  unique (user_id, content_type, content_id)
);

create index if not exists user_content_history_user_last_idx
  on public.user_content_history (user_id, last_accessed_at desc);

create index if not exists user_content_history_continue_idx
  on public.user_content_history (user_id, completed, last_accessed_at desc);

comment on table public.user_content_history is
  'Histórico consolidado por conteúdo — base para continuar lendo e IA';

-- -----------------------------------------------------------------------------
-- 2. Rankings agregados (analytics + downloads)
-- -----------------------------------------------------------------------------
create table if not exists public.content_rankings (
  id uuid primary key default gen_random_uuid(),
  content_type text not null
    check (content_type in ('article', 'protocol', 'ebook')),
  content_key text not null,
  content_title text not null,
  content_slug text,
  view_count integer not null default 0,
  download_count integer not null default 0,
  score numeric(12, 2) not null default 0,
  ranking_period text not null default 'all_time'
    check (ranking_period in ('all_time', '30d', '7d')),
  rank_position integer not null default 0,
  updated_at timestamptz not null default timezone('utc'::text, now()),
  unique (content_type, content_key, ranking_period)
);

create index if not exists content_rankings_period_score_idx
  on public.content_rankings (ranking_period, rank_position asc);

comment on table public.content_rankings is
  'Ranking de conteúdos — agregado de analytics_events e downloads';

-- -----------------------------------------------------------------------------
-- 3. Backfill a partir de user_content_access (017)
-- -----------------------------------------------------------------------------
insert into public.user_content_history (
  user_id,
  content_type,
  content_id,
  content_title,
  content_slug,
  source_path,
  access_count,
  completed,
  first_accessed_at,
  last_accessed_at
)
select
  user_id,
  content_type,
  content_id,
  content_title,
  content_slug,
  source_path,
  count(*)::integer,
  false,
  min(created_at),
  max(created_at)
from public.user_content_access
group by user_id, content_type, content_id, content_title, content_slug, source_path
on conflict (user_id, content_type, content_id) do update
set
  access_count = public.user_content_history.access_count + excluded.access_count,
  last_accessed_at = greatest(public.user_content_history.last_accessed_at, excluded.last_accessed_at),
  content_title = excluded.content_title,
  content_slug = coalesce(excluded.content_slug, public.user_content_history.content_slug),
  source_path = coalesce(excluded.source_path, public.user_content_history.source_path);

-- -----------------------------------------------------------------------------
-- 4. Atualizar rankings a partir de analytics_events
-- -----------------------------------------------------------------------------
create or replace function public.refresh_content_rankings()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_count integer := 0;
begin
  delete from public.content_rankings
  where ranking_period in ('all_time', '30d', '7d');

  with raw_events as (
    select
      case event_type
        when 'article_view' then 'article'
        when 'protocol_view' then 'protocol'
        when 'ebook_download' then 'ebook'
      end as content_type,
      coalesce(content_id, content_title, 'unknown') as content_key,
      coalesce(content_title, content_id, 'Sem título') as content_title,
      coalesce(metadata->>'slug', content_id) as content_slug,
      case when event_type in ('article_view', 'protocol_view') then 1 else 0 end as view_inc,
      case when event_type = 'ebook_download' then 1 else 0 end as download_inc,
      created_at
    from public.analytics_events
    where event_type in ('article_view', 'protocol_view', 'ebook_download')
  ),
  aggregated as (
    select
      content_type,
      content_key,
      max(content_title) as content_title,
      max(content_slug) as content_slug,
      sum(view_inc)::integer as view_count,
      sum(download_inc)::integer as download_count,
      (sum(view_inc) * 1.0 + sum(download_inc) * 2.0)::numeric(12, 2) as score,
      'all_time'::text as ranking_period
    from raw_events
    where content_type is not null
    group by content_type, content_key

    union all

    select
      content_type,
      content_key,
      max(content_title) as content_title,
      max(content_slug) as content_slug,
      sum(view_inc)::integer as view_count,
      sum(download_inc)::integer as download_count,
      (sum(view_inc) * 1.0 + sum(download_inc) * 2.0)::numeric(12, 2) as score,
      '30d'::text as ranking_period
    from raw_events
    where content_type is not null
      and created_at >= timezone('utc', now()) - interval '30 days'
    group by content_type, content_key

    union all

    select
      content_type,
      content_key,
      max(content_title) as content_title,
      max(content_slug) as content_slug,
      sum(view_inc)::integer as view_count,
      sum(download_inc)::integer as download_count,
      (sum(view_inc) * 1.0 + sum(download_inc) * 2.0)::numeric(12, 2) as score,
      '7d'::text as ranking_period
    from raw_events
    where content_type is not null
      and created_at >= timezone('utc', now()) - interval '7 days'
    group by content_type, content_key
  ),
  ranked as (
    select
      *,
      row_number() over (
        partition by ranking_period, content_type
        order by score desc, view_count desc
      )::integer as rank_position
    from aggregated
  )
  insert into public.content_rankings (
    content_type,
    content_key,
    content_title,
    content_slug,
    view_count,
    download_count,
    score,
    ranking_period,
    rank_position
  )
  select
    content_type,
    content_key,
    content_title,
    content_slug,
    view_count,
    download_count,
    score,
    ranking_period,
    rank_position
  from ranked;

  get diagnostics updated_count = row_count;
  return updated_count;
end;
$$;

-- -----------------------------------------------------------------------------
-- 5. Recomendações inteligentes por usuário
-- -----------------------------------------------------------------------------
create or replace function public.get_user_recommendations(
  p_user_id uuid,
  p_limit integer default 12,
  p_include_premium boolean default true
)
returns table (
  kind text,
  content_type text,
  content_id uuid,
  content_title text,
  content_slug text,
  category_label text,
  is_premium boolean,
  reason text,
  score numeric
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_goal text;
  v_protocol_category text;
  v_library_category text;
begin
  if auth.uid() is distinct from p_user_id and not public.is_admin() then
    raise exception 'not authorized';
  end if;

  select up.goal into v_goal
  from public.user_preferences up
  where up.user_id = p_user_id;

  v_protocol_category := case v_goal
    when 'energia' then 'energia'
    when 'sono' then 'sono'
    when 'intestinal' then 'intestinal'
    when 'emagrecimento' then 'detox'
    when 'longevidade' then 'longevidade'
    else null
  end;

  v_library_category := case v_goal
    when 'energia' then 'Energia'
    when 'sono' then 'Sono'
    when 'intestinal' then 'Intestinal'
    when 'emagrecimento' then 'Hábitos'
    when 'longevidade' then 'Hábitos'
    else null
  end;

  return query
  with continue_reading as (
    select
      'continue_reading'::text as kind,
      h.content_type,
      h.content_id,
      h.content_title,
      coalesce(h.content_slug, '') as content_slug,
      null::text as category_label,
      false as is_premium,
      'Continue de onde parou'::text as reason,
      (100 - least(h.access_count, 50))::numeric as score
    from public.user_content_history h
    where h.user_id = p_user_id
      and h.completed = false
    order by h.last_accessed_at desc
    limit 3
  ),
  in_progress_protocols as (
    select
      'continue_reading'::text as kind,
      'protocol'::text as content_type,
      sp.protocol_id as content_id,
      coalesce(p.title, 'Protocolo') as content_title,
      coalesce(p.slug, '') as content_slug,
      p.category_label,
      coalesce(p.is_premium, false) as is_premium,
      'Protocolo em andamento'::text as reason,
      95::numeric as score
    from public.user_saved_protocols sp
    left join public.protocols p on p.id = sp.protocol_id
    where sp.user_id = p_user_id
      and sp.status = 'in_progress'
    order by sp.updated_at desc
    limit 2
  ),
  trending as (
    select
      'trending'::text as kind,
      cr.content_type,
      coalesce(p.id, a.id, e.id) as content_id,
      cr.content_title,
      coalesce(p.slug, a.slug, e.slug, cr.content_slug, '') as content_slug,
      coalesce(p.category_label, a.category_label, e.category_label) as category_label,
      coalesce(p.is_premium, a.is_premium, e.is_premium, false) as is_premium,
      'Em alta na plataforma'::text as reason,
      cr.score
    from public.content_rankings cr
    left join public.protocols p
      on cr.content_type = 'protocol'
      and (p.id::text = cr.content_key or p.slug = cr.content_key)
    left join public.articles a
      on cr.content_type = 'article'
      and (a.id::text = cr.content_key or a.slug = cr.content_key)
    left join public.ebooks e
      on cr.content_type = 'ebook'
      and (e.id::text = cr.content_key or e.slug = cr.content_key)
    where cr.ranking_period = '30d'
      and coalesce(p.id, a.id, e.id) is not null
    order by cr.rank_position asc
    limit 4
  ),
  personalized_protocols as (
    select
      'personalized'::text as kind,
      'protocol'::text as content_type,
      p.id as content_id,
      p.title as content_title,
      p.slug as content_slug,
      p.category_label,
      coalesce(p.is_premium, false) as is_premium,
      case
        when v_goal is not null then 'Alinhado ao seu objetivo'
        else 'Sugerido para você'
      end as reason,
      80::numeric as score
    from public.protocols p
    where p.status = 'published'
      and (v_protocol_category is null or p.category = v_protocol_category)
      and not exists (
        select 1 from public.user_content_history h
        where h.user_id = p_user_id
          and h.content_type = 'protocol'
          and h.content_id = p.id
          and h.completed = true
      )
    order by p.featured desc nulls last, p.updated_at desc nulls last
    limit 3
  ),
  personalized_ebooks as (
    select
      'personalized'::text as kind,
      'ebook'::text as content_type,
      e.id as content_id,
      e.title as content_title,
      e.slug as content_slug,
      e.category_label,
      coalesce(e.is_premium, false) as is_premium,
      case
        when v_goal is not null then 'Material recomendado para seu objetivo'
        else 'Material sugerido para você'
      end as reason,
      70::numeric as score
    from public.ebooks e
    where e.status = 'published'
      and (v_library_category is null or e.category = v_library_category)
    order by e.featured desc nulls last, e.updated_at desc nulls last
    limit 2
  ),
  related_from_last as (
    select
      'related'::text as kind,
      'protocol'::text as content_type,
      p2.id as content_id,
      p2.title as content_title,
      p2.slug as content_slug,
      p2.category_label,
      coalesce(p2.is_premium, false) as is_premium,
      'Relacionado ao que você leu'::text as reason,
      60::numeric as score
    from public.user_content_history h
    join public.protocols p1 on p1.id = h.content_id and h.content_type = 'protocol'
    join public.protocols p2 on p2.category = p1.category and p2.id <> p1.id
    where h.user_id = p_user_id
      and p2.status = 'published'
    order by h.last_accessed_at desc, p2.featured desc nulls last
    limit 2
  ),
  combined as (
    select * from continue_reading
    union all select * from in_progress_protocols
    union all select * from trending
    union all select * from personalized_protocols
    union all select * from personalized_ebooks
    union all select * from related_from_last
  ),
  filtered as (
    select distinct on (c.content_type, c.content_id)
      c.kind,
      c.content_type,
      c.content_id,
      c.content_title,
      c.content_slug,
      c.category_label,
      c.is_premium,
      c.reason,
      c.score
    from combined c
    where c.content_id is not null
      and (p_include_premium or c.is_premium = false)
    order by c.content_type, c.content_id, c.score desc
  )
  select
    f.kind,
    f.content_type,
    f.content_id,
    f.content_title,
    f.content_slug,
    f.category_label,
    f.is_premium,
    f.reason,
    f.score
  from filtered f
  order by f.score desc, f.kind
  limit greatest(p_limit, 1);
end;
$$;

grant execute on function public.refresh_content_rankings() to authenticated;
grant execute on function public.get_user_recommendations(uuid, integer, boolean) to authenticated;

-- -----------------------------------------------------------------------------
-- 6. RLS
-- -----------------------------------------------------------------------------
alter table public.user_content_history enable row level security;
alter table public.content_rankings enable row level security;

drop policy if exists "Users manage own content history" on public.user_content_history;
create policy "Users manage own content history"
  on public.user_content_history for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Authenticated users read rankings" on public.content_rankings;
create policy "Authenticated users read rankings"
  on public.content_rankings for select
  to authenticated
  using (true);

drop policy if exists "Admins manage rankings" on public.content_rankings;
create policy "Admins manage rankings"
  on public.content_rankings for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select, insert, update, delete on public.user_content_history to authenticated;
grant select on public.content_rankings to authenticated;

-- Seed inicial de rankings (best effort)
select public.refresh_content_rankings();
