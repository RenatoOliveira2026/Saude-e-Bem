import type { CheckoutRequest, CheckoutResult } from "../types";

export type PaymentProviderId = "mercadopago" | "stripe";

export interface PaymentProviderAdapter {
  id: PaymentProviderId;
  name: string;
  /** Provedor habilitado via env (sem cobrança real até Fase 5). */
  isEnabled: boolean;
  supportsRecurring: boolean;
  /** Checkout — implementação real na Fase 5. */
  createCheckout?: (input: CheckoutRequest & { userId: string }) => Promise<CheckoutResult>;
}

export interface PaymentProviderRegistry {
  activeProvider: PaymentProviderId;
  providers: PaymentProviderAdapter[];
}
