# Fase 3.7 — Mercado Pago Real — Checklist

## Pré-requisitos

- [ ] Migrations `014`, `015` e **`016_mercadopago_real.sql`** executadas no Supabase
- [ ] `.env.local` com Supabase + credenciais Mercado Pago
- [ ] `npm run dev` em http://localhost:3001

## Variáveis de ambiente

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3001
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_WEBHOOK_SECRET=
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=
MERCADOPAGO_USE_SANDBOX=1
MERCADOPAGO_STUB_MODE=1
PAYMENTS_CRON_SECRET=
SUPABASE_SERVICE_ROLE_KEY=
```

| Variável | Obrigatória | Uso |
|----------|-------------|-----|
| `NEXT_PUBLIC_SITE_URL` | Sim (checkout real) | URLs de retorno, webhook e notificações |
| `MERCADOPAGO_ACCESS_TOKEN` | Checkout real | API Mercado Pago (Checkout Pro + preapproval) |
| `MERCADOPAGO_WEBHOOK_SECRET` | Produção | Validação `x-signature` nos webhooks |
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | Opcional | Futuro checkout transparente |
| `MERCADOPAGO_USE_SANDBOX` | Opcional | Força `sandbox_init_point` |
| `MERCADOPAGO_STUB_MODE=1` | Dev only | Simula checkout sem token MP (não funciona em produção) |
| `PAYMENTS_CRON_SECRET` | Cron de expiração | Protege `POST /api/payments/cron/subscriptions` |
| `SUPABASE_SERVICE_ROLE_KEY` | Sim | Persistência payments/subscriptions + webhooks |

## Migration 016

- [ ] Colunas em `subscriptions`: `billing_plan_id`, `auto_renew`, `cancel_at_period_end`, `mercadopago_payer_id`
- [ ] Tabela `payment_webhook_events` (idempotência de webhooks)
- [ ] Função RPC `expire_due_subscriptions()` — expira assinaturas vencidas e cancela as agendadas
- [ ] Índice `subscriptions_period_expiry_idx`
- [ ] Trigger da migration 014 continua sincronizando `profiles.membership_tier`

## Métodos de pagamento (Checkout Pro)

| Método | Código interno | Comportamento |
|--------|----------------|---------------|
| PIX | `pix` | Checkout Pro — `bank_transfer` |
| Cartão | `credit_card` | Checkout Pro ou **preapproval** (mensal) |
| Boleto | `ticket` | Checkout Pro — `ticket` |

### Renovação automática

- [ ] Plano **Premium Mensal + cartão** → `POST /preapproval` (Mercado Pago Subscriptions)
- [ ] Webhook `subscription_preapproval` / `preapproval` autoriza assinatura
- [ ] Pagamentos recorrentes renovam via webhook `payment` + `activateSubscriptionFromPayment` (estende período)

## Rotas de API

| Rota | Método | Descrição |
|------|--------|-----------|
| `/api/payments/create-checkout` | POST | Cria preference/preapproval e retorna `checkoutUrl` |
| `/api/payments/webhook` | POST | Processa notificações MP (payment + preapproval) |
| `/api/payments/webhook` | GET | Health check |
| `/api/payments/sync` | POST | Sincroniza pagamento após retorno do checkout (auth) |
| `/api/payments/cancel-subscription` | POST | Cancelamento pelo usuário (fim do período ou imediato) |
| `/api/payments/cron/subscriptions` | POST | Expira assinaturas vencidas (Bearer `PAYMENTS_CRON_SECRET`) |

### Webhook Mercado Pago

1. [ ] Configurar URL no painel MP: `{SITE_URL}/api/payments/webhook`
2. [ ] Eventos: `payment`, `subscription_preapproval` (ou `preapproval`)
3. [ ] Query params `?data.id=...&type=...` usados na validação de assinatura
4. [ ] Idempotência via `payment_webhook_events`

### Cron de expiração

Agendar chamada diária (Vercel Cron, GitHub Actions, etc.):

```bash
curl -X POST "https://SEU-DOMINIO/api/payments/cron/subscriptions" \
  -H "Authorization: Bearer SEU_PAYMENTS_CRON_SECRET"
