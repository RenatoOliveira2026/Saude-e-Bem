# Saúde & Bem - Status do Projeto v0.3.7

## Resumo Executivo

Portal premium de saúde, bem-estar e longevidade.

Plataforma Next.js com conteúdo editorial (blog, protocolos, biblioteca, ferramentas), área de membros premium (Clube), monetização via Mercado Pago e painel administrativo para gestão de conteúdo, leads, afiliados e assinaturas.

**Tag atual:** `v0.3.7` — Mercado Pago Real (Checkout Pro, webhooks, renovação e cancelamento automáticos).

---

## Tecnologias

| Camada | Stack |
|--------|--------|
| Frontend / SSR | Next.js 16, React, TypeScript, Tailwind CSS v4 |
| Backend / dados | Supabase (PostgreSQL, Auth, RLS, Storage) |
| Pagamentos | Mercado Pago (Checkout Pro, PIX, cartão, boleto, preapproval) |
| Deploy | Vercel |
| Repositório | GitHub |

---

## Fases concluídas

### Fase 3.2

CMS, SEO, uploads, afiliados premium e portal público.

### Fase 3.3

Newsletter, leads e afiliados.

### Fase 3.4

Analytics e Inteligência.

### Fase 3.5

Clube Premium — migration 014, rotas `/clube/*`, gate de conteúdo premium, sincronização de `membership_tier`.

### Fase 3.6

Monetização e Assinaturas — migration 015, `/assinar`, `/minha-assinatura`, APIs de checkout e webhook (modo stub em dev).

### Fase 3.7

Mercado Pago Real — migration 016, integração real (PIX, cartão, boleto, Checkout Pro), webhooks idempotentes, preapproval para renovação mensal, cancelamento e expiração automáticos, cron de assinaturas.

Documentação detalhada: [`docs/PHASE_3_7_CHECKLIST.md`](./PHASE_3_7_CHECKLIST.md)

---

## Banco de Dados

Projeto Supabase com migrations numeradas (`001`–`016`). Principais tabelas:

| Tabela | Uso |
|--------|-----|
| `admin_users` | Papéis e acesso ao painel admin |
| `affiliate_clicks` | Registro de cliques em links de afiliados |
| `affiliate_links` | Links de afiliados premium |
| `analytics_events` | Eventos de analytics |
| `articles` | Artigos do blog |
| `ebooks` | Materiais da biblioteca |
| `favorites` | Favoritos do usuário |
| `newsletter_subscribers` | Inscrições na newsletter |
| `payments` | Pagamentos Mercado Pago |
| `profiles` | Perfil do usuário e `membership_tier` |
| `subscriptions` | Assinaturas premium (planos, períodos, MP) |
| `user_downloads` | Histórico de downloads |

Tabelas auxiliares da Fase 3.7: `payment_webhook_events` (idempotência de webhooks).

Funções RPC relevantes: `user_has_active_premium`, `expire_due_subscriptions`, `is_admin`, `touch_club_joined`.

---

## Variáveis de Ambiente

Configurar em `.env.local` (desenvolvimento) e no painel da Vercel (produção). **Não commitar valores reais.**

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SITE_URL` | URL pública do site (retornos de checkout e webhooks) |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima Supabase (cliente) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role — pagamentos, webhooks e operações admin server-side |
| `MERCADOPAGO_ACCESS_TOKEN` | Token de acesso da API Mercado Pago |
| `MERCADOPAGO_WEBHOOK_SECRET` | Secret para validação da assinatura `x-signature` nos webhooks |
| `PAYMENTS_CRON_SECRET` | Secret para proteger o cron `POST /api/payments/cron/subscriptions` |

Variáveis opcionais (dev / sandbox):

- `MERCADOPAGO_STUB_MODE=1` — checkout simulado sem token MP (apenas dev)
- `MERCADOPAGO_USE_SANDBOX=1` — força URL sandbox do Checkout Pro
- `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` — chave pública MP (uso futuro)

---

## Deploy

**Produção:** https://saude-e-bem.vercel.app

Fluxo típico: push em `master` → build automático na Vercel. Aplicar migrations no Supabase antes ou logo após deploy que dependa de schema novo.

Webhook Mercado Pago (produção):

`https://saude-e-bem.vercel.app/api/payments/webhook`

---

## Tags

| Tag | Fase |
|-----|------|
| `v0.3.3` | Newsletter, leads e afiliados |
| `v0.3.4` | Analytics e Inteligência |
| `v0.3.4-production` | Release de produção 3.4 |
| `v0.3.5` | Clube Premium |
| `v0.3.6` | Monetização e Assinaturas |
| `v0.3.7` | Mercado Pago Real |

---

## Próxima Fase

**Fase 3.8 — Área do Assinante Premium**

- Favoritos
- Histórico de downloads
- Protocolos salvos
- Recomendações personalizadas
- Dashboard do assinante

---

## Checklist de Recuperação

Passos para restaurar o projeto em um novo ambiente:

1. **Clonar** o repositório GitHub (`RenatoOliveira2026/Saude-e-Bem`).
2. **Configurar** `.env.local` com as variáveis listadas acima (sem expor secrets no Git).
3. **Executar** todas as migrations Supabase em ordem (`supabase/migrations/001` … `016`).
4. **`npm install`** — instalar dependências.
5. **`npm run build`** — validar compilação TypeScript e build de produção.
6. **Deploy Vercel** — vincular repositório, configurar env vars e domínio.
7. **Mercado Pago** — configurar credenciais, URL de webhook e (opcional) cron de expiração com `PAYMENTS_CRON_SECRET`.
8. **Smoke test** — login, `/assinar`, webhook de teste, `/minha-assinatura`, conteúdo premium no Clube.

---

## Referências rápidas

| Recurso | Caminho |
|---------|---------|
| Checklist Fase 3.7 | `docs/PHASE_3_7_CHECKLIST.md` |
| Migrations | `supabase/migrations/` |
| Pagamentos | `src/lib/payments/` |
| Clube / premium | `src/lib/club/` |
| Admin | `src/app/admin/` |

*Última atualização: checkpoint `v0.3.7` — Mercado Pago Real.*
