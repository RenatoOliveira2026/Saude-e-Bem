# Fase 5.5 — Monetização Real (Consolidação)

Consolida e completa a monetização do Clube Saúde & Bem: quatro planos comerciais, checkout Mercado Pago, liberação automática de Premium, histórico financeiro, dashboard admin e status de assinatura em Minha Saúde. Inclui estrutura de banco para cupons futuros.

> **Relação com Fase 5.4:** a base de pagamentos (Checkout Pro, webhooks, `/assinar`, `/minha-assinatura`, `/admin/financeiro`) foi implementada na Fase 5.4. A Fase 5.5 adiciona o **plano trimestral**, **status em Minha Saúde** e **estrutura de cupons**.

---

## Objetivos entregues

| # | Objetivo | Status |
|---|----------|--------|
| 1 | Mercado Pago Checkout Pro | ✅ Fase 5.4 + mantido |
| 2 | Planos Gratuito, Mensal, Trimestral, Anual | ✅ Fase 5.5 |
| 3 | Página `/assinar` | ✅ Fase 5.4 + 4 planos |
| 4 | Área admin financeira | ✅ `/admin/financeiro` |
| 5 | Histórico de assinaturas | ✅ `/minha-assinatura` |
| 6 | Premium automático após pagamento | ✅ Webhook + trigger |
| 7 | Bloqueio de conteúdo Premium | ✅ `PremiumContentGuard` |
| 8 | Status em Minha Saúde | ✅ Fase 5.5 |
| 9 | Webhook Mercado Pago | ✅ `/api/payments/webhook` |
| 10 | Estrutura para cupons | ✅ Fase 5.5 (DB + validação stub) |

---

## Planos comerciais

| ID | Nome | Preço | Período | Checkout |
|----|------|-------|---------|----------|
| `free` | Gratuito | R$ 0 | — | Não |
| `premium_monthly` | Premium Mensal | R$ 29,90 | 30 dias | Checkout Pro ou Preapproval (cartão) |
| `premium_quarterly` | Premium Trimestral | R$ 79,90 | 90 dias | Checkout Pro |
| `premium_annual` | Premium Anual | R$ 297,00 | 365 dias | Checkout Pro |

**Economia trimestral:** R$ 9,80 vs. 3× mensal (R$ 89,70).  
**Economia anual:** R$ 61,80 vs. 12× mensal.

---

## Migration

| Arquivo | Descrição |
|---------|-----------|
| `030_phase_5_5_monetization.sql` | Plano trimestral, cupons, KPIs admin |

### Ordem de execução no Supabase

1. `014_clube_premium.sql`
2. `015_payments.sql`
3. `016_mercadopago_real.sql`
4. `022_profiles_plan.sql`
5. `029_monetization_real.sql`
6. **`030_phase_5_5_monetization.sql`**

### Novas estruturas (030)

| Objeto | Uso |
|--------|-----|
| `profiles.plan` + `premium_quarterly` | Plano trimestral no perfil |
| `sync_profile_membership_tier()` | Sincroniza plano trimestral |
| `user_has_active_premium()` | Inclui trimestral |
| `get_finance_dashboard_stats()` | Contador `quarterly_subscribers` |
| `discount_coupons` | Cupons promocionais (futuro) |
| `discount_coupon_redemptions` | Histórico de resgates |
| `payments.coupon_code` | Código aplicado no checkout (futuro) |
| `payments.discount_cents` | Desconto em centavos (futuro) |

---

## Checkout Mercado Pago

### Fluxo

```mermaid
flowchart TD
  A[/assinar] --> B[POST /api/payments/create-checkout]
  B --> C{Mensal + cartão?}
  C -->|Sim| D[Preapproval MP — renovação automática]
  C -->|Não| E[Checkout Pro — PIX / boleto / cartão]
  D --> F[Redirect init_point]
  E --> F
  F --> G[Webhook POST /api/payments/webhook]
  G --> H[Atualiza payments + financial_events]
  H --> I[activateSubscriptionFromPayment]
  I --> J[Trigger sync_profile_membership_tier]
  J --> K[Premium liberado]
```

