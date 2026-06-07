import type { ProfilePlan } from "./plan.types";

export const profilePlanLabels: Record<ProfilePlan, string> = {
  free: "Gratuito",
  premium_monthly: "Premium Mensal",
  premium_quarterly: "Premium Trimestral",
  premium_annual: "Premium Anual",
  admin: "Administrador",
};

export const profilePlanStatusLabels: Record<ProfilePlan, string> = {
  free: "Plano gratuito ativo",
  premium_monthly: "Assinatura mensal ativa",
  premium_quarterly: "Assinatura trimestral ativa",
  premium_annual: "Assinatura anual ativa",
  admin: "Acesso administrativo",
};
