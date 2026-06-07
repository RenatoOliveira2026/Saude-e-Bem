import type { CheckoutPlanId } from "../plans";

export type DiscountType = "percent" | "fixed";

export interface DiscountCoupon {
  id: string;
  code: string;
  description: string | null;
  discountType: DiscountType;
  /** Percentual (1–100) ou valor fixo em centavos */
  discountValue: number;
  currency: string;
  validFrom: string | null;
  validUntil: string | null;
  maxRedemptions: number | null;
  redemptionCount: number;
  appliesToPlans: CheckoutPlanId[];
  minAmountCents: number | null;
  active: boolean;
}

export interface CouponValidationResult {
  valid: boolean;
  coupon?: DiscountCoupon;
  discountCents?: number;
  finalAmountCents?: number;
  error?: string;
}
