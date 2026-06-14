# Fase 5.2 — Captação de leads e construção de audiência

**Projeto:** [saudeebem.com.br](https://www.saudeebem.com.br)  
**Status:** implementado no código — migration `032` pendente no Supabase de produção.

## Funcionalidades criadas

| Item | Descrição |
|------|-----------|
| Newsletter global | Componentes reutilizáveis (`GlobalNewsletterSection`, `NewsletterFooterCapture`, `NewsletterCaptureForm`) com campos Nome + E-mail |
| Lead magnet | Landing `/guia-30-dias` com Nome, E-mail e WhatsApp opcional |
| Popup inteligente | `NewsletterSmartPopup` — 45s ou 50% scroll; cooldown 7 dias |
| Admin de leads | Painel `/admin/newsletter` com totais, origem, tabela e exportação CSV |
| GA4 | Eventos `newsletter_signup` e `lead_magnet_download` via `NewsletterConversionTracker` |
| E-mail marketing | Camada `src/lib/email` (Brevo, MailerLite, ConvertKit) — stubs, não conectada |
| Página de agradecimento | `/obrigado-newsletter` com CTAs para Blog, Protocolos e Biblioteca |

## Tabelas

### `newsletter_subscribers` (migration 012 + 032)

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | uuid | PK |
| `name` | text | obrigatório |
| `email` | text | único (23505 em duplicata) |
| `phone` | text | opcional — migration 032 |
| `source` | text | check estendido na 032 |
| `status` | text | active / unsubscribed / bounced |
| `created_at` | timestamptz | |
| (+ campos sync) | provider, external_id, synced_at, sync_error, metadata, updated_at |

**Origens (`source`):** `home`, `blog`, `biblioteca`, `protocolos`, `footer`, `popup`, `guia-30-dias`, `clube`, `other`

## Rotas

| Rota | Função |
|------|--------|
| `/guia-30-dias` | Lead magnet principal |
| `/obrigado-newsletter` | Agradecimento pós-cadastro (noindex) |
| `/admin/newsletter` | Painel administrativo |
| `/api/admin/newsletter/export` | Exportação CSV |

## Locais da newsletter global

- Home (`NewsletterLeadSection`)
- Blog
- Biblioteca
- Protocolos
- Rodapé (`NewsletterFooterCapture`)
- Popup global (`AppShell`)

## Eventos GA4

Disparados em `/obrigado-newsletter` (query `source`, `event`, `existing`):

| Evento | Quando |
|--------|--------|
| `newsletter_signup` | Formulários newsletter |
| `lead_magnet_download` | Cadastro em `/guia-30-dias` |

Parâmetros: `source_page`, `page_source`, `device_category`, `is_existing_subscriber`, `event_timestamp`

## Pendências futuras

1. **Supabase:** aplicar `supabase/migrations/032_newsletter_phase_5_2.sql` em produção
2. **E-mail marketing:** definir `EMAIL_PROVIDER` + API key e testar sync (`BREVO_API_KEY`, `MAILERLITE_API_KEY` ou `CONVERTKIT_API_KEY`)
3. **Lead magnet:** enviar PDF/guia real por e-mail ou link de download após cadastro
4. **Sitemap:** opcional incluir `/guia-30-dias` se quiser indexação orgânica do lead magnet
5. **Unsubscribe:** fluxo de cancelamento e atualização de `status`

## Arquivos principais

```
src/components/newsletter/
src/lib/actions/newsletter.actions.ts
src/lib/email/
src/lib/analytics/gtag.ts
src/app/guia-30-dias/page.tsx
src/app/obrigado-newsletter/page.tsx
src/app/admin/newsletter/page.tsx
supabase/migrations/032_newsletter_phase_5_2.sql
```
