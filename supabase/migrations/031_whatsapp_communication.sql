-- =============================================================================
-- Saúde & Bem — Fase 5.6: WhatsApp, captação e comunicação
-- Execute após 030_phase_5_5_monetization.sql
-- =============================================================================

alter table public.newsletter_leads
  add column if not exists phone text,
  add column if not exists whatsapp_opt_in boolean not null default false,
  add column if not exists whatsapp_opt_in_at timestamptz,
  add column if not exists whatsapp_opt_out_at timestamptz;

comment on column public.newsletter_leads.phone is
  'Telefone E.164 (+5511...) para WhatsApp';
comment on column public.newsletter_leads.whatsapp_opt_in is
  'Consentimento LGPD para mensagens WhatsApp';
comment on column public.newsletter_leads.whatsapp_opt_out_at is
  'Data do opt-out — bloqueia novos envios';

create index if not exists newsletter_leads_phone_idx
  on public.newsletter_leads (phone)
  where phone is not null;

create index if not exists newsletter_leads_whatsapp_opt_in_idx
  on public.newsletter_leads (whatsapp_opt_in, whatsapp_opt_out_at)
  where whatsapp_opt_in = true;

-- Templates espelhados do Meta Business Manager
create table if not exists public.whatsapp_templates (
  id uuid primary key default gen_random_uuid(),
  template_key text not null unique,
  meta_name text not null,
  language_code text not null default 'pt_BR',
  category text not null default 'UTILITY',
  status text not null default 'pending',
  body_preview text,
  variables jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.whatsapp_templates
  drop constraint if exists whatsapp_templates_status_check;

alter table public.whatsapp_templates
  add constraint whatsapp_templates_status_check
  check (status in ('pending', 'approved', 'rejected', 'paused'));

comment on table public.whatsapp_templates is
  'Catálogo local de templates WhatsApp (Meta Cloud API)';

-- Histórico / fila de mensagens
create table if not exists public.whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.newsletter_leads (id) on delete set null,
  user_id uuid references auth.users on delete set null,
  direction text not null,
  message_type text not null default 'template',
  template_key text,
  phone text not null,
  body text,
  status text not null default 'queued',
  provider_message_id text,
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  sent_at timestamptz,
  delivered_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.whatsapp_messages
  drop constraint if exists whatsapp_messages_direction_check;

alter table public.whatsapp_messages
  add constraint whatsapp_messages_direction_check
  check (direction in ('inbound', 'outbound'));

alter table public.whatsapp_messages
  drop constraint if exists whatsapp_messages_status_check;

alter table public.whatsapp_messages
  add constraint whatsapp_messages_status_check
  check (status in ('queued', 'sent', 'delivered', 'read', 'failed', 'received'));

create index if not exists whatsapp_messages_lead_id_idx
  on public.whatsapp_messages (lead_id, created_at desc);

create index if not exists whatsapp_messages_phone_idx
  on public.whatsapp_messages (phone, created_at desc);

create index if not exists whatsapp_messages_status_idx
  on public.whatsapp_messages (status, created_at desc);

create index if not exists whatsapp_messages_provider_id_idx
  on public.whatsapp_messages (provider_message_id)
  where provider_message_id is not null;

-- Automação WhatsApp (paralelo a lead_automation_runs)
create table if not exists public.whatsapp_automation_runs (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.newsletter_leads (id) on delete cascade,
  sequence_id text not null,
  status text not null default 'active',
  current_step_index integer not null default 0,
  steps_completed jsonb not null default '[]'::jsonb,
  next_step_at timestamptz,
  started_at timestamptz not null default timezone('utc'::text, now()),
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.whatsapp_automation_runs
  drop constraint if exists whatsapp_automation_runs_status_check;

alter table public.whatsapp_automation_runs
  add constraint whatsapp_automation_runs_status_check
  check (status in ('active', 'completed', 'failed', 'paused'));

create index if not exists whatsapp_automation_runs_lead_idx
  on public.whatsapp_automation_runs (lead_id, created_at desc);

create index if not exists whatsapp_automation_runs_next_step_idx
  on public.whatsapp_automation_runs (next_step_at)
  where status = 'active' and next_step_at is not null;

-- Seed templates (nomes devem existir no Meta Business Manager)
insert into public.whatsapp_templates (template_key, meta_name, category, status, body_preview, variables)
values
  ('sb_boas_vindas', 'sb_boas_vindas', 'UTILITY', 'pending',
   'Olá {{1}}, bem-vindo(a) ao Saúde & Bem!', '["name"]'::jsonb),
  ('sb_nutricao_d1', 'sb_nutricao_d1', 'MARKETING', 'pending',
   'Dica do dia sobre {{1}}', '["interest"]'::jsonb),
  ('sb_pagamento_confirmado', 'sb_pagamento_confirmado', 'UTILITY', 'pending',
   'Pagamento confirmado — plano {{1}}', '["plan_name"]'::jsonb),
  ('sb_renovacao_lembrete', 'sb_renovacao_lembrete', 'UTILITY', 'pending',
   'Sua assinatura renova em {{1}}', '["renewal_date"]'::jsonb),
  ('sb_reengajamento', 'sb_reengajamento', 'MARKETING', 'pending',
   'Sentimos sua falta, {{1}}!', '["name"]'::jsonb)
on conflict (template_key) do nothing;

-- RPC estendida: captura com telefone e opt-in WhatsApp
create or replace function public.capture_newsletter_lead(
  p_name text,
  p_email text,
  p_source text,
  p_interest text,
  p_lead_score text,
  p_content_context jsonb default '{}'::jsonb,
  p_phone text default null,
  p_whatsapp_opt_in boolean default false
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
  v_phone text := nullif(trim(p_phone), '');
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
      phone = coalesce(v_phone, v_existing.phone),
      whatsapp_opt_in = case
        when p_whatsapp_opt_in then true
        else v_existing.whatsapp_opt_in
      end,
      whatsapp_opt_in_at = case
        when p_whatsapp_opt_in and v_existing.whatsapp_opt_in_at is null then now()
        when p_whatsapp_opt_in and not v_existing.whatsapp_opt_in then now()
        else v_existing.whatsapp_opt_in_at
      end,
      whatsapp_opt_out_at = case
        when p_whatsapp_opt_in then null
        else v_existing.whatsapp_opt_out_at
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
      phone,
      whatsapp_opt_in,
      whatsapp_opt_in_at,
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
      v_phone,
      coalesce(p_whatsapp_opt_in, false),
      case when coalesce(p_whatsapp_opt_in, false) then now() else null end,
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

revoke all on function public.capture_newsletter_lead(text, text, text, text, text, jsonb, text, boolean) from public;
grant execute on function public.capture_newsletter_lead(text, text, text, text, text, jsonb, text, boolean)
  to anon, authenticated;

-- KPIs WhatsApp para admin
create or replace function public.get_whatsapp_dashboard_stats()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Acesso negado';
  end if;

  return jsonb_build_object(
    'opt_in_leads', coalesce((
      select count(*)::int from public.newsletter_leads
      where whatsapp_opt_in = true and whatsapp_opt_out_at is null
    ), 0),
    'messages_sent_30d', coalesce((
      select count(*)::int from public.whatsapp_messages
      where direction = 'outbound'
        and status in ('sent', 'delivered', 'read')
        and created_at >= timezone('utc', now()) - interval '30 days'
    ), 0),
    'messages_failed_30d', coalesce((
      select count(*)::int from public.whatsapp_messages
      where direction = 'outbound'
        and status = 'failed'
        and created_at >= timezone('utc', now()) - interval '30 days'
    ), 0),
    'inbound_30d', coalesce((
      select count(*)::int from public.whatsapp_messages
      where direction = 'inbound'
        and created_at >= timezone('utc', now()) - interval '30 days'
    ), 0),
    'active_automations', coalesce((
      select count(*)::int from public.whatsapp_automation_runs
      where status = 'active'
    ), 0),
    'pending_steps', coalesce((
      select count(*)::int from public.whatsapp_automation_runs
      where status = 'active' and next_step_at is not null
        and next_step_at <= timezone('utc', now())
    ), 0)
  );
end;
$$;

grant execute on function public.get_whatsapp_dashboard_stats() to authenticated;

-- RLS
alter table public.whatsapp_templates enable row level security;
alter table public.whatsapp_messages enable row level security;
alter table public.whatsapp_automation_runs enable row level security;

drop policy if exists "Admins manage whatsapp templates" on public.whatsapp_templates;
create policy "Admins manage whatsapp templates"
  on public.whatsapp_templates for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins view whatsapp messages" on public.whatsapp_messages;
create policy "Admins view whatsapp messages"
  on public.whatsapp_messages for select to authenticated
  using (public.is_admin());

drop policy if exists "Admins view whatsapp automation" on public.whatsapp_automation_runs;
create policy "Admins view whatsapp automation"
  on public.whatsapp_automation_runs for select to authenticated
  using (public.is_admin());

grant select on table public.whatsapp_templates to authenticated;
grant select on table public.whatsapp_messages to authenticated;
grant select on table public.whatsapp_automation_runs to authenticated;
