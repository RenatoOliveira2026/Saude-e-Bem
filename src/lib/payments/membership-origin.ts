import type { BillingPlan, PlanId } from "./plans";
import type { PaymentMethod } from "./types";

export type MembershipOrigin =
  | "recorrente_cartao"
  | "cartao_unico"
  | "pix_30_dias"
  | "pix_365_dias"
  | "boleto_30_dias"
  | "boleto_365_dias";

export type CheckoutMode = "preapproval" | "checkout_pro";

/** Cartão mensal → assinatura recorrente MP; PIX/boleto → pagamento único (Preferences). */
export function shouldUseRecurringCheckout(
  paymentMethod: PaymentMethod,
  plan: BillingPlan,
): boolean {
  return paymentMethod === "credit_card" && plan.billingInterval === "month";
}

export function resolveAccessPeriodDays(
  plan: BillingPlan,
  paymentMethod: PaymentMethod,
): number {
  if (paymentMethod === "pix" || paymentMethod === "ticket") {
    return plan.id === "premium_annual" ? 365 : 30;
  }
  return plan.periodDays;
}

export function resolveMembershipOrigin(
  paymentMethod: PaymentMethod,
  planId: PlanId | string,
  checkoutMode: CheckoutMode,
): MembershipOrigin {
  if (paymentMethod === "pix") {
    return planId === "premium_annual" ? "pix_365_dias" : "pix_30_dias";
  }
  if (paymentMethod === "ticket") {
    return planId === "premium_annual" ? "boleto_365_dias" : "boleto_30_dias";
  }
  if (paymentMethod === "credit_card") {
    return checkoutMode === "preapproval" ? "recorrente_cartao" : "cartao_unico";
  }
  return "pix_30_dias";
}

const ORIGIN_LABELS: Record<MembershipOrigin, string> = {
  recorrente_cartao: "Recorrente (cartão)",
  cartao_unico: "Cartão (pagamento único)",
  pix_30_dias: "PIX — 30 dias",
  pix_365_dias: "PIX — 365 dias",
  boleto_30_dias: "Boleto — 30 dias",
  boleto_365_dias: "Boleto — 365 dias",
};

export function getMembershipOriginLabel(
  origin: string | null | undefined,
): string {
  if (!origin) return "—";
  return ORIGIN_LABELS[origin as MembershipOrigin] ?? origin;
}

export function parseMembershipOrigin(
  value: unknown,
): MembershipOrigin | null {
  if (typeof value !== "string") return null;
  if (value in ORIGIN_LABELS) return value as MembershipOrigin;
  return null;
}
