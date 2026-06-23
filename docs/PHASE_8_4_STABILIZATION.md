# Fase 8.4 — Correção final Auth + Pagamento Premium

## Validação pré-correção

| Item | Resultado |
|------|-----------|
| Fase 8.3 commitada no GitHub? | **Não** — alterações 8.3 estavam apenas locais |
| Commit no GitHub (`master`) antes desta fase | `ce3c368` (Fase 8.1) |
| Production antes do deploy 8.4 | `ce3c368` |

---

## A) Confirmação de e-mail

### Causa exata

1. **Fase 8.3 nunca foi deployada** — produção usava callback antigo (`route.ts`) que não tratava `token_hash&type=signup|email`.
2. **Fragmento de URL (`#access_token`)** — e-mails do Supabase frequentemente redirecionam com tokens no **hash**, invisível ao servidor. O `route.ts` só lia query string → falha → `/entrar?error=auth_callback_failed`.
3. **Parâmetro inconsistente** — `signUp` usava `?redirect=` enquanto o callback lia `?next=` (corrigido em 8.3).

### Correção (8.3 + 8.4)

- Removido `src/app/auth/callback/route.ts` (servidor não vê hash).
- Criado `src/app/auth/callback/page.tsx` — cliente trata:
  - `#access_token` + `#refresh_token`
  - `?token_hash&type=signup|email|recovery`
  - `?code=` (PKCE)
- `buildAuthCallbackUrl()` unifica `?next=` em signUp e resetPassword.

### Supabase — configurar manualmente

**Site URL:** `https://www.saudeebem.com.br`

**Redirect URLs:**
```
https://www.saudeebem.com.br/auth/callback
https://www.saudeebem.com.br/auth/callback/**
https://saudeebem.com.br/auth/callback
https://saudeebem.com.br/auth/callback/**
https://www.saudeebem.com.br/redefinir-senha
```

---

## B) PIX aprovado sem Premium — Lucimar

### Dados cruzados

| Campo | Valor |
|-------|-------|
| Usuária | Lucimar Paracatu Caldeira |
| user_id | `e65791ed-8a5c-42e4-b78d-d023fc89f2d3` |
| email | `unam.representacoes@gmail.com` |
| payment_id | `9dff0ed9-b5e4-4a85-a24d-64b25c11f48c` |
| external_reference | `sb_e65791ed_539b53dc` |
| preference_id | `56920533-3ee6d245-512c-430f-97ee-4e2c9ebc3b87` |
| Estado antes | `payments.status = pending`, sem subscription/membership |

### Causa exata

Mesmo padrão do caso Emanuela: **PIX aprovado no Mercado Pago, mas webhook IPN não atualizou o Supabase**. O pagamento permaneceu `pending` → `activateSubscriptionFromPayment` nunca executou.

Fatores contribuintes:
- Webhook `/api/payments/webhook` pode falhar (401 assinatura) ou atrasar.
- API `/api/admin/payments/reconcile` retornou **401** com service role local → `SUPABASE_SERVICE_ROLE_KEY` provavelmente ausente ou diferente na Vercel.
- Retorno do checkout (`CheckoutReturnSync`) não re-tentava sync após aprovação.

### Correção operacional (Lucimar)

Executado `scripts/activate-payment-reference.mjs --reference=sb_e65791ed_539b53dc --force`:

| Item | Após correção |
|------|----------------|
| payments.status | `approved` |
| subscription_id | `2631a61f-d9ea-4e67-bbe0-d0d7579c3acf` |
| user_memberships | `active` até 2026-07-23 |
| Premium | **Ativo** |

> Quando `MERCADOPAGO_ACCESS_TOKEN` estiver disponível localmente, reexecutar sem `--force` para gravar o `external_id` real do MP.

### Correção de código

- `CheckoutReturnSync` — retry de sync após 8s.
- `syncUserMembershipFromSubscription` — erro explícito se plano não existir (antes falhava silenciosamente).
- Script `scripts/activate-payment-reference.mjs` para reconciliação manual.

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/app/auth/callback/page.tsx` | **novo** — callback cliente (hash + OTP + PKCE) |
| `src/app/auth/callback/route.ts` | **removido** |
| `src/lib/auth/callback-url.ts` | **novo** |
| `src/lib/auth/actions.ts` | URLs unificadas |
| `src/lib/auth/url-errors.ts` | Mensagens |
| `src/components/auth/ResetPasswordForm.tsx` | Fallback PKCE |
| `src/lib/billing/profile.ts` | CEP só dígitos (MP) |
| `src/components/payments/SubscribeCheckoutForm.tsx` | Erro sem checkoutUrl |
| `src/components/payments/CheckoutReturnSync.tsx` | Retry sync |
| `src/lib/membership/services/sync-membership.service.ts` | Erro se plano ausente |
| `scripts/activate-payment-reference.mjs` | **novo** |
| `scripts/find-user-payments.mjs` | **novo** |
| `scripts/list-recent-payments.mjs` | **novo** |
| `docs/PHASE_8_3_STABILIZATION.md` | Checklist 8.3 |
| `docs/PHASE_8_4_STABILIZATION.md` | Este relatório |

---

## Checklist E2E

| # | Etapa | Status |
|---|--------|--------|
| 1 | Cadastro | ⏳ Após deploy |
| 2 | Confirmação e-mail | ⏳ Após deploy + Redirect URLs |
| 3 | Login | ⏳ |
| 4 | Completar cadastro | ⏳ |
| 5 | Gerar PIX | ⏳ |
| 6 | Pagar PIX | ⏳ |
| 7 | Webhook/reconcile | ⏳ Verificar `SUPABASE_SERVICE_ROLE_KEY` na Vercel |
| 8 | Premium ativo | ✅ Lucimar reconciliada manualmente |

**Teste E2E completo:** ⏳ **Pendente** (aguarda deploy + validação com usuário novo)

---

## Pendências Vercel (críticas)

1. `SUPABASE_SERVICE_ROLE_KEY` — webhook, reconcile e ativação automática
2. `MERCADOPAGO_ACCESS_TOKEN` — já deve estar OK (PIX gera)
3. Redirect URLs no Supabase (lista acima)
