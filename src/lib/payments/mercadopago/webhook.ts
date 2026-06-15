import { createPaymentsAdminClient } from "../admin-client";
import { isMercadoPagoConfigured, isStubModeEnabled } from "../config";
import {
  fetchMercadoPagoPayment,
  searchMercadoPagoPaymentsByReference,
  type MercadoPagoPaymentRecord,
} from "./client";
import {
  cancelMercadoPagoPreapproval,
  fetchMercadoPagoPreapproval,
} from "./preapproval";
import { verifyMercadoPagoWebhookSignature } from "./signature";
import {
  activateSubscriptionFromPayment,
  activateSubscriptionFromPreapproval,
  cancelSubscriptionFromPayment,
} from "../services/subscriptions.service";
import { syncUserMembershipCancelled } from "@/lib/membership/services/sync-membership.service";
import { updatePaymentByReference } from "../services/payments.service";
import { recordFinancialEvent } from "../services/financial-events.service";
import { registerWebhookEvent } from "../services/webhook-events.service";
import type { MercadoPagoWebhookPayload, PaymentStatus } from "../types";

export { verifyMercadoPagoWebhookSignature } from "./signature";

function mapMercadoPagoStatus(status: string): PaymentStatus {
  const map: Record<string, PaymentStatus> = {
    pending: "pending",
    approved: "approved",
    authorized: "authorized",
    in_process: "in_process",
    in_mediation: "in_mediation",
    rejected: "rejected",
    cancelled: "cancelled",
    refunded: "refunded",
    charged_back: "charged_back",
  };
  return map[status] ?? "pending";
}

function mapMercadoPagoPaymentMethod(
  paymentTypeId?: string,
  paymentMethodId?: string,
): import("../types").PaymentMethod {
  const key = paymentTypeId ?? paymentMethodId ?? "";
  const map: Record<string, import("../types").PaymentMethod> = {
    bank_transfer: "pix",
    pix: "pix",
    credit_card: "credit_card",
    debit_card: "debit_card",
    ticket: "ticket",
    bolbradesco: "ticket",
    account_money: "account_money",
  };
  return map[key] ?? "unknown";
}

async function resolvePaymentRecord(
  resourceId: string,
): Promise<MercadoPagoPaymentRecord | null> {
  if (resourceId.startsWith("stub_")) return null;
  return fetchMercadoPagoPayment(resourceId);
}

async function handlePaymentNotification(
  admin: NonNullable<ReturnType<typeof createPaymentsAdminClient>>,
  resourceId: string,
): Promise<{ ok: boolean; message: string }> {
  const mpPayment = await resolvePaymentRecord(resourceId);

  if (!mpPayment && isStubModeEnabled()) {
    return { ok: true, message: "Stub: pagamento ignorado." };
  }

  if (!mpPayment) {
    return { ok: false, message: "Pagamento não encontrado no Mercado Pago." };
  }

  const externalReference = mpPayment.external_reference;
  if (!externalReference) {
    return { ok: false, message: "external_reference ausente." };
  }

  const status = mapMercadoPagoStatus(String(mpPayment.status ?? "pending"));
  const paymentMethod = mapMercadoPagoPaymentMethod(
    mpPayment.payment_type_id,
    mpPayment.payment_method_id,
  );

  const payment = await updatePaymentByReference(admin, externalReference, {
    externalId: String(mpPayment.id),
    status,
    paymentMethod,
    paidAt:
      status === "approved" && mpPayment.date_approved
        ? mpPayment.date_approved
        : status === "approved"
          ? new Date().toISOString()
          : null,
    metadata: { mercadopago: mpPayment },
  });

  if (!payment) {
    return { ok: false, message: "Pagamento local não encontrado." };
  }

  if (status === "approved") {
    await recordFinancialEvent(admin, {
      userId: payment.userId,
      paymentId: payment.id,
      eventType: "payment_approved",
      title: "Pagamento aprovado",
      description: `Mercado Pago #${mpPayment.id}`,
      amountCents: payment.amountCents,
      currency: payment.currency,
      metadata: { mercadopago_id: mpPayment.id },
    });
    await activateSubscriptionFromPayment(admin, payment);
    return { ok: true, message: "Pagamento aprovado e assinatura ativada." };
  }

  if (["rejected", "cancelled", "refunded", "charged_back"].includes(status)) {
    await recordFinancialEvent(admin, {
      userId: payment.userId,
      paymentId: payment.id,
      eventType: "payment_rejected",
      title: "Pagamento não concluído",
      description: `Status: ${status}`,
      amountCents: payment.amountCents,
      currency: payment.currency,
      metadata: { mercadopago_id: mpPayment.id, status },
    });
    await cancelSubscriptionFromPayment(admin, payment, status);
    return { ok: true, message: `Assinatura cancelada: ${status}.` };
  }

  await recordFinancialEvent(admin, {
    userId: payment.userId,
    paymentId: payment.id,
    eventType: "payment_pending",
    title: "Pagamento em processamento",
    description: `Status: ${status}`,
    amountCents: payment.amountCents,
    currency: payment.currency,
  });

  return { ok: true, message: `Pagamento atualizado: ${status}.` };
}

