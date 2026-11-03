# Saúde & Bem — Mapa técnico do projeto

> **Índice central da documentação.** Comece por aqui antes de qualquer alteração.
>
> | Item | Valor |
> |---|---|
> | Data da inspeção | 03/11/2026 |
> | Commit inspecionado | `900486528562cb1dd74868cee975342a3b4712da` (branch `master`) |
> | Cobertura | Código completo do repositório (leitura estática), 52 migrações SQL, configuração Vercel e consulta **somente leitura** aos painéis Supabase, Vercel e GitHub |
> | Fora da cobertura | Banco de produção linha a linha, logs de execução, testes de carga, testes de invasão, conteúdo do `.env.local` |
>
> O mapa é uma **referência**, não garantia de que o código continua igual. Se algo divergir, investigue o código atual e atualize este arquivo (veja a [rotina de manutenção](CHANGE_GUIDE.md#rotina-obrigatória-para-cada-tarefa)).

## Documentos

| Documento | Para quê |
|---|---|
| [PROJECT_MAP.md](PROJECT_MAP.md) (este) | Arquitetura, módulos com identificadores, rotas, tabelas e dependências |
| [CHANGE_GUIDE.md](CHANGE_GUIDE.md) | Onde mexer para cada tipo de mudança, o que revisar junto e a rotina obrigatória para a IA |
| [SECURITY_STATUS.md](SECURITY_STATUS.md) | Diagnóstico de segurança com classificação e evidências |
| [WORK_PLAN.md](WORK_PLAN.md) | Tarefas priorizadas (correções necessárias e melhorias opcionais) |
| [PROJECT_STATUS.md](PROJECT_STATUS.md) e `docs/PHASE_*.md` | **Histórico** das fases de desenvolvimento (v0.3.x a 10.0). Úteis para contexto, mas podem estar desatualizados |

Instruções para agentes de IA: [`AGENTS.md`](../AGENTS.md) (o `CLAUDE.md` apenas o importa).

---

## 1. Arquitetura confirmada

| Camada | Tecnologia | Versão | Onde está confirmado |
|---|---|---|---|
| Framework | Next.js (App Router, Turbopack) | 16.2.6 | [`package.json`](../package.json) |
| UI | React / React DOM | 19.2.4 | `package.json` |
| Estilo | Tailwind CSS v4 + `@tailwindcss/postcss` | ^4 | `package.json`, [`postcss.config.mjs`](../postcss.config.mjs) |
| Linguagem | TypeScript | ^5 | [`tsconfig.json`](../tsconfig.json) |
| Banco, Auth, Storage | Supabase (`@supabase/ssr` ^0.10.3, `@supabase/supabase-js` ^2.106.2) | — | `package.json`; projeto **Saude-e-Bem** (região us-east-2, plano Pro) visto no painel Supabase |
| Hospedagem | Vercel (projeto `quim-link/saude-e-bem`) | — | [`vercel.json`](../vercel.json); painel Vercel; deployments `Production` e `Preview` vistos via API do GitHub |
| Repositório | GitHub `RenatoOliveira2026/Saude-e-Bem` | — | **Público**, branch padrão `master`, **sem proteção de branch**, **sem GitHub Actions** (confirmado via API) |
| Pagamentos | Mercado Pago (Checkout Pro + Preapproval) | API REST | [`src/lib/payments/mercadopago/`](../src/lib/payments/mercadopago/) |
| E-mail marketing | Brevo (ativo); MailerLite e ConvertKit como alternativas | API REST | [`src/lib/brevo/`](../src/lib/brevo/), [`src/lib/email/providers/`](../src/lib/email/providers/) |
| WhatsApp | WhatsApp Cloud API (Meta) | API REST | [`src/lib/whatsapp/`](../src/lib/whatsapp/) |
| Analytics/Ads | GA4, GTM, Meta Pixel, Google AdSense | scripts | [`src/lib/analytics/`](../src/lib/analytics/), [`src/lib/ads/config.ts`](../src/lib/ads/config.ts) |

**Não existem:** Edge Functions do Supabase (não há `supabase/functions/`), suíte de testes automatizados (não há Jest/Vitest/Playwright), pipeline de CI no GitHub. A publicação acontece pela integração Git da Vercel: **push em `master` → deploy de produção**; outros branches → deploy de preview.

### Fluxo de uma requisição

1. [`src/proxy.ts`](../src/proxy.ts) (o "middleware" do Next 16) roda em toda rota fora de estáticos: rejeita caminhos inválidos, atualiza a sessão Supabase ([`src/lib/supabase/middleware.ts`](../src/lib/supabase/middleware.ts)) e redireciona para `/entrar` quem acessa rota privada sem login (lista em [`src/lib/auth/routes.ts`](../src/lib/auth/routes.ts)).
2. Páginas são Server Components. Leem dados por repositórios ([`src/lib/data/repositories/`](../src/lib/data/repositories/)) e serviços ([`src/lib/supabase/services/`](../src/lib/supabase/services/)) com o cliente do usuário ([`src/lib/supabase/server.ts`](../src/lib/supabase/server.ts)), sujeito a RLS.
3. Se o Supabase falhar ou vier vazio, vários repositórios caem para **dados locais** ([`src/lib/data/*.ts`](../src/lib/data/), [`src/lib/content-engine/seed/`](../src/lib/content-engine/seed/)) via [`fallback.ts`](../src/lib/supabase/services/fallback.ts).
4. Escritas usam **Server Actions** (`"use server"`) ou **Route Handlers** (`src/app/api/**/route.ts`).
5. Operações privilegiadas (pagamentos, CRM, crons) usam a **service role** ([`service-role.ts`](../src/lib/supabase/service-role.ts), [`payments/admin-client.ts`](../src/lib/payments/admin-client.ts)), que **ignora RLS**.

### Estrutura de pastas

```
src/
├── app/            # Rotas (páginas, admin, API, sitemap, robots)
├── components/     # UI por domínio (admin, club, payments, protocols…)
├── lib/            # Regras de negócio, serviços, integrações (um diretório por domínio)
├── proxy.ts        # Middleware: sessão + guarda de rotas
└── instrumentation.ts  # Ajuste de TLS só em desenvolvimento
supabase/
├── migrations/     # 001…051 — SQL aplicado manualmente (ver §4)
└── scripts/        # grant-admin.sql
scripts/            # Seeds, auditorias e verificações (Node) — vários tocam produção
public/             # Estáticos, manifest, service worker
docs/               # Esta documentação + histórico de fases
```

### Perfis de acesso

| Perfil | Como é definido | Onde é checado |
|---|---|---|
| Visitante | Sem sessão | `proxy.ts` (rotas privadas) |
| Usuário logado | Sessão Supabase Auth | `requireUser()` / `getCurrentUser()` em [`src/lib/auth/session.ts`](../src/lib/auth/session.ts) |
| Assinante Premium | Assinatura ativa em `subscriptions` **ou**, sem assinatura, `profiles.plan`/`membership_tier` | [`src/lib/club/access.ts`](../src/lib/club/access.ts) (`getClubMembership`), [`PremiumContentGuard`](../src/components/club/PremiumContentGuard.tsx), função SQL `user_has_active_premium` |
| Admin | Linha em `admin_users` com `role = admin` | [`src/lib/admin/session.ts`](../src/lib/admin/session.ts) (`requireAdmin`, `requireAdminPermission`), função SQL `is_admin()` |
| Super Admin | `admin_users.role = super_admin` | `requireSuperAdmin()`; permissões em [`src/lib/admin/roles.ts`](../src/lib/admin/roles.ts) |

Permissões de admin: `manage_content`, `manage_platform_users` (admin e super), `manage_admins`, `global_settings` (só super). **Não há multiempresa** (sem tenants): o isolamento é por usuário (`auth.uid() = user_id`) e por papel de admin.

---

## 2. Módulos

Identificadores estáveis. Não renomeie; ao criar módulo novo, use o próximo número do prefixo.

### AUTH — Autenticação

| ID | AUTH-001 — Cadastro, login, logout, recuperação de senha |
|---|---|
| Rotas | `/cadastro`, `/entrar`, `/recuperar-senha`, `/redefinir-senha`, `/auth/callback`, `/auth/verify`, `/completar-cadastro` (ver COBRANCA-001) |
| Arquivos | [`src/lib/auth/actions.ts`](../src/lib/auth/actions.ts) (`signUp`, `signIn`, `signOut`, `resetPassword`, `updatePassword`, `updateProfile`), [`session.ts`](../src/lib/auth/session.ts), [`safe-redirect.ts`](../src/lib/auth/safe-redirect.ts), [`callback-url.ts`](../src/lib/auth/callback-url.ts), [`recovery-session.ts`](../src/lib/auth/recovery-session.ts), [`errors.ts`](../src/lib/auth/errors.ts), [`src/components/auth/`](../src/components/auth/) |
| Servidor | Server Actions acima; trigger SQL `handle_new_user` cria `profiles` + `user_preferences` |
| Tabelas | `auth.users`, `profiles`, `user_preferences` |
| Permissões | Público (cadastro/login); logado (logout, troca de senha, perfil) |
| Depende de | Supabase Auth; SMTP configurado no Supabase (`AUTH_SMTP_SENDER`) |
| Testes | Nenhum automatizado. Scripts manuais [`scripts/test-signin.mjs`](../scripts/test-signin.mjs), [`scripts/test-signup.mjs`](../scripts/test-signup.mjs) (**criam/alteram usuários reais**) |

| ID | AUTH-002 — Guarda de rotas e sessão (proxy) |
|---|---|
| Arquivos | [`src/proxy.ts`](../src/proxy.ts), [`src/lib/auth/routes.ts`](../src/lib/auth/routes.ts), [`src/lib/supabase/middleware.ts`](../src/lib/supabase/middleware.ts), [`src/lib/seo/slug.ts`](../src/lib/seo/slug.ts) |
| Comportamento | Rotas privadas e `/admin*` exigem login; `/dev-login` bloqueado em produção; `/admin/setup` redireciona; autorização de admin é feita **na página**, não no proxy |
| Testes | Nenhum |

| ID | AUTH-003 — Dev-login (somente desenvolvimento) |
|---|---|
| Rota | `/dev-login` |
| Arquivos | [`src/lib/auth/dev-login.ts`](../src/lib/auth/dev-login.ts), [`dev-login.actions.ts`](../src/lib/auth/dev-login.actions.ts), [`src/lib/supabase/dev-admin.ts`](../src/lib/supabase/dev-admin.ts) |
| Observação | Usa service role para criar/atualizar o usuário de desenvolvimento e sugere SQL para torná-lo super admin. **Risco crítico** registrado em [SECURITY_STATUS](SECURITY_STATUS.md#s-01) |

### ADMIN — Painel administrativo

| ID | ADMIN-001 — Shell do painel e controle de acesso |
|---|---|
| Rotas | `/admin` (dashboard) e layout [`src/app/admin/layout.tsx`](../src/app/admin/layout.tsx) |
| Arquivos | [`src/lib/admin/session.ts`](../src/lib/admin/session.ts), [`roles.ts`](../src/lib/admin/roles.ts), [`nav.ts`](../src/lib/admin/nav.ts), [`services/dashboard.service.ts`](../src/lib/admin/services/dashboard.service.ts), [`system-health.service.ts`](../src/lib/admin/services/system-health.service.ts), [`src/components/admin/`](../src/components/admin/) |
| Tabelas/funções | `admin_users`, `is_admin()`, `is_super_admin()`, `get_admin_role()` |
| Permissões | `requireAdmin()` no layout e em cada página |

| ID | ADMIN-002 — Administradores e configurações globais |
|---|---|
| Rotas | `/admin/administradores`, `/admin/configuracoes` |
| Arquivos | [`admins.service.ts`](../src/lib/admin/services/admins.service.ts), [`supabase/scripts/grant-admin.sql`](../supabase/scripts/grant-admin.sql) |
| Permissões | `requireSuperAdmin()`; novos admins são concedidos por SQL (não há tela de escrita) |

| ID | ADMIN-003 — Usuários da plataforma e memberships |
|---|---|
| Rotas | `/admin/usuarios`, `/admin/memberships` |
| Arquivos | [`users.service.ts`](../src/lib/admin/services/users.service.ts), [`src/lib/membership/`](../src/lib/membership/) |
| Tabelas | `profiles`, `subscriptions`, `user_memberships`, `membership_plans` |
| Permissões | `manage_platform_users` |

### CONTEUDO — Conteúdo editorial

| ID | CONTEUDO-001 — Artigos (blog) |
|---|---|
| Rotas | Público: `/blog`, `/blog/[slug]`. Admin: `/admin/artigos`, `/novo`, `/[id]/editar`, `/admin/conteudos` |
| Arquivos | [`src/lib/data/repositories/blog.repository.ts`](../src/lib/data/repositories/blog.repository.ts), [`src/lib/supabase/services/articles.service.ts`](../src/lib/supabase/services/articles.service.ts), [`src/lib/admin/actions/articles.actions.ts`](../src/lib/admin/actions/articles.actions.ts), [`src/lib/admin/services/articles.service.ts`](../src/lib/admin/services/articles.service.ts), [`src/components/content/ContentBlockRenderer.tsx`](../src/components/content/ContentBlockRenderer.tsx), [`src/lib/blog/`](../src/lib/blog/) |
| Tabelas | `articles` (RLS: público lê `published`; admin escreve) |
| Permissões | Leitura pública; premium via CLUBE-002; edição `manage_content` |
| Depende de | CLUBE-002, AFILIADOS-001 (produtos no fim), SEO-001, ANALYTICS-001 |

| ID | CONTEUDO-002 — Protocolos |
|---|---|
| Rotas | `/protocolos`, `/protocolos/[slug]`, `/protocolos/painel`, `/protocolos/recentes`, API `GET /api/protocolos/[slug]/lembretes`. Admin: `/admin/protocolos*` |
| Arquivos | [`src/lib/data/repositories/protocols.repository.ts`](../src/lib/data/repositories/protocols.repository.ts), [`src/lib/data/protocol-guides.ts`](../src/lib/data/protocol-guides.ts), [`src/lib/protocols/reminders-calendar.ts`](../src/lib/protocols/reminders-calendar.ts), [`src/lib/protocol-library/`](../src/lib/protocol-library/), [`src/lib/intelligent-protocols/`](../src/lib/intelligent-protocols/), [`src/components/protocols/`](../src/components/protocols/), [`protocols.actions.ts`](../src/lib/admin/actions/protocols.actions.ts) |
| Tabelas/funções | `protocols`, `protocol_categories`, `user_protocol_history`, `record_protocol_view()` |
| Permissões | Leitura pública; premium via CLUBE-002; painel/recentes exigem login; edição `manage_content` |

| ID | CONTEUDO-003 — Biblioteca (e-books, guias, itens) |
|---|---|
| Rotas | `/biblioteca`, `/biblioteca/[slug]`, `/guia-30-dias`, `/checklist-habitos`. Admin: `/admin/biblioteca*`, `/admin/biblioteca-itens*` |
| Arquivos | [`src/lib/intelligent-library/`](../src/lib/intelligent-library/), [`src/lib/supabase/services/ebooks.service.ts`](../src/lib/supabase/services/ebooks.service.ts), [`library-items.public.ts`](../src/lib/supabase/services/library-items.public.ts), [`ebooks.actions.ts`](../src/lib/admin/actions/ebooks.actions.ts), [`library-items.actions.ts`](../src/lib/admin/actions/library-items.actions.ts) |
| Tabelas | `ebooks`, `library_items`, `user_downloads` |
| Recursos | Bucket `cms-pdfs` (**público**) |

| ID | CONTEUDO-004 — Upload de mídia |
|---|---|
| Arquivos | [`src/lib/admin/actions/upload.actions.ts`](../src/lib/admin/actions/upload.actions.ts), [`src/lib/admin/services/storage.service.ts`](../src/lib/admin/services/storage.service.ts), [`src/components/admin/cms/`](../src/components/admin/cms/) |
| Recursos | Buckets `cms-images` (público, 5 MB, inclui SVG) e `cms-pdfs` (público, 50 MB) — confirmados no painel |
| Permissões | `manage_content` + políticas de Storage com `is_admin()` |

### FERRAMENTAS e JORNADA — Experiência do usuário

| ID | FERRAMENTAS-001 — Calculadoras, quiz e perfil de saúde |
|---|---|
| Rotas | `/ferramentas`, `/ferramentas/[slug]`, `/minha-saude` |
| Arquivos | [`src/lib/tools/`](../src/lib/tools/) (IMC, água, proteína, metabolismo basal, risco cardiometabólico, quiz), [`src/lib/health-profile/`](../src/lib/health-profile/), [`src/components/tools/`](../src/components/tools/), [`src/components/health-profile/`](../src/components/health-profile/) |
| Servidor | `saveToolResultAction` ([`save-tool-result.action.ts`](../src/lib/health-profile/actions/save-tool-result.action.ts)); RPC `save_user_tool_result` |
| Tabelas | `user_tool_results` |
| Permissões | Calculadoras públicas; salvar resultado exige login (via RLS/RPC) |

| ID | JORNADA-001 — Minha Jornada, onboarding e perfil |
|---|---|
| Rotas | `/minha-jornada`, `/onboarding`, `/perfil` |
| Arquivos | [`src/lib/journey/`](../src/lib/journey/), [`src/lib/onboarding/`](../src/lib/onboarding/), [`src/lib/engagement/`](../src/lib/engagement/), [`src/lib/loyalty/`](../src/lib/loyalty/), [`src/lib/favorites/`](../src/lib/favorites/) |
| Tabelas | `profiles`, `user_preferences`, `favorites`, `user_content_history` |
| Permissões | Logado |

### CLUBE — Assinatura premium

| ID | CLUBE-001 — Clube público e área de membros |
|---|---|
| Rotas | Público: `/clube`, `/clube/premium`. Membros: `/clube/dashboard`, `/beneficios`, `/downloads`, `/favoritos`, `/historico`, `/perfil`, `/protocolos-salvos`, `/recomendacoes`, `/recomendacoes-ia`, `/trilhas` (grupo [`src/app/clube/(membros)/`](../src/app/clube/%28membros%29/)) |
| Arquivos | [`src/lib/club/`](../src/lib/club/), [`src/lib/premium/`](../src/lib/premium/), [`src/components/club/`](../src/components/club/), [`src/components/campaign/FounderCampaign.tsx`](../src/components/campaign/FounderCampaign.tsx) |
| Servidor | Actions em [`src/lib/club/actions/`](../src/lib/club/actions/) (acesso, download, favorito, protocolo salvo) |
| Tabelas/funções | `subscriptions`, `user_saved_protocols`, `user_content_access`, `user_content_history`, `user_downloads`, `content_rankings`, `get_user_recommendations()`, `refresh_content_rankings()`, `touch_club_joined()` |
| Permissões | Membros: logado (proxy) + premium na página |

| ID | CLUBE-002 — Controle de acesso premium |
|---|---|
| Arquivos | [`src/lib/club/access.ts`](../src/lib/club/access.ts), [`src/components/club/PremiumContentGuard.tsx`](../src/components/club/PremiumContentGuard.tsx), [`src/lib/subscription/`](../src/lib/subscription/), [`src/lib/payments/guards.ts`](../src/lib/payments/guards.ts) |
| Regra | Com linha em `subscriptions`, vale o período pago; sem assinatura, vale `profiles.plan`/`membership_tier` (inclui `admin`) |
| Tabelas/funções | `subscriptions`, `profiles`, `user_has_active_premium()`, `sync_profile_membership_tier()` (trigger), `expire_due_subscriptions()` |
| Riscos | Ver [S-02](SECURITY_STATUS.md#s-02) e [S-04](SECURITY_STATUS.md#s-04) |

### PAGAMENTOS — Mercado Pago

| ID | PAGAMENTOS-001 — Checkout e criação de assinatura |
|---|---|
| Rotas | `/assinar`; API `POST /api/payments/create-checkout`, `POST /api/payments/create-subscription` |
| Arquivos | [`src/lib/payments/mercadopago/checkout.ts`](../src/lib/payments/mercadopago/checkout.ts), [`preapproval.ts`](../src/lib/payments/mercadopago/preapproval.ts), [`plans.ts`](../src/lib/payments/plans.ts), [`pricing.ts`](../src/lib/payments/pricing.ts) (**fonte única de preço**), [`founder.ts`](../src/lib/payments/founder.ts), [`coupons/`](../src/lib/payments/coupons/), [`src/components/payments/`](../src/components/payments/) |
| Tabelas | `payments`, `subscriptions`, `membership_plans`, `discount_coupons`, `discount_coupon_redemptions` |
| Permissões | Logado + perfil de cobrança completo (COBRANCA-001) |
| Integrações | `MERCADOPAGO_ACCESS_TOKEN`, `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` |

| ID | PAGAMENTOS-002 — Webhook, sincronização, reconciliação e crons |
|---|---|
| Rotas | `POST/GET /api/payments/webhook`, `POST /api/payments/sync`, `POST/GET /api/admin/payments/reconcile`, crons `/api/payments/cron/subscriptions` (06h UTC) e `/api/payments/cron/reconcile-pending` (09h UTC) |
| Arquivos | [`webhook.ts`](../src/lib/payments/mercadopago/webhook.ts), [`webhook-auth.ts`](../src/lib/payments/mercadopago/webhook-auth.ts), [`signature.ts`](../src/lib/payments/mercadopago/signature.ts), [`ipn.ts`](../src/lib/payments/mercadopago/ipn.ts), [`reconcile.ts`](../src/lib/payments/mercadopago/reconcile.ts), [`src/lib/payments/services/`](../src/lib/payments/services/), [`src/lib/cron/auth.ts`](../src/lib/cron/auth.ts) |
| Tabelas | `payments`, `payment_webhook_events`, `subscriptions`, `user_memberships`, `financial_events`, `profiles` (via trigger) |
| Permissões | Webhook: assinatura HMAC ou IPN (ver [S-06](SECURITY_STATUS.md#s-06)); crons: `CRON_SECRET`/`PAYMENTS_CRON_SECRET`; sync: dono do pagamento |
| Testes | Scripts manuais (`scripts/smoke-subscriptions.mjs`, `reconcile-pending-payments.mjs`, `probe-production-webhook.mjs`) — **tocam produção** |

| ID | PAGAMENTOS-003 — Minha assinatura e cancelamento |
|---|---|
| Rotas | `/minha-assinatura`; API `GET /api/payments/status`, `POST /api/payments/cancel-subscription` |
| Arquivos | [`subscriptions.service.ts`](../src/lib/payments/services/subscriptions.service.ts), [`subscription-lifecycle.service.ts`](../src/lib/payments/services/subscription-lifecycle.service.ts), [`src/components/payments/SubscriptionDashboard.tsx`](../src/components/payments/SubscriptionDashboard.tsx), [`FinancialHistoryList.tsx`](../src/components/payments/FinancialHistoryList.tsx) |
| Permissões | Logado (só a própria assinatura) |

| ID | PAGAMENTOS-004 — Financeiro (admin) |
|---|---|
| Rotas | `/admin/financeiro`; API `GET /api/admin/finance/export` |
| Arquivos | [`src/lib/admin/services/finance.service.ts`](../src/lib/admin/services/finance.service.ts) |
| Tabelas/funções | `payments`, `financial_events`, `get_finance_dashboard_stats()` (checa `is_admin()`) |
| Permissões | `requireAdmin()` / `getAdminSession()` |

| ID | PAGAMENTOS-005 — Simulação de pagamento (modo stub) |
|---|---|
| Arquivos | [`src/lib/payments/actions/simulate.actions.ts`](../src/lib/payments/actions/simulate.actions.ts), [`src/components/payments/StubCheckoutPanel.tsx`](../src/components/payments/StubCheckoutPanel.tsx) |
| Observação | Server Action **sem verificação de usuário**; bloqueio depende de configuração ([S-03](SECURITY_STATUS.md#s-03)) |

| ID | COBRANCA-001 — Perfil de cobrança |
|---|---|
| Rotas | `/completar-cadastro`; API `GET /api/billing/profile-status` |
| Arquivos | [`src/lib/billing/`](../src/lib/billing/) (`actions.ts`, `validators.ts`, `guards.ts`, `profile.ts`) |
| Tabelas | `profiles` (nome completo, CPF, celular, endereço) — **dados pessoais** |
| Permissões | `requireUser()` |

### LEADS, CRM e comunicação

| ID | LEADS-001 — Newsletter, captação e landing pages |
|---|---|
| Rotas | Formulários em várias páginas; `/obrigado`, `/obrigado-newsletter`, `/lp-emagrecimento`, `/lp-hidratacao`, `/lp-longevidade`, `/lp-sono`, `/lancamento`. Admin: `/admin/newsletter`, `/admin/leads`, `/admin/leads/[id]`; exports `/api/admin/newsletter/export`, `/api/admin/leads/export` |
| Arquivos | [`src/lib/actions/newsletter.actions.ts`](../src/lib/actions/newsletter.actions.ts), [`src/lib/leads/`](../src/lib/leads/), [`src/lib/newsletter/`](../src/lib/newsletter/), [`src/lib/conversion/`](../src/lib/conversion/), [`src/components/leads/`](../src/components/leads/), [`src/components/newsletter/`](../src/components/newsletter/) |
| Tabelas/funções | `newsletter_subscribers`, `newsletter_leads`, `capture_newsletter_lead()` |
| Permissões | Captura pública (sem limite de taxa); listas e exports só admin |

| ID | LEADS-002 — CRM, automação de e-mail e Brevo |
|---|---|
| Rotas | Cron `/api/cron/automation` (08h UTC); admin `/admin/conversao`, `/admin/crescimento` |
| Arquivos | [`src/lib/crm/`](../src/lib/crm/), [`src/lib/email-automation/`](../src/lib/email-automation/) (o dispatcher **só registra etapas, não envia**), [`src/lib/brevo/`](../src/lib/brevo/), [`src/lib/email/`](../src/lib/email/) |
| Tabelas | `lead_interactions`, `lead_automation_runs`, `newsletter_leads` |
| Externos | Brevo: listas 3 (newsletter), leads e premium; a **sequência de boas-vindas roda dentro do Brevo** (automação "Mensagem de boas-vindas"), não no código |

| ID | WHATSAPP-001 — WhatsApp Cloud API |
|---|---|
| Rotas | `GET/POST /api/webhooks/whatsapp`, cron `/api/cron/whatsapp-automation` (07h UTC); admin `/admin/comunicacao`, `/admin/comunicacao/templates` |
| Arquivos | [`src/lib/whatsapp/`](../src/lib/whatsapp/) (assinatura em [`signature.ts`](../src/lib/whatsapp/signature.ts)) |
| Tabelas/funções | `whatsapp_templates`, `whatsapp_messages`, `whatsapp_automation_runs`, `get_whatsapp_dashboard_stats()` |
| Situação | Variáveis `WHATSAPP_ACCESS_TOKEN`/`WHATSAPP_PHONE_NUMBER_ID` **não aparecem** na lista de variáveis da Vercel: integração de envio provavelmente inativa (não verificado em execução) |

### Monetização complementar

| ID | AFILIADOS-001 — Produtos afiliados e recomendados |
|---|---|
| Rotas | `/recomendados`, `/recomendados/[slug]`, redirecionamento `GET /api/affiliates/[slug]/go`. Admin: `/admin/afiliados*` |
| Arquivos | [`src/lib/affiliates/`](../src/lib/affiliates/) (inclui [`editorial-picks.ts`](../src/lib/affiliates/editorial-picks.ts) e [`placeholder.ts`](../src/lib/affiliates/placeholder.ts)), [`affiliates.public.ts`](../src/lib/supabase/services/affiliates.public.ts), [`affiliates.clicks.ts`](../src/lib/supabase/services/affiliates.clicks.ts), [`affiliates.actions.ts`](../src/lib/admin/actions/affiliates.actions.ts), [`src/components/affiliates/`](../src/components/affiliates/) |
| Tabelas | `affiliate_links`, `affiliate_clicks` |
| Externos | Amazon Associados (tag no próprio link), Hotmart |

| ID | MARKETPLACE-001 — Marketplace |
|---|---|
| Rotas | `/marketplace`, `/marketplace/[slug]`. Admin: `/admin/marketplace*` |
| Arquivos | [`src/lib/marketplace/marketplace.service.ts`](../src/lib/marketplace/marketplace.service.ts) (filtro de itens publicáveis), [`src/lib/marketplace/`](../src/lib/marketplace/), [`marketplace-products.public.ts`](../src/lib/supabase/services/marketplace-products.public.ts), [`marketplace.actions.ts`](../src/lib/admin/actions/marketplace.actions.ts) |
| Tabelas | `marketplace_products`, `affiliate_links` |
| Depende de | AFILIADOS-001, PAGAMENTOS-001 (preço do Clube), CONTEUDO-003 |

| ID | MARKETING-001 — Contas sociais, anúncios e página "Anuncie" |
|---|---|
| Rotas | `/admin/marketing`, `/anuncie`, `/ads.txt` |
| Arquivos | [`src/lib/marketing/`](../src/lib/marketing/), [`marketing.actions.ts`](../src/lib/admin/actions/marketing.actions.ts), [`src/lib/ads/config.ts`](../src/lib/ads/config.ts), [`src/components/ads/`](../src/components/ads/), [`src/components/marketing/`](../src/components/marketing/) |
| Tabelas | `marketing_settings` |

### Plataforma

| ID | RECOMENDACOES-001 — Motor de recomendações |
|---|---|
| Rotas | `/clube/recomendacoes`, `/clube/recomendacoes-ia`, `/admin/recomendacoes` |
| Arquivos | [`src/lib/recommendation-engine/`](../src/lib/recommendation-engine/), [`src/lib/recommendations/`](../src/lib/recommendations/), [`intelligent-recommendations.service.ts`](../src/lib/club/services/intelligent-recommendations.service.ts) |
| Tabelas/funções | `content_rankings`, `user_content_history`, `get_user_recommendations()` |

| ID | ANALYTICS-001 — Eventos e métricas |
|---|---|
| Rotas | `/admin/analytics`, `/admin/crescimento`, `/admin/conversao`, `/admin/lancamento` |
| Arquivos | [`src/lib/analytics/`](../src/lib/analytics/) (`actions.ts` com sanitização), [`src/components/analytics/`](../src/components/analytics/), [`analytics.service.ts`](../src/lib/admin/services/analytics.service.ts), [`growth.service.ts`](../src/lib/admin/services/growth.service.ts) |
| Tabelas | `analytics_events` (insert público), `affiliate_clicks` |

| ID | SEO-001 — SEO, sitemap e páginas institucionais |
|---|---|
| Rotas | `/sitemap.xml` ([`src/app/sitemap.ts`](../src/app/sitemap.ts)), `/robots.txt` ([`robots.ts`](../src/app/robots.ts)), `/privacidade`, `/termos`, `/cookies`, `/politica-editorial`, `/` (home) |
| Arquivos | [`src/lib/seo/`](../src/lib/seo/), [`src/components/seo/JsonLd.tsx`](../src/components/seo/JsonLd.tsx), [`src/lib/content/`](../src/lib/content/) |

| ID | PWA-001 — App instalável |
|---|---|
| Rotas | `/offline`, `public/manifest.json`, `public/sw.js` |
| Arquivos | [`src/lib/pwa/config.ts`](../src/lib/pwa/config.ts), [`src/components/pwa/`](../src/components/pwa/), cabeçalhos em [`next.config.ts`](../next.config.ts) |

---

## 3. API e Server Actions (inventário)

| Endpoint | Método | Proteção encontrada no código | Módulo |
|---|---|---|---|
| `/api/admin/finance/export` | GET | `getAdminSession()` | PAGAMENTOS-004 |
| `/api/admin/leads/export` | GET | `getAdminSession()` | LEADS-001 |
| `/api/admin/newsletter/export` | GET | `getAdminSession()` | LEADS-001 |
| `/api/admin/payments/reconcile` | POST/GET | Admin **ou** segredo de cron **ou** service role no `Authorization` | PAGAMENTOS-002 |
| `/api/affiliates/[slug]/go` | GET | Público (registra clique) | AFILIADOS-001 |
| `/api/billing/profile-status` | GET | Público (responde só sobre o próprio usuário) | COBRANCA-001 |
| `/api/cron/automation` | GET/POST | `isCronAuthorized` + `LEAD_AUTOMATION_CRON_SECRET` | LEADS-002 |
| `/api/cron/whatsapp-automation` | GET/POST | Segredo de cron | WHATSAPP-001 |
| `/api/payments/cancel-subscription` | POST | `getCurrentUser()` | PAGAMENTOS-003 |
| `/api/payments/create-checkout` | POST | Usuário logado | PAGAMENTOS-001 |
| `/api/payments/create-subscription` | POST | Usuário logado | PAGAMENTOS-001 |
| `/api/payments/cron/reconcile-pending` | GET/POST | `isCronAuthorized` (aceita service role) | PAGAMENTOS-002 |
| `/api/payments/cron/subscriptions` | GET/POST | `isCronAuthorized` | PAGAMENTOS-002 |
| `/api/payments/status` | GET | `getCurrentUser()` | PAGAMENTOS-003 |
| `/api/payments/sync` | POST | `getCurrentUser()` + dono do pagamento | PAGAMENTOS-002 |
| `/api/payments/webhook` | POST/GET | HMAC `x-signature` **ou** IPN aceito sem assinatura | PAGAMENTOS-002 |
| `/api/protocolos/[slug]/lembretes` | GET | Público | CONTEUDO-002 |
| `/api/webhooks/whatsapp` | GET/POST | Token de verificação + HMAC do app | WHATSAPP-001 |

Server Actions (`"use server"`): admin em [`src/lib/admin/actions/`](../src/lib/admin/actions/) (todas com `requireAdminPermission`); usuário em `src/lib/auth/actions.ts`, `src/lib/billing/actions.ts`, `src/lib/club/actions/*` (`requireUser`/`getCurrentUser`); públicas: `newsletter.actions.ts`, `leads/actions/save-lead.action.ts`, `analytics/actions.ts`, `health-profile/actions/save-tool-result.action.ts`; **sem guarda**: `payments/actions/simulate.actions.ts`.

---

## 4. Banco de dados (Supabase / PostgreSQL)

**Origem:** migrações em [`supabase/migrations/`](../supabase/migrations/) (001–051; há dois arquivos com prefixo `037`). **Não há controle automático de migrações**: não existe `supabase/config.toml` nem histórico da CLI, e as migrações vêm sendo aplicadas manualmente pelo SQL Editor. Portanto, **o código das migrações não prova o estado do banco**. Divergência já observada: a política `Users can update own profile` está no banco aplicada ao papel `public`, enquanto a migração 001 usa `authenticated`.

### Tabelas (36 nas migrações; todas com RLS habilitada no SQL)

| Grupo | Tabelas | Migração de origem |
|---|---|---|
| Usuários | `profiles`, `user_preferences`, `favorites`, `admin_users` | 001, 002, 004 |
| Conteúdo | `articles`, `protocols`, `ebooks`, `library_items`, `protocol_categories`, `content_rankings` | 002, 018, 019, 024 |
| Atividade do usuário | `user_downloads`, `user_saved_protocols`, `user_content_access`, `user_content_history`, `user_protocol_history`, `user_tool_results` | 014, 017–020 |
| Pagamentos/assinatura | `subscriptions`, `payments`, `payment_webhook_events`, `financial_events`, `discount_coupons`, `discount_coupon_redemptions`, `membership_plans`, `user_memberships` | 014–016, 029, 030, 036 |
| Leads/CRM | `newsletter_leads`, `newsletter_subscribers`, `lead_interactions`, `lead_automation_runs` | 009, 012, 028 |
| Afiliados/marketplace | `affiliate_links`, `affiliate_clicks`, `marketplace_products` | 008, 011, 024 |
| Comunicação | `whatsapp_templates`, `whatsapp_messages`, `whatsapp_automation_runs` | 031 |
| Analytics/config | `analytics_events`, `marketing_settings` | 013, 050 |

Relacionamentos principais: quase todas as tabelas de usuário têm `user_id → auth.users(id)`; `payments` e `subscriptions` ligam-se por `user_id` e `external_reference`/`mercadopago_preapproval_id`; `affiliate_clicks.affiliate_id → affiliate_links(id)`; `marketplace_products.affiliate_slug`/`library_slug` referenciam por slug (sem chave estrangeira).

### Funções SQL (20)

`SECURITY DEFINER`: `handle_new_user`, `is_admin`, `is_super_admin`, `get_admin_role`, `ensure_bootstrap_admin`, `user_has_active_premium`, `sync_profile_membership_tier`, `touch_club_joined`, `expire_due_subscriptions`, `refresh_content_rankings`, `get_user_recommendations`, `record_protocol_view`, `save_user_tool_result`, `lead_score_rank`, `capture_newsletter_lead`, `get_finance_dashboard_stats`, `get_whatsapp_dashboard_stats`. Demais: `handle_updated_at`, `touch_updated_at`, `is_published_content`.

### Triggers confirmados no banco (painel, 03/11/2026)

`*_updated_at` em `articles`, `ebooks`, `library_items`, `marketplace_products`, `newsletter_subscribers`, `payments`, `profiles`, `protocols`, `subscriptions`, `user_saved_protocols`; `subscriptions_sync_profile` (AFTER INSERT/UPDATE em `subscriptions` → `sync_profile_membership_tier`). **Nenhum trigger protege colunas de plano em `profiles`.**

### Storage (confirmado no painel)

| Bucket | Público | Limite | Tipos | Políticas |
|---|---|---|---|---|
| `cms-images` | Sim | 5 MB | jpeg, png, webp, gif, **svg** | Leitura pública; escrita `is_admin()` |
| `cms-pdfs` | Sim | 50 MB | pdf | Leitura pública; escrita `is_admin()` |

---

## 5. Ambientes, variáveis e publicação

| Ambiente | Onde | Banco | Observação |
|---|---|---|---|
| Desenvolvimento | `npm run dev` (porta 3001 via `.env.local`) | Projeto Supabase definido no `.env.local` (não inspecionado) | A organização Supabase tem **um único** projeto "Saude-e-Bem": tudo indica que dev usa o banco de produção |
| Preview | Vercel, a cada push fora de `master` | O mesmo de produção | Várias variáveis secretas estão em "Production and Preview" |
| Produção | Vercel, push em `master` → `saudeebem.com.br` | Supabase "Saude-e-Bem" | Crons em [`vercel.json`](../vercel.json) |

Variáveis usadas no código (somente nomes): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `MERCADOPAGO_ACCESS_TOKEN`, `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`, `MERCADOPAGO_WEBHOOK_SECRET`, `MERCADOPAGO_STUB_MODE`, `MERCADOPAGO_USE_SANDBOX`, `PAYMENTS_PROVIDER`, `PAYMENTS_CRON_SECRET`, `CRON_SECRET`, `LEAD_AUTOMATION_CRON_SECRET`, `BREVO_API_KEY`, `BREVO_NEWSLETTER_LIST_ID`, `BREVO_LEADS_LIST_ID`, `BREVO_PREMIUM_LIST_ID`, `LEAD_ESP_PROVIDER`, `LEAD_ESP_LIVE_SYNC`, `NEWSLETTER_PROVIDER`, `EMAIL_PROVIDER`, `MAILERLITE_API_KEY`, `CONVERTKIT_API_KEY`, `RDSTATION_API_KEY`, `HUBSPOT_API_KEY`, `STRIPE_SECRET_KEY` (referência sem uso ativo), `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_BUSINESS_ACCOUNT_ID`, `WHATSAPP_APP_SECRET`, `WHATSAPP_WEBHOOK_VERIFY_TOKEN`, `WHATSAPP_CRON_SECRET`, `WHATSAPP_STUB_MODE`, `WHATSAPP_DEFAULT_COUNTRY_CODE`, `NEXT_PUBLIC_WHATSAPP_DISPLAY_NUMBER`, `AUTH_SMTP_SENDER`, `ZOHO_SMTP_USER`, `NEXT_PUBLIC_GA4_MEASUREMENT_ID`, `NEXT_PUBLIC_GTM_CONTAINER_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_ADSENSE_CLIENT`, `NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE`, `NEXT_PUBLIC_ADSENSE_SLOT_LISTING`, `NEXT_PUBLIC_SEARCH_CONSOLE_VERIFICATION`, `DEV_LOGIN_ENABLED`, `SUPABASE_STRICT_TLS`, `NODE_TLS_REJECT_UNAUTHORIZED`.

## 6. Verificações disponíveis

| Comando | O que faz | Seguro? |
|---|---|---|
| `npx tsc --noEmit -p .` | Checagem de tipos | Sim. Passou em 03/11/2026 |
| `npm run lint` | ESLint | Sim. **4 erros e 31 avisos** em 03/11/2026 (regras `react-hooks`, ver WORK_PLAN) |
| `npm run build` | Build de produção (precisa acessar Google Fonts) | Sim |
| `npm audit --omit=dev` | Vulnerabilidades de dependências | Sim. 1 crítica (next), 4 altas, 1 moderada |
| `npm run audit:seo`, `audit:go-live`, `validate:supabase`, `validate:billing` | Auditorias por script | Leitura, mas **acessam serviços reais**; revisar antes de rodar |
| `npm run test:signup`, `check:auth-user`, `seed:*`, `reconcile:payments`, scripts `smoke-*`/`run-production-*` | Scripts operacionais | **Alteram dados ou chamam produção** — não usar como teste |

Não há testes automatizados (unitários, integração ou E2E).

## 7. Sugestões de padronização (não aplicadas)

- Há dois arquivos de migração com prefixo `037` (`037_phase_6_1_pricing.sql` e `037_seed_seo_articles_71a.sql`). Manter; numerar as próximas a partir de `052`.
- `README.md` e `docs/PROJECT_STATUS.md` descrevem `middleware.ts`; no Next 16 o arquivo é [`src/proxy.ts`](../src/proxy.ts).
- Diretórios com nomes próximos (`recommendations` × `recommendation-engine`, `protocols` × `protocol-library` × `intelligent-protocols`, `email` × `email-automation` × `brevo`) poderiam ser consolidados no futuro, sem urgência.
