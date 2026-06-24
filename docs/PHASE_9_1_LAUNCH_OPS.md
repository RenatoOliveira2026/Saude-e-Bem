# Fase 9.1 — Lançamento controlado e painel de operação

**Objetivo:** Acompanhar os primeiros usuários reais após o lançamento sem alterar fluxos de pagamento, auth ou webhook.

---

## Rota principal

| Rota | Descrição |
|------|-----------|
| `/admin/lancamento` | Painel de operação de lançamento |

### Atalhos relacionados (já existentes)

| Rota | Uso operacional |
|------|-----------------|
| `/admin/usuarios` | Detalhe de cadastros e perfil billing |
| `/admin/financeiro` | Pagamentos, webhooks, receita |
| `/admin/memberships` | Assinaturas Premium |
| `/admin/newsletter` | Leads newsletter |
| `/admin/leads` | CRM / lista VIP |

---

## O que o painel exibe

### Indicadores (KPIs)

- Cadastros totais, novos (24h / 7 dias)
- E-mails confirmados vs pendentes (via Auth admin)
- Perfis billing completos vs incompletos
- Pagamentos `pending` e `approved`
- Assinantes Premium ativos (`user_memberships.status = active`)
- Alertas de webhook (eventos com mensagem de falha)
- Leads newsletter (total e 7 dias)

### Tabelas

- **Últimos cadastros** — e-mail confirmado, perfil, objetivo de saúde
- **Origem do cadastro** — objetivo escolhido no `/cadastro` (`user_preferences.goal`)
- **Newsletter por origem** — `newsletter_subscribers.source`
- **Alertas de pagamento** — PIX pendente >2h ou status rejeitado
- **Falhas de webhook** — `payment_webhook_events` com mensagens de alerta
- **Lista VIP** — resumo do funil pré-lançamento (Brevo)

### Saúde do sistema

| Check | Critério |
|-------|----------|
| Auth OK | Supabase configurado + leitura profiles |
| Pagamentos OK | `MERCADOPAGO_ACCESS_TOKEN` válido |
| Webhook OK | URL configurada; alerta se >3 falhas/24h |
| Supabase OK | Query profiles sem erro |
| Brevo OK / Pendente | `BREVO_API_KEY` presente |
| SMTP Zoho Pendente | `ZOHO_SMTP_*` não configurado (fase futura) |

### Checklist operacional diário

1. Verificar novos usuários → `/admin/usuarios`
2. Verificar pagamentos → `/admin/financeiro`
3. Verificar Premium ativo → `/admin/memberships`
4. Verificar recuperação de senha → `/recuperar-senha`
5. Verificar webhooks MP → `/admin/financeiro` (seção webhooks)

---

## Arquivos criados / alterados

| Arquivo | Mudança |
|---------|---------|
| `src/lib/admin/services/operations.service.ts` | **Novo** — agrega KPIs de lançamento |
| `src/lib/admin/services/system-health.service.ts` | **Novo** — relatório de saúde (somente leitura) |
| `src/components/admin/LaunchHealthPanel.tsx` | **Novo** — UI saúde do sistema |
| `src/components/admin/LaunchDailyChecklist.tsx` | **Novo** — checklist diário |
| `src/app/admin/lancamento/page.tsx` | **Reescrito** — painel de operação |
| `src/lib/admin/nav.ts` | Ícone do menu Lançamento → `activity` |
| `docs/PHASE_9_1_LAUNCH_OPS.md` | Este documento |

**Não alterados:** `auth`, `webhook`, rotas de pagamento, migrations.

---

## Variáveis de ambiente relevantes

| Variável | Painel |
|----------|--------|
| `SUPABASE_SERVICE_ROLE_KEY` | Contagem e-mail confirmado (Auth admin) |
| `MERCADOPAGO_ACCESS_TOKEN` | Saúde Pagamentos |
| `MERCADOPAGO_WEBHOOK_SECRET` | Saúde Webhook (opcional) |
| `BREVO_API_KEY` | Saúde Brevo |
| `ZOHO_SMTP_HOST/USER/PASSWORD` | Saúde SMTP Zoho (futuro) |

---

## Próximos passos sugeridos

1. **Alinhar `SUPABASE_SERVICE_ROLE_KEY` na Vercel** — habilita contagem precisa de e-mails confirmados em produção.
2. **Template Supabase** — link `/auth/verify?token_hash=...` para confirmação cross-device.
3. **SMTP Zoho** — quando configurar suporte@, adicionar env vars e o painel passará a OK.
4. **Fase 9.2** — alertas por e-mail/WhatsApp quando PIX pendente >24h ou webhook falhar.
5. **Origem UTM** — campo opcional em `profiles` ou `user_metadata` se quiser rastrear campanhas além do objetivo de saúde.

---

## Uso diário recomendado

Abra `/admin/lancamento` pela manhã:

1. Confira **Saúde do sistema** (tudo verde ou pendente esperado).
2. Percorra o **Checklist operacional**.
3. Revise **Novos (24h)** e **Pagamentos pending**.
4. Se houver **Alertas de pagamento** ou **webhook**, acione Financeiro ou reconciliação.
