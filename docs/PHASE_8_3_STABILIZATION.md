# Fase 8.3 — Estabilização crítica de Auth e Pagamentos

Checklist E2E e registro de correções para go-live seguro.

---

## Checklist E2E (usuário novo)

Execute em **produção** após deploy desta fase (`ce3c368`+).

| # | Etapa | Como validar | OK |
|---|--------|--------------|-----|
| 1 | Cadastro | `/cadastro` → nome, e-mail, senha → mensagem de confirmação | ☐ |
| 2 | E-mail confirmação | Clicar link no e-mail → redireciona `/minha-jornada` logado | ☐ |
| 3 | Login | `/entrar` com credenciais → área logada | ☐ |
| 4 | Completar cadastro | `/completar-cadastro?next=/assinar` → CPF, celular, endereço | ☐ |
| 5 | Gerar PIX | `/assinar` → PIX → redireciona Mercado Pago com QR | ☐ |
| 6 | Pagar PIX | Pagar no MP (sandbox ou real) | ☐ |
| 7 | Webhook/reconcile | Pagamento `approved` no Supabase; `/admin/financeiro` | ☐ |
| 8 | Premium ativo | `user_memberships.status = active`; `/minha-assinatura` Premium | ☐ |

**Recuperação de senha (paralelo):**

| # | Etapa | OK |
|---|--------|-----|
| R1 | `/recuperar-senha` → e-mail enviado | ☐ |
| R2 | Link → `/redefinir-senha` com sessão válida | ☐ |
| R3 | Nova senha → login com nova senha | ☐ |

---

## Causas raiz identificadas

### A1 — Confirmação de e-mail falha (`auth_callback_failed`)

| Item | Detalhe |
|------|---------|
| **Sintoma** | Após clicar no e-mail: `/entrar?error=auth_callback_failed` — *"Não foi possível confirmar seu acesso."* |
| **Causa** | `/auth/callback` só tratava `token_hash` para `type=recovery` e `code` PKCE. Links de confirmação com `token_hash&type=signup` ou `type=email` caíam no fallback de erro. |
| **Causa secundária** | Cookies de sessão não eram gravados na `NextResponse` do redirect (padrão `@supabase/ssr` exige `setAll` na response). PKCE podia falhar silenciosamente. |
| **Causa secundária** | `signUp` usava query `redirect=` enquanto callback lia `next` — redirect pós-confirmação inconsistente. |

### A2 — Recuperação de senha instável

| Item | Detalhe |
|------|---------|
| **Sintoma** | Link expira ou `/redefinir-senha` mostra sessão inválida |
| **Causa** | Mesmo problema de cookies no callback; fluxo PKCE sem fallback no cliente em `/redefinir-senha` |
| **Mitigação** | Callback unificado + `exchangeCodeForSession` no `ResetPasswordForm` quando `?code=` presente |

### B1 — PIX não gera após completar cadastro

| Item | Detalhe |
|------|---------|
| **Sintoma** | Botão "Pagar com PIX" não redireciona; sem mensagem de erro |
| **Causa 1** | Usuário sem sessão válida (falha na confirmação de e-mail) → checkout retorna 401 |
| **Causa 2** | `zip_code` enviado ao MP com hífen (`01310-100`); API espera 8 dígitos → preference 400 |
| **Causa 3** | Resposta OK sem `checkoutUrl` não exibia erro (falha silenciosa) |

### B2 — Pagamento aprovado sem Premium (casos anteriores)

| Item | Detalhe |
|------|---------|
| **Causa** | Webhook IPN rejeitado ou reconciliação com referência errada (corrigido em `6551e42`, Fase 8.1) |
| **Operação** | Garantir `SUPABASE_SERVICE_ROLE_KEY` e `MERCADOPAGO_ACCESS_TOKEN` na Vercel |

---

## Correções aplicadas (código)

| Arquivo | Correção |
|---------|----------|
| `src/app/auth/callback/route.ts` | OTP signup/email/invite; cookies na response; OAuth errors; `NextRequest` |
| `src/lib/auth/callback-url.ts` | URL canônica `?next=` para signUp e recovery |
| `src/lib/auth/actions.ts` | `buildAuthCallbackUrl()` em signUp e resetPassword |
| `src/lib/auth/url-errors.ts` | Mensagens mais claras |
| `src/components/auth/ResetPasswordForm.tsx` | Fallback PKCE `?code=` no cliente |
| `src/lib/billing/profile.ts` | CEP só dígitos no payer MP |
| `src/components/payments/SubscribeCheckoutForm.tsx` | Erro explícito sem `checkoutUrl` |

---

## Variáveis Vercel (Production)

| Variável | Obrigatória | Uso |
|----------|-------------|-----|
| `NEXT_PUBLIC_SITE_URL` | Sim | `https://www.saudeebem.com.br` (com `www`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | Projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim | Auth + RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Sim | Pagamentos, webhook, reconcile |
| `MERCADOPAGO_ACCESS_TOKEN` | Sim | Checkout Pro / PIX |
| `MERCADOPAGO_WEBHOOK_SECRET` | Recomendado | Assinatura webhook POST |
| `PAYMENTS_CRON_SECRET` | Recomendado | Reconcile admin/cron |

---

## URLs Supabase (Auth → URL Configuration)

**Site URL:**
```
https://www.saudeebem.com.br
```

**Redirect URLs** (adicionar todas):
```
https://www.saudeebem.com.br/auth/callback
https://www.saudeebem.com.br/auth/callback/**
https://saudeebem.com.br/auth/callback
https://saudeebem.com.br/auth/callback/**
https://www.saudeebem.com.br/redefinir-senha
https://saudeebem.com.br/redefinir-senha
```

**E-mail templates:** confirmação e recovery devem apontar para `{{ .SiteURL }}/auth/callback` (Supabase injeta `token_hash` ou `code`).

**Mercado Pago:** notification URL = `https://www.saudeebem.com.br/api/payments/webhook`

---

## Teste final

| Ambiente | Resultado |
|----------|-----------|
| Código + build local | ✅ `npm run build` |
| Produção E2E usuário novo | ⏳ **Pendente validação manual** pós-deploy |

Após deploy, executar checklist acima com e-mail real e PIX de teste (ou valor mínimo).

---

## Comandos operacionais

```bash
# Reconciliar pending manualmente (admin)
POST /api/admin/payments/reconcile
Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY ou PAYMENTS_CRON_SECRET>

# Limpar pending órfãos (membership ativa)
node scripts/cancel-legacy-pending-payments.mjs --dry-run
node scripts/cancel-legacy-pending-payments.mjs
```
