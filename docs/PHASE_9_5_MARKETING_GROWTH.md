# Fase 9.5 — Marketing, Crescimento e Fidelização

**Data:** 2026-06-25  
**Status:** Implementado · Build OK (`npm run build`)  
**Escopo:** Onboarding, engajamento, compartilhamento, SEO avançado, analytics de funil (GA4), fidelização e admin de crescimento — **sem** migrations, Mercado Pago, Supabase schema, Auth core, webhooks ou fluxo Premium de pagamento.

---

## 1. Resumo executivo

A Fase 9.5 prepara o Saúde & Bem para crescimento sustentável com experiência guiada para novos usuários, estrutura de engajamento e fidelização, compartilhamento social com Open Graph, SEO enriquecido, eventos de funil no GA4 e painel administrativo de KPIs de crescimento. Toda a implementação reutiliza dados e tabelas existentes (`profiles`, `analytics_events`, `user_content_history`, memberships).

---

## 2. Entregas por etapa

### Etapa 1 — Programa de Onboarding (`/onboarding`)

- Wizard em 3–4 passos: boas-vindas → objetivo (se ausente) → plano personalizado → incentivo à jornada
- Recomendações automáticas: **trilha**, **protocolo** e **artigo** alinhados ao objetivo
- Persistência de conclusão em `localStorage` (`saude-bem:onboarding-complete`)
- CTA em Minha Jornada: **Guia de boas-vindas**

### Etapa 2 — Engajamento (estrutura, sem envio automático)

- `buildEngagementSnapshot` — lembretes ordenados por prioridade
- Sequência **Continue sua jornada**
- Lembrete de **trilha interrompida**
- Materiais recomendados e contagem de **novidades**
- **Progresso semanal** (4 métricas derivadas)
- UI: `EngagementPanel` em Minha Jornada

### Etapa 3 — Compartilhamento

- `ShareButton` — Web Share API, WhatsApp, X, copiar link
- Integrado em: artigos, protocolos, trilhas premium
- `buildShareOgTags` + metadata OG em trilhas
- Evento GA4 `content_shared`

### Etapa 4 — SEO avançado

- `personJsonLd` — autores em artigos
- `learningResourceJsonLd` — trilhas premium
- `getInternalLinksForContent` — links internos automáticos via registry
- `RelatedContentLinks` em artigos e protocolos
- Breadcrumbs + FAQ/Article/HowTo mantidos e estendidos

### Etapa 5 — Analytics (GA4, sem alterar DB)

Catálogo `GROWTH_FUNNEL_EVENTS` + helpers em `growth-events.ts`:

| Evento | Gatilho |
|--------|---------|
| `signup_complete` | Cadastro enviado |
| `email_verified` | `/auth/verify` sucesso |
| `checkout_start` | `/assinar` (usuário logado) |
| `payment_approved` | Preparado via `GrowthFunnelTracker` (?growth_event=) |
| `premium_subscribe` | Preparado via query param |
| `trail_complete` | Preparado para UI futura |
| `library_download` | Preparado (complementa `ebook_download` Supabase) |
| `article_read` | Abertura de artigo (client) |
| `onboarding_complete` | Fim do wizard |
| `content_shared` | ShareButton |

### Etapa 6 — Fidelização (sem pontuação pública)

- 8 conquistas/medalhas derivadas de atividade
- Sequência de dias e dias ativos no mês (proxy)
- Metas pessoais com barras de progresso
- UI: `LoyaltyPanel` em Minha Jornada

### Etapa 7 — Administração (`/admin/crescimento`)

KPIs:

- Usuários ativos (30d)
- Novos cadastros (30d)
- Conversão Premium (%)
- Retenção proxy (2+ eventos)
- Downloads biblioteca
- Eventos (7d)
- Rankings: protocolos, artigos, biblioteca, trilhas (est.)
- Conversão por origem (`source_type`)
- Catálogo de eventos de funil GA4

---

## 3. KPIs implementados

