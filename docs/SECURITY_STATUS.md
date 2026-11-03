# Saúde & Bem — Diagnóstico de segurança

> | Item | Valor |
> |---|---|
> | Data | 03/11/2026 |
> | Commit inspecionado | `900486528562cb1dd74868cee975342a3b4712da` |
> | Método | Leitura estática do código e das migrações; consulta **somente leitura** aos painéis Supabase (buckets, políticas de `profiles`, triggers, backups, MFA, proteção contra ataques, provedores), Vercel (nomes e ambientes das variáveis) e GitHub (visibilidade, proteção de branch, workflows); `npm audit`, `tsc` e `eslint` locais |
> | O que **não** foi feito | Nenhum teste que altere dados, envie mensagens, bloqueie contas ou gere custo. Nenhuma tentativa real de exploração. Nenhuma leitura do `.env.local` nem de valores de segredos |
>
> Índice: [PROJECT_MAP.md](PROJECT_MAP.md) · Tarefas: [WORK_PLAN.md](WORK_PLAN.md)

## Legenda

| Classificação | Significado |
|---|---|
| ✅ Verificado | Confirmado com evidência (código e/ou painel). **Inspeção não é teste executado**: quando só o código foi lido, isso é indicado |
| 🟡 Parcial | Existe, mas com lacunas |
| ❌ Não encontrado | Não existe no escopo inspecionado |
| ❔ Não verificado | Faltou acesso ou exigiria teste com efeito colateral |
| ➖ Não aplicável | Não se aplica ao projeto (com justificativa) |

---

## 1. Achados prioritários

<a id="s-01"></a>
### S-01 — Senha fixa da conta de super admin em repositório público · **CRÍTICO**

- **Evidência (código + GitHub):** [`src/lib/auth/dev-login.ts`](../src/lib/auth/dev-login.ts) define `DEV_LOGIN_EMAIL` (o e-mail do dono, que é `super_admin` por [`006_admin_roles.sql`](../supabase/migrations/006_admin_roles.sql)) e `DEV_LOGIN_PASSWORD` em texto puro. [`dev-login.actions.ts`](../src/lib/auth/dev-login.actions.ts) usa a service role para **criar o usuário ou redefinir a senha dele** com esse valor. O repositório está **público** (API do GitHub), então o valor está exposto também no histórico do Git.
- **Agravante (painel):** a organização Supabase tem um único projeto "Saude-e-Bem", o que indica que o desenvolvimento usa o banco de produção.
- **Mitigação existente:** `/dev-login` é bloqueado em produção (`proxy.ts` e `isDevLoginAllowed()`).
- **Não verificado:** se a senha atual da conta em produção é essa. Não foi testado, de propósito.
- **Ação imediata (dono):** trocar a senha da conta pelo próprio site e ativar MFA quando disponível (T-12). **Correção no código:** WORK_PLAN **T-01**.
- **Situação (03/11/2026):** correção de código feita na T-01 (credenciais só em variáveis locais, sem redefinir senha de contas reais ou de admins). **Risco residual:** o valor antigo segue no histórico público do Git até o dono confirmar a troca de senha; avaliar tornar o repositório privado.

<a id="s-02"></a>
### S-02 — Usuário pode se promover a Premium alterando o próprio perfil · **ALTO → RESOLVIDO (03/11/2026)**

- **Evidência (painel + código):** no banco de produção existe a política `Users can update own profile` (UPDATE em `profiles`, sem restrição de colunas) e **não há trigger** em `profiles` além de `profiles_updated_at`. `profiles.plan` aceita `premium_monthly`, `premium_annual` e `admin` ([`030_phase_5_5_monetization.sql`](../supabase/migrations/030_phase_5_5_monetization.sql)). Em [`src/lib/club/access.ts`](../src/lib/club/access.ts), quem **não tem linha em `subscriptions`** é premium se `profiles.plan`/`membership_tier` disser isso. A função SQL `user_has_active_premium` também confia em `profiles.plan`.
- **Consequência provável:** qualquer usuário logado, chamando a API REST do Supabase com a chave pública (anon) e a própria sessão, pode gravar `plan = 'premium_annual'` e liberar o Clube sem pagar.
- **Confirmado em 03/11/2026 (produção, somente leitura + teste desfeito):** o papel `authenticated` tem `UPDATE` em todas as colunas de `profiles`, inclusive `plan` e `membership_tier`. Um teste em bloco que termina com erro proposital (nada gravado) mostrou `usuario->plan: PERMITIDO` e `usuario->tier: PERMITIDO`. Script: [`supabase/scripts/test-t02-profile-plan.sql`](../supabase/scripts/test-t02-profile-plan.sql).
- **Correção aplicada:** migração [`052_protect_profile_plan.sql`](../supabase/migrations/052_protect_profile_plan.sql) aplicada em produção em 03/11/2026. Reteste (desfeito): `usuario->plan: bloqueado`, `usuario->tier: bloqueado`, `usuario->nome: permitido`, `sistema->plan: permitido`.

