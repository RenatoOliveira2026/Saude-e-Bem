import type { PaymentMethod, PaymentStatus } from "./types";

export {
  FREE_PLAN,
  PREMIUM_ANNUAL_PLAN,
  PREMIUM_MONTHLY_PLAN,
  ASSINAR_PLANS,
  CHECKOUT_PLANS,
  formatPlanAmount,
  formatPlanPriceLabel,
  getCheckoutPlan,
  getPlanById,
  isCheckoutPlanId,
} from "./plans";

/** @deprecated Use PREMIUM_MONTHLY_PLAN de ./plans */
export { PREMIUM_MONTHLY_PLAN as PREMIUM_PLAN } from "./plans";

export const paymentMethodOptions: Array<{
  id: PaymentMethod;
  label: string;
  description: string;
  mercadoPagoType: string;
}> = [
  {
    id: "pix",
    label: "PIX",
    description:
      "Pagamento único. Libera o Premium por 30 dias (mensal) ou 365 dias (anual).",
    mercadoPagoType: "bank_transfer",
  },
  {
    id: "credit_card",
    label: "Cartão de crédito",
    description: "Visa, Mastercard, Elo e outros.",
    mercadoPagoType: "credit_card",
  },
  {
    id: "ticket",
    label: "Boleto",
    description:
      "Pagamento único. Compensação em até 3 dias úteis; acesso por 30 ou 365 dias.",
    mercadoPagoType: "ticket",
  },
];

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: "Pendente",
  approved: "Aprovado",
  authorized: "Autorizado",
  in_process: "Em processamento",
  in_mediation: "Em mediação",
  rejected: "Recusado",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
  charged_back: "Chargeback",
};

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  pix: "PIX",
  credit_card: "Cartão de crédito",
  debit_card: "Cartão de débito",
  ticket: "Boleto",
  account_money: "Saldo Mercado Pago",
  unknown: "Outro",
};

export function formatPaymentAmount(amountCents: number, currency = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(amountCents / 100);
}
