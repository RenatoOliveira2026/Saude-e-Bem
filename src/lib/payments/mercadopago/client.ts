import {
  getMercadoPagoAccessToken,
  getSiteUrl,
  isMercadoPagoConfigured,
  isStubModeEnabled,
  shouldUseSandboxCheckout,
} from "../config";
import type { BillingPlan } from "../plans";
import type { PaymentMethod } from "../types";

export const MP_API_BASE = "https://api.mercadopago.com";

export interface MercadoPagoPreferenceInput {
  externalReference: string;
  paymentMethod: PaymentMethod;
  payerEmail: string;
  payerName?: string | null;
  plan: BillingPlan;
  userId: string;
}

export interface MercadoPagoPreferenceResult {
  id: string;
  initPoint: string;
  sandboxInitPoint?: string;
  stub: boolean;
}

export interface MercadoPagoPaymentRecord {
  id: number | string;
  status: string;
  external_reference?: string;
  payment_type_id?: string;
  payment_method_id?: string;
  transaction_amount?: number;
  date_approved?: string;
  payer?: { id?: string; email?: string };
  metadata?: Record<string, unknown>;
}

const MP_PAYMENT_TYPES = [
  "account_money",
  "ticket",
  "bank_transfer",
  "atm",
  "credit_card",
  "debit_card",
  "digital_currency",
] as const;

function getExcludedPaymentTypes(method: PaymentMethod): string[] {
  switch (method) {
    case "pix":
      return MP_PAYMENT_TYPES.filter((type) => type !== "bank_transfer");
    case "credit_card":
      return MP_PAYMENT_TYPES.filter(
        (type) => !["credit_card", "debit_card"].includes(type),
      );
    case "ticket":
      return MP_PAYMENT_TYPES.filter((type) => type !== "ticket");
    default:
      return [];
  }
}

function mpFetch(path: string, init?: RequestInit) {
  const accessToken = getMercadoPagoAccessToken();
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

/** Checkout Pro — PIX, cartão e boleto via preferência. */
export async function createMercadoPagoPreference(
  input: MercadoPagoPreferenceInput,
): Promise<MercadoPagoPreferenceResult> {
  const siteUrl = getSiteUrl();
  const amount = input.plan.amountCents / 100;

  if (!isMercadoPagoConfigured()) {
    if (!isStubModeEnabled()) {
      throw new Error(
        "Mercado Pago não configurado. Defina MERCADOPAGO_ACCESS_TOKEN ou MERCADOPAGO_STUB_MODE=1 em dev.",
      );
    }

    const stubId = `stub_pref_${input.externalReference}`;
    return {
      id: stubId,
      initPoint: `${siteUrl}/minha-assinatura?checkout=stub&reference=${encodeURIComponent(input.externalReference)}`,
      stub: true,
    };
  }

  const excluded = getExcludedPaymentTypes(input.paymentMethod);

  const body = {
    items: [
      {
        id: input.plan.id,
        title: input.plan.name,
        description: input.plan.description,
        quantity: 1,
        currency_id: input.plan.currency,
        unit_price: amount,
      },
    ],
    payer: {
      email: input.payerEmail,
      name: input.payerName ?? undefined,
    },
    external_reference: input.externalReference,
    back_urls: {
      success: `${siteUrl}/minha-assinatura?status=success&reference=${encodeURIComponent(input.externalReference)}`,
      failure: `${siteUrl}/minha-assinatura?status=failure&reference=${encodeURIComponent(input.externalReference)}`,
      pending: `${siteUrl}/minha-assinatura?status=pending&reference=${encodeURIComponent(input.externalReference)}`,
    },
    auto_return: "approved",
    notification_url: `${siteUrl}/api/payments/webhook`,
    payment_methods: {
      excluded_payment_types: excluded.map((id) => ({ id })),
    },
    metadata: {
      plan: input.plan.id,
      payment_method: input.paymentMethod,
      user_id: input.userId,
      integration: "checkout_pro",
    },
  };

  const response = await mpFetch("/checkout/preferences", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Mercado Pago preference failed: ${response.status} ${errorText}`,
    );
  }

  const data = (await response.json()) as {
    id: string;
    init_point: string;
    sandbox_init_point?: string;
  };

  const initPoint =
    shouldUseSandboxCheckout() && data.sandbox_init_point
      ? data.sandbox_init_point
      : data.init_point;

  return {
    id: data.id,
    initPoint,
    sandboxInitPoint: data.sandbox_init_point,
    stub: false,
  };
}

export async function fetchMercadoPagoPayment(
  paymentId: string,
): Promise<MercadoPagoPaymentRecord | null> {
  if (!isMercadoPagoConfigured()) return null;

  const response = await mpFetch(`/v1/payments/${paymentId}`);
  if (!response.ok) return null;
  return (await response.json()) as MercadoPagoPaymentRecord;
}

export async function searchMercadoPagoPaymentsByReference(
  externalReference: string,
): Promise<MercadoPagoPaymentRecord[]> {
  if (!isMercadoPagoConfigured()) return [];

  const response = await mpFetch(
    `/v1/payments/search?external_reference=${encodeURIComponent(externalReference)}`,
  );

  if (!response.ok) return [];

  const data = (await response.json()) as {
    results?: MercadoPagoPaymentRecord[];
  };

  return data.results ?? [];
}
