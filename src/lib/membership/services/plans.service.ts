import { FALLBACK_MEMBERSHIP_PLANS } from "@/lib/membership/constants";
import { mapMembershipPlanRow } from "@/lib/membership/mappers";
import type { MembershipPlanRecord } from "@/lib/membership/types";
import { createClient } from "@/lib/supabase/server";

export async function fetchActiveMembershipPlans(): Promise<MembershipPlanRecord[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("membership_plans")
      .select(
        "id, name, slug, description, price, billing_cycle, features, is_active, created_at",
      )
      .eq("is_active", true)
      .order("price", { ascending: true });

    if (error || !data?.length) {
      if (error) console.warn("[membership.plans]", error.message);
      return FALLBACK_MEMBERSHIP_PLANS;
    }

    return data.map((row) => mapMembershipPlanRow(row));
  } catch {
    return FALLBACK_MEMBERSHIP_PLANS;
  }
}

export async function fetchMembershipPlanBySlug(
  slug: string,
): Promise<MembershipPlanRecord | null> {
  const plans = await fetchActiveMembershipPlans();
  return plans.find((plan) => plan.slug === slug) ?? null;
}
