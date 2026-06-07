# Fase 5.7 — Go-live operacional e receita

Documento mestre para colocar o **Saúde & Bem** em operação comercial em [saudeebem.com.br](https://saudeebem.com.br).

**Objetivo da fase:** aceitar o primeiro pagamento real, comunicar leads e assinantes por e-mail e WhatsApp, e operar com checklists validados por escala (1 → 100 → 1.000 usuários).

**Pré-requisitos de código (já entregues):** Fases 5.5 (monetização MP + trimestral + cupons DB) e 5.6 (WhatsApp Cloud API). Pendências de código menores estão indicadas onde aplicável.

**Referências cruzadas:**

| Documento | Conteúdo |
|-----------|----------|
| [`PHASE_5_5_CHECKLIST.md`](./PHASE_5_5_CHECKLIST.md) | Mercado Pago detalhado |
| [`PHASE_5_5_MONETIZATION.md`](./PHASE_5_5_MONETIZATION.md) | Planos, fluxo checkout, cupons |
| [`PHASE_5_6_CHECKLIST.md`](./PHASE_5_6_CHECKLIST.md) | WhatsApp detalhado |
| [`PHASE_5_6_WHATSAPP_COMMUNICATION.md`](./PHASE_5_6_WHATSAPP_COMMUNICATION.md) | Arquitetura WhatsApp |
| [`PHASE_5_3_CRM_AUTOMATION.md`](./PHASE_5_3_CRM_AUTOMATION.md) | CRM, ESP, cron de automação |

---

## Ordem exata de execução

Siga esta sequência **do passo 1 ao 48**. Não pule etapas marcadas como **bloqueante** — elas impedem pagamento, comunicação ou conformidade.

| # | Etapa | Seção | Bloqueante |
|---|-------|-------|------------|
| **Fundação (infra)** |
| 1 | Confirmar projeto Vercel ligado ao repo `RenatoOliveira2026/Saude-e-Bem`, branch `master` | §6 | Sim |
| 2 | Configurar DNS do domínio `saudeebem.com.br` → Vercel | §6 | Sim |
| 3 | Definir domínio primário na Vercel + certificado SSL ativo | §6 | Sim |
| 4 | Definir `NEXT_PUBLIC_SITE_URL=https://saudeebem.com.br` (Production) | §6 | Sim |
| 5 | Redeploy após alterar variáveis de ambiente | §6 | Sim |
| **Supabase (dados)** |
| 6 | Aplicar migrations `001` → `031` no projeto Supabase de **produção** | §6 | Sim |
| 7 | Confirmar migration `030` (trimestral + cupons) aplicada | §1 | Sim |
| 8 | Confirmar migration `031` (WhatsApp) aplicada | §2 | Sim (WhatsApp) |
| 9 | Configurar `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` na Vercel | §6 | Sim |
| 10 | Configurar `SUPABASE_SERVICE_ROLE_KEY` na Vercel (server-only) | §6 | Sim |
| 11 | Bootstrap do primeiro `super_admin` (`/admin/setup` ou migration `005`) | §6 | Sim |
| 12 | Validar buckets Storage `cms-images` e `cms-pdfs` | §6 | Sim |
| **Mercado Pago (receita)** |
| 13 | Conta MP habilitada para receber (PIX, cartão, boleto) | §1 | Sim |
| 14 | Criar aplicação MP e obter Access Token **produção** (`APP_USR-...`) | §1 | Sim |
| 15 | Gerar `MERCADOPAGO_WEBHOOK_SECRET` no painel MP | §1 | Sim |
| 16 | Configurar variáveis MP na Vercel (sem `MERCADOPAGO_STUB_MODE`) | §1 | Sim |
| 17 | Registrar webhook MP → `https://saudeebem.com.br/api/payments/webhook` | §1 | Sim |
| 18 | Configurar `PAYMENTS_CRON_SECRET` + cron diário (já em `vercel.json`) | §1 | Sim |
| 19 | Teste sandbox MP (opcional, em Preview) → validar fluxo | §1 | Recomendado |
| 20 | Teste produção: PIX ou cartão de valor baixo | §7 | Sim |
| 21 | Validar liberação Premium (webhook + `/minha-assinatura`) | §7 | Sim |
| **E-mail profissional** |
| 22 | Criar conta Brevo (ou ESP escolhido) | §3 | Sim (comunicação) |
| 23 | Verificar domínio `saudeebem.com.br` no Brevo (SPF, DKIM, DMARC) | §3 | Sim |
| 24 | Configurar remetente `contato@saudeebem.com.br` (ou equivalente) | §3 | Sim |
| 25 | Gerar `BREVO_API_KEY` e configurar na Vercel | §3 | Sim |
| 26 | Definir `NEWSLETTER_PROVIDER=brevo` | §3 | Recomendado |
| 27 | Teste transacional: captura newsletter → e-mail recebido | §3 | Recomendado |
| **Automação de e-mail** |
| 28 | Configurar `LEAD_ESP_PROVIDER=brevo` | §4 | Sim |
| 29 | Ativar `LEAD_ESP_LIVE_SYNC=true` | §4 | Sim |
| 30 | Configurar `LEAD_AUTOMATION_CRON_SECRET` na Vercel | §4 | Sim |
| 31 | Adicionar cron `/api/cron/automation` em `vercel.json` (pendente no repo) | §4 | Sim |
| 32 | Redeploy + teste manual do cron | §4 | Sim |
| 33 | Criar templates HTML no Brevo para cada `templateKey` das sequências | §4 | Sim |
| 34 | Validar sequência: captura LP → lead em `/admin/leads` → ESP sync OK | §4 | Recomendado |
| **WhatsApp produção** |
| 35 | Meta Business Account + verificação empresa | §2 | Sim (WhatsApp) |
| 36 | Número WhatsApp Business na Cloud API | §2 | Sim |
| 37 | Configurar variáveis `WHATSAPP_*` na Vercel | §2 | Sim |
| 38 | Registrar webhook Meta → `/api/webhooks/whatsapp` | §2 | Sim |
| 39 | Submeter 5 templates Meta (nomes exatos) e aguardar **Approved** | §2 | Sim |
| 40 | Configurar `WHATSAPP_CRON_SECRET` + cron (já em `vercel.json`) | §2 | Sim |
| 41 | Teste captação: opt-in → `sb_boas_vindas` | §2 | Recomendado |
| 42 | Teste pós-pagamento: `sb_pagamento_confirmado` | §2 | Recomendado |
| **Lançamento e escala** |
| 43 | Executar checklist de lançamento oficial (§6) | §6 | Sim |
| 44 | Executar checklist primeiro assinante pagante (§7) | §7 | Sim |
| 45 | Publicar termos e privacidade (links do footer hoje apontam para `#`) | §6 | Sim (oficial) |
| 46 | Conteúdo editorial mínimo publicado | §6 | Sim (oficial) |
| 47 | Go-live: remover stubs, monitorar webhooks 48h | §6 | Sim |
| 48 | Preparar checklist 100 usuários (§8) antes de campanhas pagas | §8 | Recomendado |

**Atalho mínimo (só primeiro pagamento):** execute passos **1–4, 6–7, 9–10, 13–18, 20–21** e a seção **§7**. WhatsApp e e-mail podem entrar depois.

---

## 1. Mercado Pago Produção

### 1.1 Pré-requisitos

- Domínio `https://saudeebem.com.br` ativo (§6).
- Migrations até **`030_phase_5_5_monetization.sql`** aplicadas (após `029_monetization_real.sql`).
- `SUPABASE_SERVICE_ROLE_KEY` na Vercel — webhooks gravam pagamentos e ativam assinatura.

### 1.2 Conta e aplicação

1. Acesse [Mercado Pago Developers](https://www.mercadopago.com.br/developers/panel/app).
2. Crie ou selecione a aplicação **Saúde & Bem**.
3. Confirme conta **habilitada para receber** pagamentos (PIX, cartão, boleto conforme oferta).
4. Obtenha credenciais de **produção**:
   - **Access Token:** `APP_USR-...` (nunca `TEST-` em produção)
   - **Public Key** (opcional — futuro Checkout Bricks): `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`

### 1.3 Variáveis Vercel (Production)

| Variável | Obrigatória | Valor / notas |
|----------|-------------|---------------|
| `NEXT_PUBLIC_SITE_URL` | Sim | `https://saudeebem.com.br` |
| `MERCADOPAGO_ACCESS_TOKEN` | Sim | Token produção `APP_USR-...` |
| `MERCADOPAGO_WEBHOOK_SECRET` | Sim | Secret do painel Webhooks MP |
| `PAYMENTS_CRON_SECRET` | Sim | String forte; Bearer do cron |
| `SUPABASE_SERVICE_ROLE_KEY` | Sim | Service role Supabase |

**Não usar em produção:**

| Variável | Motivo |
|----------|--------|
| `MERCADOPAGO_STUB_MODE=1` | Simula checkout sem cobrança real |
| `MERCADOPAGO_USE_SANDBOX=1` | Força ambiente de teste |
| Token `TEST-...` | Pagamentos não liquidam |

### 1.4 Webhook Mercado Pago

**Painel MP → Aplicação → Webhooks → Configurar notificações**

| Campo | Valor |
|-------|-------|
| URL | `https://saudeebem.com.br/api/payments/webhook` |
| Eventos | `payment`, `subscription_preapproval` |
| Secret | Idêntico a `MERCADOPAGO_WEBHOOK_SECRET` |

### 1.5 Cron de assinaturas

Já configurado em `vercel.json`:

```
POST /api/payments/cron/subscriptions
Authorization: Bearer $PAYMENTS_CRON_SECRET
Schedule: 0 6 * * * (diário, 6h UTC)
```

Função: expirar assinaturas com `current_period_end` vencido e sincronizar `profiles.plan`.

### 1.6 Fluxo esperado (pagamento → Premium)

```
Usuário em /assinar (logado)
  → POST /api/payments/create-checkout
  → Redirect Mercado Pago
  → Pagamento aprovado
  → POST /api/payments/webhook
  → payments.status = approved
  → financial_events (payment_approved, subscription_activated)
  → subscriptions.status = active
  → profiles.plan = premium_* + membership_tier = premium
  → Redirect /minha-assinatura?checkout=success
```

### 1.7 Planos disponíveis

| Plano | ID billing | Checkout |
|-------|------------|----------|
| Gratuito | `free` | Sem checkout |
| Mensal | `premium_monthly` | Preapproval (cartão recorrente) ou Checkout Pro |
| Trimestral | `premium_quarterly` | Checkout Pro (PIX/cartão/boleto) |
| Anual | `premium_annual` | Preapproval ou Checkout Pro |

### 1.8 Teste sandbox (Preview / staging)

```env
MERCADOPAGO_ACCESS_TOKEN=TEST-...
MERCADOPAGO_USE_SANDBOX=1
NEXT_PUBLIC_SITE_URL=https://seu-preview.vercel.app
```

Cartão aprovado (exemplo MP): `5031 4332 1540 6351`, CVV `123`, validade futura.

### 1.9 Validação pós-configuração

- [ ] `/assinar` exibe 4 planos
- [ ] Checkout redireciona para MP (não stub)
- [ ] Após pagamento: `/minha-assinatura` badge PREMIUM
- [ ] `/minha-saude` — card de assinatura ativo
- [ ] Conteúdo premium desbloqueado (`PremiumContentGuard`)
- [ ] Supabase `subscriptions` — registro `active`
- [ ] Supabase `financial_events` — `payment_approved`
- [ ] `/admin/financeiro` — pagamento listado
- [ ] Reenvio de webhook — idempotente (sem duplicar assinatura)

### 1.10 Pendências de código (não bloqueiam primeiro pagamento)

- UI de cupom em `/assinar` + aplicação no checkout MP
- Admin CRUD `/admin/cupons`
- Página de erro dedicada em `/minha-assinatura?checkout=failure`

Detalhes: [`PHASE_5_5_MONETIZATION.md`](./PHASE_5_5_MONETIZATION.md).

---

## 2. WhatsApp Produção

### 2.1 Pré-requisitos

- Migration **`031_whatsapp_communication.sql`** aplicada.
- Domínio HTTPS ativo (webhook Meta).
- `SUPABASE_SERVICE_ROLE_KEY` configurada.

### 2.2 Meta Business e número

1. [business.facebook.com](https://business.facebook.com) — Conta Comercial Saúde & Bem.
2. **Verificação da empresa** (Business Verification) — necessária para templates MARKETING em escala.
3. Número **WhatsApp Business** dedicado (não pessoal).
4. Número conectado à **Cloud API** (Meta App → WhatsApp → API Setup).
5. Página Facebook vinculada, publicada, com botão **Enviar mensagem** testado.

### 2.3 Templates (nomes exatos)

Criar no Meta **Message Templates** e aguardar status **Approved**:

| Nome | Uso |
|------|-----|
| `sb_boas_vindas` | Opt-in após captura de lead |
| `sb_nutricao_d1` | Nutrição D+1 (cron) |
| `sb_pagamento_confirmado` | Pós-assinatura Premium |
| `sb_renovacao_lembrete` | 7 dias antes de vencer (PIX/boleto) |
| `sb_reengajamento` | Leads frios |

Espelho admin: `/admin/comunicacao/templates`.

### 2.4 Variáveis Vercel (Production)

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

**Dev local (opcional):** `WHATSAPP_STUB_MODE=1` — nunca em produção.

### 2.5 Webhook Meta

**Meta App Dashboard → WhatsApp → Configuration → Webhook**

| Campo | Valor |
|-------|-------|
| Callback URL | `https://saudeebem.com.br/api/webhooks/whatsapp` |
| Verify Token | = `WHATSAPP_WEBHOOK_VERIFY_TOKEN` |
| Campos subscribed | `messages` |

Passos:

1. Definir `WHATSAPP_WEBHOOK_VERIFY_TOKEN` na Vercel.
2. Clicar **Verify and Save** no Meta.
3. Definir `WHATSAPP_APP_SECRET` (App Settings → Basic).
4. Enviar mensagem de teste → confirmar em `/admin/comunicacao`.

### 2.6 Cron WhatsApp

```
POST /api/cron/whatsapp-automation
Authorization: Bearer $WHATSAPP_CRON_SECRET
Schedule: 0 7 * * * (diário, 7h UTC)
```

Processa nutrição D+1, lembretes de renovação e reengajamento.

### 2.7 Fluxos integrados

**Captação:**

```
LP / home → saveLeadAction → capture_newsletter_lead
  → whatsapp_opt_in + telefone
  → startWhatsAppAutomation → sb_boas_vindas
  → whatsapp_automation_runs (welcome-opt-in)
```

**Pós-assinatura:**

```
Webhook MP → activateSubscriptionFromPayment
  → notifyPremiumViaWhatsApp (e-mail + opt-in)
  → sb_pagamento_confirmado
```

**Opt-out:**

```
Lead responde SAIR → whatsapp_opt_out_at
  → automações pausadas, sem novos envios
```

### 2.8 Validação pós-configuração

- [ ] Lead em `/admin/leads` com telefone e badge opt-in
- [ ] Mensagem outbound em `/admin/comunicacao`
- [ ] Inbound registrado (`whatsapp_inbound` no CRM)
- [ ] Opt-out respeitado após SAIR
- [ ] Pós-pagamento: mensagem ou registro em `whatsapp_messages`
- [ ] Botão flutuante WhatsApp no site (wa.me)

Referência completa: [`PHASE_5_6_CHECKLIST.md`](./PHASE_5_6_CHECKLIST.md).

---

## 3. E-mail Profissional

Configuração do **remetente corporativo** e entrega transacional (captura newsletter, confirmações). Provedor recomendado: **Brevo** (já integrado no código).

### 3.1 Conta Brevo

1. Criar conta em [brevo.com](https://www.brevo.com).
2. Plano adequado ao volume inicial (Free até ~300 e-mails/dia).
3. Adicionar domínio **`saudeebem.com.br`** em **Senders & IP → Domains**.

### 3.2 Autenticação DNS (domínio)

No painel DNS (Registro.br ou provedor), adicionar registros indicados pelo Brevo:

| Tipo | Finalidade |
|------|------------|
| **SPF** | Autoriza servidores Brevo a enviar em nome do domínio |
| **DKIM** | Assinatura criptográfica dos e-mails |
| **DMARC** | Política de autenticação (recomendado: `p=none` inicial, evoluir para `quarantine`) |

Aguardar propagação (até 48h). Brevo exibe status **Verified**.

### 3.3 Remetente

| Campo | Exemplo |
|-------|---------|
| E-mail | `contato@saudeebem.com.br` |
| Nome | `Saúde & Bem` |
| Reply-to | `contato@saudeebem.com.br` ou suporte dedicado |

### 3.4 Variáveis Vercel

```env
BREVO_API_KEY=xkeysib-...
NEWSLETTER_PROVIDER=brevo
```

Opcional (newsletter legada em formulários home/blog):

```env
MAILERLITE_API_KEY=   # só se usar MailerLite em vez de Brevo
```

### 3.5 Teste de entrega

1. Submeter formulário newsletter ou lead em LP.
2. Confirmar redirect `/obrigado`.
3. E-mail recebido na caixa de entrada (não spam).
4. `/admin/leads` — lead registrado.
5. Headers do e-mail: `spf=pass`, `dkim=pass`.

### 3.6 Boas práticas

- Remetente sempre no domínio `@saudeebem.com.br`.
- Link de descadastro visível (LGPD).
- Evitar anexos pesados na fase inicial.
- Monitorar taxa de bounce no painel Brevo.

### 3.7 Pendências

- Páginas `/privacidade` e `/termos` (footer ainda com `href="#"`) — necessárias para lançamento oficial e conformidade LGPD.

---

## 4. Automação de E-mail

Sequências de nutrição por interesse do lead, sync CRM → ESP e cron de steps com delay. Base: Fase 5.3 + migration `028_crm_automation.sql`.

### 4.1 Arquitetura

```
saveLeadAction
  → capture_newsletter_lead (RPC)
  → triggerLeadAutomation
  → lead_automation_runs + lead_interactions
  → syncLeadToEsp (Brevo)
  → Cron processPendingAutomationSteps
  → próximo step (delay D+1, D+3, etc.)
```

Rotas:

| Endpoint | Função |
|----------|--------|
| `POST /api/cron/automation` | Processa steps pendentes |
| Sequências | `src/lib/email-automation/sequences.ts` |

### 4.2 Sequências configuradas (`templateKey` → criar no Brevo)

| Sequência | Interesse | Steps |
|-----------|-----------|-------|
| `welcome-hidratacao` | hidratação | `welcome_hidratacao`, `nurture_hidratacao_d3` |
| `welcome-emagrecimento` | emagrecimento | `welcome_emagrecimento`, `nurture_emagrecimento_d2` |
| `welcome-sono` | sono | `welcome_sono`, `nurture_sono_d4` |
| `welcome-longevidade` | longevidade | `welcome_longevidade`, `nurture_longevidade_d5` |
| `hot-clube-offer` | score quente | `offer_clube_quente` |

Cada `templateKey` deve existir como template/campanha no Brevo (HTML + variáveis de merge: nome, interesse, link clube).

### 4.3 Variáveis Vercel

```env
SUPABASE_SERVICE_ROLE_KEY=       # Obrigatório
LEAD_ESP_PROVIDER=brevo
LEAD_ESP_LIVE_SYNC=true          # Ativa POST real no Brevo
BREVO_API_KEY=
LEAD_AUTOMATION_CRON_SECRET=     # Bearer do cron
```

**Importante:** sem `LEAD_ESP_LIVE_SYNC=true`, o sync registra payload preparado mas não envia ao Brevo.

### 4.4 Cron de automação

**Pendência no repo:** adicionar em `vercel.json`:

```json
{
  "path": "/api/cron/automation",
  "schedule": "0 8 * * *"
}
```

Teste manual:

```bash
curl -X POST https://saudeebem.com.br/api/cron/automation \
  -H "Authorization: Bearer SEU_LEAD_AUTOMATION_CRON_SECRET"
```

Resposta esperada: `{ "ok": true, "processed": N, "completed": M }`.

### 4.5 Validação admin

- [ ] `/admin/leads/[id]` — `esp_synced_at` preenchido, sem `esp_sync_error`
- [ ] Interação `esp_synced` na timeline
- [ ] `lead_automation_runs` — status `active` → steps enviados
- [ ] `/admin/conversao` — métricas por origem coerentes

### 4.6 HubSpot / RD Station

Payloads preparados; sync live **fora do escopo 5.7**. Usar Brevo primeiro.

---

## 5. Domínio saudeebem.com.br

Fundação para webhooks MP/Meta, URLs de retorno checkout, e-mail autenticado e confiança da marca.

### 5.1 Registro e DNS

1. Confirmar titularidade em [Registro.br](https://registro.br) (ou registrador atual).
2. Na Vercel: **Project → Settings → Domains → Add** `saudeebem.com.br` e `www.saudeebem.com.br`.
3. Configurar registros DNS conforme instruções Vercel:

| Registro | Uso típico |
|----------|------------|
| `A` | `@` → IP Vercel |
| `CNAME` | `www` → `cname.vercel-dns.com` |

4. Aguardar propagação (minutos a 48h).
5. Confirmar certificado SSL **Valid** na Vercel.

### 5.2 Redirect www

Recomendado: **canonical** `https://saudeebem.com.br` (sem www) ou vice-versa — configurar redirect 301 na Vercel para evitar duplicidade SEO.

### 5.3 Variável crítica

```env
NEXT_PUBLIC_SITE_URL=https://saudeebem.com.br
```

Usada em:

- URLs de retorno Mercado Pago (`back_urls`)
- Links em e-mails e WhatsApp
- Metadata OG/canonical (SEO)

**Nunca** deixar `VERCEL_URL` como URL pública em produção.

### 5.4 Subdomínios opcionais (futuro)

| Subdomínio | Uso |
|------------|-----|
| `mail.saudeebem.com.br` | Brevo / tracking (se solicitado) |
| `api.saudeebem.com.br` | Não necessário — APIs em `/api/*` no domínio principal |

### 5.5 E-mail no domínio

Para `contato@saudeebem.com.br`:

- **Envio transacional:** Brevo (SPF/DKIM no domínio raiz).
- **Caixa de entrada:** Google Workspace, Zoho ou forward Registro.br → caixa pessoal (suporte ao cliente).

### 5.6 Checklist domínio

- [ ] `https://saudeebem.com.br` carrega o site
- [ ] Redirect HTTP → HTTPS
- [ ] `www` redireciona para canonical
- [ ] `NEXT_PUBLIC_SITE_URL` correto na Vercel Production
- [ ] Redeploy após alteração
- [ ] SPF/DKIM verificados no Brevo
- [ ] Webhooks MP e Meta apontam para o domínio final (não preview `.vercel.app`)

---

## 6. Checklist de lançamento

Checklist **oficial** — execute após passos 1–42 da ordem de execução.

### 6.1 Infraestrutura

- [ ] Build `npm run build` passa local e na Vercel
- [ ] Migrations `001`–`031` aplicadas em produção
- [ ] `SUPABASE_SERVICE_ROLE_KEY` apenas em server (nunca `NEXT_PUBLIC_*`)
- [ ] Backup Supabase habilitado (plano pago recomendado)
- [ ] Crons ativos: pagamentos (6h UTC), WhatsApp (7h UTC), automação e-mail (8h UTC)

### 6.2 Variáveis de ambiente (Production)

- [ ] Supabase URL + anon + service role
- [ ] `NEXT_PUBLIC_SITE_URL=https://saudeebem.com.br`
- [ ] Mercado Pago produção (sem stub/sandbox)
- [ ] Brevo + `LEAD_ESP_LIVE_SYNC=true`
- [ ] WhatsApp (sem `WHATSAPP_STUB_MODE`)
- [ ] Todos os `*_CRON_SECRET` definidos

### 6.3 Produto e conteúdo

- [ ] 4 planos em `/assinar`
- [ ] Conteúdo premium bloqueado para `free`
- [ ] Mínimo editorial: 3 artigos + 2 protocolos + 2 materiais biblioteca **publicados**
- [ ] LPs de conversão ativas
- [ ] `/admin` acessível apenas para admins
- [ ] Página `/privacidade` e `/termos` publicadas (links footer funcionais)
- [ ] Página de contato ou e-mail visível

### 6.4 Integrações

- [ ] Webhook MP — eventos `payment`, `subscription_preapproval`
- [ ] Webhook Meta — campo `messages`
- [ ] Templates WhatsApp **Approved**
- [ ] Templates Brevo para cada `templateKey`
- [ ] Página Facebook + perfil WhatsApp alinhados à marca

### 6.5 Teste E2E do funil

- [ ] Lead: LP → `/obrigado` → `/admin/leads`
- [ ] E-mail boas-vindas recebido
- [ ] WhatsApp opt-in → `sb_boas_vindas`
- [ ] Inbound WhatsApp → CRM
- [ ] Opt-out SAIR → sem envios
- [ ] Assinatura PIX → Premium liberado
- [ ] Assinatura cartão mensal → Preapproval ativo
- [ ] `/minha-assinatura` + `/minha-saude` corretos
- [ ] Conteúdo premium acessível
- [ ] WhatsApp `sb_pagamento_confirmado` (lead com mesmo e-mail + opt-in)
- [ ] `/admin/financeiro` — KPIs corretos

### 6.6 Go-live

- [ ] Remover qualquer stub de produção
- [ ] Monitorar logs webhooks MP e Meta por **48h**
- [ ] Primeiro cliente real acompanhado manualmente
- [ ] Tag git `v5.7-go-live` (opcional)
- [ ] Comunicar lançamento (redes, newsletter, WhatsApp)

---

## 7. Checklist para primeiro assinante pagante

Objetivo: **uma cobrança real bem-sucedida** com Premium liberado automaticamente. Mínimo viável — pode ignorar WhatsApp e automação de e-mail nesta fase.

### 7.1 Pré-requisitos (obrigatórios)

- [ ] Passos **1–4, 6–7, 9–10** da ordem de execução concluídos
- [ ] Passos **13–18** (Mercado Pago produção) concluídos
- [ ] Usuário de teste **cadastrado e logado** (`/entrar`)
- [ ] Conta MP recebendo pagamentos (não conta pendente de verificação)

### 7.2 Execução do teste

- [ ] Acessar `/assinar`
- [ ] Escolher plano **Trimestral** ou **Mensal** (valor conhecido)
- [ ] Método **PIX** (menor fricção) ou cartão real de valor baixo
- [ ] Completar checkout no Mercado Pago
- [ ] Retorno para `/minha-assinatura?checkout=...`

### 7.3 Validação técnica (5 minutos após pagamento)

- [ ] `/minha-assinatura` — status PREMIUM, plano correto, data renovação
- [ ] `/minha-saude` — card assinatura ativo
- [ ] Abrir 1 protocolo/artigo premium — sem `PremiumGate`
- [ ] Supabase `payments` — linha `approved` com `amount_cents` correto
- [ ] Supabase `subscriptions` — `status = active`, `billing_plan_id` correto
- [ ] Supabase `profiles` — `plan` = `premium_*`
- [ ] `/admin/financeiro` — pagamento na lista

### 7.4 Se Premium não liberou

| Sintoma | Verificar |
|---------|-----------|
| Pagamento OK no MP, site free | Webhook URL, `MERCADOPAGO_WEBHOOK_SECRET`, logs Vercel `/api/payments/webhook` |
| Erro 500 no webhook | `SUPABASE_SERVICE_ROLE_KEY` ausente ou migration 029/030 faltando |
| Redirect OK, status pendente | Aguardar webhook; testar reprocessamento no painel MP |
| Checkout não abre | Token produção inválido ou conta MP restrita |

### 7.5 Pós-primeiro pagamento

- [ ] Confirmar recebimento no extrato MP
- [ ] Responder manualmente ao cliente (e-mail/WhatsApp) — boas-vindas pessoal
- [ ] Registrar feedback do fluxo
- [ ] Só então abrir checkout ao público amplo

**Tempo estimado (só config):** 2–3 dias úteis.

---

## 8. Checklist para 100 usuários

Objetivo: operação estável com **~100 usuários registrados** e dezenas de leads/mês, sem degradação de webhooks, e-mail ou suporte manual insustentável.

### 8.1 Capacidade técnica

- [ ] Plano Vercel adequado (Pro se crons + tráfego LP)
- [ ] Supabase: monitorar conexões e storage (imagens CMS)
- [ ] Brevo: volume dentro do plano (~100 leads + sequências)
- [ ] Meta WhatsApp: tier de mensagens suficiente para opt-ins
- [ ] Rate limits MP: sem throttling em picos de checkout

### 8.2 Produto e suporte

- [ ] FAQ ou página de ajuda (assinatura, cancelamento, Premium)
- [ ] Fluxo de recuperação de senha testado (`/recuperar-senha`)
- [ ] Processo manual de cancelamento/reembolso documentado (admin)
- [ ] Tempo de resposta suporte definido (ex.: 24h úteis)
- [ ] Monitoramento: alertas se webhook MP falhar 3x seguidas

### 8.3 Marketing e conversão

- [ ] Google Analytics 4 (`NEXT_PUBLIC_GA4_MEASUREMENT_ID`) ou equivalente
- [ ] Meta Pixel opcional para LPs
- [ ] `/admin/conversao` revisado semanalmente
- [ ] Pelo menos 1 LP otimizada com A/B de copy (manual)
- [ ] Cupons promocionais (quando UI admin pronta) para campanhas

### 8.4 Conteúdo e retenção

- [ ] Calendário editorial mínimo (1 artigo/semana)
- [ ] Sequências e-mail + WhatsApp nutrição ativas e testadas
- [ ] Clube Premium (`/clube`) com valor claro
- [ ] Recomendações em Minha Saúde funcionando

### 8.5 Segurança e conformidade

- [ ] RLS Supabase auditado (sem leak de dados admin)
- [ ] Política de privacidade publicada
- [ ] Opt-out e-mail e WhatsApp funcionando
- [ ] Logs admin (`admin_audit` se existir) para ações sensíveis

### 8.6 Métricas alvo (referência)

| Métrica | Meta inicial |
|---------|--------------|
| Usuários cadastrados | ~100 |
| Taxa lead → assinante | > 2% (ajustar) |
| Webhook MP success rate | > 99% |
| Entregabilidade e-mail | > 95% inbox |
| Tempo liberação Premium | < 2 min após pagamento |

---

## 9. Checklist para 1.000 usuários

Objetivo: escala **~1.000 usuários** com processos repetíveis, observabilidade e redução de trabalho manual.

### 9.1 Infraestrutura e performance

- [ ] Vercel Pro/Enterprise conforme tráfego
- [ ] Supabase Pro: backups PITR, read replicas se necessário
- [ ] CDN + imagens otimizadas (Next.js Image, Storage)
- [ ] Core Web Vitals monitorados (Search Console)
- [ ] Load test básico em `/assinar` e home (100 req/s pico)

### 9.2 Pagamentos e financeiro

- [ ] Reconciliação MP ↔ `payments` mensal automatizada (export + script)
- [ ] Alertas: pagamento approved sem subscription active
- [ ] Cron expiração assinaturas validado mensalmente
- [ ] Processo de chargeback/disputa documentado
- [ ] Considerar nota fiscal / recibo (Fase 6+)

### 9.3 Comunicação em escala

- [ ] Brevo plano pago conforme volume (~3k+ e-mails/mês)
- [ ] Meta Business verificada + quality rating WhatsApp **GREEN**
- [ ] Templates WhatsApp revisados (evitar rejeição Meta)
- [ ] Segmentação por interesse no CRM (`/admin/leads` filtros)
- [ ] Supressão global: bounced e-mails + opt-outs sincronizados

### 9.4 Equipe e processos

- [ ] Runbook incidentes: webhook down, Premium não libera, WhatsApp blocked
- [ ] Rotacionar secrets (`*_CRON_SECRET`, webhook secrets) semestralmente
- [ ] Admin com 2+ operadores (`admin` + `super_admin`)
- [ ] SLA suporte definido (ex.: 12h úteis)
- [ ] Base de conhecimento interna (Notion/docs)

### 9.5 Produto

- [ ] Admin CRUD cupons operacional
- [ ] Dashboard financeiro com MRR/churn revisado semanalmente
- [ ] Onboarding pós-assinatura (e-mail D0 + WhatsApp + tour Minha Saúde)
- [ ] Ferramentas interativas estáveis sob carga (`user_tool_results`)
- [ ] PWA instalável testada (Fase 4.0)

### 9.6 Legal e governança

- [ ] DPO ou responsável LGPD identificado
- [ ] Termos de assinatura (renovação, cancelamento, reembolso)
- [ ] Registro de consentimento leads (opt-in timestamp em `newsletter_leads`)
- [ ] Retenção de dados documentada

### 9.7 Métricas alvo (referência)

| Métrica | Meta |
|---------|------|
| Usuários cadastrados | ~1.000 |
| Assinantes Premium ativos | 20–50 (depende conversão) |
| Uptime site | > 99,5% |
| Erro webhook MP | < 0,1% |
| NPS ou CSAT | baseline medido |

### 9.8 Evolução técnica (Fase 6+)

- Checkout Bricks (menos redirect)
- Stripe segundo provedor
- HubSpot/RD sync live
- Webhooks ESP (opens/clicks)
- Push notifications PWA

---

## Resumo de estimativas

| Marco | Escopo | Prazo |
|-------|--------|-------|
| **Primeiro assinante pagante** | MP prod + webhook + domínio | 2–3 dias úteis |
| **Lançamento oficial (5.7)** | MP + Brevo + WhatsApp + checklists | 3–4 semanas |
| **100 usuários estável** | Suporte + conteúdo + monitoramento | +2–4 semanas pós-launch |
| **1.000 usuários** | Infra Pro + processos + equipe | +2–3 meses pós-launch |

---

## Anexo — Mapa de variáveis Vercel (Production)

```env
# Site
NEXT_PUBLIC_SITE_URL=https://saudeebem.com.br

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_WEBHOOK_SECRET=
PAYMENTS_CRON_SECRET=
# NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=   # opcional

# E-mail / ESP
BREVO_API_KEY=
NEWSLETTER_PROVIDER=brevo
LEAD_ESP_PROVIDER=brevo
LEAD_ESP_LIVE_SYNC=true
LEAD_AUTOMATION_CRON_SECRET=

# WhatsApp
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_BUSINESS_ACCOUNT_ID=
WHATSAPP_WEBHOOK_VERIFY_TOKEN=
WHATSAPP_APP_SECRET=
WHATSAPP_DEFAULT_COUNTRY_CODE=55
WHATSAPP_CRON_SECRET=
NEXT_PUBLIC_WHATSAPP_DISPLAY_NUMBER=

# Analytics (opcional)
# NEXT_PUBLIC_GA4_MEASUREMENT_ID=
# NEXT_PUBLIC_META_PIXEL_ID=
```

**Nunca em produção:** `MERCADOPAGO_STUB_MODE`, `WHATSAPP_STUB_MODE`, `MERCADOPAGO_USE_SANDBOX`, tokens `TEST-`.

---

*Documento criado na Fase 5.7 — Go-live operacional. Atualizar conforme entregas de código (cupons, cron automação em `vercel.json`, páginas legais).*
