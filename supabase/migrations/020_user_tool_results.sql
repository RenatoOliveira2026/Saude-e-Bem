-- =============================================================================
-- Fase 4.3 — Perfil Inteligente e Histórico de Saúde
-- Execute após migrations 001–019
-- =============================================================================

create table if not exists public.user_tool_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  tool_slug text not null,
  result_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists user_tool_results_user_created_idx
  on public.user_tool_results (user_id, created_at desc);

create index if not exists user_tool_results_user_slug_created_idx
  on public.user_tool_results (user_id, tool_slug, created_at desc);

comment on table public.user_tool_results is 'Histórico de resultados das ferramentas interativas (Fase 4.3)';

alter table public.user_tool_results enable row level security;

drop policy if exists "Users manage own tool results" on public.user_tool_results;
create policy "Users manage own tool results"
  on public.user_tool_results for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert on public.user_tool_results to authenticated;
