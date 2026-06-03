import { getClubMembership } from "@/lib/club/access";
import { getSessionProfile } from "@/lib/auth/session";
import { fetchUserPayments } from "./services/payments.service";
import type { SubscriptionBillingData } from "./types";

export async function getSubscriptionBillingData(): Promise<SubscriptionBillingData> {
  const { user } = await getSessionProfile();
  const [membership, payments] = await Promise.all([
    getClubMembership(user.id),
    fetchUserPayments(user.id),
  ]);

  return {
    membership,
    payments,
    nextRenewal: membership.isPremium ? membership.expiresAt : null,
  };
}

export { createPremiumCheckout } from "./mercadopago/checkout";
export {
  processMercadoPagoWebhook,
  verifyMercadoPagoWebhookSignature,
  simulatePaymentApproval,
} from "./mercadopago/webhook";
export { fetchUserPayments } from "./services/payments.service";
export { activateSubscriptionFromPayment } from "./services/subscriptions.service";
