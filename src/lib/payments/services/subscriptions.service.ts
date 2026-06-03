import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { getPlanById, PREMIUM_MONTHLY_PLAN } from "../plans";
import type { Payment } from "../types";

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

/** Ativa ou renova assinatura premium após pagamento aprovado. */
export async function activateSubscriptionFromPayment(
  admin: SupabaseClient<Database>,
  payment: Payment,
): Promise<void> {
  const now = new Date();
  const planId =
    typeof payment.metadata?.plan === "string" ? payment.metadata.plan : null;
  const plan = getPlanById(planId) ?? PREMIUM_MONTHLY_PLAN;
  const periodEnd = addDays(now, plan.periodDays);

  const { data: existing } = await admin
    .from("subscriptions")
    .select("id, current_period_end, status")
    .eq("user_id", payment.userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let subscriptionId: string;

  if (existing) {
    const { data: updated, error } = await admin
      .from("subscriptions")
      .update({
        plan: "premium",
        status: "active",
        provider: "mercadopago",
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        canceled_at: null,
        metadata: {
          last_payment_id: payment.id,
          last_external_reference: payment.externalReference,
          billing_plan: plan.id,
        },
      })
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
        plan: "premium",
        status: "active",
        provider: "mercadopago",
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        metadata: {
          last_payment_id: payment.id,
          last_external_reference: payment.externalReference,
          billing_plan: plan.id,
        },
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
}
