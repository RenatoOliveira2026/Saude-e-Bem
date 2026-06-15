import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

const ACTIVE_SUBSCRIPTION_STATUSES = ["active", "trialing", "past_due"] as const;

/** Impede múltiplas assinaturas premium simultâneas. */
export async function assertUserCanSubscribe(
  admin: SupabaseClient<Database>,
  userId: string,
): Promise<void> {
  const { data: subscription } = await admin
    .from("subscriptions")
    .select("id, status, billing_plan_id")
    .eq("user_id", userId)
    .in("status", [...ACTIVE_SUBSCRIPTION_STATUSES])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (subscription) {
    throw new Error(
      "Você já possui uma assinatura ativa. Gerencie em Minha assinatura.",
    );
  }

  const { data: pendingPayment } = await admin
    .from("payments")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "pending")
    .gte("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString())
    .limit(1)
    .maybeSingle();

  if (pendingPayment) {
    throw new Error(
      "Há um pagamento pendente em andamento. Aguarde a confirmação ou tente novamente em alguns minutos.",
    );
  }
}

export async function userHasActiveSubscription(
  admin: SupabaseClient<Database>,
  userId: string,
): Promise<boolean> {
  const { data } = await admin
    .from("subscriptions")
    .select("id")
    .eq("user_id", userId)
    .in("status", [...ACTIVE_SUBSCRIPTION_STATUSES])
    .limit(1)
    .maybeSingle();

  return Boolean(data);
}
