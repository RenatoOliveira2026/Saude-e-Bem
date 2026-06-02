import type { MembershipPlan, SubscriptionStatus } from "./types";

export const membershipPlanLabels: Record<MembershipPlan, string> = {
  free: "Gratuito",
  premium: "Premium",
};

export const subscriptionStatusLabels: Record<SubscriptionStatus | "none", string> = {
  active: "Ativa",
  trialing: "Período de teste",
  past_due: "Pagamento pendente",
  canceled: "Cancelada",
  expired: "Expirada",
  pending: "Pendente",
  none: "Sem assinatura",
};

export function formatSubscriptionDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
