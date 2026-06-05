-- =============================================================================
-- Saúde & Bem — Fase 4.8: newsletter_leads + interesse (campanhas / automação)
-- Execute após 022_profiles_plan.sql
-- =============================================================================

alter table public.newsletter_leads
  alter column name drop not null;

alter table public.newsletter_leads
  add column if not exists interest text;

comment on table public.newsletter_leads is
  'Captura de leads com interesse — campanhas, redes sociais e automação (Fase 4.8)';
comment on column public.newsletter_leads.interest is
  'Interesse principal: emagrecimento, sono, energia, longevidade, saude-cardiovascular, bem-estar-geral';

create index if not exists newsletter_leads_interest_idx
  on public.newsletter_leads (interest);

create index if not exists newsletter_leads_created_at_idx
  on public.newsletter_leads (created_at desc);

drop policy if exists "newsletter_leads admin read" on public.newsletter_leads;
create policy "newsletter_leads admin read"
  on public.newsletter_leads
  for select
  to authenticated
  using (public.is_admin());

grant select on table public.newsletter_leads to authenticated;
