# Fase 5.6 — WhatsApp, Captação e Comunicação (Planejamento)

Integração de WhatsApp Business ao funil de captação (Fases 5.2–5.3) e à monetização (Fases 5.4–5.5), com comunicação transacional e nutrição multicanal.

> **Status:** planejamento — implementação na próxima sprint.

---

## Objetivo

1. **Captação via WhatsApp** — botões click-to-chat e formulários com opt-in
2. **Webhook de mensagens** — receber e registrar interações no CRM
3. **Templates aprovados** — boas-vindas, nutrição, confirmação de pagamento, lembrete de renovação
4. **Sincronização CRM** — `newsletter_leads` + `lead_interactions` + score
5. **Comunicação pós-conversão** — confirmação Premium, onboarding, reengajamento
6. **Admin** — fila de mensagens, status de envio, métricas WhatsApp
7. **Opt-in / LGPD** — consentimento explícito e opt-out

---

## Escopo excluído (mantido intacto)

Biblioteca (módulo core), Marketplace, Protocolos inteligentes, checkout Mercado Pago (lógica existente).

---

## Arquitetura proposta

```mermaid
flowchart LR
  A[Site / LPs / CTAs] -->|wa.me + formulário| B[Lead com phone + opt-in]
  B --> C[newsletter_leads]
  C --> D[CRM lead_interactions]
  E[Meta Cloud API Webhook] --> F[/api/webhooks/whatsapp]
  F --> D
  F --> G[whatsapp_messages]
  H[Cron / automação] --> I[Envio template]
  I --> E
  J[Pagamento aprovado] --> K[Evento financial_events]
  K --> H
```

---

## Integração técnica (Meta WhatsApp Cloud API)

### Credenciais necessárias

| Credencial | Onde obter |
|------------|------------|
| `WHATSAPP_ACCESS_TOKEN` | Meta Business → App → WhatsApp → API Setup |
| `WHATSAPP_PHONE_NUMBER_ID` | Número business verificado |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | WhatsApp Business Account |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | Token definido por nós na configuração |
| `WHATSAPP_APP_SECRET` | App Dashboard Meta — validação de assinatura |

### Endpoints previstos

| Rota | Função |
|------|--------|
| `GET/POST /api/webhooks/whatsapp` | Verificação Meta + recebimento de mensagens |
| `POST /api/whatsapp/send` | Envio server-side (admin/cron) |
| `POST /api/cron/whatsapp-automation` | Sequências de nutrição WhatsApp |

---

## Migration prevista (`031_whatsapp_communication.sql`)

| Objeto | Uso |
|--------|-----|
| `newsletter_leads.phone` | Telefone E.164 (+55...) |
| `newsletter_leads.whatsapp_opt_in` | Consentimento LGPD |
| `newsletter_leads.whatsapp_opt_in_at` | Data do opt-in |
| `whatsapp_messages` | Fila/histórico — inbound/outbound, status, template_id |
| `whatsapp_templates` | Catálogo local espelhando templates Meta |
| `whatsapp_automation_runs` | Execução de sequências (paralelo a `lead_automation_runs`) |

---

## Captação (UI)

### Componentes previstos

| Componente | Onde |
|------------|------|
| `WhatsAppCaptureButton` | LPs, `/obrigado`, CTAs de conversão |
| `WhatsAppLeadForm` | Nome + telefone + opt-in checkbox |
| `WhatsAppFloatingButton` | Site (opcional, configurável) |

### Fluxos

1. **Click-to-chat** — `https://wa.me/55XXXXXXXXXXX?text=...` com UTM/source
2. **Formulário** — salva lead via RPC estendida + registra interação CRM
3. **Pós-assinatura** — template de boas-vindas Premium automático

---

## Templates de comunicação (Meta — aprovação prévia)

