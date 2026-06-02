# Fase 3.3 — Newsletter e Captura de Leads — Checklist de validação

## Pré-requisitos

- [ ] Migration `012_newsletter_subscribers.sql` executada no Supabase SQL Editor
- [ ] `.env.local` com `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `npm run dev` em http://localhost:3001

## Captura pública

### Home (`/`)

- [ ] Seção newsletter visível (fundo verde escuro)
- [ ] Campos **Nome** e **E-mail** obrigatórios
- [ ] Submit redireciona para `/obrigado?source=home`
- [ ] Mensagem de erro se enviar vazio ou e-mail inválido

### Blog (`/blog`)

- [ ] Seção newsletter antes do CTA final
- [ ] Submit redireciona para `/obrigado?source=blog`

### Biblioteca (`/biblioteca`)

- [ ] Seção newsletter antes do CTA final
- [ ] Submit redireciona para `/obrigado?source=biblioteca`

### Página de agradecimento (`/obrigado`)

- [ ] Nova inscrição: título "Obrigado por se inscrever!"
- [ ] E-mail duplicado: título "Você já está inscrito!" (`?existing=1`)
- [ ] Exibe origem (Home, Blog, Biblioteca)
- [ ] Links para início e blog funcionam

## Validação de duplicidade

- [ ] Inscrever mesmo e-mail duas vezes → redireciona para `/obrigado?existing=1`
- [ ] Apenas **um** registro na tabela `newsletter_subscribers` (constraint `unique(email)`)
- [ ] No Supabase Table Editor: conferir colunas `name`, `email`, `source`, `status`

## Admin

- [ ] Login como admin em `/entrar`
- [ ] Menu lateral exibe **Leads**
- [ ] `/admin/leads` lista inscritos com nome, e-mail, origem, status, data
- [ ] Filtros por origem (Todos, Home, Blog, Biblioteca) funcionam
- [ ] Dashboard `/admin` mostra cards **Leads newsletter** e **Leads (30 dias)**
- [ ] Botão **Exportar CSV** baixa arquivo UTF-8 com BOM
- [ ] CSV contém colunas: id, name, email, source, status, provider, external_id, synced_at, created_at
- [ ] Export com `?source=blog` filtra apenas leads do blog

## Integração futura (estrutura)

- [ ] Sem `NEWSLETTER_PROVIDER` → painel indica "Não configurada"
- [ ] Com `NEWSLETTER_PROVIDER=brevo` + `BREVO_API_KEY` → painel indica provedor configurado (sync ainda stub)
- [ ] Colunas `provider`, `external_id`, `synced_at`, `sync_error` existem na tabela

## Build

```bash
npm run build
```

- [ ] Build conclui sem erros TypeScript

## SQL rápido (verificação)

```sql
select email, source, status, created_at
from public.newsletter_subscribers
order by created_at desc
limit 20;
```

## Arquivos principais

| Área | Path |
|------|------|
| Migration | `supabase/migrations/012_newsletter_subscribers.sql` |
| Action | `src/lib/actions/newsletter.actions.ts` |
| Providers | `src/lib/newsletter/providers.ts` |
| Formulário | `src/components/newsletter/NewsletterCaptureForm.tsx` |
| Seção | `src/components/newsletter/NewsletterCaptureSection.tsx` |
| Obrigado | `src/app/obrigado/page.tsx` |
| Admin | `src/app/admin/leads/page.tsx` |
| Export CSV | `src/app/api/admin/newsletter/export/route.ts` |
