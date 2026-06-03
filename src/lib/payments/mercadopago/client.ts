import {
  getMercadoPagoAccessToken,
  getSiteUrl,
  isMercadoPagoConfigured,
} from "../config";
import type { BillingPlan } from "../plans";
import type { PaymentMethod } from "../types";

const MP_API_BASE = "https://api.mercadopago.com";

export interface MercadoPagoPreferenceInput {
  externalReference: string;
  paymentMethod: PaymentMethod;
  payerEmail: string;
  payerName?: string | null;
  plan: BillingPlan;
}

export interface MercadoPagoPreferenceResult {
  id: string;
  initPoint: string;
  sandboxInitPoint?: string;
  stub: boolean;
}

function mapPaymentMethodToExcluded(paymentMethod: PaymentMethod): string[] {
  const all = ["pix", "credit_card", "debit_card", "ticket"];
  const keep =
    paymentMethod === "pix"
      ? ["pix"]
      : paymentMethod === "credit_card"
        ? ["credit_card", "debit_card"]
        : paymentMethod === "ticket"
          ? ["ticket"]
          : all;

  return all.filter((m) => !keep.includes(m));
}

/** Cria preferência de checkout no Mercado Pago (ou stub local). */
export async function createMercadoPagoPreference(
  input: MercadoPagoPreferenceInput,
): Promise<MercadoPagoPreferenceResult> {
  const siteUrl = getSiteUrl();
  const amount = input.plan.amountCents / 100;

  if (!isMercadoPagoConfigured()) {
    const stubId = `stub_pref_${input.externalReference}`;
    return {
      id: stubId,
      initPoint: `${siteUrl}/minha-assinatura?checkout=stub&reference=${encodeURIComponent(input.externalReference)}`,
      stub: true,
    };
  }

  const accessToken = getMercadoPagoAccessToken()!;
  const excluded = mapPaymentMethodToExcluded(input.paymentMethod);

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
      success: `${siteUrl}/minha-assinatura?status=success`,
      failure: `${siteUrl}/minha-assinatura?status=failure`,
      pending: `${siteUrl}/minha-assinatura?status=pending`,
    },
    auto_return: "approved",
    notification_url: `${siteUrl}/api/payments/webhook`,
    payment_methods: {
      excluded_payment_types: excluded.map((type) => ({ id: type })),
    },
    metadata: {
      plan: input.plan.id,
      payment_method: input.paymentMethod,
    },
  };

  const response = await fetch(`${MP_API_BASE}/checkout/preferences`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Mercado Pago preference failed: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as {
    id: string;
    init_point: string;
    sandbox_init_point?: string;
  };

  return {
    id: data.id,
    initPoint: data.init_point,
    sandboxInitPoint: data.sandbox_init_point,
    stub: false,
  };
}

/** Busca pagamento no Mercado Pago por ID (stub retorna null). */
export async function fetchMercadoPagoPayment(
  paymentId: string,
): Promise<Record<string, unknown> | null> {
  if (!isMercadoPagoConfigured()) return null;

  const accessToken = getMercadoPagoAccessToken()!;
  const response = await fetch(`${MP_API_BASE}/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) return null;
  return (await response.json()) as Record<string, unknown>;
}
