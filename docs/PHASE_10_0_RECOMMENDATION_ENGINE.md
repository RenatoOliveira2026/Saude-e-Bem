# Fase 10.0 — Motor de Recomendação Inteligente

**Data:** 2026-06-01  
**Status:** Implementado · Build OK (`npm run build`)  
**Escopo:** Perfil inteligente, motor de scoring, relações entre conteúdos, dashboard em Minha Jornada, admin de KPIs e camada `ai-bridge` para IA conversacional futura — **sem** chatbot, **sem** OpenAI, **sem** migrations, Mercado Pago, Auth core, Supabase schema, webhooks ou fluxo Premium de pagamento.

---

## 1. Resumo executivo

A Fase 10.0 introduz a primeira camada de inteligência da plataforma Saúde & Bem. O motor utiliza exclusivamente conteúdos internos (artigos, protocolos, biblioteca, ferramentas, trilhas) e metadados do `CONTENT_INTELLIGENCE_REGISTRY` (Fase 9.4) para gerar recomendações personalizadas por objetivo, histórico, dificuldade, tempo disponível e progresso — priorizando itens ainda não consumidos.

---

## 2. Arquitetura do motor

```mermaid
flowchart TB
  subgraph inputs [Entradas]
    P[Perfil / preferences.goal]
    A[UserActivitySnapshot]
    T[TrailProgress]
    C[CatalogItem registry + repositórios]
    R[CONTENT_INTELLIGENCE_REGISTRY]
  end

  subgraph engine [src/lib/recommendation-engine]
    UP[buildIntelligentUserProfile]
    SC[scoreCatalogItem]
    GEN[generateRecommendations]
    REL[getAlsoBenefitSuggestions]
    JP[buildIntelligentJourneyPanel]
    BR[recommendationEngineBridge]
  end

  subgraph outputs [Saídas]
    J[Minha Jornada — IntelligentJourneySection]
    AD[/admin/recomendacoes]
    AI[Futura IA conversacional]
  end

  P --> UP
  A --> UP
  T --> UP
  C --> GEN
  R --> SC
  UP --> SC
  SC --> GEN
  GEN --> JP
  R --> REL
  GEN --> JP
  JP --> J
  GEN --> AD
  JP --> BR
  BR --> AI
```

### Pipeline de scoring (`engine.ts`)

| Fator | Peso aproximado | Descrição |
|-------|-----------------|-----------|
| Não consumido | +35 | Prioriza conteúdo novo para o usuário |
| Já consumido | −20 | Penaliza repetição imediata |
| Objetivo principal | até +30 | Alinhamento com `goalObjective` |
| Nível vs preferido | até +15 | Iniciante / Intermediário / Avançado |
| Tempo disponível | até +12 | `estimatedMinutes` vs `availableMinutes` |
| Novidade (`isNew`) | +8 | Registry Fase 9.4 |
| Relacionado consumido | +12 | `related` no registry |

### Perfil inteligente (`user-profile.ts`)

- Score por categoria (`CategoryScore[]`) para os 9 objetivos de conteúdo
- Boost por objetivo declarado, trilhas iniciadas/concluídas, artigos, protocolos e downloads
- `consumedKeys` derivado de `activity.accessed`
- `preferredLevel` e `availableMinutes` inferidos do histórico

### Relacionamentos (`relationships.ts`)

- Usa `related` do registry → mensagem *"Quem leu este artigo também pode se beneficiar deste protocolo"*
- Fallback por `primaryObjective` compartilhado no catálogo

---

## 3. Entregas por etapa

### Etapa 1 — Perfil do usuário

`buildIntelligentUserProfile()` em `user-profile.ts`

### Etapa 2 — Motor de recomendação

`generateRecommendations()`, `scoreCatalogItem()`, `pickNextStep()`, `pickRecommendationOfTheDay()`

### Etapa 3 — Relacionamento entre conteúdos

`getAlsoBenefitSuggestions()`, `getAlsoBenefitFromLastConsumed()`

### Etapa 4 — Dashboard inteligente (Minha Jornada)

- `IntelligentJourneySection` — recomendação do dia, próximo passo, artigo/protocolo/biblioteca, "também pode te ajudar"
- Integrado em `JourneyDashboard` via `getJourneyData().intelligentPanel`
- Cliques rastreados: GA4 `recommendation_click`

### Etapa 5 — Administração

- `/admin/recomendacoes` — KPIs, top recomendados, top aceitos (`content_rankings`), categorias, CTR proxy
- Menu admin: **Recomendações**

### Etapa 6 — Preparação IA conversacional

- `RecommendationEngineService` + `createRecommendationEngineBridge()`
- `loadRecommendationEngineContext()` / `recommendationEngineBridge`
- Sem integração OpenAI nesta fase

---

## 4. Plano para IA conversacional (Fase 10.x+)

