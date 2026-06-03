# Fase 3.9 — IA de Recomendações Inteligentes — Checklist

## Pré-requisitos

- [ ] Migrations `001`–`018` executadas no Supabase
- [ ] Migration `017` (`user_content_access`) já aplicada
- [ ] Usuário autenticado para área `/clube/*`
- [ ] Eventos em `analytics_events` (Fase 3.4) para rankings

## Migration 018

Arquivo: `supabase/migrations/018_intelligent_recommendations.sql`

- [ ] Tabela `user_content_history` (histórico consolidado + continuar lendo)
- [ ] Tabela `content_rankings` (views/downloads/score por período)
- [ ] Backfill de `user_content_access` → `user_content_history`
- [ ] Função `refresh_content_rankings()` — agrega `analytics_events`
- [ ] Função `get_user_recommendations(p_user_id, p_limit, p_include_premium)`
- [ ] RLS: usuário gerencia próprio histórico; rankings legíveis por autenticados
- [ ] Seed inicial: `select refresh_content_rankings()`

## Funcionalidades

### Continuar lendo

- [ ] Upsert em `user_content_history` ao visitar conteúdo
- [ ] Seção no dashboard e página Recomendações IA
- [ ] Protocolos `in_progress` incluídos na RPC

### Recomendações personalizadas

- [ ] RPC considera `user_preferences.goal`
- [ ] Fallback para algoritmo em `get-recommendations.ts` se RPC indisponível

### Conteúdos relacionados

- [ ] Bloco `RelatedContentSection` em páginas de protocolo
- [ ] Kind `related` na RPC

### Dashboard Premium Inteligente

- [ ] `/clube/dashboard` — stats, continuar lendo, IA, ranking, previews

### Ranking de conteúdos

- [ ] `content_rankings` períodos: `all_time`, `30d`, `7d`
- [ ] Componente `ContentRankingsList`
- [ ] Atualizar via `refresh_content_rankings()`

### Histórico de acesso

- [ ] `user_content_history` (consolidado) + log `user_content_access` (eventos)
- [ ] `/clube/historico` usa histórico consolidado quando disponível

### Integração analytics_events

- [ ] Rankings derivados de `article_view`, `protocol_view`, `ebook_download`
- [ ] Score = views × 1 + downloads × 2

## Rotas

| Rota | Descrição |
|------|-----------|
| `/clube/dashboard` | Dashboard Premium Inteligente |
| `/clube/recomendacoes-ia` | Página Recomendações IA |
| `/clube/recomendacoes` | Redireciona para `/clube/recomendacoes-ia` |
| `/clube/historico` | Histórico de acessos |

## Variáveis de ambiente

Sem novas variáveis obrigatórias. Supabase configurado como nas fases anteriores.

## Arquivos principais

| Área | Path |
|------|------|
| Migration | `supabase/migrations/018_intelligent_recommendations.sql` |
| RPC client | `src/lib/club/services/intelligent-recommendations.service.ts` |
| Histórico | `src/lib/club/services/access-history.service.ts` |
| Dashboard data | `src/lib/club/get-club-dashboard.ts` |
| UI IA | `src/components/club/AiRecommendationsPanel.tsx` |
| Continuar lendo | `src/components/club/ContinueReadingSection.tsx` |
| Rankings | `src/components/club/ContentRankingsList.tsx` |
| Página IA | `src/app/clube/(membros)/recomendacoes-ia/page.tsx` |

## Teste manual

1. [ ] Login → visitar artigo, protocolo e ebook
2. [ ] Ver `/clube/dashboard` — continuar lendo preenchido
3. [ ] Abrir `/clube/recomendacoes-ia` — seções personalizadas, em alta, relacionados
4. [ ] Ver ranking com scores
5. [ ] Protocolo salvo `in_progress` aparece em continuar lendo
6. [ ] Definir objetivo em perfil → recomendações alinhadas

## Manutenção rankings

```sql
select public.refresh_content_rankings();
```

Agendar periodicamente (cron Supabase ou Vercel) após tráfego relevante.

## RPC de teste

```sql
select * from public.get_user_recommendations(
  'UUID-DO-USUARIO'::uuid,
  12,
  true
);
```

## Build

```bash
npm run build
```

- [ ] Build sem erros TypeScript

## Checkpoint v0.3.9

```bash
git add .
git commit -m "Checkpoint Fase 3.9 - IA de Recomendações"
git push
git tag -a v0.3.9 -m "Fase 3.9 - IA de Recomendações"
git push origin v0.3.9
```

## SQL rápido

```sql
select user_id, content_type, content_title, access_count, last_accessed_at
from public.user_content_history
order by last_accessed_at desc
limit 10;

select content_type, content_title, score, rank_position, ranking_period
from public.content_rankings
where ranking_period = '30d'
order by rank_position
limit 10;
```

## Fora de escopo (Fase 3.9)

- [ ] LLM externo (OpenAI/Claude) para recomendações
- [ ] Chat assistente IA
- [ ] A/B testing de recomendações
- [ ] Notificações push de conteúdo novo
