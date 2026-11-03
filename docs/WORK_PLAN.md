# Saúde & Bem — Plano de trabalho

> Criado em 03/11/2026 a partir do diagnóstico do commit `9004865`. Índice: [PROJECT_MAP.md](PROJECT_MAP.md) · Evidências: [SECURITY_STATUS.md](SECURITY_STATUS.md).
>
> Atualize a coluna **Situação** ao concluir cada tarefa e registre o PR correspondente.

## Ordem recomendada

```
T-01 ─┐
T-03 ─┼─► T-07 (CI) ─► T-08 (ambiente de teste) ─► T-02, T-04, T-05, T-06 validadas em teste
      │
T-02 ─┤ (pode ir antes de T-08 com cuidado: migração pequena e reversível)
T-05 ─┘
```

## Correções necessárias

### T-01 — Remover a senha fixa do dev-login · **P0 (crítica)**

| Campo | Conteúdo |
|---|---|
| Módulo | AUTH-003 |
| Problema e evidência | Senha e e-mail do super admin no código de um repositório público; o dev-login redefine a senha dessa conta ([S-01](SECURITY_STATUS.md#s-01)) |
| Prioridade | Risco confirmado de tomada do painel admin, sem custo para o atacante |
| Dependências | Nenhuma. A troca de senha pelo dono deve vir **antes** e independe de código |
| Correção proposta | (1) Dono troca a senha da conta e revoga sessões (Supabase → Authentication → Users). (2) Ler e-mail e senha do dev-login de variáveis só locais (`DEV_LOGIN_EMAIL`, `DEV_LOGIN_PASSWORD`) e recusar se ausentes; nunca usar o e-mail do super admin real. (3) Remover o SQL que promove a `super_admin`. (4) Avaliar tornar o repositório privado; o histórico continua com o valor antigo, por isso a troca de senha é obrigatória |
| Critérios de conclusão | Nenhuma senha no código (`git grep` limpo); `/dev-login` continua bloqueado em produção; login do dono funciona com a senha nova |
| Testes | `tsc`, lint, build; abrir `/dev-login` no preview (deve redirecionar); dev local com variáveis definidas |
| Situação | **Concluída** (PR #48, 03/11/2026; dono trocou a senha antes do merge): sem senha no código, dev login exige `DEV_LOGIN_EMAIL`/`DEV_LOGIN_PASSWORD` locais e não altera contas reais nem admins. **Opcional:** encerrar sessões antigas e decidir sobre repositório privado |
| Próxima ação | — |

### T-02 — Impedir que o usuário altere o próprio plano · **P0**

| Campo | Conteúdo |
|---|---|
| Módulo | CLUBE-002, AUTH-001, COBRANCA-001 |
| Problema e evidência | Política de UPDATE em `profiles` sem restrição de colunas e sem trigger (painel); `plan`/`membership_tier` liberam premium ([S-02](SECURITY_STATUS.md#s-02)) |
| Prioridade | Acesso pago sem pagamento; perda direta de receita |
| Dependências | Conferir privilégios por coluna no banco antes de escrever a migração |
| Correção proposta | Migração `052`: trigger `BEFORE UPDATE` em `profiles` que rejeita mudança de `plan`, `membership_tier` e `club_joined_at` quando quem altera não é `service_role` nem admin (ou `REVOKE UPDATE` + `GRANT UPDATE (colunas editáveis)` para `authenticated`). Ajustar a política para `to authenticated`. Revisar `club/access.ts` para não aceitar `profilePlan === 'admin'` como premium sem conferir `admin_users` |
| Critérios de conclusão | Usuário comum não altera `plan`/`membership_tier` pela API (erro); continua editando nome, objetivo e dados de cobrança; webhook e admin continuam ativando premium |
| Testes | Em ambiente de teste (ou conta de teste): PATCH via REST com JWT de usuário comum → negado; fluxo de pagamento stub → premium ativado; edição de perfil → ok |
| Situação | **Concluída** em 03/11/2026: migração 052 aplicada em produção pelo dono (SQL Editor) e conferida — trigger presente; políticas de `profiles` agora `authenticated`. Teste desfeito retornou `usuario->plan: bloqueado \| usuario->tier: bloqueado \| usuario->nome: permitido \| sistema->plan: permitido` (PR #49) |
| Próxima ação | Acompanhar o próximo pagamento real: assinatura deve ativar normalmente (o trigger permite service role e funções do sistema) |

### T-03 — Atualizar Next.js e dependências vulneráveis · **P0**

| Campo | Conteúdo |
|---|---|
| Módulo | Todos |
| Problema e evidência | `next@16.2.6` com avisos críticos (RCE na otimização de imagens, `next/og`) e altos ([S-05](SECURITY_STATUS.md#s-05)) |
| Prioridade | Vulnerabilidades públicas, correção disponível sem versão maior |
| Dependências | Nenhuma; validar `proxy.ts` e Server Actions após a atualização |
| Correção proposta | `next` e `eslint-config-next` para `16.4.5` (ou mais recente estável da linha 16); `npm audit fix` para as transitivas; ler as notas de versão em `node_modules/next/dist/docs/` |
| Critérios de conclusão | `npm audit --omit=dev` sem críticas nem altas; build ok; navegação principal ok |
| Testes | `tsc`, lint, build; no preview: home, login, `/admin`, um protocolo premium, `/assinar` (sem pagar), imagens carregando |
| Situação | **Concluída no código** (03/11/2026): `next` e `eslint-config-next` em 16.4.5 + `npm audit fix`; `npm audit --omit=dev` → 0 vulnerabilidades; `tsc` ok; lint sem erros novos (os 4 já existentes seguem); build ok; `next start` local respondeu 200 em `/`, `/clube`, `/blog`, `/protocolos`, `/marketplace`, `/sitemap.xml` e 307 em `/admin` |
| Próxima ação | Merge; conferir no ar home, `/entrar`, `/admin`, um protocolo premium e imagens |

### T-04 — Proteger a Server Action de simulação de pagamento · **P1**

| Campo | Conteúdo |
|---|---|
| Módulo | PAGAMENTOS-005 |
| Problema e evidência | `simulatePaymentApprovalAction` sem autenticação; bloqueio depende de variável de ambiente ([S-03](SECURITY_STATUS.md#s-03)) |
| Prioridade | Hoje mitigado em produção, mas um erro de configuração libera assinaturas grátis |
| Dependências | Nenhuma |
| Correção proposta | Exigir `NODE_ENV !== 'production'` **e** stub ativo, independentemente do token; exigir usuário logado dono do pagamento (ou admin) |
| Critérios de conclusão | Em produção a action sempre recusa; em dev stub funciona só para o dono |
| Testes | Build; em dev com stub: pagamento próprio aprova, de outro usuário recusa |
| Situação | **Concluída no código** (03/11/2026). Teste da action com dependências simuladas: produção (mesmo com stub=1) recusa; sem stub (inclusive sem token do MP) recusa; anônimo recusa; outro usuário recusa; referência inexistente recusa; dono e admin aprovam com stub em dev |
| Próxima ação | Merge |

### T-05 — Restringir conteúdo premium na API pública · **P1**

| Campo | Conteúdo |
|---|---|
| Módulo | CLUBE-002, CONTEUDO-001/002/003 |
| Problema e evidência | Políticas de leitura liberam linhas `is_premium` publicadas para `anon` ([S-04](SECURITY_STATUS.md#s-04)) |
| Prioridade | Conteúdo pago acessível sem assinatura |
| Dependências | Conferir políticas atuais no banco; T-02 (premium confiável) antes |
| Correção proposta | Opção A: política de SELECT com `is_premium = false OR user_has_active_premium(auth.uid()) OR is_admin()`, mantendo listagens por uma view ou colunas públicas (título, resumo, capa). Opção B: separar o corpo premium em tabela própria com RLS. Ajustar repositórios que listam conteúdo premium para não depender do corpo |
| Critérios de conclusão | Visitante e free veem título e resumo, mas não o corpo premium via REST; premium e admin veem tudo; páginas e sitemap continuam funcionando |
| Testes | REST com anon e com JWT free/premium em ambiente de teste; navegação nas páginas premium |
| Situação | Pendente |
| Próxima ação | Levantar políticas atuais de `articles`, `protocols`, `ebooks` no painel |

### T-06 — Tornar privados os PDFs premium · **P1**

| Campo | Conteúdo |
|---|---|
| Módulo | CONTEUDO-003, CONTEUDO-004 |
| Problema e evidência | Bucket `cms-pdfs` público ([S-07](SECURITY_STATUS.md#s-07)) |
| Prioridade | Material pago baixável por quem tem o link |
| Dependências | T-02 (premium confiável); inventário dos PDFs gratuitos e premium |
| Correção proposta | Novo bucket privado para PDFs premium com download por URL assinada de curta duração gerada no servidor após checar premium (`download.actions.ts`); manter PDFs gratuitos públicos. Remover `image/svg+xml` de `cms-images` |
| Critérios de conclusão | PDF premium sem login retorna 400/403; assinante baixa normalmente |
| Testes | Download como visitante, free e premium |
| Situação | Pendente |
| Próxima ação | Listar arquivos do `cms-pdfs` e marcar quais são premium |

### T-07 — CI mínima e proteção do branch `master` · **P1**

| Campo | Conteúdo |
|---|---|
| Módulo | Plataforma |
| Problema e evidência | Sem GitHub Actions, sem proteção de branch, lint com 4 erros (painel GitHub, `npm run lint`) |
| Prioridade | Hoje qualquer push em `master` vai direto para produção sem checagem |
| Dependências | Corrigir os 4 erros de lint (`ferramentas/[slug]/page.tsx`, `ImageUploadField.tsx`, `PdfUploadField.tsx`) |
| Correção proposta | Workflow com `npm ci`, `tsc --noEmit`, `eslint`, `next build`, `npm audit --omit=dev --audit-level=high`; exigir PR e checagem verde para `master` |
| Critérios de conclusão | PR com erro de tipo fica bloqueado; `master` não aceita push direto |
| Testes | PR de teste com erro proposital (fechado sem merge) |
| Situação | Pendente |
| Próxima ação | Corrigir os erros de lint |

### T-08 — Separar ambientes (teste × produção) · **P1**

| Campo | Conteúdo |
|---|---|
| Módulo | Plataforma |
| Problema e evidência | Um único projeto Supabase; service role e token do Mercado Pago em Preview (painéis) |
| Prioridade | Testes e previews mexem em dados reais; impede validar T-02/T-05 com segurança |
| Dependências | Plano Supabase (custo de um projeto adicional ou uso de branching) |
| Correção proposta | Projeto Supabase de teste (ou Supabase Branching) com as migrações aplicadas; variáveis de Preview e do `.env.local` apontando para ele; Mercado Pago em sandbox no Preview |
| Critérios de conclusão | Preview e dev não usam o banco nem o token de produção |
| Testes | Cadastro no preview não aparece em produção |
| Situação | Pendente (decisão do dono: custo) |
| Próxima ação | Apresentar custo e opções |

### T-09 — Controle de migrações · **P2**

| Campo | Conteúdo |
|---|---|
| Módulo | Banco |
| Problema e evidência | Migrações aplicadas à mão; divergência já observada em `profiles` (papel `public` × `authenticated`) |
| Prioridade | Impede saber o estado real do banco e reproduzir ambientes |
| Dependências | T-08 |
| Correção proposta | Adotar a Supabase CLI (`supabase/config.toml`, `supabase db diff`); gerar migração-base a partir do banco atual; registrar no PR quando cada migração foi aplicada |
| Critérios de conclusão | `supabase db diff` sem diferenças entre repositório e produção |
| Testes | Aplicar todas as migrações em banco vazio de teste |
| Situação | Pendente |
| Próxima ação | Após T-08 |

### T-10 — Endurecer crons e webhook · **P2**

| Campo | Conteúdo |
|---|---|
| Módulo | PAGAMENTOS-002, LEADS-002, WHATSAPP-001 |
| Problema e evidência | Segredo aceito por `?secret=` e service role aceita como bearer ([`cron/auth.ts`](../src/lib/cron/auth.ts)); webhook aceita IPN com assinatura inválida ([S-06](SECURITY_STATUS.md#s-06)) |
| Prioridade | Exposição de segredos em logs; risco limitado porque o webhook reconsulta o Mercado Pago |
| Dependências | Confirmar que a Vercel usa só o cabeçalho; confirmar formato real das notificações do Mercado Pago nos logs |
| Correção proposta | Aceitar segredo só por cabeçalho; não aceitar service role como segredo de cron; recusar notificação com `x-signature` inválida; comparação de segredos em tempo constante |
| Critérios de conclusão | Crons da Vercel continuam rodando; chamada com `?secret=` recusada |
| Testes | Logs dos crons no dia seguinte; webhook de teste do Mercado Pago |
| Situação | Pendente |
| Próxima ação | Revisar logs de 7 dias |

### T-11 — Limites contra abuso nos formulários e no login · **P2**

| Campo | Conteúdo |
|---|---|
| Módulo | AUTH-001, LEADS-001, ANALYTICS-001, AFILIADOS-001 |
| Problema e evidência | CAPTCHA desabilitado (painel); inserts públicos sem limite (código) |
| Prioridade | Spam na base, custo de e-mail (Brevo) e poluição de métricas |
| Dependências | Escolher provedor (Turnstile/hCaptcha) |
| Correção proposta | CAPTCHA no Supabase Auth (cadastro/recuperação); limite por IP nos formulários públicos (Vercel KV/Upstash ou tabela com janela); revisar limites de taxa do Auth |
| Critérios de conclusão | Envio repetido em sequência é recusado; usuário legítimo não é afetado |
| Testes | Script local contra preview (sem tocar produção) |
| Situação | Pendente |
| Próxima ação | Definir provedor |

### T-12 — MFA obrigatório para administradores · **P2**

| Campo | Conteúdo |
|---|---|
| Módulo | ADMIN-001, AUTH-001 |
| Problema e evidência | TOTP habilitado no projeto, sem uso no app (painel + código) |
| Prioridade | Conta admin é o alvo de maior impacto |
| Dependências | T-01 |
| Correção proposta | Tela de cadastro de autenticador em `/perfil`; `requireAdmin()` exige `aal2` |
| Critérios de conclusão | Admin sem segundo fator é levado ao cadastro; com fator, acessa normalmente |
| Testes | Fluxo completo com conta de teste admin |
| Situação | Pendente |
| Próxima ação | Após T-01 |

### T-13 — Privacidade: exclusão, retenção e dados sensíveis · **P2**

| Campo | Conteúdo |
|---|---|
| Módulo | AUTH-001, COBRANCA-001, FERRAMENTAS-001, ANALYTICS-001 |
| Problema e evidência | Sem exclusão de conta pelo usuário, sem rotina de retenção; CPF e dados de saúde em texto puro (código) |
| Prioridade | Obrigações da LGPD (dados de saúde são sensíveis) |
| Dependências | Definição jurídica de prazos |
| Correção proposta | Botão "Excluir minha conta" (anonimiza perfil, remove resultados, cancela assinatura); job de retenção para `analytics_events`, `affiliate_clicks`, `payment_webhook_events`; avaliar criptografia de colunas sensíveis |
| Critérios de conclusão | Usuário consegue excluir a conta; tabelas de log respeitam prazo definido |
| Testes | Exclusão com conta de teste em ambiente de teste |
| Situação | Pendente |
| Próxima ação | Definir prazos de retenção |

### T-14 — Cabeçalhos de segurança e saneamento de HTML · **P2**

| Campo | Conteúdo |
|---|---|
| Módulo | SEO-001, CONTEUDO-001 |
| Problema e evidência | Sem CSP/HSTS/X-Frame-Options; HTML do banco renderizado sem sanitização; JSON-LD sem escapar `</script>` (código) |
| Prioridade | Defesa em profundidade contra XSS e clickjacking |
| Dependências | Inventário de scripts de terceiros (GA4, GTM, Pixel, AdSense) para a CSP |
| Correção proposta | `headers()` com HSTS, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`, `Permissions-Policy`; CSP inicialmente em modo report-only; escapar `<` no JSON-LD; sanitizar `block.html` |
| Critérios de conclusão | Cabeçalhos presentes; nenhuma quebra de anúncios ou analytics |
| Testes | Verificar cabeçalhos no preview; console sem bloqueios |
| Situação | Pendente |
| Próxima ação | Após T-03 |

### T-15 — Fontes locais (deploy não depende do Google) · **P0 (operacional)**

| Campo | Conteúdo |
|---|---|
| Módulo | Plataforma (`src/app/layout.tsx`) |
| Problema e evidência | `next/font/google` baixava Montserrat e Open Sans do Google a cada build; o download falhou em 28/10 e em todas as publicações de 03/11 (PRs #49 e #50), travando o deploy |
| Prioridade | Bloqueava qualquer publicação, inclusive T-03 |
| Dependências | Nenhuma |
| Correção proposta | `next/font/local` com arquivos woff2 (subconjunto latin, pesos usados) em [`src/app/fonts/`](../src/app/fonts/), licença SIL OFL junto |
| Critérios de conclusão | Build sem acesso ao Google; visual idêntico |
| Testes | `next build` sem stub de fontes (passou); página `/clube` renderizada com Montserrat 400–700 e Open Sans 400–600 carregadas e acentos corretos |
| Situação | **Concluída** (03/11/2026): PR #51, deploy de produção com sucesso (publicou também #49 e #50) |
| Próxima ação | — |

## Melhorias opcionais (não bloqueiam)

| ID | Melhoria | Módulo | Benefício |
|---|---|---|---|
| M-01 | Testes automatizados mínimos (unitários para `pricing`, `club/access`, `webhook-auth`, `safe-redirect`; E2E de login e checkout stub) | Todos | Detectar regressões nas regras de dinheiro e acesso |
| M-02 | Monitoramento de erros (ex.: Sentry) e alertas de falha de cron/webhook | PAGAMENTOS-002 | Saber de falhas antes do usuário |
| M-03 | Tabela de auditoria de ações administrativas | ADMIN-001 | Rastreabilidade |
| M-04 | Revisar `REVOKE EXECUTE ... FROM PUBLIC` nas funções `SECURITY DEFINER` (`expire_due_subscriptions`, `refresh_content_rankings`, `user_has_active_premium` para `anon`) | Banco | Menor superfície |
| M-05 | Reduzir `serverActions.bodySizeLimit` (20 MB) ao necessário para uploads | Plataforma | Menos superfície de DoS |
| M-06 | Teste de restauração de backup e backup dos arquivos do Storage | Banco | Recuperação comprovada |
| M-07 | Consolidar diretórios de domínio parecidos e atualizar `README.md` (cita `middleware.ts`) | Docs | Manutenção |
| M-08 | Decidir sobre WhatsApp: ativar (variáveis ausentes) ou remover crons/rotas sem uso | WHATSAPP-001 | Menos código morto e menos custo de cron |
