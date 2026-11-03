# Saúde & Bem — Guia de alterações e manutenção

> Atualizado em 03/11/2026 (commit `9004865`). Índice: [PROJECT_MAP.md](PROJECT_MAP.md).
>
> Use este guia para saber **onde mexer** e **o que revisar junto**. Os IDs de módulo (ex.: `PAGAMENTOS-001`) estão descritos no mapa.

## Rotina obrigatória para cada tarefa

Vale para qualquer pessoa ou IA que alterar o projeto:

1. **Consultar o mapa e conferir o código atual.** Abra o [PROJECT_MAP](PROJECT_MAP.md), localize o módulo e leia os arquivos citados **na versão atual**. O mapa é referência, não garantia. Se divergir, investigue e corrija o mapa na mesma tarefa.
2. **Identificar o módulo e as dependências afetadas.** Use a tabela abaixo e a coluna "Depende de" do mapa. Inclua banco (migrações, RLS, funções), integrações externas e telas que leem o mesmo dado.
3. **Reutilizar soluções existentes** quando adequadas: guardas (`requireUser`, `requireAdmin*`, `isCronAuthorized`), clientes Supabase (`server.ts`, `service-role.ts`), preços (`src/lib/payments/pricing.ts`), redirecionamento seguro (`safe-redirect.ts`), validadores existentes, `routes.ts`.
4. **Implementar dentro do escopo pedido.** Não renomear arquivos, tabelas ou funções só para padronizar. Mudança de banco = nova migração numerada (próxima: `052_...sql`), nunca editar migração antiga.
5. **Executar as verificações pertinentes** (seção "Validações padrão"). Não rodar scripts que alteram dados ou chamam produção como se fossem testes.
6. **Atualizar a documentação afetada:** mapa (arquivos, rotas, tabelas), [SECURITY_STATUS](SECURITY_STATUS.md) se mudar algum requisito, [WORK_PLAN](WORK_PLAN.md) (situação da tarefa).
7. **Informar** o que mudou, como foi validado e o que ficou pendente (incluindo o que não pôde ser verificado).

### Regras permanentes

- Trabalhar em branch e abrir Pull Request; nunca fazer push direto em `master` (publica em produção).
- Migração SQL: aplicar primeiro em ambiente de teste quando existir (T-08); registrar no PR **como e quando** foi aplicada em produção.
- Nunca colocar senha, token ou chave em código, documentação, commit ou mensagem.
- Toda rota de API ou Server Action nova precisa de guarda explícita (ou comentário explicando por que é pública).
- Toda tabela nova precisa de RLS e políticas na mesma migração.

## Validações padrão

| Tipo de mudança | Validações mínimas |
|---|---|
| Qualquer código | `npx tsc --noEmit -p .`, `npx eslint <arquivos alterados>`, `npm run build` |
| Tela | Abrir a rota no deploy de preview, em celular e desktop; checar console |
| Regra de acesso | Testar como visitante, usuário free, usuário premium e admin |
| Banco/RLS | Revisar a política resultante no painel Supabase; testar leitura e escrita com usuário comum e com admin |
| Pagamento | Fluxo em sandbox/stub fora de produção; conferir webhook e `payments`/`subscriptions` |
| E-mail/WhatsApp | Envio de teste para endereço do próprio dono; nunca para a base |

## Mapa de mudanças

