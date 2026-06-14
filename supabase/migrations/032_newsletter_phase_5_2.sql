-- Fase 5.2 — Captação de leads e audiência (newsletter global + lead magnet)

alter table public.newsletter_subscribers
  add column if not exists phone text;

comment on column public.newsletter_subscribers.phone is
  'Telefone opcional (WhatsApp) — lead magnet e formulários estendidos';

alter table public.newsletter_subscribers
  drop constraint if exists newsletter_subscribers_source_check;

alter table public.newsletter_subscribers
  add constraint newsletter_subscribers_source_check
  check (source in (
    'home',
    'blog',
    'biblioteca',
    'protocolos',
    'footer',
    'popup',
    'guia-30-dias',
    'clube',
    'other'
  ));
