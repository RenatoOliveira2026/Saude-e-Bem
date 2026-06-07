import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { cancelMercadoPagoPreapproval } from "../mercadopago/preapproval";
import { getPlanById, PREMIUM_MONTHLY_PLAN } from "../plans";
import { recordFinancialEvent } from "./financial-events.service";
import { notifyPremiumViaWhatsApp } from "@/lib/whatsapp/hooks";
import type { Payment } from "../types";

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function resolvePlanFromPayment(payment: Payment) {
  const planId =
    typeof payment.metadata?.plan === "string" ? payment.metadata.plan : null;
  return getPlanById(planId) ?? PREMIUM_MONTHLY_PLAN;
}

function resolvePeriodStart(existingEnd: string | null | undefined): Date {
  const now = new Date();
  if (!existingEnd) return now;

  const end = new Date(existingEnd);
  return end > now ? end : now;
}

/** Ativa ou renova assinatura premium após pagamento aprovado. */
export async function activateSubscriptionFromPayment(
  admin: SupabaseClient<Database>,
  payment: Payment,
): Promise<void> {
  const plan = resolvePlanFromPayment(payment);
  const now = new Date();

  const { data: existing } = await admin
    .from("subscriptions")
    .select(
      "id, current_period_end, status, mercadopago_preapproval_id, auto_renew",
    )
    .eq("user_id", payment.userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const periodStart = resolvePeriodStart(existing?.current_period_end);
  const periodEnd = addDays(periodStart, plan.periodDays);
  const autoRenew =
    plan.billingInterval === "month" &&
    payment.paymentMethod === "credit_card";

  const subscriptionPayload = {
    plan: "premium" as const,
    status: "active" as const,
    provider: "mercadopago" as const,
    billing_plan_id: plan.id,
    auto_renew: autoRenew,
    cancel_at_period_end: false,
    current_period_start: periodStart.toISOString(),
    current_period_end: periodEnd.toISOString(),
    canceled_at: null,
    metadata: {
      last_payment_id: payment.id,
      last_external_reference: payment.externalReference,
      billing_plan: plan.id,
      renewed_at: now.toISOString(),
    },
  };

  let subscriptionId: string;

  if (existing) {
    const { data: updated, error } = await admin
      .from("subscriptions")
      .update(subscriptionPayload)
      .eq("id", existing.id)
      .select("id")
      .single();

    if (error) throw error;
    subscriptionId = updated.id;
  } else {
    const { data: inserted, error } = await admin
      .from("subscriptions")
      .insert({
        user_id: payment.userId,
        ...subscriptionPayload,
      })
      .select("id")
      .single();

    if (error) throw error;
    subscriptionId = inserted.id;
  }

  await admin
    .from("payments")
    .update({ subscription_id: subscriptionId })
    .eq("id", payment.id);

  const isRenewal = Boolean(existing?.current_period_end);
  await recordFinancialEvent(admin, {
    userId: payment.userId,
    paymentId: payment.id,
    subscriptionId,
    eventType: isRenewal ? "subscription_renewed" : "subscription_activated",
    title: isRenewal ? "Assinatura renovada" : "Assinatura Premium ativada",
    description: `${plan.name} válido até ${periodEnd.toISOString()}`,
    amountCents: payment.amountCents,
    currency: payment.currency,
    metadata: { billing_plan_id: plan.id, auto_renew: autoRenew },
  });

  void notifyPremiumViaWhatsApp(admin, payment, plan);
}

/** Cancela ou rejeita assinatura após pagamento recusado/cancelado/reembolsado. */
export async function cancelSubscriptionFromPayment(
  admin: SupabaseClient<Database>,
  payment: Payment,
  reason: string,
): Promise<void> {
  const { data: subscription } = await admin
    .from("subscriptions")
    .select("id, mercadopago_preapproval_id, status")
    .eq("user_id", payment.userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!subscription) return;

  if (subscription.mercadopago_preapproval_id) {
    await cancelMercadoPagoPreapproval(subscription.mercadopago_preapproval_id);
  }

  const hasOtherApproved = await admin
    .from("payments")
    .select("id")
    .eq("user_id", payment.userId)
    .eq("status", "approved")
    .neq("id", payment.id)
    .limit(1)
    .maybeSingle();

  if (hasOtherApproved.data) {
    return;
  }

  await admin
    .from("subscriptions")
    .update({
      status: "canceled",
      canceled_at: new Date().toISOString(),
      auto_renew: false,
      metadata: {
        cancel_reason: reason,
        last_payment_id: payment.id,
      },
    })
    .eq("id", subscription.id);

  await recordFinancialEvent(admin, {
    userId: payment.userId,
    paymentId: payment.id,
    subscriptionId: subscription.id,
    eventType: "subscription_canceled",
    title: "Assinatura cancelada",
    description: `Motivo: ${reason}`,
    metadata: { reason },
  });
}

/** Ativa assinatura a partir de preapproval autorizado (renovação automática). */
export async function activateSubscriptionFromPreapproval(
  admin: SupabaseClient<Database>,
  input: {
    userId: string;
    preapprovalId: string;
    externalReference: string;
    payerId?: string | null;
    planId?: string | null;
  },
): Promise<void> {
  const plan = getPlanById(input.planId) ?? PREMIUM_MONTHLY_PLAN;
  const now = new Date();
  const periodEnd = addDays(now, plan.periodDays);

  const { data: existing } = await admin
    .from("subscriptions")
    .select("id")
    .eq("user_id", input.userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const payload = {
    plan: "premium" as const,
    status: "active" as const,
    provider: "mercadopago" as const,
    billing_plan_id: plan.id,
    auto_renew: true,
    cancel_at_period_end: false,
    mercadopago_preapproval_id: input.preapprovalId,
    mercadopago_payer_id: input.payerId ?? null,
    current_period_start: now.toISOString(),
    current_period_end: periodEnd.toISOString(),
    canceled_at: null,
    metadata: {
      preapproval_id: input.preapprovalId,
      external_reference: input.externalReference,
    },
  };

  if (existing) {
    await admin.from("subscriptions").update(payload).eq("id", existing.id);
  } else {
    await admin.from("subscriptions").insert({
      user_id: input.userId,
      ...payload,
    });
  }

  await recordFinancialEvent(admin, {
    userId: input.userId,
    eventType: "preapproval_authorized",
    title: "Renovação automática autorizada",
    description: "Assinatura mensal com cartão via Mercado Pago",
    metadata: {
      preapproval_id: input.preapprovalId,
      external_reference: input.externalReference,
      plan: plan.id,
    },
  });
}

/** Agenda cancelamento ao fim do período ou cancela imediatamente. */
export async function cancelUserSubscription(
  admin: SupabaseClient<Database>,
  userId: string,
  immediate = false,
): Promise<{ ok: boolean; message: string }> {
  const { data: subscription } = await admin
    .from("subscriptions")
    .select("id, mercadopago_preapproval_id, status, current_period_end")
    .eq("user_id", userId)
    .in("status", ["active", "trialing", "past_due"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!subscription) {
    return { ok: false, message: "Nenhuma assinatura ativa encontrada." };
  }

  if (subscription.mercadopago_preapproval_id) {
    await cancelMercadoPagoPreapproval(subscription.mercadopago_preapproval_id);
  }

  if (immediate) {
    await admin
      .from("subscriptions")
      .update({
        status: "canceled",
        auto_renew: false,
        cancel_at_period_end: false,
        canceled_at: new Date().toISOString(),
      })
      .eq("id", subscription.id);

    return { ok: true, message: "Assinatura cancelada imediatamente." };
  }

  await admin
    .from("subscriptions")
    .update({
      cancel_at_period_end: true,
      auto_renew: false,
    })
    .eq("id", subscription.id);

  return {
    ok: true,
    message: "Cancelamento agendado para o fim do período atual.",
  };
}
