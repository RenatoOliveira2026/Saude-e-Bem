import { mapBillingPlanToMembershipSlug } from "@/lib/membership/providers";
import type { MembershipOrigin } from "@/lib/payments/membership-origin";
import type { BillingPlan } from "@/lib/payments/plans";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type MembershipStatus = "active" | "pending" | "canceled" | "expired" | "trialing" | "past_due";

function mapSubscriptionStatus(status: string): MembershipStatus {
  switch (status) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
      return "past_due";
    case "pending":
      return "pending";
    case "expired":
      return "expired";
    case "canceled":
    case "cancelled":
      return "canceled";
    default:
      return "pending";
  }
}

async function resolvePlanId(
  admin: SupabaseClient<Database>,
  billingPlanId: string,
): Promise<string | null> {
  const slug = mapBillingPlanToMembershipSlug(billingPlanId);
  if (!slug) return null;

  const { data } = await admin
    .from("membership_plans")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  return data?.id ?? null;
}

/** Sincroniza user_memberships a partir do estado de subscriptions (Fase 6.1). */
export async function syncUserMembershipFromSubscription(
  admin: SupabaseClient<Database>,
  input: {
    userId: string;
    plan: BillingPlan;
    subscriptionStatus: string;
    startedAt: string;
    expiresAt: string | null;
    provider?: string | null;
    externalId?: string | null;
    membershipOrigin?: MembershipOrigin | string | null;
  },
): Promise<void> {
  const planId = await resolvePlanId(admin, input.plan.id);
  if (!planId) {
    console.error(
      "[membership/sync] Plano não encontrado em membership_plans:",
      input.plan.id,
      mapBillingPlanToMembershipSlug(input.plan.id),
    );
    throw new Error(
      `Plano de membership não encontrado para billing_plan_id=${input.plan.id}`,
    );
  }

  const membershipStatus = mapSubscriptionStatus(input.subscriptionStatus);

  await admin
    .from("user_memberships")
    .update({ status: "canceled" })
    .eq("user_id", input.userId)
    .in("status", ["active", "trialing", "pending", "past_due"]);

  const { data: existing } = await admin
    .from("user_memberships")
    .select("id")
    .eq("user_id", input.userId)
    .eq("plan_id", planId)
    .eq("status", membershipStatus)
    .eq("started_at", input.startedAt)
    .maybeSingle();

  if (existing) {
    await admin
      .from("user_memberships")
      .update({
        expires_at: input.expiresAt,
        provider: input.provider ?? "mercadopago",
        external_id: input.externalId,
        membership_origin: input.membershipOrigin ?? null,
      })
      .eq("id", existing.id);
    return;
  }

  await admin.from("user_memberships").insert({
    user_id: input.userId,
    plan_id: planId,
    status: membershipStatus,
    started_at: input.startedAt,
    expires_at: input.expiresAt,
    provider: input.provider ?? "mercadopago",
    external_id: input.externalId,
    membership_origin: input.membershipOrigin ?? null,
  });
}

export async function syncUserMembershipCancelled(
  admin: SupabaseClient<Database>,
  userId: string,
  reason: "canceled" | "expired" = "canceled",
): Promise<void> {
  await admin
    .from("user_memberships")
    .update({ status: reason })
    .eq("user_id", userId)
    .in("status", ["active", "trialing", "pending", "past_due"]);
}
