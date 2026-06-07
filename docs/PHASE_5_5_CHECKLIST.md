# Fase 5.5 — Checklist de Produção (Monetização Real)

Use esta lista após o deploy na Vercel e antes de abrir checkout real ao público.

---

## 1. Variáveis na Vercel

**Settings → Environment Variables → Production** (e Preview, se testar PRs):

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SITE_URL` | Sim | URL pública do site (`https://saudeebem.com.br`) — usada nas URLs de retorno do MP |
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim | Chave anon do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Sim | Service role — webhooks gravam pagamentos e ativam assinatura |
| `MERCADOPAGO_ACCESS_TOKEN` | Sim (prod) | Access Token de produção ou `TEST-...` em sandbox |
| `MERCADOPAGO_WEBHOOK_SECRET` | Sim | Secret gerado no painel MP para validar `x-signature` |
| `PAYMENTS_CRON_SECRET` | Sim | Bearer token do cron `/api/payments/cron/subscriptions` |

**Opcionais:**

| Variável | Quando usar |
|----------|-------------|
| `MERCADOPAGO_USE_SANDBOX=1` | Forçar sandbox mesmo com token de teste |
| `MERCADOPAGO_STUB_MODE=1` | **Não usar em produção** — simula checkout local |

Após alterar variáveis: **Redeploy** na Vercel.

**Migration Supabase:** aplicar `030_phase_5_5_monetization.sql` no SQL Editor (após 029).

---

## 2. Credenciais no Mercado Pago

1. Acesse [Mercado Pago Developers](https://www.mercadopago.com.br/developers/panel/app).
2. Crie ou selecione a **aplicação** do Saúde & Bem.
3. Obtenha:
   - **Access Token** (Produção ou Credenciais de teste `TEST-...`)
   - **Public Key** (opcional — futuro Checkout Bricks)
4. Em **Webhooks**, gere o **Secret** para assinatura HMAC.
5. Confirme que a conta MP está **habilitada para receber pagamentos** (PIX, cartão, boleto conforme necessidade).

Copie para a Vercel:

```
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...   # ou TEST-...
MERCADOPAGO_WEBHOOK_SECRET=...
```

---

## 3. Onde configurar o webhook

**Painel Mercado Pago → Sua aplicação → Webhooks → Configurar notificações**

| Campo | Valor |
|-------|-------|
| **URL de produção** | `https://SEU-DOMINIO.com.br/api/payments/webhook` |
| **Eventos** | `payment` e `subscription_preapproval` |
| **Versão da API** | v1 (padrão) |

O secret exibido no painel deve ser idêntico a `MERCADOPAGO_WEBHOOK_SECRET` na Vercel.

**Validação rápida:** após um pagamento de teste, em `/admin/financeiro` não devem aparecer alertas de webhook com falha de assinatura.

---

## 4. Como testar pagamento em sandbox

### Preparação

```env
MERCADOPAGO_ACCESS_TOKEN=TEST-...
MERCADOPAGO_USE_SANDBOX=1
NEXT_PUBLIC_SITE_URL=https://seu-preview.vercel.app   # ou domínio de staging
```

1. Aplique migrations até `030` no Supabase de staging.
2. Faça login com usuário de teste (não admin).
3. Acesse **`/assinar`**, escolha plano (ex.: Trimestral) e método **PIX** ou **cartão**.
4. Clique em **Ir para checkout Mercado Pago** — redirect para ambiente de teste MP.
5. **Cartão de teste** (painel MP → Credenciais de teste):
   - Aprovado: `5031 4332 1540 6351` + CVV `123` + validade futura + CPF teste
   - Recusado: use cartões de erro listados na documentação MP
6. **PIX sandbox:** gere QR e simule pagamento no fluxo de teste do MP.
7. Após pagamento, você será redirecionado para `/minha-assinatura?checkout=...`.

**Modo stub (apenas dev local):**

```env
MERCADOPAGO_STUB_MODE=1
```

Simula checkout sem MP — **não usar em staging/produção**.

---

## 5. Como validar liberação automática do Premium

### Fluxo esperado

```
Pagamento aprovado (MP)
  → POST /api/payments/webhook
  → payments.status = approved
  → financial_events (payment_approved, subscription_activated)
  → subscriptions.status = active + billing_plan_id
  → trigger sync_profile_membership_tier
  → profiles.plan = premium_* + membership_tier = premium
```

### Checklist de validação

- [ ] **`/minha-assinatura`** — badge PREMIUM, plano correto, data de renovação
- [ ] **`/minha-saude`** — card de assinatura com status ativo
- [ ] **Conteúdo premium** — abrir protocolo/artigo/biblioteca premium sem bloqueio (`PremiumContentGuard`)
- [ ] **Supabase → `subscriptions`** — registro `active` com `billing_plan_id` correto
- [ ] **Supabase → `profiles`** — `plan` = `premium_monthly` | `premium_quarterly` | `premium_annual`
- [ ] **Supabase → `financial_events`** — eventos `payment_approved` e `subscription_activated`
- [ ] **`/admin/financeiro`** — pagamento na lista recente; contador do plano incrementado
- [ ] **Reprocessar webhook** — idempotência: não duplicar assinatura nem eventos

### Teste de bloqueio (usuário free)

1. Crie conta nova ou cancele assinatura.
2. Confirme `profiles.plan = free`.
3. Acesse conteúdo premium — deve exibir `PremiumGate` com CTA para `/assinar`.

### Teste de expiração (opcional)

Chame manualmente (com `PAYMENTS_CRON_SECRET`):

```bash
curl -X POST https://SEU-DOMINIO/api/payments/cron/subscriptions \
  -H "Authorization: Bearer SEU_PAYMENTS_CRON_SECRET"
```

Usuários com `current_period_end` vencido devem voltar a `free`.

---

## Referência

Documentação completa: [`PHASE_5_5_MONETIZATION.md`](./PHASE_5_5_MONETIZATION.md)

Próxima fase: [`PHASE_5_6_WHATSAPP_COMMUNICATION.md`](./PHASE_5_6_WHATSAPP_COMMUNICATION.md)
