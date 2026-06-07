# Fase 5.6 — WhatsApp, Captação e Comunicação

Integração WhatsApp Business (Meta Cloud API) ao funil de captação (5.2–5.3) e monetização (5.4–5.5).

## Objetivos entregues

| # | Objetivo | Status |
|---|----------|--------|
| 1 | Captação via WhatsApp (click-to-chat + formulário opt-in) | ✅ |
| 2 | Webhook Meta — mensagens inbound + status | ✅ |
| 3 | Templates (catálogo local + seed) | ✅ |
| 4 | Sincronização CRM (`lead_interactions`) | ✅ |
| 5 | Pós-cadastro — boas-vindas + nutrição D+1 | ✅ |
| 6 | Pós-assinatura Premium — confirmação WhatsApp | ✅ |
| 7 | Admin `/admin/comunicacao` | ✅ |
| 8 | Opt-in / opt-out LGPD | ✅ |

## Migration

| Arquivo | Descrição |
|---------|-----------|
| `031_whatsapp_communication.sql` | Telefone, opt-in, mensagens, templates, automação |

Execute após `030_phase_5_5_monetization.sql`.

## Arquitetura

```
Site / LPs → formulário (phone + opt-in) → capture_newsletter_lead
         → startWhatsAppAutomation → template sb_boas_vindas
         → lead_interactions (whatsapp_sent)

Meta webhook → /api/webhooks/whatsapp → whatsapp_messages + CRM

Pagamento MP → subscription_activated → sb_pagamento_confirmado (se lead com opt-in)

Cron diário → /api/cron/whatsapp-automation → nutrição + lembretes renovação
```

## Templates Meta (criar no Business Manager)

| Chave | Nome Meta | Gatilho |
|-------|-----------|---------|
| `sb_boas_vindas` | sb_boas_vindas | Opt-in captura |
| `sb_nutricao_d1` | sb_nutricao_d1 | Automação D+1 |
| `sb_pagamento_confirmado` | sb_pagamento_confirmado | Premium ativado |
| `sb_renovacao_lembrete` | sb_renovacao_lembrete | 7 dias antes vencimento |
| `sb_reengajamento` | sb_reengajamento | Reengajamento (futuro) |

## Variáveis de ambiente

```env
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_BUSINESS_ACCOUNT_ID=
WHATSAPP_WEBHOOK_VERIFY_TOKEN=
WHATSAPP_APP_SECRET=
WHATSAPP_DEFAULT_COUNTRY_CODE=55
WHATSAPP_CRON_SECRET=
NEXT_PUBLIC_WHATSAPP_DISPLAY_NUMBER=5511999999999
WHATSAPP_STUB_MODE=1              # apenas dev
```

## Endpoints

| Rota | Função |
|------|--------|
| `GET/POST /api/webhooks/whatsapp` | Verificação + inbound Meta |
| `POST /api/cron/whatsapp-automation` | Nutrição + lembretes |
| `/admin/comunicacao` | Dashboard |
| `/admin/comunicacao/templates` | Catálogo templates |

## Componentes UI

- `WhatsAppCaptureButton` — click-to-chat
- `WhatsAppCaptureSection` — bloco em LPs e `/obrigado`
- `WhatsAppFloatingButton` — botão flutuante site
- `LeadCaptureForm` — campos phone + opt-in (`showWhatsAppFields`)

## Opt-out

Lead responde **SAIR**, **CANCELAR** ou **STOP** → `whatsapp_opt_out_at` + interação CRM.

## Checklist de produção

Ver [`PHASE_5_6_CHECKLIST.md`](./PHASE_5_6_CHECKLIST.md).

## Build

```bash
npm run build
```
