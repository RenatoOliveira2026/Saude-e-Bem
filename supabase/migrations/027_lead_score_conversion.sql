-- Fase 5.2 — Lead Score e contexto de conversão

alter table public.newsletter_leads
  add column if not exists lead_score text not null default 'frio',
  add column if not exists content_context jsonb not null default '{}'::jsonb;

comment on column public.newsletter_leads.lead_score is
  'Temperatura do lead: frio | morno | quente | muito_quente';
comment on column public.newsletter_leads.content_context is
  'Contexto opcional: content_type, content_slug, content_title, lp_slug';

create index if not exists newsletter_leads_lead_score_idx
  on public.newsletter_leads (lead_score);

create index if not exists newsletter_leads_source_idx
  on public.newsletter_leads (source);

alter table public.newsletter_leads
  drop constraint if exists newsletter_leads_lead_score_check;

alter table public.newsletter_leads
  add constraint newsletter_leads_lead_score_check
  check (lead_score in ('frio', 'morno', 'quente', 'muito_quente'));