<a id="s-03"></a>
### S-03 — Server Action de simulação de pagamento sem autenticação · **MÉDIO**

- **Evidência (código):** [`simulate.actions.ts`](../src/lib/payments/actions/simulate.actions.ts) não verifica usuário. [`simulatePaymentApproval`](../src/lib/payments/mercadopago/webhook.ts) só bloqueia quando **não** está em modo stub **e** o Mercado Pago está configurado. Se `MERCADOPAGO_ACCESS_TOKEN` faltar em algum ambiente, qualquer pessoa que conheça uma `external_reference` aprova o pagamento e ativa a assinatura.
- **Hoje:** em produção o token existe (nome visto na Vercel), então o caminho está bloqueado; a proteção depende de configuração.
- **Correção:** WORK_PLAN **T-04**.

<a id="s-04"></a>
### S-04 — Conteúdo premium legível pela API pública · **ALTO (receita)**

- **Evidência (migrações):** as políticas de leitura de `articles`, `protocols` e `ebooks` ([`002_content_and_favorites.sql`](../supabase/migrations/002_content_and_favorites.sql)) liberam a `anon` toda linha com `status = 'published'`, **inclusive `is_premium = true`**. O bloqueio premium existe só na página ([`PremiumContentGuard`](../src/components/club/PremiumContentGuard.tsx)).
- **Não verificado:** se as políticas em produção continuam iguais às da migração; não houve chamada à API.
- **Correção:** WORK_PLAN **T-05**.

<a id="s-05"></a>
### S-05 — Next.js com vulnerabilidades críticas conhecidas · **ALTO**

- **Evidência (`npm audit`, 03/11/2026):** `next@16.2.6` tem avisos **críticos** (ex.: execução remota de código na otimização de imagens com SVG/AVIF — GHSA-2464-fhr4-w9xw, GHSA-2xp9-vwfh-vxw4; RCE em `next/og` — GHSA-vcvr-r3jv-pc5j) e altos (bypass de proxy, SSRF, DoS em Server Actions). O site usa `next/image` com hosts remotos. Correção disponível em `next@16.4.5` (sem mudança de versão maior). Também há avisos em `postcss`, `nanoid`, `sharp`, `source-map-js` e `baseline-browser-mapping`.
- **Não verificado:** se a infraestrutura da Vercel já mitiga algum desses casos.
- **Correção:** WORK_PLAN **T-03** — `next@16.4.5` e `npm audit fix` (03/11/2026); `npm audit --omit=dev` sem vulnerabilidades. **Resolvido após o deploy do PR de T-03.**

<a id="s-06"></a>
### S-06 — Webhook do Mercado Pago aceita notificação sem assinatura · **BAIXO/MÉDIO**

- **Evidência (código):** [`webhook-auth.ts`](../src/lib/payments/mercadopago/webhook-auth.ts) aceita IPN sem `x-signature`, e mesmo com **assinatura inválida** (`ipn_fallback_after_bad_signature`).
- **Mitigação:** o processamento busca o pagamento/preapproval **na API do Mercado Pago** ([`webhook.ts`](../src/lib/payments/mercadopago/webhook.ts)) antes de mudar status. Um atacante não forja aprovação, só provoca reconsultas.
- **Correção:** endurecer após confirmar o formato das notificações reais (WORK_PLAN **T-10**).

<a id="s-07"></a>
### S-07 — Arquivos privados em bucket público · **MÉDIO**

- **Evidência (painel):** `cms-pdfs` é **público** (50 MB) e guarda e-books, inclusive os premium. Quem tiver a URL baixa sem login. `cms-images` aceita `image/svg+xml` em bucket público; o SVG roda no domínio do Supabase, não no do site, então o risco é baixo.
- **Correção:** WORK_PLAN **T-06**.

---

## 2. Requisitos avaliados

### Autenticação e autorização

| Requisito | Situação | Evidência |
|---|---|---|
| Sessão validada no servidor | ✅ Verificado (código) | `supabase.auth.getUser()` em [`middleware.ts`](../src/lib/supabase/middleware.ts) e [`session.ts`](../src/lib/auth/session.ts) |
| Rotas privadas exigem login | ✅ Verificado (código) | [`proxy.ts`](../src/proxy.ts) + [`auth/routes.ts`](../src/lib/auth/routes.ts) |
| Autorização de admin no servidor | ✅ Verificado (código) | `requireAdmin*` em todas as páginas `/admin` e Server Actions de admin; exports com `getAdminSession()`; RLS com `is_admin()` |
| Autorização de escrita de usuário | ✅ Verificado (produção, teste desfeito) | RLS por `auth.uid()` nas tabelas de usuário; colunas de plano de `profiles` protegidas por trigger desde a 052 (S-02 resolvido) |
| Server Actions sem guarda | 🟡 Parcial | `simulatePaymentApprovalAction` (S-03). Públicas por design: newsletter, leads, analytics, salvar ferramenta |
| Redirecionamento seguro após login | ✅ Verificado (código) | [`safe-redirect.ts`](../src/lib/auth/safe-redirect.ts) recusa `//` e caminhos externos |

