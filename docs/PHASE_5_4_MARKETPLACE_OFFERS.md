# Fase 5.4 — Marketplace de Ofertas Reais

**Status:** implementado no código — migration `034` pendente no Supabase de produção.

## 1. Área administrativa (`/admin/afiliados`)

Campos da oferta:

| Campo | Implementação |
|-------|----------------|
| Nome | `title` (obrigatório) |
| Categoria | 8 categorias oficiais (obrigatório) |
| Imagem | `image_url` (obrigatório no servidor) |
| Descrição curta | `short_description` (obrigatório) |
| Benefícios | `benefits` (textarea) |
| URL afiliada | `affiliate_url` (obrigatório) |
| Plataforma | Amazon, Hotmart, Kiwify, Eduzz, Braip (+ Monetizze/Outra) |
| Destaque | `featured` — seção Destaques em `/recomendados` |
| Status | `active` ativo/inativo |

Formulário: `AffiliatePremiumForm.tsx` (8 abas).

## 2. Página pública `/recomendados`

Seções implementadas em `RecomendadosMarketplace.tsx`:

- **Destaques** — `featured`
- **Mais acessados** — ranking por cliques (30 dias)
- **Novidades** — `created_at` desc
- **Categorias** — blocos por taxonomia oficial
- **Catálogo completo** — busca + filtros (`RecomendadosListing`)

Mobile: carrossel horizontal (`snap-x`) nas seções Destaques e Mais acessados.

## 3. Detalhe `/recomendados/[slug]`

- Benefícios (lista)
- CTA principal **Acessar Site Oficial** (hero + banner)
- **Produtos relacionados** (mesma categoria)
- SEO: Schema Product, OG, Twitter, canonical

## 4. Analytics (`/admin/afiliados`)

- Cliques por produto
- Conversão estimada (modelo por plataforma — placeholder)
- Top categorias
- Ranking de produtos (cliques + conv. est.)
- Cliques por dia (14 dias)

Camada: `conversion-estimate.ts` + `getAffiliateClickReport()`.

## 5. Migration

`034_phase_5_4_marketplace.sql`:

- Coluna `short_description`
- View `affiliate_products` atualizada

## Pendências futuras

1. Aplicar migration 034 em produção
2. Integração real de conversão com APIs de parceiros
3. Exportação CSV de cliques no admin
