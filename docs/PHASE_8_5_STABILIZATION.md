# Fase 8.5 — Estabilização produção (webhook, Premium, e-mail)

**Data:** 2026-06-01  
**Produção:** https://www.saudeebem.com.br  
**Deploy alvo:** pós-commit `fix(auth,payments): Fase 8.5`

---

## Sintomas em produção (antes da 8.5)

| # | Sintoma | Status pré-8.5 |
|---|---------|----------------|
| 1 | Usuários criados no Supabase | ✅ OK |
| 2 | PIX gerado | ✅ OK |
| 3 | PIX pago no MP | ✅ OK |
| 4 | Webhooks MP retornam **401** | ❌ |
| 5 | Premium não ativa automaticamente | ❌ |
| 6 | Confirmação de e-mail falha no link | ❌ |

---

## Causa raiz por problema

### 4 — Webhook 401

**Arquivo:** `src/app/api/payments/webhook/route.ts` + `src/lib/payments/mercadopago/webhook-auth.ts`

1. O handler exigia `signatureOk || ipnOk`, mas `ipn.ts` **bloqueava IPN quando `x-signature` estava presente** (removido na 8.4/8.5).
2. Mercado Pago envia POST com header `x-signature`. Se `MERCADOPAGO_WEBHOOK_SECRET` na Vercel estiver ausente ou diferente do painel MP, a verificação HMAC falha → **401** antes de processar o pagamento.
3. GET IPN legado (`?topic=payment&id=`) funcionava em teoria, mas o fluxo principal Checkout Pro usa POST assinado.

**Correção 8.5:** `authorizeMercadoPagoWebhook()` — após falha de assinatura, aceita notificação IPN válida e busca o pagamento na API do MP (confirmação real, não confia só no body).

### 5 — Premium não ativa

**Cadeia:** Webhook 401 → `payments.status` permanece `pending` → `activateSubscriptionFromPayment()` nunca executa.

**Fatores adicionais:**
- `createPaymentsAdminClient()` retorna `null` se `SUPABASE_SERVICE_ROLE_KEY` ausente na Vercel → reconciliação admin também retorna 401.
- Casos já pagos (ex.: Lucimar) foram reconciliados manualmente via `scripts/activate-payment-reference.mjs`.

**Correção 8.5:**
- Webhook aceita IPN com fallback seguro (fetch MP API).
- Cron `POST /api/payments/cron/reconcile-pending` a cada 10 min (`vercel.json`) — safety net para PIX aprovado sem webhook.

### 6 — Confirmação de e-mail

**Arquivos:** `src/app/auth/callback/page.tsx` → `src/app/auth/verify/page.tsx`, `src/lib/auth/verify-session-client.ts`

1. Supabase redireciona com `#access_token` no hash — **invisível no servidor** (motivo da migração 8.4 para página cliente).
2. Fluxo PKCE `?code=` **falha em outro navegador/dispositivo** (cookie `code_verifier` ausente).
3. `router.replace()` após `setSession` podia redirecionar antes da sessão persistir nos cookies.

**Correção 8.5:**
- Rota principal `/auth/verify` com `waitForSession()` + `window.location.href` (hard navigation).
- `emailRedirectTo` aponta para `/auth/verify?next=/minha-jornada`.
- Erro dedicado `email_confirm_wrong_browser` quando PKCE falha.
- **Recomendação Supabase Dashboard:** template de e-mail com `token_hash` (funciona cross-device):

```html
<a href="{{ .SiteURL }}/auth/verify?token_hash={{ .TokenHash }}&type=email&next=/minha-jornada">
  Confirmar e-mail
</a>
```

**Redirect URLs (Supabase):**
```
https://www.saudeebem.com.br/auth/verify
https://www.saudeebem.com.br/auth/verify/**
https://www.saudeebem.com.br/auth/callback
https://www.saudeebem.com.br/auth/callback/**
https://saudeebem.com.br/auth/verify
https://www.saudeebem.com.br/redefinir-senha
```

**Site URL:** `https://www.saudeebem.com.br`

---

## Variáveis Vercel (checklist)

| Variável | Obrigatória | Notas |
|----------|-------------|-------|
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Webhook, cron reconcile, admin |
| `MERCADOPAGO_ACCESS_TOKEN` | ✅ | Checkout + fetch pagamento no webhook |
| `MERCADOPAGO_WEBHOOK_SECRET` | Recomendado | Deve coincidir com o secret no painel MP |
| `PAYMENTS_CRON_SECRET` | Opcional | Protege crons; fallback aceita service role |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Auth cliente |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Auth cliente |

---

## Arquivos alterados (8.5)

| Arquivo | Mudança |
|---------|---------|
| `src/lib/payments/mercadopago/webhook-auth.ts` | Novo — autorização com fallback IPN |
| `src/lib/payments/mercadopago/ipn.ts` | Removido bloqueio por `x-signature` |
| `src/app/api/payments/webhook/route.ts` | Usa `authorizeMercadoPagoWebhook`, log `reason` |
| `src/app/api/payments/cron/reconcile-pending/route.ts` | Novo cron safety net |
| `vercel.json` | Cron reconcile a cada 10 min |
| `src/lib/auth/verify-session-client.ts` | Lógica compartilhada auth |
| `src/app/auth/verify/page.tsx` | Handler principal confirmação |
| `src/app/auth/callback/page.tsx` | Redirect → `/auth/verify` |
| `src/lib/auth/callback-url.ts` | `buildAuthVerifyUrl()` |
| `src/lib/auth/actions.ts` | `emailRedirectTo` → `/auth/verify` |
| `src/lib/auth/url-errors.ts` | `email_confirm_wrong_browser` |
| `src/components/auth/LoginForm.tsx` | Hint cross-browser |
| `scripts/probe-production-webhook.mjs` | Probe webhook produção |

---

## Testes realizados

### Scripts locais
```bash
npm run build
node scripts/probe-production-webhook.mjs
node scripts/run-production-reconcile.mjs --reference=sb_6e24a584_46545780
```

### Produção (preencher após deploy)
- [ ] `GET /api/payments/webhook` → 200
- [ ] `GET /api/payments/webhook?topic=payment&id={id}` → 200 (não 401)
- [ ] `POST` webhook com assinatura inválida + payload payment → 200 + `auth: ipn_fallback_after_bad_signature`
- [ ] PIX pago → Premium `active` em até 1 min (webhook) ou 10 min (cron)
- [ ] Cadastro → e-mail → `/auth/verify` → sessão → `/minha-jornada`
- [ ] E2E completo novo usuário

### Reconciliação manual (pré-deploy)
| Usuário | Referência | Premium |
|---------|------------|---------|
| Lucimar | `sb_e65791ed_539b53dc` | ✅ active (manual) |
| Kelen | `sb_6e24a584_46545780` | ⏳ pending → reconciliar pós-deploy |

---

## Fluxo E2E esperado

```
Cadastro → E-mail → /auth/verify → Login automático → Assinatura → PIX MP
    → Webhook 200 → payments.approved → activateSubscriptionFromPayment
    → membership premium active → /minha-jornada
```

Fallback: cron reconcile-pending consulta MP e ativa se webhook falhar.
