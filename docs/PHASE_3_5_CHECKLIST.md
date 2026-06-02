# Fase 3.5 — Clube Saúde & Bem Premium — Checklist de validação

## Pré-requisitos

- [ ] Migration `014_clube_premium.sql` executada no Supabase SQL Editor (após 013)
- [ ] `.env.local` com `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `npm run dev` em http://localhost:3001

## Migration 014

- [ ] Coluna `membership_tier` em `profiles` (default `free`)
- [ ] Coluna `club_joined_at` em `profiles`
- [ ] Coluna `is_premium` em `articles`
- [ ] Tabela `subscriptions` criada
- [ ] Tabela `user_downloads` criada
- [ ] Funções `user_has_active_premium()` e `touch_club_joined()` disponíveis
- [ ] RLS ativo em `subscriptions` e `user_downloads`

## Rotas públicas do clube

### Landing (`/clube`)

- [ ] Página de marketing carrega sem login
- [ ] Seções de benefícios, preços e FAQ visíveis

### Premium (`/clube/premium`)

- [ ] Página acessível sem login
- [ ] Indica que Stripe será habilitado em breve
- [ ] CTAs para cadastro e dashboard funcionam

## Área de membros (exige login)

- [ ] `/clube/dashboard` redireciona para `/entrar` se deslogado
- [ ] Dashboard exibe nome, plano atual e validade da assinatura
- [ ] Cards de favoritos e downloads com contagem
- [ ] `/clube/favoritos` lista favoritos resolvidos (título + link)
- [ ] `/clube/downloads` lista histórico de downloads
- [ ] `/clube/perfil` exibe formulário de perfil e plano

## Controle de acesso premium

### Conteúdo marcado como premium no CMS

- [ ] Artigo com `is_premium` → visitante vê hero + gate (sem corpo)
- [ ] Protocolo premium → gate para não-assinantes
- [ ] Ebook/biblioteca premium → gate para não-assinantes
- [ ] Membro premium (assinatura ativa) vê conteúdo completo
- [ ] Admin continua com acesso total ao conteúdo premium

### Conceder premium manualmente (sem Stripe)

```sql
insert into public.subscriptions (
  user_id, plan, status, provider,
  current_period_start, current_period_end
) values (
  'UUID-DO-USUARIO',
  'premium',
  'active',
  'manual',
  timezone('utc', now()),
  timezone('utc', now()) + interval '365 days'
);
```

- [ ] Após insert, `profiles.membership_tier` = `premium`
- [ ] Dashboard mostra plano Premium e data de validade
- [ ] Conteúdo premium desbloqueado para o usuário

## CMS (admin)

- [ ] Formulário de artigos exibe checkbox **Conteúdo premium**
- [ ] Protocolos e biblioteca já possuem checkbox `is_premium`
- [ ] Salvar artigo premium persiste `is_premium = true`

## Middleware

- [ ] Rotas `/clube/dashboard`, `/clube/favoritos`, `/clube/downloads`, `/clube/perfil` protegidas
- [ ] `/clube` e `/clube/premium` permanecem públicas
- [ ] Redirect pós-login preserva `?redirect=` para área do clube

## Build

```bash
npm run build
```

- [ ] Build conclui sem erros TypeScript

## SQL rápido (verificação)

```sql
select id, email, membership_tier, club_joined_at
from public.profiles
order by created_at desc
limit 10;

select user_id, plan, status, current_period_end, provider
from public.subscriptions
order by created_at desc
limit 10;

select user_id, content_type, content_title, created_at
from public.user_downloads
order by created_at desc
limit 10;
```

## Arquivos principais

| Área | Path |
|------|------|
| Migration | `supabase/migrations/014_clube_premium.sql` |
| Acesso premium | `src/lib/club/access.ts` |
| Dashboard | `src/lib/club/get-club-dashboard.ts` |
| Rotas | `src/app/clube/(membros)/*`, `src/app/clube/premium/page.tsx` |
| UI | `src/components/club/*` |
| Gate conteúdo | `src/components/club/PremiumContentGuard.tsx` |
| Middleware | `src/middleware.ts`, `src/lib/auth/routes.ts` |
| CMS artigos | `src/components/admin/forms/ArticleCmsForm.tsx` |

## Fora de escopo (Fase 3.5)

- [ ] Integração Stripe (checkout, webhooks, portal)
- [ ] Cobrança recorrente automática
- [ ] Botão favoritar na UI pública (tabela `favorites` já existe)
