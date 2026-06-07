# Fase 5.6 — Checklist de Produção (WhatsApp)

Use após deploy na Vercel e migration `031` aplicada no Supabase.

---

## 1. Configuração do WhatsApp Business

- [ ] Conta **WhatsApp Business** ativa e verificada
- [ ] Número business dedicado (não usar WhatsApp pessoal em produção)
- [ ] Perfil business preenchido (nome, descrição, horário)
- [ ] Número conectado ao **Meta Cloud API** (não apenas app mobile)
- [ ] Copiar **Phone Number ID** → `WHATSAPP_PHONE_NUMBER_ID`
- [ ] Copiar **WhatsApp Business Account ID** → `WHATSAPP_BUSINESS_ACCOUNT_ID`
- [ ] Gerar **Access Token** permanente → `WHATSAPP_ACCESS_TOKEN`
- [ ] Definir `NEXT_PUBLIC_WHATSAPP_DISPLAY_NUMBER` (somente dígitos, ex.: `5511987654321`)

---

## 2. Meta Business Manager

1. Acesse [business.facebook.com](https://business.facebook.com)
2. Crie ou selecione a **Conta Comercial**
3. **Configurações → Contas do WhatsApp** → adicione o número
4. **Verificação da empresa** (Business Verification) — necessária para templates MARKETING em escala
5. **Apps → Seu App → WhatsApp → API Setup** — copie credenciais
6. **Message Templates** → crie os 5 templates com nomes exatos:
   - `sb_boas_vindas`
   - `sb_nutricao_d1`
   - `sb_pagamento_confirmado`
   - `sb_renovacao_lembrete`
   - `sb_reengajamento`
7. Aguarde status **Approved** no Meta (espelhado em `/admin/comunicacao/templates`)

---

## 3. Página Facebook

- [ ] Página Facebook vinculada à Conta Comercial
- [ ] Página publicada e acessível
- [ ] Página conectada ao número WhatsApp Business
- [ ] Botão **Enviar mensagem** ou link wa.me testado publicamente
- [ ] Mesma identidade visual do site Saúde & Bem (confiança na captação)

---

## 4. Webhook Meta

**Meta App Dashboard → WhatsApp → Configuration → Webhook**

| Campo | Valor |
|-------|-------|
| **Callback URL** | `https://SEU-DOMINIO.com.br/api/webhooks/whatsapp` |
| **Verify Token** | mesmo valor de `WHATSAPP_WEBHOOK_VERIFY_TOKEN` |
| **Campos subscribed** | `messages` |

Passos:

1. Defina `WHATSAPP_WEBHOOK_VERIFY_TOKEN` na Vercel (string secreta qualquer)
2. Clique **Verify and Save** no Meta — GET deve retornar `hub.challenge`
3. Defina `WHATSAPP_APP_SECRET` (App Dashboard → Settings → Basic)
4. Envie mensagem de teste para o número business
5. Confirme em `/admin/comunicacao` — contador **Recebidas (30d)** incrementa
6. Confirme em `/admin/leads/[id]` — interação `whatsapp_inbound`

---

## 5. Variáveis da Vercel

**Production:**

```env
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_BUSINESS_ACCOUNT_ID=
WHATSAPP_WEBHOOK_VERIFY_TOKEN=
WHATSAPP_APP_SECRET=
WHATSAPP_DEFAULT_COUNTRY_CODE=55
WHATSAPP_CRON_SECRET=
NEXT_PUBLIC_WHATSAPP_DISPLAY_NUMBER=5511XXXXXXXXX
```

Manter também: Supabase, Mercado Pago, `PAYMENTS_CRON_SECRET`, `NEXT_PUBLIC_SITE_URL`.

**Dev local (opcional):**

```env
WHATSAPP_STUB_MODE=1
```

Redeploy após alterar variáveis.

**Cron Vercel** (já em `vercel.json`):

```
POST /api/cron/whatsapp-automation
Authorization: Bearer $WHATSAPP_CRON_SECRET
Schedule: 0 7 * * * (diário 7h UTC)
```

---

## 6. Integração CRM

- [ ] Migration `031_whatsapp_communication.sql` aplicada
- [ ] Captura grava `phone`, `whatsapp_opt_in`, `whatsapp_opt_in_at` em `newsletter_leads`
- [ ] Interações CRM registradas:
  - `whatsapp_sent` — template enviado
  - `whatsapp_inbound` — mensagem recebida
  - `whatsapp_opt_out` — lead pediu sair
- [ ] `/admin/leads/[id]` exibe telefone, opt-in e mensagens WhatsApp
- [ ] `/admin/comunicacao` exibe KPIs e fila recente
- [ ] Opt-out respeitado — sem envios após `whatsapp_opt_out_at`

---

## 7. Fluxo de captação de leads

1. Usuário acessa LP, home ou CTA de conversão
2. Preenche nome, e-mail, interesse + **telefone** + **checkbox opt-in**
3. `saveLeadAction` → RPC `capture_newsletter_lead` (com phone)
4. Se opt-in: `startWhatsAppAutomation` → template `sb_boas_vindas`
5. Botão **Falar no WhatsApp** (wa.me) disponível se `NEXT_PUBLIC_WHATSAPP_DISPLAY_NUMBER` configurado
6. Botão flutuante verde no site (exceto admin)

**Validar:**

- [ ] Lead em `/admin/leads` com telefone e badge opt-in
- [ ] Mensagem outbound em `/admin/comunicacao`
- [ ] Redirect `/obrigado` + seção WhatsApp

---

## 8. Fluxo pós-cadastro

1. Após captura → redirect `/obrigado?type=lead&...`
2. Template **sb_boas_vindas** enviado (stub ou Meta)
3. Automação `welcome-opt-in` agenda **sb_nutricao_d1** em 24h
4. Cron processa step pendente

**Validar:**

- [ ] Stub: log/mensagem `stub_*` em `whatsapp_messages`
- [ ] Produção: template aprovado chega no WhatsApp do lead
- [ ] `whatsapp_automation_runs` com status `active` → `completed`

---

## 9. Fluxo pós-assinatura Premium

1. Mercado Pago aprova pagamento → webhook MP
2. `activateSubscriptionFromPayment` → Premium liberado
3. `notifyPremiumViaWhatsApp` busca lead pelo **e-mail** com opt-in + telefone
4. Envia template **sb_pagamento_confirmado** com nome do plano

**Validar:**

- [ ] Lead de teste com mesmo e-mail da conta assinante + opt-in
- [ ] Após pagamento sandbox: mensagem WhatsApp ou registro em `whatsapp_messages`
- [ ] Premium liberado (`/minha-assinatura`, conteúdo desbloqueado)

**Lembrete renovação (PIX/boleto):**

- Cron envia **sb_renovacao_lembrete** 7 dias antes de `current_period_end` (assinaturas sem auto_renew)

---

## Referência

Documentação: [`PHASE_5_6_WHATSAPP_COMMUNICATION.md`](./PHASE_5_6_WHATSAPP_COMMUNICATION.md)

Migration: `supabase/migrations/031_whatsapp_communication.sql`
