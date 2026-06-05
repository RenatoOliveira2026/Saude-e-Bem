import { isMercadoPagoConfigured } from "../config";
import type { PaymentProviderAdapter } from "./types";

/** Adapter Mercado Pago — checkout em `mercadopago/checkout.ts`. */
export const mercadoPagoProvider: PaymentProviderAdapter = {
  id: "mercadopago",
  name: "Mercado Pago",
  isEnabled: isMercadoPagoConfigured(),
  supportsRecurring: true,
};
