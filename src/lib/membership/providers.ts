import type { MembershipPaymentProvider } from "@/lib/membership/types";

/** Provedores de cobrança suportados (Fase 6.0 — integração futura). */
export const MEMBERSHIP_PAYMENT_PROVIDERS: {
  id: MembershipPaymentProvider;
  label: string;
  status: "active" | "planned";
  description: string;
}[] = [
  {
    id: "mercadopago",
    label: "Mercado Pago",
    status: "active",
    description: "Checkout Pro e assinaturas — integração atual do projeto.",
  },
  {
    id: "hotmart",
    label: "Hotmart",
    status: "planned",
    description: "Webhook de assinaturas e produtos digitais.",
  },
  {
    id: "kiwify",
    label: "Kiwify",
    status: "planned",
    description: "Checkout e recorrência via API/webhook.",
  },
  {
    id: "stripe",
    label: "Stripe",
    status: "planned",
    description: "Billing internacional e Customer Portal.",
  },
];

export function getMembershipProviderLabel(
  provider: string | null | undefined,
): string {
  if (!provider) return "—";
  const match = MEMBERSHIP_PAYMENT_PROVIDERS.find((p) => p.id === provider);
  return match?.label ?? provider;
}

export function mapBillingPlanToMembershipSlug(
  billingPlanId: string | null | undefined,
): string | null {
  switch (billingPlanId) {
    case "premium_monthly":
      return "premium-mensal";
    case "premium_quarterly":
      return "premium-mensal";
    case "premium_annual":
      return "premium-anual";
    case "free":
      return "gratuito";
    default:
      return null;
  }
}