async function handlePreapprovalNotification(
  admin: NonNullable<ReturnType<typeof createPaymentsAdminClient>>,
  resourceId: string,
): Promise<{ ok: boolean; message: string }> {
  const preapproval = await fetchMercadoPagoPreapproval(resourceId);
  if (!preapproval) {
    return { ok: false, message: "Preapproval não encontrado." };
  }

  const status = String(preapproval.status ?? "");
  const externalReference = String(preapproval.external_reference ?? "");

  const { data: paymentRow } = await admin
    .from("payments")
    .select("user_id, metadata")
    .eq("external_reference", externalReference)
    .maybeSingle();

  if (!paymentRow) {
    return { ok: false, message: "Pagamento local não encontrado para preapproval." };
  }

  if (status === "authorized") {
    await activateSubscriptionFromPreapproval(admin, {
      userId: paymentRow.user_id,
      preapprovalId: resourceId,
      externalReference,
      payerId:
        typeof preapproval.payer_id === "string" ? preapproval.payer_id : null,
      planId:
        typeof paymentRow.metadata === "object" &&
        paymentRow.metadata &&
        "plan" in paymentRow.metadata
          ? String((paymentRow.metadata as Record<string, unknown>).plan)
          : null,
    });
    return { ok: true, message: "Preapproval autorizado — assinatura ativa." };
  }

  if (status === "cancelled" || status === "paused" || status === "expired") {
    await cancelMercadoPagoPreapproval(resourceId);
    const nextStatus = status === "expired" ? "expired" : "canceled";
    await admin
      .from("subscriptions")
      .update({
        status: nextStatus,
        auto_renew: false,
        canceled_at: new Date().toISOString(),
        mercadopago_preapproval_id: resourceId,
      })
      .eq("user_id", paymentRow.user_id)
      .in("status", ["active", "trialing", "past_due"]);

    await syncUserMembershipCancelled(
      admin,
      paymentRow.user_id,
      status === "expired" ? "expired" : "canceled",
    );

    return { ok: true, message: `Preapproval ${status} — assinatura atualizada.` };
  }

  return { ok: true, message: `Preapproval status: ${status}.` };
}

export async function processMercadoPagoWebhook(input: {
  payload: MercadoPagoWebhookPayload;
  queryType: string | null;
  queryDataId: string | null;
}): Promise<{ ok: boolean; message: string }> {
  const admin = createPaymentsAdminClient();
  if (!admin) {
    return { ok: false, message: "Service role não configurado." };
  }

  const topic =
    input.queryType ??
    input.payload.type ??
    input.payload.action ??
    "unknown";

  const resourceId =
    input.queryDataId ??
    input.payload.data?.id?.toString() ??
    null;

  if (!resourceId) {
    return { ok: true, message: "Evento ignorado (sem resource id)." };
  }

  const eventKey = `${topic}:${resourceId}:${input.payload.action ?? "event"}`;
  const registered = await registerWebhookEvent(admin, {
    eventKey,
    topic,
    resourceId,
    payload: input.payload as Record<string, unknown>,
    resultMessage: "processing",
  });

  if (!registered) {
    return { ok: true, message: "Evento já processado (idempotente)." };
  }

  let result: { ok: boolean; message: string };

  if (topic.includes("payment") || topic === "payment") {
    result = await handlePaymentNotification(admin, resourceId);
  } else if (
    topic.includes("preapproval") ||
    topic === "subscription_preapproval"
  ) {
    result = await handlePreapprovalNotification(admin, resourceId);
  } else {
    result = { ok: true, message: `Tópico ignorado: ${topic}.` };
  }

  await admin
    .from("payment_webhook_events")
    .update({ result_message: result.message })
    .eq("provider", "mercadopago")
    .eq("event_key", eventKey);

  return result;
}

/** Stub dev — simula aprovação manual. */
export async function simulatePaymentApproval(
  externalReference: string,
): Promise<{ ok: boolean; message: string }> {
  if (!isStubModeEnabled() && isMercadoPagoConfigured()) {
    return {
      ok: false,
      message: "Simulação disponível apenas com MERCADOPAGO_STUB_MODE=1.",
    };
  }

  const admin = createPaymentsAdminClient();
  if (!admin) {
    return { ok: false, message: "Service role não configurado." };
  }

  const payment = await updatePaymentByReference(admin, externalReference, {
    status: "approved",
    paidAt: new Date().toISOString(),
    metadata: { simulated: true, stub: true },
  });

  if (!payment) {
    return { ok: false, message: "Pagamento não encontrado." };
  }

  await activateSubscriptionFromPayment(admin, payment);
  return { ok: true, message: "Assinatura ativada (simulação stub)." };
}

/** Sincroniza pagamento pendente consultando MP (retorno do checkout). */
export async function syncPaymentByReference(
  externalReference: string,
): Promise<{ ok: boolean; message: string }> {
  if (!isMercadoPagoConfigured()) {
    return { ok: false, message: "Mercado Pago não configurado." };
  }

  const admin = createPaymentsAdminClient();
  if (!admin) {
    return { ok: false, message: "Service role não configurado." };
  }

  const payments = await searchMercadoPagoPaymentsByReference(externalReference);
  const approved = payments.find((p) => p.status === "approved");

  if (!approved?.id) {
    return { ok: false, message: "Nenhum pagamento aprovado encontrado." };
  }

  return handlePaymentNotification(admin, String(approved.id));
}
