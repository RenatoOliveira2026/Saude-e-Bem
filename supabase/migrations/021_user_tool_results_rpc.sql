-- =============================================================================
-- Fase 4.3 — RPC para persistir resultados de ferramentas (auth.uid() no insert)
-- Execute após 020_user_tool_results.sql
-- =============================================================================

create or replace function public.save_user_tool_result(
  p_tool_slug text,
  p_result_json jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_id uuid;
begin
  if v_user_id is null then
    raise exception 'not_authenticated' using errcode = '42501';
  end if;

  if p_tool_slug is null or length(trim(p_tool_slug)) = 0 then
    raise exception 'invalid_tool_slug';
  end if;

  insert into public.user_tool_results (user_id, tool_slug, result_json)
  values (v_user_id, trim(p_tool_slug), coalesce(p_result_json, '{}'::jsonb))
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.save_user_tool_result(text, jsonb) to authenticated;

-- Políticas explícitas por operação (alinhado a public.favorites)
drop policy if exists "Users manage own tool results" on public.user_tool_results;

drop policy if exists "Users can view own tool results" on public.user_tool_results;
create policy "Users can view own tool results"
  on public.user_tool_results for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own tool results" on public.user_tool_results;
create policy "Users can insert own tool results"
  on public.user_tool_results for insert
  to authenticated
  with check (auth.uid() = user_id);
