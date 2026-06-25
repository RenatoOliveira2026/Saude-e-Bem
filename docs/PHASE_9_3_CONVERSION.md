# Fase 9.3 — Melhorias de Conversão (P0)

**Data:** 2026-06-01  
**Status:** Implementado · Build OK  
**Escopo:** Copy, CTAs, SEO e preservação de intent pós-confirmação de e-mail — sem alterações em MP, webhooks, Supabase, DB ou área `/clube/(membros)`.

---

## 1. Resumo executivo

A Fase 9.2 identificou fricção crítica entre mensagem “Em breve” e checkout ativo, perda de intent `/assinar` após confirmação de e-mail e páginas de conversão com distrações. A 9.3 corrige esses pontos com mudanças de front-end e copy de baixo risco.

---

## 2. O que foi implementado

### Home (`ClubPremiumSection` + seções auxiliares)

| Antes | Depois |
|-------|--------|
| Badge “Em breve”, CTA lista VIP | Badge “Premium disponível” |
| Título “Em breve: Clube…” | “Clube Saúde & Bem Premium” |
| CTA único → `/lancamento#lista-vip` | **Assinar Premium** → `/assinar` |
| — | **Conhecer benefícios** → `/clube#planos` |
| Empty states com “em breve” | Copy orientada a explorar conteúdo existente |

### Clube Premium (`/clube`)

- Hero e metadata atualizados: **Premium disponível**
- Removidos: `ClubVipList`, `ClubWaitlist`, `LaunchFunnelCta` (distração pré-lançamento)
- Adicionado: `ClubTrustSection` (garantia, pagamento seguro, cancelamento)
- FAQ reescrito (assinatura, segurança, ativação, cancelamento)
- Stats: “Na lista de espera” → “Membros na comunidade”
- Depoimentos: “beta testers” → “nossos membros”
- JSON-LD: `WebPage` + `FAQPage`
- CTA Premium no split Gratuito × Premium → `/assinar`

### Página Assinar (`/assinar`)

- Removido `LeadCaptureSection`
- Adicionado `SubscribeTrustPanel` (3 passos pós-pagamento + selos de confiança)
- FAQ dedicado ao checkout (`AssinarFaqSection`)
- Hero sem menção ao plano trimestral (não ativo no checkout)
- Metadata via `buildContentMetadata` + JSON-LD (`WebPage`, `Product`, `FAQPage`)

### Jornada — preservação de intent

- `SignUpForm`: lê `?redirect=` e envia hidden field
- `signUp`: `emailRedirectTo` usa `safePostAuthRedirect` (permite `/assinar`, `/completar-cadastro`, etc.)
- `verify-session-client`: mesmo allowlist na confirmação de e-mail
- Mensagem de sucesso contextual quando redirect aponta para `/assinar`

**Fluxo esperado:**

```
/assinar (não logado) → /cadastro?redirect=/assinar
→ e-mail com link /auth/verify?next=/assinar
→ confirmação → /assinar (retoma checkout)
```

### SEO (baixo risco)

| Página | Melhoria |
|--------|----------|
| `/assinar` | metadata completa, Product + FAQ JSON-LD |
| `/clube` | metadata + FAQ JSON-LD |
| `/protocolos/[slug]` | BreadcrumbList + HowTo JSON-LD |
| `/ferramentas/[slug]` | BreadcrumbList + WebApplication JSON-LD |
| Footer / nav | “Perfil de Saúde” → `/minha-saude`, link “Assinar Premium” |

### Jornada (`JourneyClubCta`)

- CTAs alinhados: **Assinar Premium** + **Conhecer benefícios**

---

## 3. Arquivos principais

```
src/components/home/ClubPremiumSection.tsx
src/components/club/ClubTrustSection.tsx
src/components/payments/SubscribeTrustPanel.tsx
src/components/payments/AssinarFaqSection.tsx
src/lib/auth/safe-redirect.ts
src/lib/conversion/assinar-content.ts
src/lib/auth/actions.ts (signUp redirect)
src/components/auth/SignUpForm.tsx
src/app/assinar/page.tsx
src/app/clube/page.tsx
src/lib/data/club.ts
src/lib/seo/json-ld.ts
```

---

## 4. Relatório de impacto

