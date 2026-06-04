# Fase 4.3 — Perfil Inteligente e Histórico de Saúde

Persistência dos resultados das ferramentas interativas no Supabase e área `/minha-saude` para acompanhamento pessoal e recomendações de protocolos.

## Pré-requisitos

- [ ] Migrations `001`–`019` aplicadas
- [ ] Migration `020_user_tool_results.sql` aplicada
- [ ] Fase 4.2.2 — ferramentas interativas operacionais
- [ ] Autenticação Supabase configurada (`.env.local` / Vercel)

## Migration 020

Arquivo: `supabase/migrations/020_user_tool_results.sql`

| Objeto | Descrição |
|--------|-----------|
| `user_tool_results` | Histórico de resultados por usuário e ferramenta |
| RLS | Usuário autenticado gerencia apenas próprios registros |
| Grants | `select`, `insert` para `authenticated` |

### Colunas

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid | PK |
| `user_id` | uuid | FK `auth.users` |
| `tool_slug` | text | Slug da ferramenta |
| `result_json` | jsonb | Payload completo do resultado |
| `created_at` | timestamptz | Data do registro |

## Ferramentas com save automático

| Slug | Salva? |
|------|--------|
| `calculadora-imc` | Sim |
| `consumo-agua` | Sim |
| `proteina-diaria` | Sim |
| `metabolismo-basal` | Sim |
| `quiz-saude-bem` | Sim |
| `risco-cardiometabolico` | Não (Fase 4.2.2 inalterada) |

- Save via server action `saveToolResultAction` — **somente usuário logado**
- Visitantes anônimos: ferramentas funcionam normalmente, sem persistência
- Badge **“Salvo em Minha Saúde”** após save bem-sucedido

## Página `/minha-saude`

Rota privada (`privateRoutes` + proxy).

### Seções

1. **Hero** — boas-vindas e CTAs (ferramentas, Minha Jornada)
2. **Últimos resultados** — card resumido por ferramenta (mais recente de cada slug)
3. **Protocolos recomendados** — engine automática + links para detalhe e biblioteca
4. **Histórico completo** — lista cronológica de todos os registros

## Recomendações automáticas

Arquivo: `src/lib/health-profile/recommendations.ts`

- **Quiz:** categorias de `protocolCategories` no resultado
- **IMC:** sobrepeso/obesidade → alimentação + exercícios
- **Proteína / água / TMB:** hints complementares
- Até **4 protocolos** da biblioteca (`getProtocolLibraryItems`), priorizando gratuitos
- Links: `/protocolos/[slug]`, biblioteca e painel inteligente

## Arquitetura

```
supabase/migrations/020_user_tool_results.sql

src/lib/health-profile/
  constants.ts          # SAVABLE_TOOL_SLUGS
  types.ts
  summaries.ts          # Resumo por ferramenta
  recommendations.ts    # Protocolos sugeridos
  get-health-profile-data.ts
  use-persist-tool-result.ts
  actions/save-tool-result.action.ts
  services/tool-results.service.ts

src/components/health-profile/
  HealthProfileDashboard.tsx
  HealthRecommendations.tsx
  ToolResultCards.tsx

src/app/minha-saude/page.tsx
```

## Rotas e navegação

| Rota | Auth |
|------|------|
| `/minha-saude` | Login obrigatório |

- `routes.minhaSaude`
- Nav logado: “Minha Saúde”
- Footer → conta

## Checklist de validação

- [ ] Migration 020 no Supabase SQL Editor ou CLI
- [ ] Login → usar calculadora IMC → badge “Salvo em Minha Saúde”
- [ ] `/minha-saude` — último IMC + histórico
- [ ] Quiz salvo → recomendações de protocolos
- [ ] Anônimo → ferramentas OK, sem save
- [ ] `npm run build` passa

## Compatibilidade

- **Fase 4.2.2:** componentes de ferramentas preservados; apenas hook de persistência + badge opcional
- **Risco cardiometabólico:** sem alteração de fluxo ou persistência

## Próximos passos (fora do escopo)

- Persistir `risco-cardiometabolico`
- Gráficos de evolução (IMC, peso) ao longo do tempo
- Sync quiz → `user_preferences.goal`
- Deep link `/protocolos?categoria=`
