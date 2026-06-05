import { mercadoPagoProvider } from "./mercadopago.adapter";
import { stripeProvider } from "./stripe.adapter";
import type { PaymentProviderId, PaymentProviderRegistry } from "./types";

export type { PaymentProviderAdapter, PaymentProviderId, PaymentProviderRegistry } from "./types";
export { mercadoPagoProvider } from "./mercadopago.adapter";
export { stripeProvider, createStripeCheckoutStub } from "./stripe.adapter";

const PROVIDERS = [mercadoPagoProvider, stripeProvider] as const;

function resolveActiveProvider(): PaymentProviderId {
  const preferred = process.env.PAYMENTS_PROVIDER as PaymentProviderId | undefined;
  if (preferred === "stripe" && stripeProvider.isEnabled) return "stripe";
  if (preferred === "mercadopago" && mercadoPagoProvider.isEnabled) return "mercadopago";
  if (mercadoPagoProvider.isEnabled) return "mercadopago";
  if (stripeProvider.isEnabled) return "stripe";
  return "mercadopago";
}

export function getPaymentProviderRegistry(): PaymentProviderRegistry {
  return {
    activeProvider: resolveActiveProvider(),
    providers: [...PROVIDERS],
  };
}

export function getPaymentProvider(id: PaymentProviderId) {
  return PROVIDERS.find((p) => p.id === id) ?? mercadoPagoProvider;
}