| Template | Gatilho | Canal |
|----------|---------|-------|
| `sb_boas_vindas` | Novo lead (opt-in) | WhatsApp |
| `sb_nutricao_d1` | Automação CRM dia 1 | WhatsApp |
| `sb_pagamento_confirmado` | Webhook MP aprovado | WhatsApp |
| `sb_renovacao_lembrete` | 7 dias antes do vencimento (PIX/boleto) | WhatsApp |
| `sb_reengajamento` | Lead morno 14 dias sem interação | WhatsApp |

> Templates devem ser criados e **aprovados no Meta Business Manager** antes do envio em produção.

---

## Integração com módulos existentes

| Módulo | Integração |
|--------|------------|
| **Leads (5.2)** | `saveLeadAction` aceita `phone` + `whatsappOptIn` |
| **CRM (5.3)** | Nova interação `whatsapp_inbound` / `whatsapp_sent` |
| **Automação (5.3)** | Steps `channel: whatsapp` em sequências |
| **Monetização (5.5)** | Hook pós-`subscription_activated` → template confirmação |
| **Admin leads** | Coluna telefone + filtro opt-in WhatsApp |
| **Admin conversão** | Métricas: leads WhatsApp, taxa resposta |

---

## Variáveis Vercel (previstas)

```env
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_BUSINESS_ACCOUNT_ID=
WHATSAPP_WEBHOOK_VERIFY_TOKEN=
WHATSAPP_APP_SECRET=
WHATSAPP_DEFAULT_COUNTRY_CODE=55
WHATSAPP_CRON_SECRET=
```

Manter variáveis existentes de Supabase, Mercado Pago e CRM (Brevo opcional).

---

## Admin previsto

| Rota | Função |
|------|--------|
| `/admin/comunicacao` | Dashboard WhatsApp — enviados, entregues, falhas |
| `/admin/comunicacao/templates` | Lista templates + status Meta |
| `/admin/leads/[id]` | Timeline com mensagens WhatsApp |

---

## Configuração Meta (checklist futuro)

1. Criar **Meta Business Account** e verificar empresa
2. Adicionar **número WhatsApp Business**
3. Criar **App** com produto WhatsApp
4. Configurar webhook: `https://SEU-DOMINIO/api/webhooks/whatsapp`
5. Subscrever campos: `messages`, `message_template_status_update`
6. Criar e submeter **templates** para aprovação
7. Testar com números de sandbox Meta

---

## Ordem de implementação sugerida

| Etapa | Entrega |
|-------|---------|
| **5.6.1** | Migration 031 + tipos + serviço WhatsApp base |
| **5.6.2** | Webhook Meta + registro inbound no CRM |
| **5.6.3** | Captação UI (botão + formulário) nas LPs e CTAs |
| **5.6.4** | Envio transacional pós-pagamento Premium |
| **5.6.5** | Automação nutrição + cron |
| **5.6.6** | Admin comunicação + docs + checklist |

---

## Critérios de aceite (Fase 5.6)

- [ ] Lead capturado com telefone e opt-in registrado no Supabase
- [ ] Mensagem inbound registrada em `lead_interactions`
- [ ] Template de boas-vindas enviado após opt-in (sandbox)
- [ ] Confirmação WhatsApp após pagamento Premium aprovado
- [ ] Admin exibe histórico de mensagens por lead
- [ ] Opt-out respeitado — sem envios após revogação
- [ ] Build e webhook Meta validados em staging

---

## Referências internas

- [`PHASE_5_2_CONVERSION.md`](./PHASE_5_2_CONVERSION.md) — captação e LPs
- [`PHASE_5_3_CRM_AUTOMATION.md`](./PHASE_5_3_CRM_AUTOMATION.md) — pipeline e automação
- [`PHASE_5_5_MONETIZATION.md`](./PHASE_5_5_MONETIZATION.md) — eventos financeiros pós-pagamento
- [`PHASE_5_5_CHECKLIST.md`](./PHASE_5_5_CHECKLIST.md) — checklist produção pagamentos