| Problema ou melhoria | Módulo | Arquivos envolvidos | Dependências (revisar junto) | Validações necessárias |
|---|---|---|---|---|
| Login não funciona / erro ao entrar | AUTH-001, AUTH-002 | `src/lib/auth/actions.ts` (`signIn`), `src/lib/auth/errors.ts`, `src/proxy.ts`, `src/lib/supabase/middleware.ts`, `src/app/entrar/` | Configuração do Supabase Auth (URL do site, SMTP, "Confirm email"); `NEXT_PUBLIC_SUPABASE_*` na Vercel | Login com conta de teste no preview; redirecionamento `?redirect=`; logout |
| Cadastro de usuários (novos campos, validação) | AUTH-001, COBRANCA-001 | `src/lib/auth/actions.ts` (`signUp`, `updateProfile`), `src/lib/billing/validators.ts`, `src/lib/billing/actions.ts`, `src/app/cadastro/`, `src/app/completar-cadastro/`, `src/app/perfil/` | Trigger `handle_new_user` (migração 006), colunas de `profiles` (001, 022, 039), tipos em `src/lib/supabase/types.ts`, admin `/admin/usuarios` | Novo cadastro no preview; campos obrigatórios; RLS de `profiles` (usuário não pode alterar `plan`, ver T-02) |
| Recuperação de senha | AUTH-001 | `resetPassword`/`updatePassword` em `src/lib/auth/actions.ts`, `src/lib/auth/recovery-session.ts`, `src/app/recuperar-senha/`, `src/app/redefinir-senha/`, `src/app/auth/callback/` | Templates e SMTP no Supabase; `NEXT_PUBLIC_SITE_URL` | Fluxo completo com e-mail de teste |
| Alterar permissões de admin | ADMIN-001, ADMIN-002 | `src/lib/admin/roles.ts`, `src/lib/admin/session.ts`, páginas em `src/app/admin/**` (cada uma chama `requireAdmin*`), `src/lib/admin/nav.ts` | Funções SQL `is_admin`/`is_super_admin`/`get_admin_role` e **todas as políticas RLS que as usam**; Server Actions em `src/lib/admin/actions/` | Acessar cada página e ação como admin e como super admin; tentar como usuário comum (deve negar) |
| Conceder ou remover admin | ADMIN-002 | `supabase/scripts/grant-admin.sql`, tabela `admin_users` | `ensure_bootstrap_admin()` (migração 006) | Conferir no painel; testar acesso ao `/admin` |
| Regras de acesso Premium | CLUBE-002 | `src/lib/club/access.ts`, `src/components/club/PremiumContentGuard.tsx`, `src/lib/subscription/`, `src/lib/payments/guards.ts` | Função `user_has_active_premium`, trigger `sync_profile_membership_tier`, crons de expiração, políticas de `articles`/`protocols`/`ebooks` (S-04) | Usuário free, premium ativo, premium vencido, admin; conteúdo premium e gratuito |
| Preços e planos do Clube | PAGAMENTOS-001 | `src/lib/payments/pricing.ts` (**fonte única**), `src/lib/payments/plans.ts`, `src/lib/payments/founder.ts`, `src/lib/data/club.ts`, `src/lib/marketplace/marketplace.service.ts` | Tabela `membership_plans` (migração nova), textos em `/clube`, `/assinar`, e-mails do Brevo (template 4), posts agendados | Valor no checkout = valor exibido; `/clube`, `/assinar`, `/marketplace` |
| Checkout ou assinatura falhando | PAGAMENTOS-001, PAGAMENTOS-002 | `src/lib/payments/mercadopago/*.ts`, `src/app/api/payments/*/route.ts`, `src/components/payments/` | Variáveis `MERCADOPAGO_*`; URL do webhook no painel do Mercado Pago; `payments`, `subscriptions`, `user_memberships` | Sandbox; logs da Vercel; `payment_webhook_events` |
| Cancelamento / renovação | PAGAMENTOS-003 | `src/lib/payments/services/subscriptions.service.ts`, `subscription-lifecycle.service.ts`, `src/components/payments/SubscriptionDashboard.tsx`, `src/app/api/payments/cancel-subscription/` | Preapproval no Mercado Pago; cron `/api/payments/cron/subscriptions`; e-mails | Cancelar no fim do período e imediato com conta de teste |
| Relatórios financeiros / exportação | PAGAMENTOS-004 | `src/lib/admin/services/finance.service.ts`, `src/app/admin/financeiro/`, `src/app/api/admin/finance/export/` | Função `get_finance_dashboard_stats`; `financial_events` | Totais conferem com `payments`; acesso negado a não-admin |
| Novo relatório no painel | ADMIN-001 + módulo de origem | Novo serviço em `src/lib/admin/services/`, página em `src/app/admin/<nome>/`, item em `src/lib/admin/nav.ts` | RLS: preferir função SQL com `is_admin()` ou serviço com `requireAdmin`; não usar service role sem necessidade | Acesso como admin e como usuário comum; desempenho com volume real |
| Leads e newsletter (campos, origem, exportação) | LEADS-001 | `src/lib/actions/newsletter.actions.ts`, `src/lib/leads/`, `src/lib/newsletter/`, `src/components/leads/`, `src/app/admin/leads/`, `src/app/api/admin/leads/export/` | Função `capture_newsletter_lead`, listas do Brevo (`src/lib/brevo/config.ts`), automação de boas-vindas no Brevo | Inscrição de teste aparece no admin e no Brevo; export CSV |
| E-mails automáticos | LEADS-002 | Automação no **painel do Brevo**; `src/lib/email-automation/` (só registra), `src/lib/crm/` | Domínio autenticado no Brevo; DNS no Registro.br | Envio de teste para o próprio dono |
| Produtos afiliados | AFILIADOS-001, MARKETPLACE-001 | Painel `/admin/afiliados`; `src/lib/affiliates/editorial-picks.ts`, `src/lib/supabase/services/affiliates.public.ts`, `src/app/api/affiliates/[slug]/go/` | `marketplace.service.ts` (filtro de publicáveis), seções em artigos e protocolos | Link final contém a tag; `/recomendados`, `/marketplace`, fim de um protocolo |
| Conteúdo (artigos, protocolos, e-books) | CONTEUDO-001/002/003 | Painel `/admin/*`; `src/lib/admin/actions/*.actions.ts`; dados locais em `src/lib/data/` e `src/lib/content-engine/seed/` | Fallback local pode esconder falha do banco; sitemap; guias em `protocol-guides.ts` | Página pública, sitemap, premium x gratuito |
| Upload de arquivos | CONTEUDO-004 | `src/lib/admin/actions/upload.actions.ts`, `src/lib/admin/services/storage.service.ts`, `src/components/admin/cms/` | Buckets `cms-images`/`cms-pdfs` e políticas de Storage (S-07) | Upload de imagem e PDF como admin; negar como usuário |
| WhatsApp | WHATSAPP-001 | `src/lib/whatsapp/`, `src/app/api/webhooks/whatsapp/`, `src/app/api/cron/whatsapp-automation/` | Variáveis `WHATSAPP_*` (hoje ausentes na Vercel), templates aprovados na Meta | Modo stub; mensagem para número do dono |
| Crons | PAGAMENTOS-002, LEADS-002, WHATSAPP-001 | `vercel.json`, `src/lib/cron/auth.ts`, rotas `src/app/api/**/cron/**` | `CRON_SECRET` e segredos específicos | Chamada sem segredo retorna 401; logs da execução |
| SEO, sitemap, páginas legais | SEO-001 | `src/app/sitemap.ts`, `src/app/robots.ts`, `src/lib/seo/`, `src/app/privacidade/`, `src/app/termos/` | Rotas novas em `src/lib/seo/public-routes.ts` | `/sitemap.xml`, `/robots.txt`, metadados |
| Atualizar dependências | Todos | `package.json`, `package-lock.json` | Next 16 tem mudanças de API (ver `node_modules/next/dist/docs/`), `proxy.ts` | `tsc`, lint, build, navegação completa no preview |

