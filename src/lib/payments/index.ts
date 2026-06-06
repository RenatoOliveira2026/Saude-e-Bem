import { getClubMembership } from "@/lib/club/access";
import { getSessionProfile } from "@/lib/auth/session";
import { resolveNextRenewal } from "@/lib/subscription";
import { isRealCheckoutEnabled } from "./config";
import { fetchUserFinancialEvents } from "./services/financial-events.service";
import { fetchUserPayments } from "./services/payments.service";
import type { SubscriptionBillingData } from "./types";

export async function getSubscriptionBillingData(): Promise<SubscriptionBillingData> {
  const { user } = await getSessionProfile();
  const [membership, payments, financialEvents] = await Promise.all([
    getClubMembership(user.id),
    fetchUserPayments(user.id),
    fetchUserFinancialEvents(user.id),
  ]);

  return {
    membership,
    payments,
    financialEvents,
    nextRenewal: resolveNextRenewal(membership),
    checkoutMode: isRealCheckoutEnabled() ? "real" : "stub",
  };
}

export { createPremiumCheckout } from "./mercadopago/checkout";
export {
  processMercadoPagoWebhook,
  verifyMercadoPagoWebhookSignature,
  simulatePaymentApproval,
  syncPaymentByReference,
} from "./mercadopago/webhook";
export { expireDueSubscriptions } from "./services/subscription-lifecycle.service";
export { cancelUserSubscription } from "./services/subscriptions.service";
export { fetchUserPayments } from "./services/payments.service";
export { activateSubscriptionFromPayment } from "./services/subscriptions.service";
export { getPaymentsConfigSummary } from "./config";
export { getPaymentProvider, getPaymentProviderRegistry } from "./providers";
