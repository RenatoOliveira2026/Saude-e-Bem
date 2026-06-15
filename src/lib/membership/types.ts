export type MembershipBillingCycle = "free" | "monthly" | "quarterly" | "annual";

export type MembershipPlanSlug =
  | "gratuito"
  | "premium-mensal"
  | "premium-anual";

export type UserMembershipStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "expired"
  | "pending";

export type MembershipPaymentProvider =
  | "mercadopago"
  | "hotmart"
  | "kiwify"
  | "stripe"
  | "manual"
  | "internal";

export interface MembershipPlanRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  billingCycle: MembershipBillingCycle;
  features: string[];
  isActive: boolean;
  createdAt: string;
}

export interface UserMembershipRecord {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  planSlug: string;
  status: UserMembershipStatus;
  startedAt: string;
  expiresAt: string | null;
  provider: string | null;
  externalId: string | null;
  createdAt: string;
  userEmail?: string | null;
  userName?: string | null;
}

export interface PlanComparisonRow {
  feature: string;
  free: boolean | string;
  premium: boolean | string;
}
