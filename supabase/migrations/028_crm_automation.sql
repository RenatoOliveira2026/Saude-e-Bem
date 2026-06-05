-- =============================================================================
-- Saúde & Bem — Fase 5.3: CRM, histórico de interações e automação inteligente
-- Execute após 027_lead_score_conversion.sql
-- =============================================================================

-- Extensão do lead para CRM + sync ESP
alter table public.newsletter_leads
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists last_interaction_at timestamptz,
  add column if not exists interaction_count integer not null default 0,
  add column if not exists esp_provider text,
  add column if not exists esp_external_id text,
  add column if not exists esp_synced_at timestamptz,
  add column if not exists esp_sync_error text;

comment on column public.newsletter_leads.esp_provider is
  'ESP ativo: brevo | hubspot | rdstation | mailerlite';
comment on column public.newsletter_leads.esp_external_id is
  'ID do contato no ESP externo';

create index if not exists newsletter_leads_updated_at_idx
  on public.newsletter_leads (updated_at desc);

create index if not exists newsletter_leads_last_interaction_idx
  on public.newsletter_leads (last_interaction_at desc nulls last);

-- Histórico de interações do lead
create table if not exists public.lead_interactions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.newsletter_leads (id) on delete cascade,
  event_type text not null,
  title text not null,
  description text,
  source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

comment on table public.lead_interactions is
  'Timeline CRM — capturas, upgrades de score, automação e sync ESP';

create index if not exists lead_interactions_lead_id_idx
  on public.lead_interactions (lead_id, created_at desc);

create index if not exists lead_interactions_event_type_idx
  on public.lead_interactions (event_type);

-- Execução de sequências de nutrição
create table if not exists public.lead_automation_runs (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.newsletter_leads (id) on delete cascade,
  sequence_id text not null,
  status text not null default 'active',
  current_step_index integer not null default 0,
  steps_completed jsonb not null default '[]'::jsonb,
  next_step_at timestamptz,
  esp_provider text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.lead_automation_runs is
  'Sequências automáticas de nutrição por lead';

alter table public.lead_automation_runs
  drop constraint if exists lead_automation_runs_status_check;

alter table public.lead_automation_runs
  add constraint lead_automation_runs_status_check
  check (status in ('active', 'completed', 'failed', 'paused'));

create index if not exists lead_automation_runs_lead_id_idx
  on public.lead_automation_runs (lead_id, created_at desc);

create index if not exists lead_automation_runs_next_step_idx
  on public.lead_automation_runs (next_step_at)
  where status = 'active' and next_step_at is not null;

create index if not exists lead_automation_runs_status_idx
  on public.lead_automation_runs (status);

-- Helper: ranking do pipeline (score)
create or replace function public.lead_score_rank(p_score text)
returns integer
language sql
immutable
as $$
  select case p_score
    when 'frio' then 0
    when 'morno' then 1
    when 'quente' then 2
    when 'muito_quente' then 3
    else 0
  end;
$$;

-- RPC: captura com upsert e upgrade de score (anon/authenticated)
create or replace function public.capture_newsletter_lead(
  p_name text,
  p_email text,
  p_source text,
  p_interest text,
  p_lead_score text,
  p_content_context jsonb default '{}'::jsonb
)
returns table (
  lead_id uuid,
  is_existing boolean,
  final_score text,
  previous_score text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(trim(p_email));
  v_existing public.newsletter_leads%rowtype;
  v_final_score text;
  v_prev_score text;
  v_lead_id uuid;
  v_is_existing boolean;
begin
  if v_email is null or v_email = '' then
    raise exception 'E-mail obrigatório';
  end if;

  select * into v_existing
  from public.newsletter_leads
  where email = v_email;

  if found then
    v_prev_score := v_existing.lead_score;
    v_final_score := case
      when public.lead_score_rank(p_lead_score) > public.lead_score_rank(v_existing.lead_score)
        then p_lead_score
      else v_existing.lead_score
    end;

    update public.newsletter_leads
    set
      name = coalesce(nullif(trim(p_name), ''), v_existing.name),
      source = p_source,
      interest = coalesce(nullif(trim(p_interest), ''), v_existing.interest),
      lead_score = v_final_score,
      content_context = case
        when p_content_context = '{}'::jsonb then v_existing.content_context
        else p_content_context
      end,
      updated_at = now(),
      last_interaction_at = now(),
      interaction_count = interaction_count + 1
    where id = v_existing.id
    returning id into v_lead_id;

    v_is_existing := true;
  else
    v_prev_score := null;
    v_final_score := coalesce(nullif(trim(p_lead_score), ''), 'frio');

    insert into public.newsletter_leads (
      name,
      email,
      source,
      interest,
      lead_score,
      content_context,
      last_interaction_at,
      interaction_count
    )
    values (
      nullif(trim(p_name), ''),
      v_email,
      p_source,
      nullif(trim(p_interest), ''),
      v_final_score,
      coalesce(p_content_context, '{}'::jsonb),
      now(),
      1
    )
    returning id into v_lead_id;

    v_is_existing := false;
  end if;

  return query
  select v_lead_id, v_is_existing, v_final_score, v_prev_score;
end;
$$;

revoke all on function public.capture_newsletter_lead(text, text, text, text, text, jsonb) from public;
grant execute on function public.capture_newsletter_lead(text, text, text, text, text, jsonb)
  to anon, authenticated;

-- RLS — admin read
alter table public.lead_interactions enable row level security;
alter table public.lead_automation_runs enable row level security;

drop policy if exists "lead_interactions admin read" on public.lead_interactions;
create policy "lead_interactions admin read"
  on public.lead_interactions
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "lead_automation_runs admin read" on public.lead_automation_runs;
create policy "lead_automation_runs admin read"
  on public.lead_automation_runs
  for select
  to authenticated
  using (public.is_admin());

grant select on table public.lead_interactions to authenticated;
grant select on table public.lead_automation_runs to authenticated;
