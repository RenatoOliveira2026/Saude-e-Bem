# Fase 6.0 — Clube Saúde & Bem / Área Premium

**Status:** implementado (cobrança real condicionada a `isRealCheckoutEnabled()`).

## Objetivo

Estrutura inicial da área premium para monetização por assinatura, sem ativar cobrança real sem aprovação.

## Arquivos criados

| Arquivo | Descrição |
|---------|-----------|
| `supabase/migrations/036_phase_6_0_memberships.sql` | Tabelas + seed de planos |
| `src/lib/membership/types.ts` | Tipos de planos e membros |
| `src/lib/membership/constants.ts` | Comparativo, benefícios, preços fallback |
| `src/lib/membership/providers.ts` | Compatibilidade MP, Hotmart, Kiwify, Stripe |
| `src/lib/membership/mappers.ts` | Mapeamento DB → domínio |
| `src/lib/membership/services/plans.service.ts` | Planos públicos |
| `src/lib/membership/services/memberships.service.ts` | Admin: planos + membros |
| `src/lib/membership/index.ts` | Barrel export |
| `src/components/subscription/ContentBadge.tsx` | Badges Gratuito / Premium / Em breve |
| `src/components/club/ClubPublicSections.tsx` | Seções da landing `/clube` |
| `src/app/admin/memberships/page.tsx` | Admin do Clube |
| `scripts/smoke-phase-6-clube.mjs` | Smoke test de rotas |

## Arquivos modificados

- `src/app/clube/page.tsx` — landing completa + SEO + Schema.org WebPage
- `src/components/club/PremiumContentGuard.tsx` — preview + CTA Clube
- `src/app/protocolos/[slug]/page.tsx` — preview do objetivo em conteúdo premium
- `src/app/ferramentas/[slug]/page.tsx` — preview de features em ferramentas premium
- `src/components/pages/ProtocolCard.tsx`, `LibraryCard.tsx`, `ToolCard.tsx` — `ContentBadge`
- `src/lib/admin/nav.ts`, `src/lib/routes.ts` — rota admin
- `src/lib/seo/json-ld.ts` — `webPageJsonLd()`
- `src/lib/supabase/types.ts` — tipos das novas tabelas

## Tabelas (migration 036)

### `membership_plans`

| Campo | Tipo |
|-------|------|
| id | uuid |
| name | text |
| slug | text (unique) |
| description | text |
| price | numeric |
| billing_cycle | free \| monthly \| quarterly \| annual |
| features | jsonb |
| is_active | boolean |
| created_at | timestamptz |

**Seed:** `gratuito`, `premium-mensal`, `premium-anual`

### `user_memberships`

| Campo | Tipo |
|-------|------|
| id | uuid |
| user_id | uuid → auth.users |
| plan_id | uuid → membership_plans |
| status | active \| trialing \| past_due \| canceled \| expired \| pending |
| started_at | timestamptz |
| expires_at | timestamptz |
| provider | text (mercadopago, hotmart, …) |
| external_id | text |
| created_at | timestamptz |

Complementa `subscriptions` existente — admin faz fallback para assinaturas legadas.

## Rotas

| Rota | Função |
|------|--------|
| `/clube` | Landing pública: benefícios, comparativo, planos, CTAs |
| `/admin/memberships` | Planos cadastrados + usuários membros |
| `/assinar` | Checkout (Mercado Pago — já existente) |
| `/clube/premium` | Pitch premium (já existente) |

## Página `/clube`

- Apresentação do Clube
- Benefícios Gratuito vs Premium
- Tabela comparativa
- Planos: Gratuito, Premium Mensal, Premium Anual
- CTA cadastro (`/cadastro`)
- CTA assinatura: `/assinar?plano=…` se MP validado; senão “Assinatura em breve”
- SEO: title, description, OG, Twitter, canonical
- Schema.org `WebPage`

## Badges de conteúdo

`ContentBadge`: **Gratuito** | **Premium** | **Em breve**

Usado em protocolos, biblioteca e ferramentas (cards).

## Proteção premium

`PremiumContentGuard` com `preview`:

- Conteúdo gratuito: acesso total (inalterado)
- Premium sem assinatura: preview + CTA “Conhecer o Clube Saúde & Bem”
- Premium com assinatura: conteúdo completo

## Integração de pagamento

| Provedor | Status no código |
|----------|------------------|
| Mercado Pago | Ativo (`isRealCheckoutEnabled()`) |
| Hotmart | Planejado (`providers.ts`) |
| Kiwify | Planejado |
| Stripe | Planejado |

Fluxo MP existente (`/assinar`, webhooks) **não alterado**.

## Validação

```bash
npm run build
npm run lint
node scripts/smoke-phase-6-clube.mjs
```

Aplicar migration:

```bash
# SQL Editor ou após deploy
supabase/migrations/036_phase_6_0_memberships.sql
```

## Pendências para cobrança real

1. Aplicar migration `036` no Supabase de produção
2. Configurar `MERCADOPAGO_ACCESS_TOKEN` na Vercel
3. Validar webhook MP em produção
4. Sincronizar `user_memberships` a partir de webhooks (hoje usa `subscriptions`)
5. Ativar CTAs “Assinar agora” em `/clube` (automático quando `isRealCheckoutEnabled()`)
6. Integrar Hotmart/Kiwify/Stripe quando necessário