| Problema (9.2) | Correção (9.3) | Impacto esperado |
|----------------|----------------|------------------|
| Home diz “Em breve” com checkout ativo | Copy + CTAs diretos para assinar | **Alto** — reduz confusão e bounce na dobra principal |
| Perda de intent após confirmar e-mail | `redirect` preservado no signup → verify | **Alto** — recupera usuários que abandonavam no meio do funil |
| `/assinar` com lead capture e copy longa | Painel de confiança + FAQ focado | **Médio** — menos distração, mais clareza pós-pagamento |
| `/clube` com narrativa pré-lançamento | FAQ, prova social, comparação, trust | **Médio** — alinha expectativa com produto disponível |
| SEO Premium fraco | metadata + JSON-LD | **Baixo–Médio** — ganho orgânico gradual |

### O que **não** mudou (conforme restrições)

- Mercado Pago, webhooks, APIs de pagamento
- Supabase, migrations, banco
- Recuperação de senha
- Área premium de membros (`/clube/(membros)`)
- Formulário de billing (9 campos) — previsto para Fase 9.4

---

## 5. Estimativa de ganho de conversão

Estimativa conservadora com base em benchmarks de e-commerce SaaS e no diagnóstico 9.2:

| Métrica | Baseline estimado | Ganho 9.3 | Novo patamar |
|---------|-------------------|-----------|--------------|
| Clique Home → `/assinar` ou `/clube` | ~2–4% dos visitantes da Home | +30–50% relativo | ~3–6% |
| Cadastro com intent `/assinar` que retorna ao checkout | ~40–55% (perda no verify) | +25–40 pp | ~65–80% |
| Conclusão checkout (visitantes `/assinar` logados) | baseline atual | +5–15% relativo | depende de billing 9.4 |

**Ganho agregado estimado no funil visitante → assinatura paga: +15–25%** nos primeiros 30 dias, assumindo tráfego similar ao atual.

> Validação real requer eventos GA4 (`signup_complete`, `checkout_start`, `purchase`) comparando 14 dias pré vs pós deploy.

---

## 6. Checklist de validação em produção

### Home e Clube

- [ ] Home: seção Clube exibe “Premium disponível” (sem “Em breve”)
- [ ] Home: botão “Assinar Premium” abre `/assinar`
- [ ] Home: “Conhecer benefícios” rola para `#planos` em `/clube`
- [ ] `/clube`: sem lista VIP / waitlist na página principal
- [ ] `/clube`: FAQ menciona assinatura ativa e Mercado Pago
- [ ] `/clube`: tabela Gratuito × Premium visível
- [ ] `/clube`: `ClubTrustSection` com CTAs de assinatura

### Assinar

- [ ] `/assinar`: sem formulário de lead capture no rodapé
- [ ] `/assinar`: painel “Acesso imediato ao Premium” visível acima do checkout
- [ ] `/assinar`: FAQ de checkout funcional
- [ ] `/assinar`: hero cita apenas mensal e anual (sem trimestral)

### Funil cadastro → pagamento

- [ ] Visitante em `/assinar` → redireciona para login/cadastro com `?redirect=/assinar`
- [ ] Cadastro com `redirect=/assinar` → e-mail de confirmação
- [ ] Link do e-mail → `/auth/verify?next=/assinar` (ou equivalente)
- [ ] Após confirmar → usuário em `/assinar` (não apenas `/minha-jornada`)
- [ ] Mensagem pós-cadastro menciona conclusão da assinatura quando intent = assinar

### SEO

- [ ] View source `/assinar`: JSON-LD Product + FAQPage
- [ ] View source `/clube`: JSON-LD FAQPage
- [ ] View source protocolo: HowTo + BreadcrumbList
- [ ] Footer: “Perfil de Saúde” → `/minha-saude`
- [ ] Footer/nav: link “Assinar Premium” → `/assinar`

### Regressão

- [ ] Login / logout normais
- [ ] Recuperação de senha inalterada
- [ ] Checkout PIX/cartão ainda gera preferência MP
- [ ] Webhook continua reconciliando pagamentos
- [ ] Área `/clube/dashboard` e conteúdo premium de membros intactos

---

## 7. Próximos passos sugeridos (fora do escopo 9.3)

| Fase | Foco |
|------|------|
| **9.4** | Billing progressivo (menos campos antes do PIX) |
| **9.5** | Performance (LCP, lazy load) |
| **10.x** | IA e personalização |

---

## 8. Build

```bash
npm run build  # ✓ exit 0 (2026-06-01)
```