### Senhas, sessões, recuperação e MFA

| Requisito | Situação | Evidência |
|---|---|---|
| Política de senha | 🟡 Parcial | Mínimo de 8 caracteres no app ([`actions.ts`](../src/lib/auth/actions.ts)); "Prevent use of leaked passwords" existe no painel, **estado não confirmado** |
| Recuperação de senha | ✅ Verificado (código) | `resetPasswordForEmail` + `/redefinir-senha`; não testado |
| Cookies de sessão | ✅ Verificado (código) | `@supabase/ssr` com `SameSite=Lax` |
| MFA | 🟡 Parcial | TOTP **habilitado no projeto** (painel), mas o app **não tem tela de cadastro de fator nem exige AAL2** para `/admin` |
| Credenciais fixas no código | 🟡 Parcial | Removidas na T-01; valor antigo ainda no histórico do Git (S-01). Scripts de teste usam senhas fixas só para contas descartáveis com e-mail aleatório |

### Master, perfis e permissões

| Requisito | Situação | Evidência |
|---|---|---|
| Papéis definidos | ✅ Verificado (código) | `super_admin`/`admin` em [`roles.ts`](../src/lib/admin/roles.ts) e enum `admin_role` |
| Gestão de admins restrita | ✅ Verificado (código) | `requireSuperAdmin()`; política `Super admins manage admin users` |
| Bootstrap de admin por e-mail fixo | 🟡 Parcial | `ensure_bootstrap_admin()` concede `super_admin` ao e-mail do dono ([`006`](../supabase/migrations/006_admin_roles.sql)); seguro enquanto essa conta existir e estiver protegida |
| Escalada via `profiles.plan = 'admin'` | ✅ Verificado (produção) | Bloqueada pelo trigger da 052 para não admins |

### Isolamento e RLS

| Requisito | Situação | Evidência |
|---|---|---|
| Multiempresa | ➖ Não aplicável | Não há tenants; isolamento é por usuário |
| RLS habilitada | ✅ Verificado (migrações) | As 36 tabelas têm `enable row level security`. **Estado do banco conferido só para `profiles`** |
| Políticas por usuário | ✅ Verificado (migrações) | `auth.uid() = user_id` em favoritos, histórico, downloads, resultados, pagamentos (leitura) |
| Conteúdo premium | ❌ Problema | S-04 |
| Funções `SECURITY DEFINER` | 🟡 Parcial | Funções de painel checam `is_admin()`. `expire_due_subscriptions` e `refresh_content_rankings` podem ser chamadas por qualquer logado (efeito limitado, consome recurso). `user_has_active_premium(uuid)` está liberada para `anon` (permite saber se um id é premium). Sem `REVOKE ... FROM PUBLIC` na maioria |
| Migrações = banco | ❔ Não verificado | Sem controle de migrações; divergência já observada em `profiles` |

### Validação no servidor e injeções

| Requisito | Situação | Evidência |
|---|---|---|
| Validação de entrada | 🟡 Parcial | Validadores em `billing/validators.ts`, `leads/lead.validate.ts`, `newsletter/validate.ts`, `analytics/sanitize.ts`, uploads checam tipo e tamanho. Sem biblioteca de esquema (ex.: zod) nem padrão único |
| SQL Injection | ✅ Verificado (código) | Só supabase-js e RPC parametrizados; nenhuma SQL montada por string no app |
| XSS | 🟡 Parcial | React escapa por padrão. `dangerouslySetInnerHTML` com HTML vindo do banco em [`ContentBlockRenderer.tsx`](../src/components/content/ContentBlockRenderer.tsx) (conteúdo de admin, sem sanitização) e JSON-LD sem escapar `</script>` em [`JsonLd.tsx`](../src/components/seo/JsonLd.tsx) |
| CSRF | 🟡 Parcial | Server Actions têm checagem de origem do Next; rotas `POST` com cookie dependem do `SameSite=Lax`; sem token CSRF próprio |
| Cabeçalhos de segurança (CSP, HSTS, X-Frame-Options) | ❌ Não encontrado | [`next.config.ts`](../next.config.ts) só define cache do service worker e do manifest |

### Chaves, credenciais e criptografia