```

## Páginas

### `/assinar`

- [ ] Planos mensal (R$ 29,90) e anual (R$ 297,00) — selo «Mais Escolhido» no anual
- [ ] PIX, cartão e boleto
- [ ] Redireciona para Checkout Pro ou preapproval MP

### `/minha-assinatura`

- [ ] Status, renovação, provedor Mercado Pago
- [ ] Sincronização automática ao retornar com `?status=success&reference=...`
- [ ] Botões **Cancelar ao fim do período** / **Cancelar agora**
- [ ] Painel stub apenas com `MERCADOPAGO_STUB_MODE=1` (dev)

## Fluxos automáticos

### Aprovação automática

1. [ ] Webhook `payment` com status `approved`
2. [ ] Atualiza `payments.status = approved`
3. [ ] `activateSubscriptionFromPayment` → `subscriptions.status = active`
4. [ ] Trigger 014 → `profiles.membership_tier = premium`

### Cancelamento automático

1. [ ] Webhook `payment` rejected/cancelled/refunded/charged_back
2. [ ] `cancelSubscriptionFromPayment` → cancela preapproval MP se existir
3. [ ] `subscriptions.status = canceled` (se não houver outro pagamento aprovado)

### Cancelamento pelo usuário

1. [ ] `POST /api/payments/cancel-subscription` `{ immediate: false }` → `cancel_at_period_end = true`
2. [ ] `{ immediate: true }` → cancelamento imediato + preapproval MP cancelado
3. [ ] Cron `expire_due_subscriptions` finaliza assinaturas agendadas

### Renovação automática (mensal + cartão)

1. [ ] Checkout cria preapproval MP
2. [ ] Webhook preapproval `authorized` → assinatura ativa com `auto_renew = true`
3. [ ] Cobranças mensais via webhook `payment` estendem `current_period_end`

## Fluxo stub (dev)

1. [ ] `MERCADOPAGO_STUB_MODE=1` sem token MP
2. [ ] Checkout redireciona para `/minha-assinatura?checkout=stub&reference=...`
3. [ ] Botão **Simular pagamento aprovado**
4. [ ] Assinatura ativada localmente

## Fluxo real (sandbox/produção)

1. [ ] Token TEST- ou APP_USR- em `MERCADOPAGO_ACCESS_TOKEN`
2. [ ] `NEXT_PUBLIC_SITE_URL` público (ngrok/Vercel)
3. [ ] Webhook configurado no painel MP
4. [ ] Testar PIX, boleto e cartão no Checkout Pro
5. [ ] Testar mensal + cartão (preapproval)
6. [ ] Verificar `payments`, `subscriptions` e `membership_tier`

## Build

```bash
npm run build
```

- [ ] Build conclui sem erros TypeScript

## SQL rápido

```sql
-- Webhooks processados
select event_key, topic, resource_id, result_message, processed_at
from public.payment_webhook_events
order by processed_at desc
limit 10;

-- Pagamentos
select id, user_id, status, payment_method, amount_cents, external_reference, paid_at
from public.payments
order by created_at desc
limit 10;

-- Assinaturas
select user_id, plan, status, provider, billing_plan_id, auto_renew,
       cancel_at_period_end, current_period_end
from public.subscriptions
order by created_at desc
limit 10;

-- Expirar manualmente (dev)
select public.expire_due_subscriptions();
```

## Arquivos principais

| Área | Path |
|------|------|
| Migration | `supabase/migrations/016_mercadopago_real.sql` |
| Config | `src/lib/payments/config.ts` |
| Checkout Pro | `src/lib/payments/mercadopago/client.ts` |
| Preapproval | `src/lib/payments/mercadopago/preapproval.ts` |
| Webhook | `src/lib/payments/mercadopago/webhook.ts`, `signature.ts` |
| Serviços | `src/lib/payments/services/` |
| APIs | `src/app/api/payments/` |
| UI | `src/components/payments/` |
| Páginas | `src/app/assinar/`, `src/app/minha-assinatura/` |

## Diferença em relação à Fase 3.6

| Recurso | 3.6 (stub) | 3.7 (real) |
|---------|------------|------------|
| Checkout | Simulação local | Checkout Pro MP |
| Webhook | Básico | Idempotente + assinatura |
| Renovação | Manual | Preapproval mensal |
| Cancelamento | — | Self-service + automático |
| Expiração | — | Cron `expire_due_subscriptions` |
| Sync retorno | — | `POST /api/payments/sync` |

## Fora de escopo (Fase 3.7)

- [ ] Checkout transparente (Bricks) no frontend
- [ ] Reembolsos automatizados
- [ ] Múltiplos planos além de mensal/anual
- [ ] Credenciais de produção no repositório
