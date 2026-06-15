# Fase 6.1 — Integração Real Mercado Pago (Assinaturas)

## Objetivo

Ativar cobrança real dos planos **Premium Mensal (R$ 19,90)** e **Premium Anual (R$ 197,00)** do Clube Saúde & Bem, sincronizando `subscriptions` + `user_memberships` via webhook.

---

## Planos oficiais (fonte única)

Arquivo: `src/lib/payments/pricing.ts`

| Plano | Preço | ID checkout |
|-------|-------|-------------|
| Premium Mensal | R$ 19,90/mês | `premium_monthly` |
| Premium Anual | R$ 197,00/ano | `premium_annual` |

Migration `037_phase_6_1_pricing.sql` atualiza `membership_plans` no Supabase.

---

## Arquivos criados / principais

### APIs
- `src/app/api/payments/create-subscription/route.ts` — POST, cria preapproval MP
- `src/app/api/payments/status/route.ts` — GET status da assinatura do usuário logado
- `src/app/api/payments/webhook/route.ts` — eventos MP (existente, expandido)
- `src/lib/payments/guards.ts` — bloqueio de assinatura duplicada / pagamento pendente
- `src/lib/payments/pricing.ts` — preços centralizados

### Membership sync
- `src/lib/membership/services/sync-membership.service.ts`
- `src/lib/membership/services/admin-stats.service.ts`

### UI
- `src/components/club/ClubSubscribeButtons.tsx` — botões na `/clube`
- `src/app/minha-assinatura/page.tsx` — dashboard do assinante (noindex)
- `src/app/admin/memberships/page.tsx` — stats expandidos (noindex)

### Migrations
- `supabase/migrations/036_phase_6_0_memberships.sql`
- `supabase/migrations/037_phase_6_1_pricing.sql`

### Scripts
- `scripts/smoke-subscriptions.mjs`

---

## Rotas

| Rota | Descrição |
|------|-----------|
| `/clube` | Landing + botões "Assinar Premium Mensal/Anual" |
| `/assinar` | Checkout legado (métodos PIX/cartão) |
| `/minha-assinatura` | Plano, status, renovação, cancelar |
| `/admin/memberships` | Planos, membros, MRR/ARR estimados |
| `POST /api/payments/create-subscription` | Inicia checkout MP |
| `GET /api/payments/status` | Status autenticado |
| `POST /api/payments/webhook` | Webhook MP assinado |

---

## Tabelas

- `membership_plans` — catálogo de planos
- `user_memberships` — status premium por usuário (`active`, `pending`, `canceled`, `expired`)
- `subscriptions` — registro técnico MP (existente)
- `payments` — pagamentos individuais (existente)
- `webhook_events` — idempotência (existente)

---

## Variáveis de ambiente

```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
MERCADOPAGO_WEBHOOK_SECRET=...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=https://www.saudeebem.com.br
```

Opcional (cron/sync):
```env
CRON_SECRET=...
PAYMENTS_STUB_MODE=false
```

---

## Segurança

- `create-subscription` e `create-checkout` exigem usuário autenticado
- `assertUserCanSubscribe` impede múltiplas assinaturas ativas e checkout duplicado (< 1h pendente)
- Webhook valida assinatura HMAC (`MERCADOPAGO_WEBHOOK_SECRET`)
- Eventos processados de forma idempotente

---

## Webhook — mapeamento de status

| Evento MP | `user_memberships.status` |
|-----------|---------------------------|
| authorized / approved | `active` |
| pending | `pending` |
| cancelled / paused | `canceled` |
| expired | `expired` |

---

## SEO

`robots: { index: false }` em:
- `/minha-assinatura`
- `/admin/memberships`

---

## Checklist de testes

### Automatizado (`node scripts/smoke-subscriptions.mjs`)
- [ ] `/clube` → 200
- [ ] `/minha-assinatura` → 302 (redirect login)
- [ ] `POST /api/payments/create-subscription` → 401 sem auth
- [ ] `GET /api/payments/status` → 401 sem auth
- [ ] `/admin/memberships` → 302 (redirect admin)

### Manual (sandbox/produção MP)
- [ ] Aplicar migrations `036` e `037` no Supabase
- [ ] Assinar Premium Mensal em `/clube` → redirect MP → aprovar → `user_memberships.active`
- [ ] Conteúdo premium liberado (`premium = true`)
- [ ] `/minha-assinatura` mostra plano, próxima cobrança, renovação
- [ ] Cancelar assinatura → status `canceled` → premium bloqueado
- [ ] Webhook `expired` após fim do período
- [ ] Admin `/admin/memberships` — MRR/ARR e conversão

---

## Build & lint

```bash
npm run build   # OK
npm run lint    # erros pré-existentes em outros módulos (ferramentas, CMS, Header)
```

---

## Deploy

1. Commit e push para branch conectada à Vercel
2. Confirmar env vars na Vercel (MP + Supabase)
3. Aplicar migrations no Supabase produção
4. Configurar webhook MP: `https://www.saudeebem.com.br/api/payments/webhook`
5. Testar assinatura real em sandbox antes de produção

---

## Compatibilidade

- Marketplace, Newsletter e SEO existentes **não alterados**
- Fluxo legado `/assinar` + `create-checkout` mantido
- Supabase Auth inalterado
