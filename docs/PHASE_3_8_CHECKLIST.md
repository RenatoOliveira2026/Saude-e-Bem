# Fase 3.8 — Área do Assinante Premium — Checklist

## Pré-requisitos

- [ ] Migrations `001`–`017` executadas no Supabase
- [ ] Usuário autenticado para área `/clube/*` (membros)
- [ ] `npm run dev` ou deploy Vercel atualizado

## Migration 017

Arquivo: `supabase/migrations/017_subscriber_area.sql`

- [ ] Tabela `user_saved_protocols` (status: saved, in_progress, completed)
- [ ] Tabela `user_content_access` (histórico de visualizações)
- [ ] RLS: usuário gerencia apenas seus registros
- [ ] Trigger `updated_at` em protocolos salvos

## Funcionalidades

### Meus Favoritos

- [ ] Botão **Favoritar** em artigos, protocolos e biblioteca
- [ ] Server action `toggleFavoriteAction`
- [ ] Listagem em `/clube/favoritos`
- [ ] Preview no dashboard

### Meus Downloads

- [ ] Download da biblioteca registra em `user_downloads`
- [ ] `trackDownloadAction` no `LibraryDownloadPanel`
- [ ] Listagem em `/clube/downloads`

### Protocolos Salvos

- [ ] Botão **Salvar protocolo** em páginas de protocolo
- [ ] Status: Salvo / Em andamento / Concluído
- [ ] Listagem em `/clube/protocolos-salvos`

### Histórico de Acessos

- [ ] Registro automático ao visitar artigo, protocolo ou ebook (usuário logado)
- [ ] Deduplicação de 5 minutos por conteúdo
- [ ] Listagem em `/clube/historico`

### Recomendações Personalizadas

- [ ] Baseadas em `user_preferences.goal`
- [ ] Respeitam plano premium (conteúdo premium só para assinantes)
- [ ] Página `/clube/recomendacoes`
- [ ] Preview no dashboard

### Dashboard Premium

- [ ] `/clube/dashboard` — estatísticas, previews, assinatura, recomendações
- [ ] Cards: dias como membro, favoritos, downloads, protocolos salvos, acessos, perfil

### Estatísticas do usuário

- [ ] `ClubUserStats` no dashboard (dias, contagens, perfil completo, objetivo)

## Rotas novas

| Rota | Descrição |
|------|-----------|
| `/clube/dashboard` | Dashboard Premium |
| `/clube/favoritos` | Meus favoritos |
| `/clube/downloads` | Meus downloads |
| `/clube/protocolos-salvos` | Protocolos com progresso |
| `/clube/historico` | Histórico de acessos |
| `/clube/recomendacoes` | Recomendações personalizadas |
| `/clube/perfil` | Perfil do membro |

## Arquivos principais

| Área | Path |
|------|------|
| Migration | `supabase/migrations/017_subscriber_area.sql` |
| Dashboard data | `src/lib/club/get-club-dashboard.ts` |
| Recomendações | `src/lib/club/get-recommendations.ts` |
| Serviços | `src/lib/club/services/` |
| Actions | `src/lib/club/actions/` |
| UI | `src/components/club/` |
| Páginas | `src/app/clube/(membros)/` |

## Teste manual

1. [ ] Login em `/entrar`
2. [ ] Acessar `/clube/dashboard` — ver estatísticas
3. [ ] Abrir um protocolo → **Salvar protocolo** e **Favoritar**
4. [ ] Baixar material da biblioteca → ver em `/clube/downloads`
5. [ ] Ver `/clube/historico` após visitar conteúdos
6. [ ] Definir objetivo em perfil/jornada → ver `/clube/recomendacoes`
7. [ ] Alterar status do protocolo em `/clube/protocolos-salvos`

## Build

```bash
npm run build
```

- [ ] Build sem erros TypeScript

## Checkpoint v0.3.8

```bash
git add .
git commit -m "Checkpoint Fase 3.8 - Área do Assinante Premium"
git tag -a v0.3.8 -m "Fase 3.8 - Área do Assinante Premium"
git push && git push origin v0.3.8
```

## SQL rápido

```sql
select user_id, protocol_id, status, updated_at
from public.user_saved_protocols
order by updated_at desc
limit 10;

select user_id, content_type, content_title, created_at
from public.user_content_access
order by created_at desc
limit 10;
```

## Relação com Minha Jornada

- **Minha Jornada** (`/minha-jornada`): onboarding, objetivo, checklist inicial
- **Clube Dashboard** (`/clube/dashboard`): hub do assinante com favoritos, downloads, histórico e recomendações

## Fora de escopo (Fase 3.8)

- [ ] IA para recomendações
- [ ] Notificações push de novos conteúdos
- [ ] Exportação PDF do histórico
- [ ] Gamificação avançada (badges, ranking)