1. **Injetar bridge** — O agente LLM chama `recommendationEngineBridge.getContext({ userId, goalKey, isPremium })` antes de responder.
2. **Contexto estruturado** — Retorna `profile`, `recommendations`, `journeyPanel`, `alsoBenefit` em JSON tipado (sem alucinar slugs).
3. **explainRecommendation** — Expandir stub para narrativa natural a partir de `reason`, `objective`, `level`.
4. **Tool calling** — Expor endpoints `/api/ai/recommendations` que delegam ao bridge (auth session).
5. **RAG opcional** — Embeddings sobre corpo dos artigos; o motor continua como ranker determinístico.
6. **Guardrails** — Disclaimer médico; nunca substituir motor por resposta livre sem citar `href` interno.

---

## 5. Arquivos criados / alterados

### Novos

| Arquivo | Função |
|---------|--------|
| `src/lib/recommendation-engine/types.ts` | Tipos do motor |
| `src/lib/recommendation-engine/catalog.ts` | Catálogo unificado |
| `src/lib/recommendation-engine/user-profile.ts` | Perfil inteligente |
| `src/lib/recommendation-engine/engine.ts` | Scoring e ranking |
| `src/lib/recommendation-engine/relationships.ts` | Sugestões cruzadas |
| `src/lib/recommendation-engine/journey-panel.ts` | Painel Minha Jornada |
| `src/lib/recommendation-engine/admin-stats.ts` | KPIs admin |
| `src/lib/recommendation-engine/ai-bridge.ts` | Contrato IA futura |
| `src/lib/recommendation-engine/bridge-loader.ts` | Implementação do bridge |
| `src/lib/recommendation-engine/index.ts` | Barrel export |
| `src/lib/admin/services/recommendations-admin.service.ts` | Service admin |
| `src/app/admin/recomendacoes/page.tsx` | Página admin |
| `src/components/journey/IntelligentJourneySection.tsx` | UI recomendações |
| `src/components/journey/RecommendationLink.tsx` | Link + GA4 |
| `docs/PHASE_10_0_RECOMMENDATION_ENGINE.md` | Este documento |

### Alterados

| Arquivo | Mudança |
|---------|---------|
| `src/lib/journey/get-journey-data.ts` | `intelligentPanel` |
| `src/lib/journey/types.ts` | Tipo `IntelligentJourneyPanel` |
| `src/components/journey/JourneyDashboard.tsx` | Seção inteligente |
| `src/lib/routes.ts` | `adminRoutes.recomendacoes` |
| `src/lib/admin/nav.ts` | Item menu |
| `src/lib/analytics/growth-events.ts` | `recommendation_click` |

### Não alterados (restrições)

- Mercado Pago, Auth core, migrations, webhooks, fluxo Premium de pagamento
- `src/lib/recommendations/` (motor legado de saúde/ferramentas) — coexistência mantida

---

## 6. Reutilização Fases 9.4 / 9.5

| Recurso | Uso na 10.0 |
|---------|-------------|
| `CONTENT_INTELLIGENCE_REGISTRY` | Objetivo, nível, related, isNew |
| `fetchUserActivitySnapshot` | Histórico e consumedKeys |
| `buildAllTrailsProgress` | Progresso e próximo passo |
| `content_rankings` (read-only) | Admin top aceitos |
| `growth-events.ts` | CTR real via GA4 |

---

## 7. Testes manuais sugeridos

1. Login → `/minha-jornada` — ver seção **Recomendações inteligentes**
2. Completar perfil com objetivo → scores mudam nas sugestões
3. Consumir artigo → "Também pode te ajudar" atualiza
4. Trilha ativa → **Próximo passo** aponta step da trilha
5. Admin → `/admin/recomendacoes` — KPIs e rankings
6. DevTools → clique em recomendação dispara `recommendation_click` no GA4

---

## 8. Deploy

| Campo | Valor |
|-------|-------|
| **Commit** | `4d93b6e` — `feat(recommendations): Fase 10.0 — motor de recomendação inteligente` |
| **Deploy ID** | `dpl_CGZoWFtcrxrAWgEvMRcUz41EN1Fp` |
| **URL deploy** | https://saude-e-lamod7fa9-quim-link.vercel.app |
| **Produção** | https://www.saudeebem.com.br |

### Validação pré-push

| Check | Resultado |
|-------|-----------|
| `npm run build` | ✓ OK |
| Áreas restritas (MP, Auth, Webhook, Supabase schema, Premium) | ✓ Nenhum arquivo alterado |
| `/minha-jornada` usuário logado (local) | ✓ 11/11 `validate-phase-100.mjs` |
| `/admin/recomendacoes` não-admin | ✓ Redirect 307 |
| `recommendation_click` | ✓ `RecommendationLink` → `sendGa4RecommendationClick` |
| Webhook intacto | ✓ HTTP 200 |

### Validação pós-deploy (produção)

| Check | Resultado |
|-------|-----------|
| `validate-phase-100.mjs` produção | ✓ 11/11 PASS |
| `/minha-jornada` — seção inteligente | ✓ Presente |
| Cards e links de recomendação | ✓ Renderizados |
| Usuário gratuito | ✓ Sem erro |
| `/admin/recomendacoes` anônimo | ✓ Redirect login |

Seguir fluxo das fases anteriores: commit, push, Vercel com `NODE_OPTIONS=--use-system-ca` se necessário.
