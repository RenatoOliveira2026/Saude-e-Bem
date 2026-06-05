# Fase 4.8 — Captura de Leads e Automação

Estrutura de captação com nome, e-mail e interesse principal — preparada para campanhas em redes sociais, domínio próprio e venda futura do Clube Premium.

## Migration

Arquivo: `supabase/migrations/023_newsletter_leads_interest.sql`  
(Tabela base em `009_home_public.sql`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid | PK, `gen_random_uuid()` |
| `name` | text | Nome (opcional no banco) |
| `email` | text | E-mail (único, obrigatório) |
| `source` | text | Origem da captura |
| `interest` | text | Interesse principal |
| `created_at` | timestamptz | Data do cadastro |

### RLS

- **INSERT** público (`anon`, `authenticated`) — policy existente desde migration 009
- **SELECT** apenas admins (`is_admin()`)

## Arquitetura

```
src/lib/leads/
  lead.types.ts
  lead.constants.ts      # Interesses + sources
  lead.validate.ts
  actions/save-lead.action.ts
  index.ts

src/components/leads/
  LeadCaptureForm.tsx
  LeadCaptureSection.tsx
  index.ts
```

## Formulário `LeadCaptureForm`

| Campo | Tipo |
|-------|------|
| Nome | text |
| E-mail | email |
| Interesse principal | select |

### Interesses

| ID | Label |
|----|-------|
| `emagrecimento` | Emagrecimento |
| `sono` | Sono |
| `energia` | Energia |
| `longevidade` | Longevidade |
| `saude-cardiovascular` | Saúde cardiovascular |
| `bem-estar-geral` | Bem-estar geral |

## Server action

`saveLeadAction` → insert em `newsletter_leads`

| Situação | Comportamento |
|----------|---------------|
| Sucesso | Redirect `/obrigado?type=lead&source=…&interest=…` |
| E-mail duplicado (`23505`) | Redirect `/obrigado?…&existing=1` |
| Erro | Mensagem **Erro ao cadastrar** |

## Mensagens (`LEAD_MESSAGES`)

- **Cadastro realizado com sucesso**
- **E-mail já cadastrado**
- **Erro ao cadastrar**

Exibidas em `/obrigado` (fluxo `type=lead`).

## Páginas com captura

| Página | Source |
|--------|--------|
| Home | `home` |
| Biblioteca | `biblioteca` |
| Blog | `blog` |
| `/assinar` | `assinar` |
| `/minha-saude` | `minha-saude` |

## Analytics

Evento `lead_submitted` com `metadata: { source, interest }`.

## O que não foi alterado

- Login / autenticação
- Fluxo de assinaturas e checkout Mercado Pago
- Score Saúde & Bem
- Ferramentas interativas
- Motor de protocolos inteligentes
- Conteúdo premium da biblioteca

> A tabela `newsletter_subscribers` (Fase 3.3) permanece para sync Brevo/MailerLite.  
> `newsletter_leads` concentra leads com **interesse** para campanhas segmentadas.

## Teste manual

1. Aplicar migration `023` no Supabase
2. Preencher formulário na Home com interesse
3. Confirmar redirect em `/obrigado` com mensagem de sucesso
4. Repetir mesmo e-mail → **E-mail já cadastrado**
5. Verificar registro em `newsletter_leads` (admin)

## Build

```bash
npm run build
```

## Próximos passos (Fase 5+)

- [ ] Automação e-mail (Brevo / MailerLite) por `interest`
- [ ] Admin: listagem e export CSV de `newsletter_leads`
- [ ] Sequências por interesse (drip campaigns)
- [ ] Integração Meta Ads / UTM em `source`
