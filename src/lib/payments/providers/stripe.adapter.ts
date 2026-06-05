import type { PaymentProviderAdapter } from "./types";

/**
 * Adapter Stripe — placeholder Fase 4.7.
 * Implementar `createCheckout` quando STRIPE_SECRET_KEY estiver configurada.
 */
export const stripeProvider: PaymentProviderAdapter = {
  id: "stripe",
  name: "Stripe",
  isEnabled: Boolean(process.env.STRIPE_SECRET_KEY),
  supportsRecurring: true,
};

export function createStripeCheckoutStub(planId: string): never {
  throw new Error(
    `Stripe checkout não implementado (plano ${planId}). Configure STRIPE_SECRET_KEY na Fase 5.`,
  );
}
