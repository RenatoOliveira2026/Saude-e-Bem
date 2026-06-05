# Fase 4.6 — Biblioteca Inteligente

Biblioteca Saúde & Bem com catálogo mockado, filtros por tipo e tier (gratuito/premium), pronta para escalar com Supabase Storage, assinaturas e monetização.

## Objetivo

Estrutura completa em `/biblioteca` para materiais gratuitos e premium, sem alterar autenticação, score, protocolos inteligentes ou ferramentas.

## Arquitetura

```
src/lib/intelligent-library/
  library.types.ts      # LibraryItem, filtros, assets (Storage/afiliados)
  library-catalog.ts    # Catálogo mockado (8 itens)
  library-filters.ts    # Filtros: todos, gratuitos, premium, tipos
  library.service.ts    # fetch* — ponto único para futuro Supabase
  index.ts

src/components/intelligent-library/
  IntelligentLibraryCard.tsx       # Card + banner destaque
  IntelligentLibraryListing.tsx    # Listagem com filtros (client)
  IntelligentLibraryDetail.tsx     # Página de detalhe
  index.ts

src/app/biblioteca/
  page.tsx              # Listagem inteligente
  [slug]/page.tsx       # Detalhe (inteligente + legado ebooks)
```

## Rota

| Rota | Descrição |
|------|-----------|
| `/biblioteca` | Catálogo com filtros e cards |
| `/biblioteca/[slug]` | Detalhe do material (catálogo inteligente ou ebooks legados) |

## Filtros

| ID | Label |
|----|-------|
| `todos` | Todos |
| `gratuitos` | Gratuitos |
| `premium` | Premium |
| `ebooks` | E-books |
| `protocolos` | Protocolos |
| `videos` | Vídeos |

## Estrutura `LibraryItem`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | Identificador único |
| `slug` | string | URL `/biblioteca/[slug]` |
| `title` | string | Título |
| `description` | string | Resumo |
| `category` | string | Categoria temática |
| `type` | `ebook \| protocolo \| video \| pdf \| affiliate` | Tipo de material |
| `isPremium` | boolean | Tier de acesso |
| `image` | string? | Capa (futuro CDN/Storage) |
| `estimatedReadTime` | string | Tempo ou duração |
| `assets` | object? | `storagePath`, `pdfUrl`, `videoUrl`, `affiliateUrl` |

## Catálogo inicial (mock)

| Material | Tipo | Tier |
|----------|------|------|
| Guia da Hidratação | E-book | Gratuito |
| Checklist Saúde Preventiva | E-book | Gratuito |
| Manual da Longevidade | E-book | Premium |
| Protocolo Energia Diária | Protocolo | Gratuito |
| Sono Reparador | Protocolo | Gratuito |
| Plano Saúde Metabólica | Protocolo | Premium |
| Rotina Matinal em 10 Minutos | Vídeo | Gratuito |
| Masterclass Longevidade Ativa | Vídeo | Premium |

## UI

- **Badge:** `Gratuito` (sage) ou `Premium` (gold)
- **Gratuito:** botão **Acessar conteúdo** → `/biblioteca/[slug]`
- **Premium:** botão **Assinar para acessar** → `/assinar`
- Grid responsivo `sm:grid-cols-2 lg:grid-cols-3`
- Banner de destaque no topo (item `featured`)

## Integração futura

### Supabase Storage

1. Criar tabela `library_items` espelhando `LibraryItem`
2. Em `fetchIntelligentLibraryItems()`, buscar Supabase com fallback para `INTELLIGENT_LIBRARY_CATALOG`
3. Preencher `assets.storagePath` e gerar URL assinada no detalhe
4. Bucket sugerido: `library` (`ebooks/`, `protocolos/`, `videos/`)

### PDFs e e-books

- `assets.pdfUrl` / `assets.ebookFileUrl` após upload no Storage
- `resolveLibraryAssetUrl()` centraliza a resolução de URL

### Vídeos

- `assets.videoUrl` ou embed via Storage/CDN
- Filtro `videos` já operacional

### Produtos afiliados

- `type: "affiliate"` + `assets.affiliateProductId` / `affiliateUrl`
- Card pode abrir link externo ou página de recomendados

### Assinaturas

- Materiais premium redirecionam para `/assinar`
- Após Fase 5+: gate no detalhe com verificação de plano ativo

## O que não foi alterado

- Autenticação e sessão
- Score Saúde & Bem (`/minha-saude`)
- Motor de protocolos inteligentes (Fase 4.5)
- Ferramentas interativas
- Admin CMS de ebooks (`/admin/biblioteca`) — legado preservado

## Teste manual

1. Abrir `/biblioteca`
2. Testar cada filtro (Todos, Gratuitos, Premium, E-books, Protocolos, Vídeos)
3. Clicar **Acessar conteúdo** em item gratuito → detalhe
4. Clicar **Assinar para acessar** em item premium → `/assinar`
5. Verificar banner de destaque (Guia da Hidratação)
6. Slugs legados de ebooks continuam funcionando em `/biblioteca/[slug]`

## Build

```bash
npm run build
```

## Próximos passos (Fase 5+)

- [ ] Migration `library_items` + RLS
- [ ] Upload admin para Storage
- [ ] Gate premium por assinatura ativa
- [ ] Download/stream real de PDFs e vídeos
- [ ] Recomendações cruzadas com `/minha-saude` e Clube
