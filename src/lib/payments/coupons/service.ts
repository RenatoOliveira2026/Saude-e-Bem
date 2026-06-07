import { getCheckoutPlan, type CheckoutPlanId } from "../plans";
import type { CouponValidationResult, DiscountCoupon } from "./types";

/**
 * Valida cupom e calcula desconto (estrutura Fase 5.5 — aplicação no checkout em fase futura).
 */
export function validateCouponForCheckout(input: {
  coupon: DiscountCoupon | null;
  planId: CheckoutPlanId;
  userId: string;
}): CouponValidationResult {
  const { coupon, planId } = input;

  if (!coupon) {
    return { valid: false, error: "Cupom não encontrado." };
  }

  if (!coupon.active) {
    return { valid: false, error: "Cupom inativo." };
  }

  const now = Date.now();
  if (coupon.validFrom && new Date(coupon.validFrom).getTime() > now) {
    return { valid: false, error: "Cupom ainda não está válido." };
  }
  if (coupon.validUntil && new Date(coupon.validUntil).getTime() < now) {
    return { valid: false, error: "Cupom expirado." };
  }

  if (
    coupon.maxRedemptions !== null &&
    coupon.redemptionCount >= coupon.maxRedemptions
  ) {
    return { valid: false, error: "Cupom esgotado." };
  }

  if (
    coupon.appliesToPlans.length > 0 &&
    !coupon.appliesToPlans.includes(planId)
  ) {
    return { valid: false, error: "Cupom não válido para este plano." };
  }

  const plan = getCheckoutPlan(planId);
  if (coupon.minAmountCents && plan.amountCents < coupon.minAmountCents) {
    return { valid: false, error: "Valor mínimo do plano não atingido." };
  }

  const discountCents =
    coupon.discountType === "percent"
      ? Math.min(
          plan.amountCents,
          Math.round((plan.amountCents * coupon.discountValue) / 100),
        )
      : Math.min(plan.amountCents, coupon.discountValue);

  if (discountCents <= 0) {
    return { valid: false, error: "Desconto inválido." };
  }

  return {
    valid: true,
    coupon,
    discountCents,
    finalAmountCents: plan.amountCents - discountCents,
  };
}
