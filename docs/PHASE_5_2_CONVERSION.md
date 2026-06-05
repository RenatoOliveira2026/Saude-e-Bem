# Fase 5.2 — Conteúdo Comercial e Conversão

Transforma visitantes em leads e assinantes com landing pages temáticas, CTAs contextuais, lead score, automação de e-mail preparada para ESPs e dashboard administrativo.

## Objetivo

- **Landing pages** com captura de lead por tema
- **CTA inteligente** em artigos, protocolos e biblioteca (detalhe)
- **Lead score** (frio → muito quente) persistido no Supabase
- **Automação de e-mails** estruturada (sequências + dispatcher)
- **Página `/obrigado`** com recomendações personalizadas
- **Dashboard `/admin/leads`** com filtros e export CSV
- **Preparação ESP:** Brevo, MailerLite, RD Station, HubSpot

## Escopo excluído (não alterado)

Minha Saúde, Marketplace (módulo), Biblioteca inteligente (componentes internos), Assinaturas, SEO global (sitemap/robots/json-ld infra), Protocolos Inteligentes.

> CTAs foram adicionados apenas nas **páginas de detalhe** (`/blog/[slug]`, `/protocolos/[slug]`, `/biblioteca/[slug]`), sem modificar os módulos core listados acima.

## Migration

| Arquivo | Descrição |
|---------|-----------|
| `027_lead_score_conversion.sql` | Colunas `lead_score` e `content_context` em `newsletter_leads` |

### Ordem de execução no Supabase

1. `023_newsletter_leads.sql` (se ainda não aplicada)
2. `027_lead_score_conversion.sql`

### Colunas novas

| Coluna | Tipo | Valores |
|--------|------|---------|
| `lead_score` | `text` | `frio`, `morno`, `quente`, `muito_quente` |
| `content_context` | `jsonb` | `content_type`, `content_slug`, `content_title`, `lp_slug` |

## Landing pages

| Rota | Interesse | Origem (`source`) |
|------|-----------|-------------------|
| `/lp-hidratacao` | hidratação | `lp-hidratacao` |
| `/lp-emagrecimento` | emagrecimento | `lp-emagrecimento` |
| `/lp-longevidade` | longevidade | `lp-longevidade` |
| `/lp-sono` | sono | `lp-sono` |

- Config central: `src/lib/conversion/landing-pages.config.ts`
- Componente: `src/components/conversion/LandingPageView.tsx`
- **SEO:** `robots: { index: false }` — páginas de campanha, fora do sitemap

## CTA inteligente

Componente: `SmartConversionCta` (`src/components/conversion/SmartConversionCta.tsx`)

Mapeia categoria do conteúdo → interesse → landing page relacionada via `conversion-mapping.ts`.

| Contexto | Página | `source` no cadastro |
|----------|--------|----------------------|
| `article` | `/blog/[slug]` | `artigo` |
| `protocol` | `/protocolos/[slug]` | `protocolo` |
| `library` | `/biblioteca/[slug]` | `biblioteca` |

Cada CTA inclui:
1. Formulário de captura (`LeadCaptureSection`) com interesse pré-selecionado
2. Upsell secundário (guia completo + Clube Saúde & Bem)

## Lead score

Lógica: `src/lib/leads/lead-score.ts` → `computeLeadScore()`

| Score | Regra principal |
|-------|-----------------|
| **Muito quente** | Origem `assinar` |
| **Quente** | LPs (`lp-*`), artigo, protocolo, biblioteca com contexto |
| **Morno** | Blog, biblioteca (geral), minha-saude |
| **Frio** | Home e demais |

Persistido em `newsletter_leads.lead_score` no `saveLeadAction`.

## Automação de e-mails

```
src/lib/email-automation/
  types.ts          # Tipos de sequência, step, payload
  sequences.ts      # Sequências por interesse + oferta Clube (leads quentes)
  dispatcher.ts     # triggerLeadAutomation() — log + sync ESP
  providers/        # Stubs Brevo, MailerLite, RD Station, HubSpot
```

### Sequências definidas

- `welcome-hidratacao`, `welcome-emagrecimento`, `welcome-sono`, `welcome-longevidade`
- `hot-clube-offer` — leads com score ≥ quente

### Variáveis ESP (futuro)

```env
BREVO_API_KEY=
MAILERLITE_API_KEY=
RDSTATION_API_KEY=
HUBSPOT_API_KEY=
```

Sem chaves configuradas, o dispatcher registra a sequência e retorna `skipped: true` (sem erro).

## Página `/obrigado`

- Confirma cadastro com origem, interesse e score
- `ThankYouRecommendations` — links para LP do interesse, blog, protocolos e Clube
- Query params: `source`, `type=lead`, `interest`, `score`, `existing=1`

## Admin — `/admin/leads`

- Stats por temperatura (frio / morno / quente / muito quente)
- Filtros por origem e score
- Tabela com nome, e-mail, interesse, origem, score, data
- Export CSV: `/api/admin/leads/export`
- Badge de ESP configurado ou pendente

Serviço: `src/lib/admin/services/leads.service.ts`

> A tabela `newsletter_subscribers` (legacy) permanece separada; export legacy em `/api/admin/newsletter/export`.

## Fluxo de captura

```mermaid
flowchart LR
  A[Visitante] --> B{Origem}
  B -->|LP / Artigo / Protocolo / Biblioteca| C[LeadCaptureForm]
  C --> D[saveLeadAction]
  D --> E[computeLeadScore]
  E --> F[(newsletter_leads)]
  D --> G[triggerLeadAutomation]
  G --> H{ESP configurado?}
  H -->|Sim| I[syncLeadToProviders]
  H -->|Não| J[Log skipped]
  D --> K[/obrigado + recomendações]
```

## Arquivos principais

| Área | Caminhos |
|------|----------|
| Migration | `supabase/migrations/027_lead_score_conversion.sql` |
| Lead score | `src/lib/leads/lead-score.ts` |
| Conversão | `src/lib/conversion/*`, `src/components/conversion/*` |
| LPs | `src/app/lp-*/page.tsx` |
| Obrigado | `src/app/obrigado/page.tsx` |
| Admin | `src/app/admin/leads/page.tsx`, `src/app/api/admin/leads/export/route.ts` |
| E-mail | `src/lib/email-automation/*` |

## Build

```bash
npm run build
```

Build validado na Fase 5.2.

## Próximos passos (fora do escopo)

1. Implementar APIs reais nos providers ESP
2. Templates de e-mail (HTML) por `templateKey`
3. Job/cron para steps com `delay`
4. Campanhas pagas apontando para LPs (`utm_*` tracking)
5. Regras de upgrade de score em re-capturas (lead existente)
