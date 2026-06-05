# Fase 5.0 — Content Engine (Conteúdo Real e Monetização)

Prepara o Saúde & Bem para receber conteúdos reais: e-books, artigos e produtos afiliados/próprios — com seeds, Supabase e painel administrativo.

## Objetivo

- Biblioteca com camadas **Gratuitos** e **Premium**
- Blog com 5 categorias oficiais
- Marketplace com **digitais**, **afiliados** e **próprios**
- Seeds iniciais: 10 artigos, 6 e-books, 10 produtos
- Admin organizado em **Conteúdos**, **Biblioteca** e **Marketplace**

## Migrations

| Arquivo | Descrição |
|---------|-----------|
| `024_content_engine.sql` | Tabelas `library_items` e `marketplace_products` + RLS |
| `025_seed_content_engine.sql` | Seed 6 e-books + 10 produtos (gerado) |
| `003_seed_content.sql` | Atualizado — 10 artigos com novas categorias (gerado) |

### Gerar seeds

```bash
npm run generate:content-seed
```

## Arquitetura

```
src/lib/content-engine/
  constants.ts              # Categorias blog, tiers biblioteca, fulfillment marketplace
  mappers.ts                # Seed → LibraryItem / MarketplaceItem
  seed/
    articles.ts             # 10 artigos
    library-items.ts        # 6 e-books
    marketplace-products.ts # 10 produtos
  index.ts

scripts/content-engine-seed-data.mjs   # Fonte para SQL generator
scripts/generate-content-seed.mjs      # Gera 003 + 025
```

## Blog — categorias oficiais

| Slug | Label |
|------|-------|
| `hidratacao` | Hidratação |
| `sono` | Sono |
| `emagrecimento` | Emagrecimento |
| `saude-cardiovascular` | Saúde Cardiovascular |
| `longevidade` | Longevidade |

## Biblioteca — camadas

| Tier | Descrição |
|------|-----------|
| `free` | Gratuito |
| `premium` | Premium (Clube) |

Leitura pública: `fetchIntelligentLibraryItems()` → Supabase `library_items` com fallback para seeds locais.

## Marketplace — tipos

| Fulfillment | Descrição |
|-------------|-----------|
| `digital` | Link para biblioteca |
| `affiliate` | Produto afiliado |
| `own` | Produto próprio Saúde & Bem |
| `subscription` | Clube Premium |

Filtro adicional: **Próprios** (`proprios`).

Leitura pública: `fetchMarketplaceItems()` → Supabase + merge afiliados ativos.

## Admin

| Rota | Função |
|------|--------|
| `/admin/conteudos` | Hub — Conteúdos, Biblioteca, Marketplace |
| `/admin/biblioteca-itens` | CRUD biblioteca digital |
| `/admin/marketplace` | CRUD produtos marketplace |
| `/admin` | Dashboard com 3 seções |

Legacy mantido: `/admin/biblioteca` (ebooks CMS antigo), `/admin/artigos`, `/admin/protocolos`, `/admin/afiliados`.

## Seeds incluídos

| Tipo | Qtd | IDs prefix |
|------|-----|------------|
| Artigos | 10 | `a1000001-*` |
| E-books (library_items) | 6 | `d4000004-*` |
| Produtos marketplace | 10 | `e5000005-*` |

## Não alterado (restrito)

- Score Saúde & Bem
- Minha Saúde (apenas consome marketplace existente)
- Ferramentas
- Protocolos inteligentes / biblioteca de protocolos
- Leads
- Assinaturas / pagamentos

## Checklist de validação

- [ ] Migrations `024` e `025` aplicadas no Supabase
- [ ] `npm run generate:content-seed` regenera 003 e 025
- [ ] `/blog` — 5 categorias e 10 artigos
- [ ] `/biblioteca` — itens gratuitos/premium
- [ ] `/marketplace` — digitais, afiliados, próprios
- [ ] `/admin/conteudos` — hub funcional
- [ ] `/admin/biblioteca-itens` e `/admin/marketplace` — CRUD
- [ ] `npm run build` passa

## Produção

Aplicar migrations pendentes (incluindo `022`, `023` se ainda não aplicadas) e executar seeds:

1. `024_content_engine.sql`
2. `003_seed_content.sql` (re-seed artigos se necessário)
3. `025_seed_content_engine.sql`
