# Fase 5.1 — Conteúdo Real e SEO

Substitui conteúdos mock da Biblioteca, Blog e Marketplace por conteúdo editorial real, preparado para indexação no Google e monetização do Clube Saúde & Bem.

## Objetivo

- **Blog:** 10 artigos com 5 parágrafos editoriais cada + metadados SEO
- **Biblioteca:** 6 e-books com descrição longa e campos SEO
- **Marketplace:** 10 produtos com SEO e imagens OG
- **Infra SEO:** sitemap, robots, JSON-LD, canonical, Open Graph
- **Admin:** campos SEO em Biblioteca e Marketplace (paridade com CMS de artigos)

## Escopo excluído (não alterado)

Score, Minha Saúde (lógica), Ferramentas, Protocolos inteligentes, Leads, Assinaturas/pagamentos.

## Migrations

| Arquivo | Descrição |
|---------|-----------|
| `026_seo_content_engine.sql` | Colunas SEO em `library_items` e `marketplace_products` |
| `003_seed_content.sql` | Regenerado — 10 artigos com conteúdo longo + SEO |
| `025_seed_content_engine.sql` | Regenerado — biblioteca + marketplace com SEO |

### Ordem de execução no Supabase

1. `024_content_engine.sql` (se ainda não aplicada)
2. `026_seo_content_engine.sql`
3. `003_seed_content.sql` e/ou `025_seed_content_engine.sql` (re-seed)

### Gerar seeds localmente

```bash
npm run generate:content-seed
```

O gerador enriquece artigos via `scripts/article-bodies.mjs` (espelha `src/lib/content-engine/seed/article-bodies.ts`).

## Variável de ambiente

```env
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com.br
```

Usada em canonical URLs, sitemap, robots e JSON-LD. Em dev, default: `http://localhost:3001`.

## Arquitetura SEO

```
src/lib/seo/
  site-url.ts      # getSiteUrl(), absoluteUrl()
  metadata.ts      # buildContentMetadata() — canonical, OG, Twitter
  json-ld.ts       # Organization, WebSite, Article, Book, Product, Breadcrumb

src/app/
  robots.ts        # Allow/disallow + sitemap
  sitemap.ts       # Blog, biblioteca, marketplace + rotas estáticas

src/components/seo/
  JsonLd.tsx       # <script type="application/ld+json">
```

## Conteúdo real (seeds TypeScript)

| Módulo | Arquivo | Itens |
|--------|---------|-------|
| Blog | `seed/articles.ts` + `article-bodies.ts` | 10 artigos × 5 parágrafos |
| Biblioteca | `seed/library-items.ts` | 6 e-books |
| Marketplace | `seed/marketplace-products.ts` | 10 produtos |

Fallback local: se Supabase estiver indisponível, o app serve seeds TS. Com DB populado, Supabase é fonte primária.

## Páginas com SEO completo

| Rota | Metadata | JSON-LD |
|------|----------|---------|
| `/blog/[slug]` | title, description, OG, keywords, publishedTime | Article + Breadcrumb |
| `/biblioteca/[slug]` | idem (inteligente + legacy) | Book + Breadcrumb |
| `/marketplace/[slug]` | idem + preço no Product schema | Product + Breadcrumb |
| Layout raiz | `metadataBase` | Organization + WebSite |

## Admin

| Formulário | Campos novos |
|------------|--------------|
| `LibraryItemForm` | `long_description`, `CmsSeoSection` |
| `MarketplaceProductForm` | `CmsSeoSection` |

Persistência via `parseSeoFields()` em `library-items.actions.ts` e `marketplace.actions.ts`.

## Monetização Clube

Artigos e materiais marcados `is_premium: true` continuam protegidos por `PremiumContentGuard`. Metadados SEO indicam `isAccessibleForFree: false` no JSON-LD para conteúdo premium — o Google indexa a página, mas o corpo completo exige assinatura.

## Checklist pós-deploy

- [ ] `NEXT_PUBLIC_SITE_URL` configurada em produção
- [ ] Migration `026` aplicada
- [ ] Re-seed `003` + `025` executado
- [ ] Verificar `/sitemap.xml` e `/robots.txt`
- [ ] Testar compartilhamento OG (Facebook Debugger / Twitter Card Validator)
- [ ] Google Search Console: enviar sitemap
