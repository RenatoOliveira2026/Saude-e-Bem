# Fase 4.9 — Marketplace Saúde & Bem

Área de produtos digitais e afiliados integrada ao perfil do usuário, com monetização via e-books próprios, produtos afiliados e recomendações baseadas no Score Saúde & Bem.

## Objetivo

- Catálogo unificado: digitais (biblioteca), afiliados (Supabase) e assinatura Premium
- Páginas públicas `/marketplace` e `/marketplace/[slug]`
- Recomendações personalizadas em **Minha Saúde** (1–3 produtos por lacunas do score)

## Arquitetura

```
src/lib/marketplace/
  marketplace.types.ts
  marketplace-catalog.ts      # Mock inicial (8 itens)
  marketplace-filters.ts
  marketplace-mapper.ts       # Afiliados → MarketplaceItem
  marketplace-matching.ts     # recommendMarketplaceProducts()
  marketplace.service.ts
  index.ts

src/components/marketplace/
  MarketplaceCard.tsx
  MarketplaceListing.tsx
  MarketplaceDetail.tsx
  RecommendedProductsSection.tsx
  index.ts

src/app/marketplace/
  page.tsx
  [slug]/page.tsx
```

## Tipos principais

| Campo | Descrição |
|-------|-----------|
| `fulfillment` | `digital` \| `affiliate` \| `subscription` |
| `librarySlug` | Link para `/biblioteca/[slug]` (digitais) |
| `affiliateSlug` | Link para tracking `/api/affiliates/[slug]/go` |
| `isPremium` | Exige assinatura Premium |

## Catálogo mock (`MARKETPLACE_CATALOG`)

| Tipo | Qtd | Destino |
|------|-----|---------|
| Digital (FREE) | 2 | Biblioteca |
| Digital (PREMIUM) | 2 | Biblioteca + gate |
| Afiliado | 3 | Mock local + merge Supabase |
| Assinatura | 1 | `/assinar` |

Afiliados ativos no Supabase são mesclados automaticamente via `fetchAllActiveAffiliateLinks()`.

## Filtros do listing

| ID | Label |
|----|-------|
| `todos` | Todos |
| `digitais` | Digitais |
| `afiliados` | Afiliados |
| `premium` | Premium |
| `ebooks` | E-books |

## Recomendações inteligentes

`recommendMarketplaceProducts(records, catalog)` em `marketplace-matching.ts`:

- Usa `getUnmetCriteria()` e categorias do score
- Retorna 1–3 produtos com `reason`, `priority`, `matchScore`, `href`
- Integrado em `getHealthProfileData()` → `HealthProfileDashboard`

## Tracking de afiliados

Novos `AffiliateSourceType`:

| Valor | Uso |
|-------|-----|
| `marketplace` | Listing e cards do marketplace |
| `minha-saude` | Seção de produtos recomendados |

## Rotas

| Rota | Descrição |
|------|-----------|
| `/marketplace` | Catálogo com filtros |
| `/marketplace/[slug]` | Detalhe do produto |
| `/minha-saude` | Seção "Produtos recomendados para você" |

Adicionado em `routes.ts`: nav principal, footer e cross-links.

## Futuro (sem migration nesta fase)

- Tabela `marketplace_products` no Supabase
- Checkout próprio para e-books pagos
- Admin CRUD de produtos marketplace

## Checklist de validação

- [ ] `/marketplace` lista digitais + afiliados + assinatura
- [ ] Filtros funcionam (todos, digitais, afiliados, premium, e-books)
- [ ] `/marketplace/[slug]` exibe CTA correto por `fulfillment`
- [ ] Minha Saúde mostra 1–3 produtos após uso de ferramentas
- [ ] Links afiliados passam por `/api/affiliates/[slug]/go` com source correto
- [ ] `npm run build` passa
