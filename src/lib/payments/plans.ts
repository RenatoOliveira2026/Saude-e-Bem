export type PlanId = "free" | "premium_monthly" | "premium_annual";

export type CheckoutPlanId = "premium_monthly" | "premium_annual";

export interface BillingPlan {
  id: PlanId;
  name: string;
  description: string;
  amountCents: number;
  currency: "BRL";
  periodDays: number;
  periodLabel: string;
  billingInterval: "free" | "month" | "year";
  checkoutEnabled: boolean;
  /** Selo comercial (ex.: plano anual) */
  highlightBadge?: string;
  /** Texto de economia vs. 12× mensal */
  savingsLabel?: string;
}

/** Fase 4.2.1 — preços comerciais oficiais */
export const PREMIUM_MONTHLY_PRICE_LABEL = "R$ 29,90";
export const PREMIUM_ANNUAL_PRICE_LABEL = "R$ 297,00";
export const PREMIUM_ANNUAL_BADGE = "Mais Escolhido";
export const PREMIUM_ANNUAL_SAVINGS_LABEL = "Economize R$ 61,80 por ano";

export const FREE_PLAN: BillingPlan = {
  id: "free",
  name: "Plano Gratuito",
  description: "Acesso a conteúdos públicos, ferramentas e minha jornada.",
  amountCents: 0,
  currency: "BRL",
  periodDays: 0,
  periodLabel: "",
  billingInterval: "free",
  checkoutEnabled: false,
};

export const PREMIUM_MONTHLY_PLAN: BillingPlan = {
  id: "premium_monthly",
  name: "Plano Mensal",
  description: "Acesso completo a protocolos, biblioteca e artigos premium.",
  amountCents: 2990,
  currency: "BRL",
  periodDays: 30,
  periodLabel: "mês",
  billingInterval: "month",
  checkoutEnabled: true,
};

export const PREMIUM_ANNUAL_PLAN: BillingPlan = {
  id: "premium_annual",
  name: "Plano Anual",
  description: "Acesso premium por 12 meses com o melhor custo-benefício.",
  amountCents: 29700,
  currency: "BRL",
  periodDays: 365,
  periodLabel: "ano",
  billingInterval: "year",
  checkoutEnabled: true,
  highlightBadge: PREMIUM_ANNUAL_BADGE,
  savingsLabel: PREMIUM_ANNUAL_SAVINGS_LABEL,
};

/** Planos exibidos na página /assinar */
export const ASSINAR_PLANS: BillingPlan[] = [
  FREE_PLAN,
  PREMIUM_MONTHLY_PLAN,
  PREMIUM_ANNUAL_PLAN,
];

export const CHECKOUT_PLANS: BillingPlan[] = [
  PREMIUM_MONTHLY_PLAN,
  PREMIUM_ANNUAL_PLAN,
];

export function getPlanById(id: string | null | undefined): BillingPlan | null {
  return ASSINAR_PLANS.find((plan) => plan.id === id) ?? null;
}

export function getCheckoutPlan(id: string): BillingPlan {
  const plan = getPlanById(id);
  if (!plan?.checkoutEnabled) {
    throw new Error("Plano de checkout inválido.");
  }
  return plan;
}

export function isCheckoutPlanId(id: string): id is CheckoutPlanId {
  return id === "premium_monthly" || id === "premium_annual";
}

export function formatPlanAmount(plan: BillingPlan): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: plan.currency,
  }).format(plan.amountCents / 100);
}

export function formatPlanPriceLabel(plan: BillingPlan): string {
  if (plan.amountCents === 0) return "R$ 0,00";
  if (plan.periodLabel) {
    return `${formatPlanAmount(plan)} / ${plan.periodLabel}`;
  }
  return formatPlanAmount(plan);
}
