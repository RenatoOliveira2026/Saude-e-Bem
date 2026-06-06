import { randomUUID } from "crypto";
import { createPaymentsAdminClient } from "../admin-client";
import { getCheckoutPlan } from "../plans";
import {
  getSiteUrl,
  isMercadoPagoConfigured,
  isStubModeEnabled,
  shouldUseSandboxCheckout,
} from "../config";
import { createMercadoPagoPreference } from "./client";
import { createMercadoPagoPreapproval } from "./preapproval";
import { recordFinancialEvent } from "../services/financial-events.service";
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

  if (!isMercadoPagoConfigured() && !isStubModeEnabled()) {
    throw new Error(
      "Configure MERCADOPAGO_ACCESS_TOKEN para checkout real ou MERCADOPAGO_STUB_MODE=1 em dev.",
    );
  }

  const externalReference = buildExternalReference(input.userId);
  const paymentMethod = input.request.paymentMethod;
  const plan = getCheckoutPlan(input.request.plan);
  const usePreapproval =
    isMercadoPagoConfigured() &&
    plan.billingInterval === "month" &&
    paymentMethod === "credit_card";

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
      billing_plan_id: plan.id,
      metadata: {
        plan: plan.id,
        payment_method: paymentMethod,
        period_days: plan.periodDays,
        checkout_mode: usePreapproval ? "preapproval" : "checkout_pro",
      },
    })
    .select("id")
    .single();

  if (insertError || !paymentRow) {
    throw new Error(insertError?.message ?? "Falha ao registrar pagamento.");
  }

  const paymentId = paymentRow.id;

  await recordFinancialEvent(admin, {
    userId: input.userId,
    paymentId,
    eventType: "checkout_started",
    title: "Checkout iniciado",
    description: `${plan.name} via Mercado Pago (${paymentMethod})`,
    amountCents: plan.amountCents,
    currency: plan.currency,
    metadata: {
      external_reference: externalReference,
      checkout_mode: usePreapproval ? "preapproval" : "checkout_pro",
      plan: plan.id,
    },
  });

  let checkoutUrl: string;
  let preferenceId: string | null = null;
  let stub = false;
  let message: string | undefined;

  if (usePreapproval) {
    const preapproval = await createMercadoPagoPreapproval({
      externalReference,
      payerEmail: input.email,
      plan,
      userId: input.userId,
    });

    if (preapproval) {
      checkoutUrl = preapproval.initPoint;
      preferenceId = preapproval.id;

      await admin
        .from("payments")
        .update({
          preference_id: preapproval.id,
          metadata: {
            plan: plan.id,
            payment_method: paymentMethod,
            period_days: plan.periodDays,
            checkout_mode: "preapproval",
            preapproval_id: preapproval.id,
          },
        })
        .eq("id", paymentId);

      message =
        "Renovação automática ativada via assinatura Mercado Pago (cartão).";
    } else {
      const preference = await createCheckoutProPreference();
      checkoutUrl = preference.checkoutUrl;
      preferenceId = preference.preferenceId;
      stub = preference.stub;
      message = preference.message;
    }
  } else {
    const preference = await createCheckoutProPreference();
    checkoutUrl = preference.checkoutUrl;
    preferenceId = preference.preferenceId;
    stub = preference.stub;
    message = preference.message;
  }

  async function createCheckoutProPreference() {
    const preference = await createMercadoPagoPreference({
      externalReference,
      paymentMethod,
      payerEmail: input.email,
      payerName: input.name,
      plan,
      userId: input.userId,
    });

    await admin!
      .from("payments")
      .update({
        preference_id: preference.id,
        metadata: {
          plan: plan.id,
          payment_method: paymentMethod,
          period_days: plan.periodDays,
          checkout_mode: "checkout_pro",
          stub: preference.stub,
        },
      })
      .eq("id", paymentId);

    const url =
      shouldUseSandboxCheckout() && preference.sandboxInitPoint
        ? preference.sandboxInitPoint
        : preference.initPoint;

    return {
      checkoutUrl: url,
      preferenceId: preference.id,
      stub: preference.stub,
      message: preference.stub
        ? "Modo stub — configure MERCADOPAGO_ACCESS_TOKEN para checkout real."
        : undefined,
    };
  }

  return {
    paymentId,
    externalReference,
    preferenceId,
    checkoutUrl,
    stub: stub || !isMercadoPagoConfigured(),
    message,
  };
}
