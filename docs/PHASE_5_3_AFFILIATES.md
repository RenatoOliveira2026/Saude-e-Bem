# Fase 5.3 — Central de Recomendações e Afiliados

**Projeto:** Saúde & Bem  
**Status:** implementado no código — migration `033` pendente no Supabase de produção.

## Funcionalidades

| Item | Implementação |
|------|----------------|
| Central `/recomendados` | Listagem com 8 categorias oficiais + filtros |
| Banco de produtos | Tabela `affiliate_links` + view `affiliate_products` |
| Tracking de cliques | Tabela `affiliate_clicks` + rota `/api/affiliates/[slug]/go` |
| Cards | Imagem, descrição, benefícios, CTA **Acessar Site Oficial** |
| SEO | `buildContentMetadata` (OG + Twitter) + JSON-LD `Product` na página de detalhe |
| Admin `/admin/afiliados` | CRUD existente + relatórios de cliques |
| Integração futura | `src/lib/affiliates/partners/` (Amazon, Hotmart, Kiwify, Eduzz, Braip) |

## Tabelas

### `affiliate_links` (produtos — canonical)

Campos principais mapeados para spec `affiliate_products`:

| Spec | Campo real |
|------|------------|
| `id` | `id` |
| `title` | `title` |
| `slug` | `slug` |
| `description` | `description` |
| `image_url` | `image_url` |
| `category` | `category` |
| `affiliate_url` | `affiliate_url` / `url` |
| `partner` | `brand` ou `affiliate_platform` |
| `is_featured` | `featured` |
| `created_at` | `created_at` |

**View:** `affiliate_products` (migration 033) — leitura compatível com a spec.

### `affiliate_clicks`

| Campo | Notas |
|-------|-------|
| `id` | uuid |
| `affiliate_id` | FK → produto (`product_id` na spec) |
| `source_page` | Página de origem |
| `source_type` | Tipo de origem |
| `user_agent` | Novo — migration 033 |
| `referrer` | Novo — migration 033 |
| `created_at` | timestamptz |

## Categorias (Fase 5.3)

1. Suplementos  
2. Livros  
3. Saúde Mental  
4. Exercícios  
5. Sono  
6. Alimentação Saudável  
7. Equipamentos de Saúde  
8. Bem-estar  

Categorias legadas são migradas automaticamente (migration 033).

## Rotas

| Rota | Função |
|------|--------|
| `/recomendados` | Central de recomendações |
| `/recomendados/[slug]` | Detalhe do produto |
| `/api/affiliates/[slug]/go` | Tracking + redirect |
| `/admin/afiliados` | Painel + relatórios |
| `/admin/afiliados/novo` | Cadastrar produto |
| `/admin/afiliados/[id]/editar` | Editar produto |

## Eventos

| Evento | Onde |
|--------|------|
| `affiliate_click` (GA4) | `AffiliateTrackLink` → `sendGa4AffiliateClick` |
| `affiliate_click` (interno) | `trackEvent` na rota `/go` |
| INSERT | `affiliate_clicks` com user_agent e referrer |

Parâmetros GA4: `product_slug`, `source_page`, `page_source`, `device_category`, `event_timestamp`.

## Métricas no admin

- Total de cliques  
- Cliques últimos 7 e 30 dias  
- Produtos mais clicados  
- Categorias mais acessadas  
- Cliques por dia (últimos 14 dias)  
- Cliques por produto no catálogo  

## Pendências futuras

1. Aplicar migration `033_phase_5_3_affiliates.sql` em produção  
2. Conectar APIs de parceiros (Amazon PA-API, Hotmart, etc.)  
3. Exportação CSV de cliques no admin  
4. Automação de sincronização de catálogo por plataforma  

## Arquivos principais

```
src/app/recomendados/
src/app/admin/afiliados/
src/lib/affiliates/partners/
src/lib/supabase/services/affiliates.clicks.ts
supabase/migrations/033_phase_5_3_affiliates.sql
```
