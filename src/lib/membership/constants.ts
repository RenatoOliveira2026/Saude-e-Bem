import type { MembershipPlanRecord, PlanComparisonRow } from "@/lib/membership/types";
import {
  FREE_PLAN,
  PREMIUM_ANNUAL_PLAN,
  PREMIUM_MONTHLY_PLAN,
  formatPlanPriceLabel,
} from "@/lib/payments/plans";

/** Fallback quando membership_plans ainda não está no Supabase. */
export const FALLBACK_MEMBERSHIP_PLANS: MembershipPlanRecord[] = [
  {
    id: "f0600006-0006-4006-8006-000000000001",
    name: FREE_PLAN.name,
    slug: "gratuito",
    description: FREE_PLAN.description,
    price: 0,
    billingCycle: "free",
    features: [
      "Blog e artigos gratuitos",
      "Protocolos públicos",
      "Ferramentas básicas",
      "Biblioteca digital gratuita",
      "Minha Jornada",
    ],
    isActive: true,
    createdAt: new Date(0).toISOString(),
  },
  {
    id: "f0600006-0006-4006-8006-000000000002",
    name: PREMIUM_MONTHLY_PLAN.name,
    slug: "premium-mensal",
    description: PREMIUM_MONTHLY_PLAN.description,
    price: PREMIUM_MONTHLY_PLAN.amountCents / 100,
    billingCycle: "monthly",
    features: [
      "Todos os protocolos premium",
      "Biblioteca ampliada",
      "Ferramentas avançadas",
      "Área de membros do Clube",
      "Suporte prioritário",
    ],
    isActive: true,
    createdAt: new Date(0).toISOString(),
  },
  {
    id: "f0600006-0006-4006-8006-000000000003",
    name: PREMIUM_ANNUAL_PLAN.name,
    slug: "premium-anual",
    description: PREMIUM_ANNUAL_PLAN.description,
    price: PREMIUM_ANNUAL_PLAN.amountCents / 100,
    billingCycle: "annual",
    features: [
      "Tudo do Premium Mensal",
      "Lives exclusivas gravadas",
      "Acesso antecipado a novidades",
      PREMIUM_ANNUAL_PLAN.savingsLabel ?? "Melhor custo-benefício",
    ],
    isActive: true,
    createdAt: new Date(0).toISOString(),
  },
];

export const CLUB_PLAN_COMPARISON: PlanComparisonRow[] = [
  { feature: "Blog e artigos", free: true, premium: true },
  { feature: "Protocolos públicos", free: true, premium: true },
  { feature: "Protocolos premium", free: false, premium: true },
  { feature: "Ferramentas básicas", free: true, premium: true },
  { feature: "Ferramentas avançadas", free: false, premium: true },
  { feature: "Biblioteca gratuita", free: true, premium: true },
  { feature: "Biblioteca premium", free: false, premium: true },
  { feature: "Área de membros do Clube", free: "Parcial", premium: true },
  { feature: "Suporte prioritário", free: false, premium: true },
  { feature: "Lives e masterclasses", free: false, premium: true },
];

export const FREE_PLAN_BENEFITS = [
  "Conteúdos educativos abertos no blog",
  "Protocolos e ferramentas gratuitas",
  "Biblioteca digital com materiais free",
  "Minha Jornada e perfil de saúde",
  "Newsletter e guias de captação",
];

export const PREMIUM_PLAN_BENEFITS = [
  "Protocolos avançados e exclusivos",
  "Ferramentas premium e trackers",
  "Biblioteca ampliada com e-books premium",
  "Dashboard completo na área de membros",
  "Suporte prioritário e comunidade",
];

export function formatMembershipPrice(plan: MembershipPlanRecord): string {
  if (plan.price <= 0) return "Grátis";
  const cycle =
    plan.billingCycle === "monthly"
      ? "mês"
      : plan.billingCycle === "annual"
        ? "ano"
        : plan.billingCycle === "quarterly"
          ? "trimestre"
          : "";
  return cycle
    ? `${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(plan.price)} / ${cycle}`
    : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
        plan.price,
      );
}

export function getAssinarHrefForPlan(slug: string): string | null {
  switch (slug) {
    case "premium-mensal":
      return "/assinar?plano=premium_monthly";
    case "premium-anual":
      return "/assinar?plano=premium_annual";
    default:
      return null;
  }
}

export { formatPlanPriceLabel };
