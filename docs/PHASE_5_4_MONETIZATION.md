# Fase 5.4 — Monetização Real

Substitui o checkout simulado por integração de produção com **Mercado Pago**, com controle de assinaturas, liberação automática de Premium, histórico financeiro do usuário e dashboard administrativo.

## Objetivo

- **Checkout real** Mercado Pago (Checkout Pro + Preapproval)
- **Planos:** mensal (R$ 29,90) e anual (R$ 297,00)
- **Métodos:** PIX, cartão de crédito, boleto
- **Webhooks** com idempotência e validação de assinatura
- **Status de assinatura** e liberação automática de conteúdo Premium
- **Histórico financeiro** do usuário (`financial_events`)
- **Dashboard admin** `/admin/financeiro`

## Escopo excluído (não alterado)

Biblioteca, Marketplace, CRM, Leads, Conversão, Protocolos, Minha Saúde.

> Pagamentos evoluem módulos existentes (`src/lib/payments/`, `/assinar`, `/minha-assinatura`) criados nas Fases 3.6–3.7.

## Migration

| Arquivo | Descrição |
|---------|-----------|
| `029_monetization_real.sql` | `financial_events`, `billing_plan_id` em payments, KPIs admin |

### Ordem de execução no Supabase

1. `014_clube_premium.sql`
2. `015_payments.sql`
3. `016_mercadopago_real.sql`
4. `022_profiles_plan.sql`
5. **`029_monetization_real.sql`**

### Novas estruturas

| Objeto | Uso |
|--------|-----|
| `financial_events` | Timeline financeira por usuário |
| `payments.billing_plan_id` | Plano no checkout (relatórios) |
| `get_finance_dashboard_stats()` | KPIs agregados para admin |

## Checkout Mercado Pago

### Planos

| ID | Preço | Período | Checkout |
|----|-------|---------|----------|
| `premium_monthly` | R$ 29,90 | 30 dias | Checkout Pro ou Preapproval |
| `premium_annual` | R$ 297,00 | 365 dias | Checkout Pro |

### Métodos de pagamento

| Método | Fluxo MP | Renovação |
|--------|----------|-----------|
| **PIX** | Checkout Pro (`bank_transfer`) | Manual ao fim do período |
| **Cartão** | Checkout Pro ou Preapproval (mensal) | Auto (mensal + cartão) |
| **Boleto** | Checkout Pro (`ticket`) | Manual ao fim do período |

### Modos de operação

| Modo | Condição |
|------|----------|
| **Real** | `MERCADOPAGO_ACCESS_TOKEN` válido |
| **Stub** | `MERCADOPAGO_STUB_MODE=1` + dev — simula aprovação local |
| **Produção** | Token obrigatório (`assertProductionCheckoutReady`) |

## Fluxo de pagamento

```mermaid
flowchart TD
  A[/assinar] --> B[POST /api/payments/create-checkout]
  B --> C{Mensal + cartão?}
  C -->|Sim| D[Preapproval MP]
  C -->|Não| E[Checkout Pro PIX/boleto/cartão]
  D --> F[Redirect init_point]
  E --> F
  F --> G[Webhook /api/payments/webhook]
  G --> H[Atualiza payments]
  H --> I[financial_events]
  I --> J[activateSubscriptionFromPayment]
  J --> K[profiles.plan + membership_tier]
  K --> L[Premium liberado]
```

## Webhooks

- **URL:** `{NEXT_PUBLIC_SITE_URL}/api/payments/webhook`
- **Secret:** `MERCADOPAGO_WEBHOOK_SECRET` (validação `x-signature`)
- **Idempotência:** tabela `payment_webhook_events`
- **Tópicos:** `payment`, `subscription_preapproval`

## Liberação Premium

Automática via trigger em `subscriptions` (migration 014/022):

1. Webhook aprova pagamento
2. `activateSubscriptionFromPayment()` atualiza `subscriptions`
3. Trigger sincroniza `profiles.plan` e `membership_tier`
4. `canAccessPremiumContent()` / `user_has_active_premium()` liberam conteúdo

## Histórico financeiro (usuário)

Rota: **`/minha-assinatura`**

| Seção | Fonte |
|-------|-------|
| Histórico de pagamentos | `payments` |
| Linha do tempo financeira | `financial_events` |

Eventos registrados:

- `checkout_started`, `payment_pending`, `payment_approved`, `payment_rejected`
- `subscription_activated`, `subscription_renewed`, `subscription_canceled`
- `preapproval_authorized`

## Admin — `/admin/financeiro`

| Métrica | Descrição |
|---------|-----------|
| Receita total | Soma `payments` aprovados |
| Receita 30 dias | Aprovados no último mês |
| Assinaturas ativas | `subscriptions` active/trialing |
| MRR estimado | Mensais × R$ 29,90 + anuais ÷ 12 |
| Receita por método | PIX, cartão, boleto |
| Webhooks com alerta | Falhas recentes |

Export CSV: `/api/admin/finance/export`

## Variáveis de ambiente

```env
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com.br
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_WEBHOOK_SECRET=
MERCADOPAGO_USE_SANDBOX=1          # opcional — credenciais TEST-
MERCADOPAGO_STUB_MODE=1            # apenas dev local
SUPABASE_SERVICE_ROLE_KEY=         # webhooks + checkout
PAYMENTS_CRON_SECRET=              # expirar assinaturas vencidas
```

## Cron (Vercel)

`vercel.json` agenda diariamente:

```
POST /api/payments/cron/subscriptions
Authorization: Bearer $PAYMENTS_CRON_SECRET
```

Executa RPC `expire_due_subscriptions()`.

## Arquivos principais

```
supabase/migrations/029_monetization_real.sql

src/lib/payments/
  config.ts                    # isRealCheckoutEnabled()
  mercadopago/checkout.ts      # Checkout Pro + Preapproval
  mercadopago/webhook.ts       # Webhooks + sync
  services/financial-events.service.ts
  services/subscriptions.service.ts

src/lib/admin/services/finance.service.ts
src/app/admin/financeiro/page.tsx
src/app/api/admin/finance/export/route.ts
src/app/api/payments/webhook/route.ts

src/components/payments/
  FinancialHistoryList.tsx
  SubscribeCheckoutForm.tsx
```

## Build

```bash
npm run build
```

## Produção — checklist

1. Aplicar migration `029_monetization_real.sql`
2. Configurar `MERCADOPAGO_ACCESS_TOKEN` (produção ou TEST-)
3. Registrar webhook no painel MP → `/api/payments/webhook`
4. Definir `MERCADOPAGO_WEBHOOK_SECRET`
5. Configurar `PAYMENTS_CRON_SECRET` na Vercel
6. Testar fluxo: assinar → pagar → premium liberado → `/minha-assinatura`

## Próximos passos (fora do escopo)

1. Checkout Bricks (transparente) com `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`
2. Nota fiscal / recibo PDF
3. Reembolsos e chargebacks no admin
4. Stripe como segundo provedor
5. Lembretes de renovação PIX/boleto por e-mail (CRM)
