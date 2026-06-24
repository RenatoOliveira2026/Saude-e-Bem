import { isEmailAutomationConfigured } from "@/lib/email-automation";
import { isBrevoConfigured } from "@/lib/brevo/config";
import {
  getPaymentsConfigSummary,
  isMercadoPagoConfigured,
} from "@/lib/payments/config";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type HealthStatus = "ok" | "warning" | "pending" | "error";

export interface HealthCheckItem {
  id: string;
  label: string;
  status: HealthStatus;
  detail: string;
}

export interface SystemHealthReport {
  checkedAt: string;
  overall: HealthStatus;
  items: HealthCheckItem[];
}

function worstStatus(items: HealthCheckItem[]): HealthStatus {
  if (items.some((i) => i.status === "error")) return "error";
  if (items.some((i) => i.status === "warning")) return "warning";
  if (items.some((i) => i.status === "pending")) return "pending";
  return "ok";
}

/** Relatório leve de saúde — somente leitura, sem side effects (Fase 9.1). */
export async function getSystemHealthReport(): Promise<SystemHealthReport> {
  const items: HealthCheckItem[] = [];
  const paymentsConfig = getPaymentsConfigSummary();

  // Auth + Supabase
  if (!isSupabaseConfigured()) {
    items.push({
      id: "supabase",
      label: "Supabase",
      status: "error",
      detail: "Variáveis NEXT_PUBLIC_SUPABASE_URL / ANON_KEY ausentes.",
    });
    items.push({
      id: "auth",
      label: "Auth",
      status: "error",
      detail: "Supabase Auth indisponível — configure o projeto.",
    });
  } else {
    try {
      const supabase = await createClient();
      const { error } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true });
      items.push({
        id: "supabase",
        label: "Supabase",
        status: error ? "error" : "ok",
        detail: error
          ? `Erro ao consultar profiles: ${error.message}`
          : "Conexão e leitura de profiles OK.",
      });
      items.push({
        id: "auth",
        label: "Auth",
        status: error ? "warning" : "ok",
        detail: error
          ? "Verifique políticas RLS e URL do projeto."
          : "Supabase Auth operacional (cadastro/login).",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      items.push({
        id: "supabase",
        label: "Supabase",
        status: "error",
        detail: message,
      });
      items.push({
        id: "auth",
        label: "Auth",
        status: "error",
        detail: message,
      });
    }
  }

  // Pagamentos
  items.push({
    id: "payments",
    label: "Pagamentos",
    status: paymentsConfig.realCheckoutEnabled
      ? "ok"
      : paymentsConfig.stubMode
        ? "warning"
        : "error",
    detail: paymentsConfig.realCheckoutEnabled
      ? "Mercado Pago configurado — checkout real ativo."
      : paymentsConfig.stubMode
        ? "Modo stub (dev) — não use em lançamento público."
        : "MERCADOPAGO_ACCESS_TOKEN ausente ou inválido.",
  });

  // Webhook
  let webhookStatus: HealthStatus = paymentsConfig.realCheckoutEnabled
    ? "ok"
    : "warning";
  let webhookDetail = paymentsConfig.webhookSecretConfigured
    ? `Webhook MP configurado — ${paymentsConfig.siteUrl}/api/payments/webhook`
    : `Webhook ativo sem MERCADOPAGO_WEBHOOK_SECRET (fallback IPN). URL: ${paymentsConfig.siteUrl}/api/payments/webhook`;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data: events } = await supabase
        .from("payment_webhook_events")
        .select("result_message")
        .gte("processed_at", dayAgo)
        .order("processed_at", { ascending: false })
        .limit(50);

      const failures = (events ?? []).filter((row) => {
        const msg = row.result_message?.toLowerCase() ?? "";
        return (
          msg.length > 0 &&
          !msg.includes("aprovado") &&
          !msg.includes("ativada") &&
          !msg.includes("atualizado") &&
          !msg.includes("idempotente")
        );
      });

      if (failures.length > 3) {
        webhookStatus = "warning";
        webhookDetail = `${failures.length} eventos com alerta nas últimas 24h. Revise Financeiro → Webhooks.`;
      }
    } catch {
      // mantém status base
    }
  }

  items.push({
    id: "webhook",
    label: "Webhook",
    status: webhookStatus,
    detail: webhookDetail,
  });

  // Brevo
  const brevoOk = isBrevoConfigured();
  items.push({
    id: "brevo",
    label: "Brevo",
    status: brevoOk ? "ok" : "pending",
    detail: brevoOk
      ? isEmailAutomationConfigured()
        ? "BREVO_API_KEY configurada — sync de leads ativo."
        : "BREVO_API_KEY presente — automação parcial."
      : "Pendente — configure BREVO_API_KEY para newsletter e leads.",
  });

  // SMTP Zoho — não implementado (Fase futura)
  const zohoConfigured = Boolean(
    process.env.ZOHO_SMTP_HOST?.trim() &&
      process.env.ZOHO_SMTP_USER?.trim() &&
      process.env.ZOHO_SMTP_PASSWORD?.trim(),
  );
  items.push({
    id: "zoho_smtp",
    label: "SMTP Zoho",
    status: zohoConfigured ? "ok" : "pending",
    detail: zohoConfigured
      ? "Credenciais Zoho SMTP detectadas."
      : "Pendente — e-mail transacional via Supabase; Zoho para suporte ainda não integrado.",
  });

  return {
    checkedAt: new Date().toISOString(),
    overall: worstStatus(items),
    items,
  };
}
