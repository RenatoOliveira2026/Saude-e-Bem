# Fase 4.2.2 — Ferramentas Interativas

Ativação de todas as ferramentas gratuitas da plataforma com formulários client-side, cálculo em `src/lib/tools/` e registro centralizado de componentes.

## Objetivo

Substituir o placeholder “Ferramenta interativa em breve” por funcionalidades reais, mantendo o padrão visual e de UX iniciado em `risco-cardiometabolico`.

## Ferramentas implementadas

| Slug | Rota | Tipo | Entrada | Saída |
|------|------|------|---------|-------|
| `calculadora-imc` | `/ferramentas/calculadora-imc` | Calculadora | peso (kg), altura (cm) | IMC, classificação OMS, orientações |
| `consumo-agua` | `/ferramentas/consumo-agua` | Calculadora | peso, atividade, clima | L/dia, ml, copos 250 ml |
| `proteina-diaria` | `/ferramentas/proteina-diaria` | Calculadora | peso, objetivo, atividade | g/dia, g/kg, por refeição |
| `metabolismo-basal` | `/ferramentas/metabolismo-basal` | Calculadora | sexo, idade, peso, altura, atividade | TMB + GET (Mifflin-St Jeor) |
| `quiz-saude-bem` | `/ferramentas/quiz-saude-bem` | Avaliação | 5 perguntas (sono, nutrição, estresse, atividade, objetivo) | Perfil + categorias de protocolos |
| `risco-cardiometabolico` | `/ferramentas/risco-cardiometabolico` | Avaliação | medidas + hábitos + histórico | score, nível de risco, fatores |

Todas são **gratuitas** (`isPremium: false`).

## Arquitetura

```
src/lib/tools/           # Lógica pura (testável, sem React)
  bmi.ts
  water-intake.ts
  daily-protein.ts
  basal-metabolism.ts
  health-quiz.ts
  cardiometabolic-risk.ts
  form-utils.ts          # parsePositiveNumber compartilhado

src/components/tools/    # UI client ("use client")
  tool-ui.tsx            # ToolFieldset, ToolResultPanel, disclaimer
  BmiCalculatorTool.tsx
  WaterIntakeTool.tsx
  DailyProteinTool.tsx
  BasalMetabolismTool.tsx
  HealthQuizTool.tsx
  CardiometabolicRiskTool.tsx
  registry.tsx           # slug → componente
  index.ts

src/app/ferramentas/[slug]/page.tsx
  getToolComponent(slug) → renderiza interativo ou fallback
```

## Registro de componentes

`src/components/tools/registry.tsx` mapeia cada `slug` de `src/lib/data/tools.ts` ao componente React correspondente. Slugs sem entrada exibem o placeholder e emitem `console.warn` em dev.

## Detalhes de cálculo

### IMC (`bmi.ts`)

- Fórmula: peso / (altura m)²
- Classificação OMS: abaixo do peso, adequado, sobrepeso, obesidade I–III
- Orientações sobre limitações do IMC vs composição corporal

### Água (`water-intake.ts`)

- Base: 35 ml × peso (kg)
- Fatores: atividade (1.0–1.2) e clima (1.0–1.22)
- Resultado em litros, ml e copos de 250 ml

### Proteína (`daily-protein.ts`)

- Faixas g/kg por objetivo: manutenção, muscular, longevidade, perda de gordura
- Bônus por nível de atividade
- Distribuição sugerida em 3–4 refeições

### Metabolismo basal (`basal-metabolism.ts`)

- TMB: **Mifflin-St Jeor** (kcal/dia)
- GET: TMB × fator de atividade (1.2–1.9)
- Orientação sobre manutenção, déficit e superávit

### Quiz (`health-quiz.ts`)

- 5 perguntas com pontuação ponderada para perfis de `src/lib/home-content.ts`
- Perfis: Metabólico, Energético, Longevidade, Equilíbrio
- Recomenda categorias oficiais de protocolos (Fase 4.2)

### Risco cardiometabólico (`cardiometabolic-risk.ts`)

- Score composto: idade, IMC, cintura, tabagismo, atividade, histórico
- Níveis: baixo, moderado, elevado, muito elevado
- Reutiliza `calcBmi` de `bmi.ts`

## Listagem pública

`/ferramentas` consome `getTools()` → `ToolsListing` com filtros **Todos**, **Calculadoras** e **Avaliações**. As 6 ferramentas aparecem nos cards com link para a rota dinâmica.

## Checklist de validação

- [ ] `/ferramentas` — 6 ferramentas visíveis
- [ ] Cada slug abre formulário interativo (sem placeholder)
- [ ] Submit calcula resultado e rola até o painel
- [ ] CTAs “Ver protocolos” e “Outras ferramentas” funcionam
- [ ] Quiz retorna perfil + categorias sugeridas
- [ ] `npm run build` passa sem erros

## Checkpoint Git sugerido

```bash
git add .
git commit -m "feat(tools): ativar ferramentas interativas Fase 4.2.2"
git push
git tag -a v4.2.2 -m "Fase 4.2.2 - Ferramentas Interativas"
git push origin v4.2.2
```

## Próximos passos (fora do escopo 4.2.2)

- Persistir resultados do quiz/perfil no Supabase (usuário logado)
- Ferramentas premium com trackers e histórico
- Testes unitários para `src/lib/tools/*.ts`
- Deep link de categorias no quiz → `/protocolos?categoria=sono`
