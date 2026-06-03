# Fase 3.6 — Monetização e Assinaturas (Mercado Pago) — Checklist

## Pré-requisitos

- [ ] Migration `015_payments.sql` executada no Supabase (após 014)
- [ ] Migration `014_clube_premium.sql` já aplicada
- [ ] `.env.local` com Supabase configurado
- [ ] `npm run dev` em http://localhost:3001

## Variáveis de ambiente

Adicionar em `.env.local` (sem credenciais reais ainda — usar placeholders ou omitir para modo stub):

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3001
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_WEBHOOK_SECRET=
SUPABASE_SERVICE_ROLE_KEY=
```

| Variável | Obrigatória | Uso |
|----------|-------------|-----|
| `NEXT_PUBLIC_SITE_URL` | Sim (checkout real) | URLs de retorno e webhook |
| `MERCADOPAGO_ACCESS_TOKEN` | Checkout real | API Mercado Pago |
| `MERCADOPAGO_WEBHOOK_SECRET` | Produção | Validação `x-signature` |
| `SUPABASE_SERVICE_ROLE_KEY` | Sim (persistência) | Insert payments + ativar assinatura |

## Migration 015

- [ ] Tabela `payments` criada
- [ ] Provider `mercadopago` permitido em `subscriptions`
- [ ] Coluna `mercadopago_preapproval_id` em `subscriptions`
- [ ] RLS ativo em `payments`

## Rotas

### `/assinar` (login obrigatório)

- [ ] Redireciona para `/entrar` se deslogado
- [ ] Exibe plano mensal e valor
- [ ] Opções: PIX, cartão, boleto
- [ ] Botão chama `POST /api/payments/create-checkout`
- [ ] Modo stub sem token MP → redireciona para simulação

### `/minha-assinatura` (login obrigatório)

- [ ] Plano atual, status, próxima renovação, provedor
- [ ] Histórico de pagamentos
- [ ] Painel stub com botão **Simular pagamento aprovado**
- [ ] Query `?status=success|pending|failure` exibe feedback

### API

- [ ] `POST /api/payments/create-checkout` — retorna `checkoutUrl`, `paymentId`, `stub`
- [ ] `POST /api/payments/webhook` — processa notificação MP (stub aceita sem secret se MP off)
- [ ] `GET /api/payments/webhook` — health check

## Dashboard do clube (`/clube/dashboard`)

- [ ] Card assinatura com status e provedor Mercado Pago
- [ ] Próxima renovação visível para premium
- [ ] Histórico de pagamentos (últimos 5)
- [ ] Link para `/minha-assinatura`
- [ ] CTA **Assinar Premium** → `/assinar` se free

## Fluxo stub (sem credenciais MP)

1. [ ] Login em `/entrar`
2. [ ] Acessar `/assinar` → escolher PIX → checkout
3. [ ] Redireciona para `/minha-assinatura?checkout=stub&reference=...`
4. [ ] Clicar **Simular pagamento aprovado**
5. [ ] `subscriptions.status` = `active`, `provider` = `mercadopago`
6. [ ] `profiles.membership_tier` = `premium`
7. [ ] Conteúdo premium desbloqueado

## Fluxo real (quando configurar MP)

- [ ] Token de teste/produção em `MERCADOPAGO_ACCESS_TOKEN`
- [ ] `NEXT_PUBLIC_SITE_URL` apontando para URL pública (ngrok/Vercel)
- [ ] Webhook configurado no painel MP → `/api/payments/webhook`
- [ ] Pagamento aprovado atualiza `payments` e `subscriptions` automaticamente

## Métodos de pagamento Mercado Pago

- [ ] PIX (`pix`)
- [ ] Cartão de crédito (`credit_card`)
- [ ] Boleto (`ticket`)

## Build

```bash
npm run build
```

- [ ] Build conclui sem erros TypeScript

## SQL rápido

```sql
select id, user_id, status, payment_method, amount_cents, external_reference, paid_at
from public.payments
order by created_at desc
limit 10;

select user_id, plan, status, provider, current_period_end
from public.subscriptions
order by created_at desc
limit 10;
```

## Arquivos principais

| Área | Path |
|------|------|
| Migration | `supabase/migrations/015_payments.sql` |
| Serviços | `src/lib/payments/` |
| Checkout API | `src/app/api/payments/create-checkout/route.ts` |
| Webhook API | `src/app/api/payments/webhook/route.ts` |
| UI | `src/components/payments/` |
| Páginas | `src/app/assinar/`, `src/app/minha-assinatura/` |

## Fora de escopo (Fase 3.6)

- [ ] Credenciais reais de produção no repositório
- [ ] Assinatura recorrente automática (preapproval MP)
- [ ] Cancelamento self-service
- [ ] Reembolsos automatizados
