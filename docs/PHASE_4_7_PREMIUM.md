# Fase 4.7 — Área Premium e Controle de Assinaturas

Infraestrutura de planos gratuitos e premium, preparada para Mercado Pago e Stripe (sem cobrança ativa nesta fase).

## Migration

Arquivo: `supabase/migrations/022_profiles_plan.sql`

| Campo | Tipo | Valores |
|-------|------|---------|
| `profiles.plan` | `text` | `free`, `premium_monthly`, `premium_annual`, `admin` |

- Backfill de `membership_tier = 'premium'` → `premium_monthly`
- Admins em `admin_users` → `plan = 'admin'`
- RPC `user_has_active_premium()` considera `profiles.plan` e assinaturas ativas
- Trigger `sync_profile_membership_tier` sincroniza `plan` ao alterar `subscriptions`

## Arquitetura

```
src/lib/subscription/
  plan.types.ts           # ProfilePlan
  plan-labels.ts          # Labels UI
  is-premium-user.ts      # isPremiumPlan(), isPremiumUser(), resolveIsPremiumUser()
  benefits.ts             # Benefícios FREE / PREMIUM
  renewal.ts              # Próxima renovação (real ou mock)
  index.ts

src/lib/payments/providers/
  types.ts                # PaymentProviderAdapter
  mercadopago.adapter.ts  # Mercado Pago (habilitado via env)
  stripe.adapter.ts       # Stripe (placeholder)
  index.ts                # getPaymentProviderRegistry()

src/components/subscription/
  PlanBadge.tsx           # FREE / PREMIUM
  PremiumGate.tsx         # Bloqueio de conteúdo premium
  ActiveBenefitsList.tsx  # Benefícios ativos
  index.ts
```

## Helper `isPremiumUser()`

| Função | Uso |
|--------|-----|
| `isPremiumPlan(plan)` | Checa se `profiles.plan` é premium/admin |
| `isPremiumUser(membership \| plan \| boolean)` | Síncrono — membership ou plano |
| `resolveIsPremiumUser()` | Server — sessão + RPC + admin |

Reexportado em `@/lib/club/access`.

## Página `/minha-assinatura`

Exibe via `SubscriptionDashboard`:

1. **Plano atual** — badge FREE/PREMIUM + label (`profilePlanLabels`)
2. **Status** — assinatura + `profilePlanStatusLabels`
3. **Próxima renovação** — `current_period_end` ou mock (+30 / +365 dias)
4. **Benefícios ativos** — `ActiveBenefitsList`
5. Histórico de pagamentos (existente)

## Biblioteca inteligente

| Tier | UI |
|------|-----|
| Gratuito | Badge **FREE**, botão **Acessar conteúdo** (inalterado) |
| Premium | Badge **PREMIUM**, texto **🔒 Exclusivo para assinantes**, botão **Assinar agora** |

Detalhe premium sem assinatura → `PremiumGate`.

## Componente `PremiumGate.tsx`

Bloqueia conteúdo premium e redireciona para `/assinar`.

Usado em:

- `IntelligentLibraryDetail`
- `PremiumContentGuard`
- Reexport em `DetailPage` (compatibilidade)

## Provedores de pagamento (preparado)

| Provedor | Env | Status |
|----------|-----|--------|
| Mercado Pago | `MERCADOPAGO_ACCESS_TOKEN` | Adapter + checkout existente |
| Stripe | `STRIPE_SECRET_KEY` | Placeholder — Fase 5 |

Variável `PAYMENTS_PROVIDER` define preferência (`mercadopago` \| `stripe`).

## O que não foi alterado

- Score Saúde & Bem (`/minha-saude`)
- Motor de protocolos inteligentes (Fase 4.5)
- Ferramentas interativas
- Fluxo de conteúdo **gratuito** da biblioteca

## Teste manual

1. Aplicar migration `022_profiles_plan.sql` no Supabase
2. Login → `/minha-assinatura` — ver plano, status, renovação mock, benefícios
3. `/biblioteca` — cards FREE vs PREMIUM com CTAs corretos
4. Abrir item premium sem assinatura → gate
5. Abrir item gratuito → **Acessar conteúdo** funciona

## Build

```bash
npm run build
```

## Próximos passos (Fase 5)

- [ ] Checkout Stripe
- [ ] Webhooks unificados por provider
- [ ] Gate automático pós-pagamento em `profiles.plan`
- [ ] Download/stream via Supabase Storage