### Métodos de pagamento

| Método | Planos | Renovação |
|--------|--------|-----------|
| **PIX** | Mensal, Trimestral, Anual | Manual ao fim do período |
| **Cartão** | Mensal (Preapproval), demais (Checkout Pro) | Auto (só mensal + cartão) |
| **Boleto** | Mensal, Trimestral, Anual | Manual ao fim do período |

---

## Liberação e bloqueio Premium

### Liberação automática

1. Mercado Pago confirma pagamento → webhook
2. `activateSubscriptionFromPayment()` atualiza `subscriptions`
3. Trigger `sync_profile_membership_tier()` define `profiles.plan` e `membership_tier`
4. `canAccessPremiumContent()` / `user_has_active_premium()` liberam conteúdo

### Bloqueio para usuários gratuitos

Componentes em páginas premium:

- `PremiumContentGuard` — protocolos, blog, biblioteca
- `PremiumGate` — ferramentas premium

CTA padrão → `/assinar`.

---

## Páginas do usuário

| Rota | Conteúdo |
|------|----------|
| `/assinar` | Escolha de plano + método + redirect MP |
| `/minha-assinatura` | Plano, renovação, histórico de pagamentos e timeline financeira |
| `/minha-saude` | **Card de status da assinatura** (Fase 5.5) |

---

## Admin — `/admin/financeiro`

| Métrica | Descrição |
|---------|-----------|
| Receita total | Soma `payments` aprovados |
| Receita 30 dias | Aprovados no último mês |
| Assinaturas ativas | `subscriptions` active/trialing |
| MRR estimado | Mensais × R$ 29,90 + trimestrais ÷ 3 + anuais ÷ 12 |
| Mensais / Trimestrais / Anuais | Contadores por `billing_plan_id` |
| Receita por método | PIX, cartão, boleto |
| Webhooks com alerta | Falhas recentes |

Export CSV: `/api/admin/finance/export`

---

## Cupons (estrutura futura)

### Banco de dados

```sql
discount_coupons (
  code, discount_type, discount_value,
  valid_from, valid_until, max_redemptions,
  applies_to_plans[], min_amount_cents, active
)

discount_coupon_redemptions (
  coupon_id, user_id, payment_id, discount_cents
)
```

### Código (stub)

- `src/lib/payments/coupons/types.ts` — tipos
- `src/lib/payments/coupons/service.ts` — `validateCouponForCheckout()`
- `CheckoutRequest.couponCode` — campo reservado na API

**Próximo passo:** UI de cupom em `/assinar`, lookup no checkout e registro em `discount_coupon_redemptions`.

---

## Configuração — Mercado Pago

### 1. Credenciais

