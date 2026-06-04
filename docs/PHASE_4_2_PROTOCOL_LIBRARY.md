# Fase 4.2 — Biblioteca Inteligente de Protocolos

Núcleo de conteúdo de protocolos integrado à IA de recomendações (Fase 3.9), com taxonomia oficial, listagem avançada, favoritos, histórico e painel inteligente.

## Pré-requisitos

- [ ] Migrations `001`–`018` aplicadas no Supabase
- [ ] Migration `019_protocol_library.sql` aplicada
- [ ] Fase 3.9 (`get_user_recommendations`, `user_content_history`) operacional
- [ ] Sistema Premium / assinatura (Fases anteriores do Clube)

## Migration 019

Arquivo: `supabase/migrations/019_protocol_library.sql`

| Objeto | Descrição |
|--------|-----------|
| `protocol_categories` | 10 categorias oficiais (seed) |
| `user_protocol_history` | Visualizações por usuário + protocolo |
| `user_favorites` | View sobre `favorites` |
| `record_protocol_view` | RPC upsert de histórico |
| FK `protocols.category` | Referência a `protocol_categories` (NOT VALID até backfill) |

### Categorias (seed)

1. Saúde Mental — `saude-mental`
2. Ansiedade — `ansiedade`
3. Sono — `sono`
4. Alimentação Saudável — `alimentacao-saudavel`
5. Exercícios — `exercicios`
6. Controle de Estresse — `controle-estresse`
7. Saúde Feminina — `saude-feminina`
8. Saúde Masculina — `saude-masculina`
9. Saúde do Idoso — `saude-idoso`
10. Bem-Estar Geral — `bem-estar-geral`

## Funcionalidades

### Biblioteca pública (`/protocolos`)

- [ ] Listagem com cards responsivos
- [ ] Filtro por categoria (10 + Todos)
- [ ] Busca por palavra-chave
- [ ] Filtro por tier: Todos / Gratuitos / Premium
- [ ] Destaque visual em protocolos gratuitos (badge + ring)
- [ ] Premium: detalhe com `PremiumContentGuard` + assinatura ativa

### Favoritos

- [ ] `FavoriteButton` nos cards (usuário logado + ID UUID)
- [ ] Toggle via `toggleFavoriteAction` (revalida biblioteca e painel)
- [ ] Página unificada: `/clube/favoritos` (todos os tipos de conteúdo)

### Histórico

- [ ] `record_protocol_view` ao abrir detalhe (UUID)
- [ ] Fallback `user_content_history` se tabela 019 indisponível
- [ ] `/protocolos/recentes` — lista dedicada

### Painel inteligente (`/protocolos/painel`)

- [ ] Recomendações IA (`get_user_recommendations`)
- [ ] Favoritos de protocolos
- [ ] Últimos acessados
- [ ] Novidades e destaques free/premium

## Rotas

| Rota | Auth | Descrição |
|------|------|-----------|
| `/protocolos` | Pública | Biblioteca com filtros e busca |
| `/protocolos/[slug]` | Pública* | Detalhe (*Premium com gate) |
| `/protocolos/painel` | Login | Dashboard inteligente |
| `/protocolos/recentes` | Login | Histórico de visualizações |
| `/clube/favoritos` | Login | Meus favoritos (Clube) |

## Arquivos principais

| Área | Path |
|------|------|
| Migration | `supabase/migrations/019_protocol_library.sql` |
| Domínio | `src/lib/protocol-library/` |
| UI | `src/components/protocol-library/` |
| Páginas | `src/app/protocolos/page.tsx`, `painel/`, `recentes/` |
| Histórico | `src/lib/protocol-library/services/history.service.ts` |
| View tracking | `src/lib/club/record-content-view.ts` |

## Build e validação

```bash
npm run build
```

Rotas a validar manualmente:

1. `/protocolos` — filtros, busca, cards free/premium
2. `/protocolos/sono-reparador` — histórico (logado)
3. `/protocolos/painel` — redireciona para login se anônimo
4. `/protocolos/recentes` — lista após visualizar protocolos
5. Protocolo premium — gate sem assinatura; acesso com Premium

## Checkpoint sugerido

Após checklist completo e build verde:

```bash
git add -A
git commit -m "feat(protocols): biblioteca inteligente de protocolos (Fase 4.2)"
git tag v4.2
```

**Tag:** `v4.2` — Biblioteca Inteligente de Protocolos + integração IA 3.9.

## Checklist da fase

### Banco de dados

- [ ] `019_protocol_library.sql` executada
- [ ] 10 categorias visíveis em `protocol_categories`
- [ ] RPC `record_protocol_view` testada

### UI / UX

- [ ] 10 categorias no filtro
- [ ] Busca funcional
- [ ] Badge Gratuito em cards free
- [ ] Premium com mensagem de assinatura
- [ ] Painel com seções IA, favoritos, recentes, novidades

### Integração

- [ ] Favoritos sincronizam com `/clube/favoritos`
- [ ] IA exibe protocolos no painel
- [ ] Visualização registra histórico

### Deploy

- [ ] `npm run build` sem erros
- [ ] Migration 019 no Supabase de produção
