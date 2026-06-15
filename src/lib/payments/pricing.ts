/**
 * Fase 6.1 — Preços oficiais do Clube Saúde & Bem (fonte única).
 * Altere aqui para atualizar checkout, UI e seed do banco.
 */
export const CLUB_PRICING = {
  premiumMonthly: {
    amountCents: 1990,
    label: "R$ 19,90",
    periodLabel: "mês",
  },
  premiumAnnual: {
    amountCents: 19700,
    label: "R$ 197,00",
    periodLabel: "ano",
    badge: "Mais Escolhido",
    savingsLabel: "Economize R$ 41,80 por ano vs. mensal",
  },
} as const;

export type SubscriptionCheckoutPlanId = "premium_monthly" | "premium_annual";

export const SUBSCRIPTION_CHECKOUT_PLAN_IDS: SubscriptionCheckoutPlanId[] = [
  "premium_monthly",
  "premium_annual",
];

export function isSubscriptionCheckoutPlanId(
  id: string,
): id is SubscriptionCheckoutPlanId {
  return (
    id === "premium_monthly" || id === "premium_annual"
  );
}
