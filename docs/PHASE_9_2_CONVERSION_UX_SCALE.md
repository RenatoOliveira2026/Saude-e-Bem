# Fase 9.2 — Otimização de Conversão, UX e Preparação para Escala

**Data:** 2026-06-24  
**Tipo:** Auditoria e planejamento (sem alterações de código)  
**Restrições respeitadas:** Auth, Supabase, Mercado Pago, webhook, migrations e recuperação de senha **não foram modificados**.

---

## 1. Relatório executivo

O Saúde & Bem está **tecnicamente estável** após as Fases 8.x (auth, webhook, Premium) e **operacionalmente monitorável** após a Fase 9.1 (`/admin/lancamento`). O principal gargalo para escala de assinantes não é infraestrutura, e sim **conversão e fricção na jornada**.

### Diagnóstico em uma frase

> Usuários interessados em Premium encontram mensagens contraditórias na Home (“Em breve”), perdem a intenção de compra após confirmar o e-mail (redirect para `/minha-jornada` em vez de `/assinar`) e enfrentam um formulário de 9 campos antes do primeiro pagamento.

### Métricas de fricção (caminho feliz estimado)

| Métrica | Valor atual |
|---------|-------------|
| Cliques até pagamento | ~11–15 |
| Campos de formulário | ~13 (4 cadastro + 9 billing) |
| Páginas com copy “Em breve” vs checkout ativo | 3+ conflitos |

### Oportunidades de maior retorno (sem mexer no núcleo técnico)

1. **Alinhar copy e CTAs** Home ↔ Clube ↔ Assinar (impacto alto, esforço baixo).
2. **Preservar intent** `redirect=/assinar` no fluxo cadastro → verify (impacto alto, esforço baixo).
3. **Reduzir ou adiar campos de billing** (impacto alto, esforço médio).
4. **Otimizar imagens e JS** (impacto médio em SEO/CWV, esforço médio).
5. **Completar SEO em protocolos/ferramentas/assinar** (impacto médio em tráfego orgânico).

### Segurança

Postura **adequada para lançamento**: RLS, webhook HMAC, admin layout gate, service role apenas server-side. Pontos de atenção documentados (admin API sem permissão granular, service role como bearer em reconcile) — **correções recomendadas em fase dedicada, com aprovação**.

### IA

Infraestrutura **rule-based** madura (migration 018, health-score, journey). LLM não implementado; extensão natural via `ai_conversations` (planejado em `future-features.ts`).

---

## ETAPA 1 — Jornada do usuário

### Mapa

```
Home → Cadastro → E-mail → /auth/verify → Minha Jornada
                                              ↓ (perde intent)
Clube → Assinar → Completar cadastro (9 campos) → MP → Minha Assinatura → Clube/dashboard
```

### Pontos de abandono (prioridade)

| P | Ponto | Causa |
|---|-------|-------|
| P0 | Pós-confirmação de e-mail | `emailRedirectTo` fixo em `/minha-jornada`; intent `/assinar` perdido |
| P0 | Home seção Clube | `ClubPremiumSection`: badge “Em breve” + lista VIP — Premium já está ativo |
| P1 | Completar cadastro | 9 campos obrigatórios antes do PIX |
| P1 | `/assinar` privada | Usuário não vê preços sem login |
| P1 | CTA Clube deslogado | Redirect confuso via `/completar-cadastro` em vez de `/entrar` |
| P2 | PIX pending | Incerteza até webhook/sync |
| P2 | PKCE cross-browser | Link de e-mail em app ≠ navegador do cadastro |

### Excesso de cliques

- Clube → API profile-status → Assinar (hop extra).
- Banner billing + botão checkout → ambos para completar-cadastro.
- `/clube/premium` → `/assinar` (páginas sobrepostas).

### Textos confusos

| Texto | Onde |
|-------|------|
| “Em breve: Clube Saúde & Bem” | `ClubPremiumSection.tsx` |
| Trimestral no hero, ausente no grid | `assinar/page.tsx` vs `plans.ts` |
| “Dashboard Premium Inteligente” para free | `ClubDashboard.tsx` |
| Lead capture “Ainda não assinou?” em `/assinar` | `LeadCaptureSection` |
| “cadastre-se novamente” (e-mail não confirmado) | `LoginForm.tsx` |