## Partes que precisam ser revisadas juntas

| Ao mexer em… | Revise também… | Porque |
|---|---|---|
| `profiles` (colunas ou políticas) | `club/access.ts`, `user_has_active_premium`, `sync_profile_membership_tier`, `billing/validators.ts`, `/admin/usuarios` | O plano e os dados de cobrança moram na mesma tabela |
| `pricing.ts` | `membership_plans`, `founder.ts`, `/clube`, `/assinar`, marketplace, e-mails do Brevo | Preço aparece em vários lugares e no checkout |
| Funções `is_admin`/`is_super_admin` | Todas as políticas RLS e funções de painel | São a base de autorização do banco |
| `webhook.ts` | `reconcile.ts`, `subscriptions.service.ts`, crons, `payment_webhook_events` | O mesmo pagamento pode chegar por webhook, sync ou reconciliação |
| `proxy.ts` / `auth/routes.ts` | Guardas nas páginas (`requireUser`, `requireAdmin*`) | Proxy só exige login; a autorização fina está na página |
| Políticas de `articles`/`protocols`/`ebooks` | Repositórios com fallback local e `PremiumContentGuard` | Fallback local pode mascarar erro de permissão |
| Buckets do Storage | `storage.service.ts`, componentes de upload, links já publicados | Tornar bucket privado quebra URLs públicas existentes |

## Equivalências de domínio

Termos genéricos e onde ficam neste projeto (não existem "clientes" nem "propostas" como entidades):

| Termo genérico | Neste projeto |
|---|---|
| Clientes | Usuários (`profiles`) e assinantes (`subscriptions`, `user_memberships`) |
| Cadastro de clientes | AUTH-001 + COBRANCA-001 |
| Propostas / ofertas | Planos e preços do Clube (PAGAMENTOS-001), produtos do marketplace e afiliados |
| Empresas / tenants | Não há; aplicação de empresa única |
