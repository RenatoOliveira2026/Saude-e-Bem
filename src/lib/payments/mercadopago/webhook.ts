import { createHash, timingSafeEqual } from "crypto";
import { createPaymentsAdminClient } from "../admin-client";
import { getMercadoPagoWebhookSecret, isMercadoPagoConfigured } from "../config";
import { fetchMercadoPagoPayment } from "./client";
import { activateSubscriptionFromPayment } from "../services/subscriptions.service";
import { updatePaymentByReference } from "../services/payments.service";
import type { MercadoPagoWebhookPayload, PaymentStatus } from "../types";

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
  type: string | undefined,
): import("../types").PaymentMethod {
  const map: Record<string, import("../types").PaymentMethod> = {
    bank_transfer: "pix",
    credit_card: "credit_card",
    debit_card: "debit_card",
    ticket: "ticket",
    account_money: "account_money",
  };
  return map[type ?? ""] ?? "unknown";
}

/** Valida assinatura do webhook Mercado Pago (stub aceita se secret ausente). */
export function verifyMercadoPagoWebhookSignature(
  headers: Headers,
  body: string,
): boolean {
  const secret = getMercadoPagoWebhookSecret();
  if (!secret) {
    return !isMercadoPagoConfigured();
  }

  const signature = headers.get("x-signature");
  const requestId = headers.get("x-request-id");
  if (!signature || !requestId) return false;

  const parts = Object.fromEntries(
    signature.split(",").map((part) => {
      const [key, value] = part.split("=");
      return [key.trim(), value?.trim() ?? ""];
    }),
  );

  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  const manifest = `id:${requestId};request-id:${requestId};ts:${ts};`;
  const expected = createHash("sha256")
    .update(`${manifest}${body}`)
    .digest("hex");

  try {
    return timingSafeEqual(Buffer.from(v1), Buffer.from(expected));
  } catch {
    return v1 === expected;
  }
}

export async function processMercadoPagoWebhook(
  payload: MercadoPagoWebhookPayload,
): Promise<{ ok: boolean; message: string }> {
  const admin = createPaymentsAdminClient();
  if (!admin) {
    return { ok: false, message: "Service role não configurado." };
  }

  const action = payload.action ?? payload.type ?? "";
  const paymentId =
    payload.data?.id?.toString() ??
    (payload as { id?: string }).id?.toString();

  if (!paymentId && action !== "payment.updated") {
    return { ok: true, message: "Evento ignorado (sem payment id)." };
  }

  if (paymentId?.startsWith("stub_")) {
    return { ok: true, message: "Evento stub ignorado." };
  }

  let mpPayment: Record<string, unknown> | null = null;
  if (paymentId) {
    mpPayment = await fetchMercadoPagoPayment(paymentId);
  }

  if (!mpPayment && !isMercadoPagoConfigured()) {
    return processStubWebhookApproval(admin, payload);
  }

  if (!mpPayment) {
    return { ok: false, message: "Pagamento não encontrado no Mercado Pago." };
  }

  const externalReference = mpPayment.external_reference as string | undefined;
  if (!externalReference) {
    return { ok: false, message: "external_reference ausente." };
  }

  const status = mapMercadoPagoStatus(String(mpPayment.status ?? "pending"));
  const paymentMethod = mapMercadoPagoPaymentMethod(
    (mpPayment.payment_type_id as string | undefined) ??
      (mpPayment.payment_method_id as string | undefined),
  );

  const payment = await updatePaymentByReference(admin, externalReference, {
    externalId: String(mpPayment.id ?? paymentId),
    status,
    paymentMethod,
    paidAt: status === "approved" ? new Date().toISOString() : null,
    metadata: { mercadopago: mpPayment },
  });

  if (!payment) {
    return { ok: false, message: "Pagamento local não encontrado." };
  }

  if (status === "approved") {
    await activateSubscriptionFromPayment(admin, payment);
    return { ok: true, message: "Pagamento aprovado e assinatura ativada." };
  }

  return { ok: true, message: `Pagamento atualizado: ${status}.` };
}

/** Simula aprovação em dev quando MP não está configurado. */
async function processStubWebhookApproval(
  admin: NonNullable<ReturnType<typeof createPaymentsAdminClient>>,
  payload: MercadoPagoWebhookPayload,
) {
  const reference =
    (payload as { external_reference?: string }).external_reference ??
    (payload.data as { external_reference?: string } | undefined)
      ?.external_reference;

  if (!reference) {
    return { ok: true, message: "Webhook stub — sem referência." };
  }

  const payment = await updatePaymentByReference(admin, reference, {
    status: "approved",
    paidAt: new Date().toISOString(),
    metadata: { stub: true, payload },
  });

  if (payment) {
    await activateSubscriptionFromPayment(admin, payment);
    return { ok: true, message: "Stub: assinatura ativada." };
  }

  return { ok: false, message: "Stub: pagamento não encontrado." };
}

/** Ativa assinatura a partir de referência (útil para simulação manual). */
export async function simulatePaymentApproval(
  externalReference: string,
): Promise<{ ok: boolean; message: string }> {
  const admin = createPaymentsAdminClient();
  if (!admin) {
    return { ok: false, message: "Service role não configurado." };
  }

  const payment = await updatePaymentByReference(admin, externalReference, {
    status: "approved",
    paidAt: new Date().toISOString(),
    metadata: { simulated: true },
  });

  if (!payment) {
    return { ok: false, message: "Pagamento não encontrado." };
  }

  await activateSubscriptionFromPayment(admin, payment);
  return { ok: true, message: "Assinatura ativada (simulação)." };
}