### Simplificações recomendadas

1. Passar `redirect` do cadastro até `/auth/verify`.
2. Substituir “Em breve” por CTA “Ver planos” → `/clube#planos` ou `/assinar`.
3. Tornar `/assinar` legível publicamente; gate só no botão pagar.
4. Remover lead capture de `/assinar`.
5. CPF + celular no checkout; endereço progressivo.
6. Banner pós-login “Continuar assinatura” quando intent=premium.

---

## ETAPA 2 — Auditoria da Home

### Estado atual (`src/app/page.tsx`)

Seções: Hero, Objetivos, Destaques, Protocolos, Biblioteca, Afiliados, Newsletter, LaunchFunnel, ClubPremium.

### Proposta de valor

- **Hero:** foco em ferramentas e protocolos gratuitos — correto para topo de funil.
- **Gap:** nenhum CTA Premium acima da dobra; usuário com intenção de assinar não é atendido.

### CTAs atuais

| Seção | CTA | Destino |
|-------|-----|---------|
| Hero | Explorar ferramentas / protocolos | `/ferramentas`, `/protocolos` |
| ClubPremium | Lista VIP | `/lancamento#lista-vip` |
| LaunchFunnel | Guia + VIP | captação, não conversão |

### Melhorias priorizadas (impacto)

| # | Melhoria | Impacto | Esforço |
|---|----------|---------|---------|
| H1 | Trocar `ClubPremiumSection` para “Assinar Premium” ou “Conhecer o Clube” | **Alto** | Baixo |
| H2 | Adicionar CTA secundário no Hero: “Clube Premium” | **Alto** | Baixo |
| H3 | Prova social: depoimentos / números (reutilizar `ClubStats`) | Médio | Baixo |
| H4 | Bloco “Por que Premium?” com 3 benefícios + preço desde R$ X | **Alto** | Médio |
| H5 | Reduzir competição LaunchFunnel vs assinatura na home pós-lançamento | Médio | Baixo |

---

## ETAPA 3 — Auditoria do Clube Premium

### Estado atual (`/clube`)

Componentes fortes: `ClubPlanComparison`, `ClubMembershipPlans`, `ClubFaq`, `ClubTestimonials`, `ClubStats`.

### Gaps de conversão

| Área | Situação | Recomendação |
|------|----------|--------------|
| Comparação Gratuito × Premium | Existe (`ClubPlanComparison`) | Destacar acima da dobra no mobile |
| Planos | Dinâmicos via `membership_plans` | Alinhar copy trimestral com `/assinar` |
| FAQ | Presente | Adicionar “Como funciona o PIX?” e “Quando ativa o Premium?” |
| Garantia | Ausente explícita | Bloco “7 dias para explorar” ou política clara |
| Confiança | Parcial (stats) | Selos: Mercado Pago, dados LGPD, sem renovação automática PIX |
| Mensagens contraditórias | “Comunidade em breve” em `/clube/premium` | Unificar com realidade do produto |

### Melhorias priorizadas

| # | Melhoria | Impacto |
|---|----------|---------|
| C1 | CTA único “Assinar agora” em todos os planos → checkout direto | **Alto** |
| C2 | FAQ pagamento + ativação Premium | **Alto** |
| C3 | Seção garantia / confiança | Médio |
| C4 | Remover “em breve” de subpáginas do clube | **Alto** |
| C5 | Prova social com nome/foto (já há `ClubTestimonials`) | Médio |

---

## ETAPA 4 — Auditoria SEO

### Pontos fortes

- `buildContentMetadata()` com canonical, OG, Twitter em ~20 rotas.
- `sitemap.ts` + `robots.ts` completos.
- JSON-LD: Organization, WebSite, Article, Book, Product.
- Bot-probe hardening (`proxy.ts`, `slug.ts`).

### Gaps

