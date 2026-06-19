-- Fase pagamento — origem da assinatura (PIX 30d, boleto, cartão recorrente)

alter table public.user_memberships
  add column if not exists membership_origin text;

comment on column public.user_memberships.membership_origin is
  'recorrente_cartao | pix_30_dias | pix_365_dias | boleto_30_dias | boleto_365_dias';

create index if not exists user_memberships_origin_idx
  on public.user_memberships (membership_origin)
  where membership_origin is not null;
