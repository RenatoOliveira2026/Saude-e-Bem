# Fase 4.4 — Recomendações Inteligentes

Motor determinístico que usa `public.user_tool_results` para calcular o **Score Saúde & Bem** e gerar recomendações na página `/minha-saude`.

## Pré-requisitos

- [x] Fase 4.3 — `user_tool_results` + `/minha-saude`
- [x] Migrations `020` e `021` aplicadas
- [x] Ferramentas salvando resultados com usuário logado

## Arquitetura

```
src/lib/recommendations/
  recommendation-types.ts   # Tipos do motor
  health-score.ts           # Score 0–100 (5 × 20 pts)
  recommendation-engine.ts  # Protocolos, ferramentas, prioridades
  index.ts

src/lib/health-profile/
  get-health-profile-data.ts  # Chama buildIntelligentRecommendations()

src/components/health-profile/
  HealthScoreCard.tsx
  RecommendedToolsSection.tsx
  PrioritiesSection.tsx
  HealthProfileDashboard.tsx  # Seções integradas
```

## Score Saúde & Bem (0–100)

Cada critério vale **até 20 pontos** (total máximo 100). Sem registro da ferramenta = 0 no critério.

| Critério | Ferramenta | Regra (+20) |
|----------|------------|-------------|
| IMC saudável | `calculadora-imc` | `category === "normal"` |
| Água adequada | `consumo-agua` | `litersPerDay` entre 1,5 e 5 L |
| Proteína adequada | `proteina-diaria` | `gramsPerKg >= 1.2` |
| Metabolismo na faixa | `metabolismo-basal` | TMB 1000–3500 kcal e GET 1200–4500 kcal |
| Risco cardiometabólico baixo | `risco-cardiometabolico` | `level === "low"` |

### Níveis do score

| % | Nível | Label |
|---|-------|-------|
| 0–39 | `iniciante` | Iniciante |
| 40–59 | `evolucao` | Em evolução |
| 60–79 | `bom` | Bom |
| 80–100 | `excelente` | Excelente |

## Saídas do motor

`buildIntelligentRecommendations(records)` retorna:

| Campo | Descrição |
|-------|-----------|
| `healthScore` | Score, critérios, nível, resumo |
| `protocols` | Até 4 protocolos da biblioteca (categorias por lacunas + quiz + IMC) |
| `tools` | Até 4 ferramentas não usadas ou com critério não atendido |
| `priorities` | Até 5 próximos passos (critérios → ferramentas → protocolos) |

## Página `/minha-saude`

1. **Seu Score Saúde & Bem** — card com pontuação, barra, breakdown dos 5 critérios  
2. Últimos resultados (Fase 4.3)  
3. **Protocolos recomendados para você**  
4. **Ferramentas recomendadas**  
5. **Próximos passos**  
6. Histórico completo  

## Regras de negócio

- **Sem OpenAI** — apenas regras locais sobre `result_json`
- Protocolos: prioriza gratuitos; hints por critério não atendido + quiz + IMC + risco alto
- Ferramentas: sugere slugs ausentes no histórico ou ligados a critérios pendentes
- Prioridades: critérios não atendidos primeiro (risco cardiometabólico = prioridade alta)

## Teste manual

1. Login → usar ferramentas e salvar resultados  
2. `/minha-saude` — conferir score e seções  
3. SQL: `select tool_slug, result_json, created_at from user_tool_results order by created_at desc;`  

## Build

```bash
npm run build
```

## Commits sugeridos

```
feat(recommendations): Fase 4.4 motor e score Saúde & Bem
```