| Gap | Prioridade |
|-----|------------|
| `/assinar` no sitemap sem canonical/OG | P0 |
| JSON-LD ausente em `/protocolos/[slug]` e `/ferramentas/[slug]` | P0 |
| `unoptimized` em imagens públicas (`ContentCover`, cards) | P0 |
| Ferramentas sem `revalidate = 3600` | P1 |
| Listing pages sem ItemList schema | P2 |
| Footer: link “Perfil de Saúde” → ferramentas (âncora errada) | P2 |

### Ação recomendada

```bash
npm run audit:seo https://www.saudeebem.com.br
```

Estender script para validar canonical/OG em URLs do sitemap (Fase 9.3).

---

## ETAPA 5 — Performance

### Riscos Core Web Vitals

| Fator | Impacto | Arquivo(s) |
|-------|---------|------------|
| Imagens `unoptimized` | LCP alto | `ContentCover.tsx`, cards |
| 7 pesos de fonte | FCP/CLS | `layout.tsx` |
| GA + GTM + PWA + popup + WhatsApp | TBT/INP | `layout.tsx`, analytics |
| Tools bundle sem code-split | JS grande em ferramentas | `tools/registry.tsx` |
| Home: 4+ fetches paralelos | TTFB percebido | `lib/content/home.ts` |

### Otimizações sugeridas (sem alterar núcleo)

1. Remover `unoptimized` + `sizes` + `priority` em LCP.
2. `next/dynamic` por ferramenta.
3. Uma família de analytics (GA **ou** GTM).
4. Lazy-load popup WhatsApp após idle.
5. `loading.tsx` em home, marketplace, ferramentas.
6. Lighthouse CI em 5 URLs críticas.

---

## ETAPA 6 — Preparação para IA (documentação, sem implementar)

### O que já existe

```
Sinais: user_preferences.goal | user_tool_results | user_content_history | analytics_events
         ↓                        ↓                      ↓                    ↓
Motores: Journey matcher    Health-score motor    Club RPC (018)      content_rankings
         ↓                        ↓                      ↓
UI:     /minha-jornada        /minha-saude         /clube/recomendacoes-ia
```

### Arquitetura futura proposta

```
┌──────────────────────────────────────────────────────────────┐
│                    Camada de experiência                      │
│  Assistente chat │ Busca semântica │ Recomendações híbridas  │
└────────────────────────────┬─────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────┐
│              API /api/ai/* (futura — Edge ou Server)            │
│  - RAG sobre artigos, protocolos, biblioteca (pgvector)       │
│  - Guardrails: sem diagnóstico médico; citar fontes internas    │
│  - Rate limit por user_id + membership gate                     │
└────────────────────────────┬─────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────┐
│                    Dados (Supabase)                            │
│  ai_conversations (novo) │ ai_embeddings (novo) │ histórico 018 │
└────────────────────────────────────────────────────────────────┘
```

### Fases IA sugeridas

| Fase | Entrega |
|------|---------|
| 10.1 | Busca inteligente (full-text + rankings 018) |
| 10.2 | Recomendações híbridas (regras + ranking) |
| 10.3 | Assistente RAG com biblioteca curada |
| 10.4 | Personalização por health-score |

**Tabela planejada:** `ai_conversations` (`src/lib/journey/future-features.ts`).

---

## ETAPA 7 — Segurança (auditoria somente leitura)

### OK

- Session refresh via `getUser()` no proxy.
- Admin UI: `requireAdmin()` + RLS `is_admin()`.
- Webhook MP: HMAC + fallbacks documentados (Fase 8.5).
- Payments: sem INSERT autenticado; service role server-only.
- Dev routes bloqueadas em produção.

### Atenção (não crítico para lançamento imediato)

| Item | Severidade | Ação futura |
|------|------------|-------------|
| Admin API aceita qualquer admin (export/reconcile) | Média | `requireAdminPermission` nas APIs |
| Service role como Bearer em reconcile | Alta se vazamento | Restringir a `PAYMENTS_CRON_SECRET` apenas |
| `analytics_events` insert público | Baixa | Rate limit / honeypot |
| Bootstrap admin hardcoded em migration | Média | Documentar rotação |

**Nenhuma alteração aplicada nesta fase.**

---

## 2. Lista priorizada de melhorias

### P0 — Conversão (aprovar antes de implementar)

