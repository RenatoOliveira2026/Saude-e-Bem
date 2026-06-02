# Saúde & Bem — Status do Projeto

> **Checkpoint de referência:** [Fase 3.2](https://github.com/RenatoOliveira2026/Saude-e-Bem)  
> **Commit:** `e1c43b4` — *Checkpoint Fase 3.2 - CMS completo, SEO, uploads, afiliados premium e portal público*  
> **Data:** 2026-06-01  
> **Branch:** `master`  
> **Produção alvo:** [saudeebem.com.br](https://saudeebem.com.br)  
> **Dev local:** [http://localhost:3001](http://localhost:3001) (`PORT=3001` em `.env.local`)

---

## Visão geral

Plataforma premium de saúde, bem-estar e longevidade com portal público, autenticação de usuários, painel administrativo e integração Supabase. O checkpoint atual consolida CMS profissional, SEO, uploads de mídia, portal de afiliados premium com tracking de cliques e home dinâmica alimentada pelo banco.

### Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Linguagem | TypeScript |
| Backend / Auth / DB | Supabase (PostgreSQL, Auth, Storage, RLS) |
| Fontes | Montserrat + Open Sans |

---

## Arquitetura atual

### Camadas da aplicação

```
src/
├── app/              # Rotas App Router (público, auth, admin, API)
├── components/       # UI, layout, brand, CMS, afiliados, páginas
├── lib/
│   ├── admin/        # Actions, services, sessão e permissões do painel
│   ├── affiliates/   # Tipos, categorias, mappers e tracking
│   ├── auth/         # Login, cadastro, sessão, rotas protegidas
│   ├── content/      # Agregadores de conteúdo (ex.: home)
│   ├── data/         # Tipos, mocks e repositórios
│   ├── seo/          # Helpers de metadata
│   └── supabase/     # Clientes, middleware, services e mappers
└── middleware.ts     # Sessão Supabase + guards de rota
```

### Fluxo de dados (portal público)

1. **Páginas Server Components** chamam repositórios em `src/lib/data/repositories/`.
2. Repositórios tentam **Supabase** via `withSupabaseFallback` / `withSupabaseListFallback`.
3. Se Supabase não estiver configurado, falhar ou retornar vazio, caem para **mocks locais** em `src/lib/data/*.ts`.
4. Conteúdo publicado (`status = 'published'`) é exposto publicamente via RLS; rascunhos e arquivados ficam restritos a admins.

### Autenticação e autorização

| Camada | Responsabilidade |
|--------|------------------|
| `middleware.ts` | Atualiza sessão Supabase; redireciona rotas privadas/auth |
| `requireUser()` | Exige usuário logado (Minha Jornada, Perfil) |
| `requireAdmin()` | Exige registro em `admin_users` + role |
| RLS PostgreSQL | Leitura pública de conteúdo; escrita admin; favoritos por usuário |

**Roles administrativos** (`super_admin` | `admin`):

- **super_admin** — conteúdo, usuários, administradores, configurações globais
- **admin** — conteúdo e usuários da plataforma (sem gerir admins)

### Server Actions e API

- **CMS e admin:** Server Actions em `src/lib/admin/actions/` (CRUD de artigos, protocolos, ebooks, afiliados, uploads).
- **Auth:** Server Actions em `src/lib/auth/actions.ts`.
- **Afiliados (tracking):** `GET /api/affiliates/[slug]/go` — registra clique e redireciona para URL de afiliado.

### Configuração relevante

- `next.config.ts`: imagens remotas Supabase Storage; `serverActions.bodySizeLimit: "20mb"`.
- `.env.local`: `NEXT_PUBLIC_SUPABASE_*`, `NEXT_PUBLIC_SITE_URL`, `PORT=3001`.
- Scripts carregam env via `scripts/with-env.mjs`.

---

## Banco de dados

Migrations em `supabase/migrations/` — executar em ordem no Supabase SQL Editor.

| # | Arquivo | Escopo |
|---|---------|--------|
| 001 | `profiles_and_preferences.sql` | Perfis, preferências, triggers de novo usuário, RLS |
| 002 | `content_and_favorites.sql` | `articles`, `protocols`, `ebooks`, `favorites`, RLS público |
| 003 | `seed_content.sql` | Seed inicial de conteúdo |
| 004 | `admin_users.sql` | Tabela `admin_users`, políticas admin em conteúdo |
| 005 | `bootstrap_admin.sql` | Bootstrap do primeiro admin |
| 006 | `admin_roles.sql` | Enum `admin_role`, funções `is_admin()`, `is_super_admin()` |
| 007 | `cms_storage.sql` | Campos de mídia + buckets Storage |
| 008 | `cms_professional.sql` | Status `archived`, SEO, conteúdo rico, `affiliate_links` |
| 009 | `home_public.sql` | `newsletter_leads`, leitura pública de afiliados ativos |
| 010 | `affiliate_featured.sql` | Coluna `featured` em afiliados |
| 011 | `affiliates_premium.sql` | Campos premium, `slug`, `affiliate_clicks`, tracking RLS |

### Tabelas principais

| Tabela | Uso |
|--------|-----|
| `profiles` | Perfil do usuário (nome, email) |
| `user_preferences` | Objetivo de saúde (`goal`) |
| `articles` | Blog — slug, excerpt, `content` JSONB, SEO, capa |
| `protocols` | Protocolos — benefícios/steps JSONB, premium, SEO, capa |
| `ebooks` | Biblioteca — highlights JSONB, PDF, SEO, capa |
| `favorites` | Favoritos por usuário (estrutura pronta; UI parcial) |
| `admin_users` | Equipe administrativa + role |
| `affiliate_links` | Produtos afiliados (campos premium + comercial) |
| `affiliate_clicks` | Tracking de cliques nos CTAs |
| `newsletter_leads` | Captura de email na home |

### Status de conteúdo

Valores: `published` | `draft` | `archived`

- **published** — visível no portal (RLS)
- **draft** / **archived** — apenas admins

### Funções auxiliares (PostgreSQL)

- `is_admin()` — qualquer registro em `admin_users`
- `is_super_admin()` — role `super_admin`
- `get_admin_role()` — role do usuário autenticado
- `handle_new_user()` — cria profile, preferences e bootstrap super_admin

---

## CMS

Painel em `/admin` com formulários dedicados por tipo de conteúdo.

### Recursos implementados

| Recurso | Artigos | Protocolos | E-books |
|---------|:-------:|:----------:|:-------:|
| Editor rico (blocos JSONB) | ✓ | ✓ | ✓ |
| Capa (upload imagem) | ✓ | ✓ | ✓ |
| PDF | — | — | ✓ |
| SEO (title, description, keywords, OG) | ✓ | ✓ | ✓ |
| Destaque (`featured`) | ✓ | ✓ | ✓ |
| Status draft / published / archived | ✓ | ✓ | ✓ |
| Preview antes de publicar | ✓ | ✓ | ✓ |

### Blocos de conteúdo (`ContentBlock`)

Tipos suportados: `paragraph`, `heading`, `image`, `list`, `blockquote`, `divider`.

- Editor: `RichContentEditor.tsx` + `ParagraphBlockEditor` (contentEditable estável, sem reset de cursor).
- Armazenamento: JSONB em `articles.content`, `protocols.content`, `ebooks.content`.
- Renderização pública: `ContentBlockRenderer` / `PublicArticleBody`.

### Componentes CMS (admin)

| Componente | Função |
|------------|--------|
| `CmsEditorShell` | Layout do editor com abas e barra de ações |
| `CmsSeoSection` | Campos SEO + OG image |
| `ImageUploadField` | Upload de capa via Server Action |
| `PdfUploadField` | Upload de PDF (biblioteca) |
| `CmsPreviewModal` | Preview visual do conteúdo |
| `ArticleCmsForm` / `ProtocolCmsForm` / `EbookCmsForm` | Formulários completos |

### Server Actions

- `articles.actions.ts`, `protocols.actions.ts`, `ebooks.actions.ts` — CRUD
- `upload.actions.ts` — upload para Supabase Storage
- Validação de tamanho em `upload-limits.ts` (5 MB imagem, 20 MB PDF)

---

## SEO

### Helper central

`src/lib/seo/metadata.ts` — `buildContentMetadata()` gera:

- `title` com sufixo `| Saúde & Bem`
- `description`
- Open Graph (`title`, `description`, `url`, `siteName`, `type`, `images`)
- Twitter Card (`summary` ou `summary_large_image`)

Base URL: `NEXT_PUBLIC_SITE_URL` (fallback `http://localhost:3001`).

### Onde é aplicado

| Página | Campos usados |
|--------|---------------|
| `/blog/[slug]` | `seo_*`, `og_image_url`, capa |
| `/protocolos/[slug]` | idem |
| `/biblioteca/[slug]` | idem |
| `/recomendados/[slug]` | `seo_*` do afiliado |

### Campos no banco (migration 008)

Por entidade de conteúdo e afiliados:

- `seo_title`, `seo_description`, `seo_keywords`, `og_image_url`

### Admin

Seção SEO nos formulários CMS (`CmsSeoSection`) e na aba SEO do formulário de afiliados premium.

---

## Storage

### Buckets Supabase (migration 007)

| Bucket | Público | Limite | MIME types |
|--------|---------|--------|------------|
| `cms-images` | Sim | 5 MB | jpeg, png, webp, gif, svg |
| `cms-pdfs` | Sim | 50 MB (bucket) / 20 MB (validação app) | application/pdf |

### Políticas

- **Leitura:** pública (`anon`, `authenticated`)
- **Escrita/update/delete:** apenas `is_admin()`

### Campos persistidos

| Tabela | Campo | Origem |
|--------|-------|--------|
| `articles` | `cover_image_url` | `cms-images` |
| `protocols` | `cover_image_url` | `cms-images` |
| `ebooks` | `cover_image_url`, `pdf_url` | `cms-images`, `cms-pdfs` |
| `affiliate_links` | `image_url` | URL manual ou upload futuro |

### Upload no app

- Service: `src/lib/admin/services/storage.service.ts` (`uploadCmsFile`)
- Paths: `{folder}/{timestamp}-{slug}.{ext}`
- Next.js Image: `remotePatterns` para `**.supabase.co/storage/v1/object/public/**`
- Limite Server Actions: 20 MB (`next.config.ts`)

---

## Afiliados

Evolução em três fases entregues no checkpoint:

| Fase | Entrega |
|------|---------|
| 2.9 | Tabela `affiliate_links` (admin only) |
| 3.0 | Seção na home + CRUD admin |
| 3.1 | `featured`, `/recomendados`, match por categoria em blog/protocolos |
| 3.2 | Portal premium, slug, tracking, dashboard de cliques |

### Modelo premium (`affiliate_links`)

Campos principais: `slug`, `product_type`, `brand`, preços, comissão, `affiliate_url`, `official_url`, benefícios, contraindicações, depoimentos, `video_url`, SEO, `featured`, `editor_choice`, `rating`, etc.

### Admin — formulário com 8 abas

`AffiliatePremiumForm.tsx`: Informações, Mídia, Conteúdo, Comercial, Afiliado, SEO, Prova social, Destaques.

> **Nota técnica:** `AdminFormTabs` renderiza todas as abas no DOM (ocultas com `hidden`) para incluir campos no submit.

### Portal público

| Rota | Descrição |
|------|-----------|
| `/recomendados` | Listagem de afiliados ativos |
| `/recomendados/[slug]` | Página de produto premium |
| Home | `AffiliatesRecommendedSection` (destaques) |
| Blog / Protocolos | `RelatedAffiliatesSection` (match de categoria) |

### Tracking de cliques

```
GET /api/affiliates/[slug]/go?source_page=...&source_type=...
  → valida slug ativo
  → insert em affiliate_clicks
  → redirect 302 para affiliate_url
```

- Componente: `AffiliateTrackLink.tsx`
- Service: `affiliates.clicks.ts`
- Dashboard admin: cards de cliques totais e últimos 30 dias

### Categorias de afiliados

Definidas em `src/lib/affiliates/categories.ts` (sono, energia, intestinal, detox, longevidade, menopausa, nutrição, mente, alimentação) com normalização e aliases para match com categorias de blog/protocolos.

### RLS

- Leitura pública: apenas `active = true` (migration 009)
- Escrita: admins
- `affiliate_clicks`: insert público; select apenas admins

---

## Rotas públicas

Definidas em `src/lib/routes.ts`.

### Portal e conteúdo

| Rota | Descrição | Auth |
|------|-----------|------|
| `/` | Home dinâmica (destaques, protocolos, biblioteca, afiliados) | — |
| `/blog` | Listagem de artigos | — |
| `/blog/[slug]` | Artigo individual | — |
| `/protocolos` | Listagem de protocolos | — |
| `/protocolos/[slug]` | Protocolo individual | — |
| `/biblioteca` | Materiais gratuitos | — |
| `/biblioteca/[slug]` | Download / detalhe do material | — |
| `/ferramentas` | Ferramentas (mock local) | — |
| `/ferramentas/[slug]` | Ferramenta individual | — |
| `/recomendados` | Afiliados recomendados | — |
| `/recomendados/[slug]` | Página premium do afiliado | — |
| `/clube` | Landing do Clube (conteúdo estático / em breve) | — |

### Conta do usuário

| Rota | Descrição | Auth |
|------|-----------|------|
| `/entrar` | Login | Pública (redireciona se logado) |
| `/cadastro` | Cadastro | Pública |
| `/recuperar-senha` | Recuperação | Pública |
| `/redefinir-senha` | Redefinição | Pública |
| `/minha-jornada` | Dashboard do usuário | **Requer login** |
| `/perfil` | Edição de perfil | **Requer login** |

### API

| Rota | Método | Descrição |
|------|--------|-----------|
| `/api/affiliates/[slug]/go` | GET | Tracking + redirect afiliado |
| `/auth/callback` | GET | Callback OAuth Supabase |

### Dev only

| Rota | Descrição |
|------|-----------|
| `/dev-login` | Login de desenvolvimento (bloqueado em produção) |

### Navegação

- Header: Início, Blog, Protocolos, Ferramentas, Biblioteca, Clube
- Footer: inclui link **Recomendados**
- Cross-nav entre seções de conteúdo

---

## Rotas admin

Base: `/admin` — exige login + registro em `admin_users`. Metadata com `robots: noindex`.

Definidas em `adminRoutes` (`src/lib/routes.ts`). Menu filtrado por role em `src/lib/admin/nav.ts`.

| Rota | Descrição | Roles |
|------|-----------|-------|
| `/admin` | Dashboard (stats, ações rápidas, integrações futuras) | super_admin, admin |
| `/admin/artigos` | Lista de artigos | super_admin, admin |
| `/admin/artigos/novo` | Criar artigo | super_admin, admin |
| `/admin/artigos/[id]/editar` | Editar artigo | super_admin, admin |
| `/admin/protocolos` | Lista de protocolos | super_admin, admin |
| `/admin/protocolos/novo` | Criar protocolo | super_admin, admin |
| `/admin/protocolos/[id]/editar` | Editar protocolo | super_admin, admin |
| `/admin/biblioteca` | Lista de e-books | super_admin, admin |
| `/admin/biblioteca/novo` | Criar material | super_admin, admin |
| `/admin/biblioteca/[id]/editar` | Editar material | super_admin, admin |
| `/admin/afiliados` | Lista de afiliados | super_admin, admin |
| `/admin/afiliados/novo` | Criar afiliado premium | super_admin, admin |
| `/admin/afiliados/[id]/editar` | Editar afiliado | super_admin, admin |
| `/admin/usuarios` | Usuários da plataforma | super_admin, admin |
| `/admin/administradores` | Gestão de admins | **super_admin** |
| `/admin/configuracoes` | Configurações globais | **super_admin** |

> `/admin/setup` redireciona para `/admin` (bootstrap via migrations).

---

## Scripts úteis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Dev server (porta via `.env.local`) |
| `npm run build` | Build de produção |
| `npm run validate:supabase` | Valida conexão Supabase |
| `npm run generate:content-seed` | Gera seed de conteúdo |
| `node scripts/audit-affiliates.mjs` | Auditoria de afiliados |
| `node scripts/validate-cms-storage.mjs` | Valida buckets CMS |

---

## Próximas fases

Itens já preparados no código ou no dashboard admin, ainda não entregues como produto completo.

### Fase 3.3 — Jornada do usuário

- UI em `/minha-jornada` (dashboard básico)
- Tabela `favorites` pronta; integração completa na UI pendente
- Roadmap em `src/lib/journey/future-features.ts`:
  - Favoritos persistentes
  - Protocolos em andamento (`user_protocols`)
  - Biblioteca pessoal (`user_library`)

### Fase 4.0 — Clube Saúde & Bem

- Landing `/clube` (conteúdo estático, lista de espera)
- Admin: placeholder "Clube Saúde & Bem" no dashboard
- Pendente: planos, assinaturas, conteúdo premium gated, gestão de membros

### Fase 4.1 — IA Saúde & Bem

- Placeholder no dashboard admin
- Pendente: assistente conversacional, recomendações personalizadas (`ai_conversations`)

### Fase 4.2 — Ferramentas interativas

- Rotas `/ferramentas` existem com dados mock
- Pendente: calculadoras/checklists persistidas, integração Supabase

### Fase 4.3 — Newsletter e CRM

- Tabela `newsletter_leads` + action na home
- Pendente: painel admin de leads, integração email (Resend, Mailchimp, etc.)

### Fase 4.4 — Analytics e monetização

- Tracking básico de afiliados (`affiliate_clicks`) ✓
- Pendente: relatórios avançados, funil, A/B, export CSV, metas de conversão

### Fase 5.0 — Produção e operação

- Deploy Vercel/hosting com env de produção
- Aplicar migrations 001–011 no Supabase de produção
- Domínio `saudeebem.com.br` + `NEXT_PUBLIC_SITE_URL`
- Monitoramento, backups, CI/CD

---

## Checklist pós-deploy (migrations)

Garantir no Supabase de produção:

- [ ] Migrations 001–011 aplicadas em ordem
- [ ] Buckets `cms-images` e `cms-pdfs` criados
- [ ] Primeiro super_admin bootstrapado (`005` / `006`)
- [ ] Variáveis `NEXT_PUBLIC_SUPABASE_*` e `NEXT_PUBLIC_SITE_URL` configuradas
- [ ] Smoke test: criar afiliado → `/recomendados/[slug]` → clique registrado

---

## Referências no repositório

| Área | Paths principais |
|------|------------------|
| Rotas | `src/lib/routes.ts`, `src/lib/auth/routes.ts` |
| Admin | `src/lib/admin/`, `src/app/admin/` |
| CMS | `src/components/admin/cms/`, `src/lib/admin/cms/` |
| Afiliados | `src/lib/affiliates/`, `src/components/affiliates/`, `src/app/recomendados/` |
| Supabase | `src/lib/supabase/`, `supabase/migrations/` |
| SEO | `src/lib/seo/metadata.ts` |
| Home | `src/lib/content/home.ts`, `src/app/page.tsx` |
