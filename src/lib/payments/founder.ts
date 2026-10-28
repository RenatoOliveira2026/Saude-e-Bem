import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { BillingPlan, CheckoutPlanId } from "./plans";

/**
 * Campanha "preço de fundador" do Clube.
 *
 * Quem tiver um pagamento aprovado até o fim da campanha paga sempre o
 * preço de fundador nas renovações, mesmo que o preço do Clube suba depois.
 * Para subir o preço no futuro, altere só CLUB_PRICING (pricing.ts):
 * os valores abaixo ficam congelados.
 */
export const FOUNDER_CAMPAIGN_ENDS_AT = "2026-11-30T23:59:59-03:00";

export const FOUNDER_PRICES_CENTS: Record<CheckoutPlanId, number> = {
  premium_monthly: 1990,
  premium_quarterly: 7990,
  premium_annual: 14900,
};

export function isFounderCampaignOpen(now: Date = new Date()): boolean {
  return now.getTime() <= new Date(FOUNDER_CAMPAIGN_ENDS_AT).getTime();
}

/** Tem pagamento aprovado feito até o fim da campanha? */
export async function isFounderMember(
  admin: SupabaseClient<Database>,
  userId: string,
): Promise<boolean> {
  const { data } = await admin
    .from("payments")
    .select("id")
    .eq("user_id", userId)
    .in("status", ["approved", "authorized"])
    .lte("created_at", new Date(FOUNDER_CAMPAIGN_ENDS_AT).toISOString())
    .limit(1)
    .maybeSingle();
  return Boolean(data);
}

/** Aplica o preço de fundador quando ele for menor que o preço atual. */
export async function withFounderPrice(
  admin: SupabaseClient<Database>,
  userId: string,
  plan: BillingPlan,
): Promise<BillingPlan> {
  const founderCents = FOUNDER_PRICES_CENTS[plan.id as CheckoutPlanId];
  if (!founderCents || founderCents >= plan.amountCents) return plan;
  if (!(await isFounderMember(admin, userId))) return plan;
  return { ...plan, amountCents: founderCents, highlightBadge: "Preço de fundador" };
}