1. Acesse [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
2. Crie ou selecione a aplicação
3. Copie o **Access Token** de produção (ou `TEST-...` para sandbox)

### 2. Webhook

| Campo | Valor |
|-------|-------|
| **URL** | `https://SEU-DOMINIO.com.br/api/payments/webhook` |
| **Eventos** | `payment`, `subscription_preapproval` |
| **Secret** | Gere no painel → `MERCADOPAGO_WEBHOOK_SECRET` |

### 3. URLs de retorno (automáticas)

O checkout usa `NEXT_PUBLIC_SITE_URL` para:

- `back_urls.success` → `/minha-assinatura?checkout=success`
- `back_urls.failure` → `/minha-assinatura?checkout=failure`
- `back_urls.pending` → `/minha-assinatura?checkout=pending`
- `notification_url` → `/api/payments/webhook`

### 4. Sandbox (testes)

```env
MERCADOPAGO_ACCESS_TOKEN=TEST-...
MERCADOPAGO_USE_SANDBOX=1
```

Use cartões de teste do painel MP.

### 5. Checklist produção

- [ ] Access Token de produção configurado
- [ ] Webhook registrado com HTTPS válido
- [ ] `MERCADOPAGO_WEBHOOK_SECRET` definido
- [ ] Teste: assinar trimestral → pagar → premium liberado
- [ ] Teste: webhook reprocessado sem duplicar (idempotência)

---

## Configuração — Supabase

### 1. Migrations

Execute no SQL Editor ou via CLI, na ordem listada acima.

### 2. Variáveis (Vercel / `.env.local`)

```env
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com.br
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # obrigatório para webhooks

MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_WEBHOOK_SECRET=
MERCADOPAGO_USE_SANDBOX=1           # opcional — sandbox
MERCADOPAGO_STUB_MODE=1             # apenas dev local

PAYMENTS_CRON_SECRET=               # expirar assinaturas vencidas
```

### 3. RLS

- Usuários veem próprios `payments`, `financial_events`, `discount_coupon_redemptions`
- Admins veem tudo via `is_admin()`
- Cupons: apenas admin gerencia (`discount_coupons`)

### 4. Cron diário

`vercel.json`:

```
POST /api/payments/cron/subscriptions
Authorization: Bearer $PAYMENTS_CRON_SECRET
```

Executa `expire_due_subscriptions()` para downgrade automático.

---

## Variáveis de ambiente (resumo)

| Variável | Obrigatória | Uso |
|----------|-------------|-----|
| `NEXT_PUBLIC_SITE_URL` | Sim | URLs de retorno MP |
| `MERCADOPAGO_ACCESS_TOKEN` | Produção | Checkout real |
| `MERCADOPAGO_WEBHOOK_SECRET` | Sim | Validação `x-signature` |
| `SUPABASE_SERVICE_ROLE_KEY` | Sim | Webhook + persistência |
| `PAYMENTS_CRON_SECRET` | Sim | Cron de expiração |
| `MERCADOPAGO_STUB_MODE` | Dev | Simula checkout local |
| `MERCADOPAGO_USE_SANDBOX` | Opcional | Força sandbox |

---

## Arquivos principais

```
supabase/migrations/030_phase_5_5_monetization.sql

src/lib/payments/
  plans.ts                         # 4 planos comerciais
  coupons/                         # Estrutura cupons (futuro)
  mercadopago/checkout.ts          # Checkout Pro + Preapproval
  mercadopago/webhook.ts           # Webhooks + sync

src/app/assinar/page.tsx
src/app/minha-assinatura/page.tsx
src/app/admin/financeiro/page.tsx
src/app/api/payments/webhook/route.ts
src/app/api/payments/create-checkout/route.ts

src/components/subscription/SubscriptionStatusCard.tsx  # Minha Saúde
src/components/payments/SubscribeCheckoutForm.tsx
src/components/club/PremiumContentGuard.tsx

src/lib/health-profile/get-health-profile-data.ts     # membership em Minha Saúde
```

---

## Build e deploy

```bash
npm run build
```

### Checklist pós-deploy

1. Aplicar migration `030_phase_5_5_monetization.sql`
2. Confirmar webhook MP ativo
3. Testar `/assinar` com os 4 planos visíveis
4. Confirmar card de assinatura em `/minha-saude`
5. Confirmar bloqueio premium para usuário free
6. Confirmar KPI trimestral em `/admin/financeiro`

---

## Escopo excluído

Biblioteca, Marketplace, CRM, Leads, Conversão, Protocolos inteligentes (sem alterações de lógica core).

---

## Checklist e próxima fase

- **Checklist de produção:** [`PHASE_5_5_CHECKLIST.md`](./PHASE_5_5_CHECKLIST.md)
- **Próxima fase (planejamento):** [`PHASE_5_6_WHATSAPP_COMMUNICATION.md`](./PHASE_5_6_WHATSAPP_COMMUNICATION.md)

## Próximos passos (fora do escopo 5.5)

1. UI de cupom em `/assinar` + aplicação no checkout MP
2. Admin CRUD de cupons
3. Checkout Bricks (transparente)
4. Nota fiscal / recibo PDF
5. Lembretes de renovação PIX/boleto por WhatsApp (Fase 5.6)
6. Stripe como segundo provedor