| Requisito | Situação | Evidência |
|---|---|---|
| Segredos fora do código | 🟡 Parcial | Variáveis de ambiente na Vercel; `.env*` está no [`.gitignore`](../.gitignore) e nenhum `.env` está versionado; **exceção S-01** |
| Service role só no servidor | ✅ Verificado (código) | Usada em `service-role.ts`, `payments/admin-client.ts`, `dev-admin.ts`, `cron/auth.ts`; nenhum uso em componente cliente |
| Segredo de cron por query string | 🟡 Parcial | [`cron/auth.ts`](../src/lib/cron/auth.ts) aceita `?secret=` (vaza em logs) e aceita a **service role** como bearer em alguns crons |
| Criptografia em trânsito | ✅ Verificado | HTTPS (Vercel/Supabase) |
| Criptografia de dados sensíveis | ❌ Não encontrado | CPF, celular e endereço em texto puro em `profiles`; dados de saúde em `user_tool_results` (dado sensível na LGPD) protegidos só por RLS |
| Arquivos privados | ❌ Problema | S-07 |

### Limites de login, consumo e custos

| Requisito | Situação | Evidência |
|---|---|---|
| Limite de tentativas de login | ❔ Não verificado | Depende dos limites do Supabase Auth (tela "Rate Limits" não lida) |
| CAPTCHA | ❌ Não encontrado | "Enable Captcha protection" **desabilitado** (painel) |
| Limite em formulários públicos | ❌ Não encontrado | Newsletter, leads, analytics e clique de afiliado inserem sem limite por IP |
| Tamanho de Server Action | 🟡 Parcial | `bodySizeLimit: 20mb` em `next.config.ts` (alto para formulários comuns) |
| Alertas de custo | ❔ Não verificado | Vercel e Supabase Pro; não inspecionado |

### Logs, alertas, backups

| Requisito | Situação | Evidência |
|---|---|---|
| Logs de aplicação | 🟡 Parcial | `console.error` em rotas e serviços (logs da Vercel); sem ferramenta de monitoramento (ex.: Sentry) |
| Alertas | ❌ Não encontrado | Nenhum alerta configurado no código; painéis não inspecionados |
| Auditoria de ações admin | ❌ Não encontrado | Sem tabela de auditoria; `payment_webhook_events` cobre só webhooks |
| Backups do banco | ✅ Verificado (painel) | Backups físicos diários (03/11, 02/11, 01/11…). **Storage não entra no backup**. PITR não verificado. Restauração nunca testada |

### Dependências e ambientes

| Requisito | Situação | Evidência |
|---|---|---|
| Dependências atualizadas | ✅ Ok (03/11/2026, após T-03) | S-05 |
| Separação de ambientes | ❌ Não encontrado | Um único projeto Supabase; segredos (service role, Mercado Pago) disponíveis em **Preview** |
| Proteção do branch de produção | ❌ Não encontrado | `master` sem proteção; push publica direto |
| CI (lint, build, testes) | ❌ Não encontrado | Sem GitHub Actions; a Vercel só faz o build |
| Testes automatizados | ❌ Não encontrado | Nenhum |
| Lint | 🟡 Parcial | 4 erros e 31 avisos (`react-hooks`) |

### Privacidade, retenção e exclusão

| Requisito | Situação | Evidência |
|---|---|---|
| Política de privacidade | ✅ Verificado (código) | [`/privacidade`](../src/app/privacidade/page.tsx) cita a LGPD e o canal `contato@` |
| Exclusão de conta pelo usuário | ❌ Não encontrado | Sem fluxo; só por pedido ao contato |
| Retenção de dados | ❌ Não encontrado | Sem rotina de expurgo (`analytics_events`, `affiliate_clicks`, `payment_webhook_events`, leads) |
| Consentimento de cookies | ❔ Não verificado | Página `/cookies` existe; banner e bloqueio prévio de GA/Pixel não verificados |

---

## 3. Áreas não verificadas (e por quê)

| Área | Motivo |
|---|---|
| Políticas RLS de todas as tabelas no banco real | Só `profiles` foi conferida no painel; o resto vem das migrações |
| Privilégios por coluna em `profiles` | Exigiria consulta SQL; adiado para T-02 |
| Senha atual da conta admin | Teste de login com credencial exposta não é feito por princípio |
| Limites de taxa do Supabase Auth, "leaked passwords", "Confirm email" | Telas abertas, estado dos interruptores não capturado com segurança |
| Conteúdo do `.env.local` e qual projeto o desenvolvimento usa | Arquivo fora do repositório (correto) |
| Logs e alertas da Vercel/Supabase | Não inspecionados |
| Comportamento em execução (exploração real de S-02, S-03, S-04) | Alteraria dados ou exigiria teste ofensivo |
