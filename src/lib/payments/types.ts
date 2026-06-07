export type PaymentProvider = "mercadopago" | "manual" | "stripe" | "internal";

export type PaymentStatus =
  | "pending"
  | "approved"
  | "authorized"
  | "in_process"
  | "in_mediation"
  | "rejected"
  | "cancelled"
  | "refunded"
  | "charged_back";

export type PaymentMethod =
  | "pix"
  | "credit_card"
  | "debit_card"
  | "ticket"
  | "account_money"
  | "unknown";

export interface Payment {
  id: string;
  userId: string;
  subscriptionId: string | null;
  provider: PaymentProvider;
  externalId: string | null;
  preferenceId: string | null;
  externalReference: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  amountCents: number;
  currency: string;
  description: string | null;
  metadata?: Record<string, unknown>;
  billingPlanId?: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

import type { CheckoutPlanId } from "./plans";

export interface CheckoutRequest {
  paymentMethod: PaymentMethod;
  plan: CheckoutPlanId;
  /** Reservado para cupons — validação em fase futura */
  couponCode?: string;
}

export interface CheckoutResult {
  paymentId: string;
  externalReference: string;
  preferenceId: string | null;
  checkoutUrl: string;
  stub: boolean;
  message?: string;
}

export interface MercadoPagoWebhookPayload {
  action?: string;
  type?: string;
  data?: { id?: string };
  [key: string]: unknown;
}

export interface SubscriptionBillingData {
  membership: import("@/lib/club/types").ClubMembership;
  payments: Payment[];
  financialEvents: import("./services/financial-events.service").FinancialEvent[];
  nextRenewal: string | null;
  checkoutMode: "real" | "stub";
}
