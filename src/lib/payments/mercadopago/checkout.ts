import { randomUUID } from "crypto";
import { createPaymentsAdminClient } from "../admin-client";
import { getCheckoutPlan } from "../plans";
import { getSiteUrl, isMercadoPagoConfigured } from "../config";
import { createMercadoPagoPreference } from "./client";
import type { CheckoutRequest, CheckoutResult } from "../types";

function buildExternalReference(userId: string): string {
  return `sb_${userId.slice(0, 8)}_${randomUUID().slice(0, 8)}`;
}

export async function createPremiumCheckout(input: {
  userId: string;
  email: string;
  name?: string | null;
  request: CheckoutRequest;
}): Promise<CheckoutResult> {
  const admin = createPaymentsAdminClient();
  if (!admin) {
    return {
      paymentId: "",
      externalReference: "",
      preferenceId: null,
      checkoutUrl: `${getSiteUrl()}/minha-assinatura?error=service_role`,
      stub: true,
      message:
        "SUPABASE_SERVICE_ROLE_KEY ausente — configure para persistir pagamentos.",
    };
  }

  const externalReference = buildExternalReference(input.userId);
  const paymentMethod = input.request.paymentMethod;
  const plan = getCheckoutPlan(input.request.plan);

  const { data: paymentRow, error: insertError } = await admin
    .from("payments")
    .insert({
      user_id: input.userId,
      provider: "mercadopago",
      external_reference: externalReference,
      status: "pending",
      payment_method: paymentMethod,
      amount_cents: plan.amountCents,
      currency: plan.currency,
      description: plan.name,
      metadata: {
        plan: plan.id,
        payment_method: paymentMethod,
        period_days: plan.periodDays,
      },
    })
    .select("id")
    .single();

  if (insertError || !paymentRow) {
    throw new Error(insertError?.message ?? "Falha ao registrar pagamento.");
  }

  const preference = await createMercadoPagoPreference({
    externalReference,
    paymentMethod,
    payerEmail: input.email,
    payerName: input.name,
    plan,
  });

  await admin
    .from("payments")
    .update({
      preference_id: preference.id,
      metadata: {
        plan: plan.id,
        payment_method: paymentMethod,
        period_days: plan.periodDays,
        stub: preference.stub,
      },
    })
    .eq("id", paymentRow.id);

  const checkoutUrl =
    process.env.NODE_ENV !== "production" && preference.sandboxInitPoint
      ? preference.sandboxInitPoint
      : preference.initPoint;

  return {
    paymentId: paymentRow.id,
    externalReference,
    preferenceId: preference.id,
    checkoutUrl,
    stub: preference.stub || !isMercadoPagoConfigured(),
    message: preference.stub
      ? "Modo stub — configure MERCADOPAGO_ACCESS_TOKEN para checkout real."
      : undefined,
  };
}
