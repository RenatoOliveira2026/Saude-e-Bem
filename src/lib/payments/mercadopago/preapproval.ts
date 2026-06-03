import { getSiteUrl, isMercadoPagoConfigured } from "../config";
import type { BillingPlan } from "../plans";
import { MP_API_BASE } from "./client";

export interface PreapprovalInput {
  externalReference: string;
  payerEmail: string;
  plan: BillingPlan;
  userId: string;
}

export interface PreapprovalResult {
  id: string;
  initPoint: string;
  status: string;
}

async function mpFetch(path: string, init?: RequestInit) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim();
  if (!accessToken) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN não configurado.");
  }

  return fetch(`${MP_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

/** Assinatura recorrente Mercado Pago (renovação automática — plano mensal). */
export async function createMercadoPagoPreapproval(
  input: PreapprovalInput,
): Promise<PreapprovalResult | null> {
  if (!isMercadoPagoConfigured()) return null;
  if (input.plan.billingInterval !== "month") return null;

  const siteUrl = getSiteUrl();
  const amount = input.plan.amountCents / 100;

  const body = {
    reason: input.plan.name,
    external_reference: input.externalReference,
    payer_email: input.payerEmail,
    auto_recurring: {
      frequency: 1,
      frequency_type: "months",
      transaction_amount: amount,
      currency_id: input.plan.currency,
    },
    back_url: `${siteUrl}/minha-assinatura?status=success&reference=${encodeURIComponent(input.externalReference)}`,
    notification_url: `${siteUrl}/api/payments/webhook`,
    status: "pending",
  };

  const response = await mpFetch("/preapproval", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[mercadopago/preapproval] create failed", errorText);
    return null;
  }

  const data = (await response.json()) as {
    id: string;
    init_point: string;
    status: string;
  };

  return {
    id: data.id,
    initPoint: data.init_point,
    status: data.status,
  };
}

export async function fetchMercadoPagoPreapproval(
  preapprovalId: string,
): Promise<Record<string, unknown> | null> {
  if (!isMercadoPagoConfigured()) return null;

  const response = await mpFetch(`/preapproval/${preapprovalId}`);
  if (!response.ok) return null;
  return (await response.json()) as Record<string, unknown>;
}

export async function cancelMercadoPagoPreapproval(
  preapprovalId: string,
): Promise<boolean> {
  if (!isMercadoPagoConfigured()) return false;

  const response = await mpFetch(`/preapproval/${preapprovalId}`, {
    method: "PUT",
    body: JSON.stringify({ status: "cancelled" }),
  });

  return response.ok;
}