| ID | Melhoria | Área |
|----|----------|------|
| P0-1 | Preservar `redirect=/assinar` em cadastro → verify | UX/Auth copy only |
| P0-2 | Atualizar `ClubPremiumSection` (remover “Em breve”) | Home |
| P0-3 | Remover lead capture de `/assinar` | Checkout UX |
| P0-4 | Alinhar planos (trimestral hero vs grid) | Assinar |

### P1 — Conversão + SEO

| ID | Melhoria | Área |
|----|----------|------|
| P1-1 | `/assinar` público para leitura; gate no pagar | UX |
| P1-2 | Billing progressivo (CPF/celular primeiro) | UX |
| P1-3 | JSON-LD protocolos + ferramentas | SEO |
| P1-4 | Metadata completa em `/assinar` | SEO |
| P1-5 | Remover `unoptimized` de imagens LCP | Performance |

### P2 — Escala e polish

| ID | Melhoria | Área |
|----|----------|------|
| P2-1 | Dynamic import ferramentas | Performance |
| P2-2 | FAQ pagamento no Clube | Conversão |
| P2-3 | Resend e-mail confirmação | UX |
| P2-4 | Lighthouse CI | Performance |
| P2-5 | Permissões granulares admin API | Segurança |

---

## 3. Estimativa de impacto

| Melhoria | Impacto conversão | Impacto tráfego | Esforço | Prazo sugerido |
|----------|-------------------|-----------------|---------|----------------|
| P0-1 redirect assinar | +15–25% checkout starts* | — | 2–4h | Fase 9.3 |
| P0-2 Home Clube CTA | +10–20% cliques clube | — | 1–2h | Fase 9.3 |
| P1-2 billing progressivo | +20–30% completam billing* | — | 1–2 dias | Fase 9.4 |
| P1-4/P1-5 SEO+imagens | — | +10–15% CTR orgânico* | 1 dia | Fase 9.3 |
| P1-5 performance | — | +5–10 pts Lighthouse* | 1–2 dias | Fase 9.3 |

\*Estimativas qualitativas para priorização; medir com `/admin/lancamento` + analytics após deploy.

---

## 4. Plano das próximas fases

| Fase | Foco | Entregas |
|------|------|----------|
| **9.3** | Quick wins conversão + SEO | P0-1 a P0-4, P1-4, P1-5, metadata assinar |
| **9.4** | Redução de fricção checkout | Billing progressivo, assinar público, FAQ pagamento |
| **9.5** | Performance & monitoramento | Lighthouse CI, dynamic tools, fontes reduzidas |
| **9.6** | Segurança admin | Permissões API, harden reconcile auth |
| **10.x** | IA (sem LLM inicial) | Busca inteligente + rankings 018 na UI |
| **10.3+** | Assistente RAG | `ai_conversations`, embeddings, guardrails |

### KPIs a acompanhar (`/admin/lancamento`)

- Novos cadastros (24h / 7d)
- E-mails confirmados vs pendentes
- Perfis completos
- Pagamentos pending → approved
- Premium ativos
- Alertas webhook

---

## 5. Compromisso

- **Nenhuma alteração crítica** em auth, MP, webhook, Supabase ou migrations foi feita nesta fase.
- Implementação de qualquer item P0+ requer **aprovação explícita** do responsável.
- Próximo passo recomendado: **aprovar Fase 9.3 (quick wins)** — estimativa 1 sprint curta, risco baixo.

---

## Referências de código

| Tópico | Arquivo |
|--------|---------|
| Home Clube “Em breve” | `src/components/home/ClubPremiumSection.tsx` |
| Redirect pós-verify | `src/lib/auth/verify-session-client.ts` |
| Billing 9 campos | `src/components/billing/CompleteBillingProfileForm.tsx` |
| Checkout | `src/components/payments/SubscribeCheckoutForm.tsx` |
| Clube público | `src/app/clube/page.tsx` |
| SEO helper | `src/lib/seo/metadata.ts` |
| Recomendações IA (regras) | `supabase/migrations/018_intelligent_recommendations.sql` |
| Futuro IA | `src/lib/journey/future-features.ts` |
| Operação | `src/app/admin/lancamento/page.tsx` |