| KPI | Fonte |
|-----|-------|
| Usuários ativos 30d | `analytics_events.user_id` |
| Novos cadastros 30d | `profiles.created_at` |
| Conversão Premium | `getMembershipAdminStats()` |
| Retenção proxy | Usuários com ≥2 eventos |
| Protocolos/artigos top | `analytics_events` |
| Downloads biblioteca | `ebook_download` |
| Trilhas iniciadas (est.) | Proxy via primeiro protocolo da trilha |
| Origem conversão | `analytics_events.source_type` |

---

## 4. Arquivos criados

```
src/lib/onboarding/
src/lib/engagement/
src/lib/loyalty/
src/lib/analytics/growth-events.ts
src/lib/seo/internal-links.ts
src/lib/seo/share-metadata.ts
src/lib/admin/services/growth.service.ts
src/components/onboarding/OnboardingWizard.tsx
src/components/engagement/EngagementPanel.tsx
src/components/loyalty/LoyaltyPanel.tsx
src/components/share/ShareButton.tsx
src/components/seo/RelatedContentLinks.tsx
src/components/analytics/GrowthFunnelTracker.tsx
src/components/analytics/CheckoutStartTracker.tsx
src/components/analytics/SignupCompleteTracker.tsx
src/components/analytics/ArticleReadTracker.tsx
src/app/onboarding/page.tsx
src/app/admin/crescimento/page.tsx
docs/PHASE_9_5_MARKETING_GROWTH.md
```

### Modificados (principais)

```
src/lib/journey/get-journey-data.ts
src/lib/journey/types.ts
src/components/journey/JourneyDashboard.tsx
src/lib/seo/json-ld.ts
src/lib/routes.ts
src/lib/admin/nav.ts
src/components/admin/AdminStatCard.tsx
src/app/blog/[slug]/page.tsx
src/app/protocolos/[slug]/page.tsx
src/app/clube/(membros)/trilhas/page.tsx
src/app/assinar/page.tsx
src/app/auth/verify/page.tsx
src/components/auth/SignUpForm.tsx
src/components/premium/PremiumTrailsListing.tsx
```

---

## 5. Restrições respeitadas

- [x] Nenhuma migration criada
- [x] Nenhuma variável de ambiente nova obrigatória
- [x] Mercado Pago / webhooks intactos
- [x] Supabase schema intacto
- [x] Auth core intacto (apenas evento GA4 em verify/signup)
- [x] `analytics_events` CHECK constraint não alterado — novos eventos via GA4

---

## 6. Impacto esperado

| Área | Efeito |
|------|--------|
| Onboarding | ↑ ativação D1/D7 — usuário sabe o que fazer no primeiro acesso |
| Engajamento | ↑ retorno — lembretes visíveis sem spam (push futuro) |
| Compartilhamento | ↑ aquisição orgânica via WhatsApp/redes |
| SEO | ↑ CTR em busca — Person, LearningResource, links internos |
| Analytics | ↑ visibilidade de funil para otimização de conversão |
| Fidelização | ↑ retenção emocional — medalhas e metas privadas |
| Admin | ↑ decisões data-driven sem BI externo |

**Estimativa qualitativa:** +15–25% retenção D30 em membros que completam onboarding; +5–10% tráfego orgânico em 90 dias com SEO + share; base pronta para automações Fase 10.x.

---

## 7. Checklist de produção

- [x] `npm run build` — sucesso
- [x] `/onboarding` — rota registrada
- [x] `/admin/crescimento` — painel admin
- [x] Minha Jornada — engajamento + fidelização
- [x] Share em artigos, protocolos, trilhas
- [x] Eventos GA4 documentados
- [ ] Deploy produção (quando autorizado)
- [ ] Validar eventos no GA4 DebugView
- [ ] Teste manual wizard onboarding com usuário novo

---

## 8. Próximas recomendações (Fase 10.x)

1. Persistir onboarding e conquistas em `user_preferences` (migration leve)
2. E-mail/push a partir de `engagement.reminders`
3. `payment_approved` / `premium_subscribe` via redirect pós-checkout (sem tocar webhook)
4. Trail complete automático com evento ao atingir 100%
5. Biblioteca — ShareButton em páginas de detalhe
6. A/B test de copy no wizard de onboarding

**Status:** Fase 9.5 implementada — aguarda commit/deploy se autorizado.
