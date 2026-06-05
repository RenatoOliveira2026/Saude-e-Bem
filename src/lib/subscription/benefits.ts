import type { ProfilePlan } from "./plan.types";
import { isPremiumPlan } from "./is-premium-user";

export interface PremiumBenefit {
  id: string;
  title: string;
  description: string;
}

export const FREE_BENEFITS: PremiumBenefit[] = [
  {
    id: "tools",
    title: "Ferramentas gratuitas",
    description: "Calculadoras e avaliações interativas de saúde.",
  },
  {
    id: "library-free",
    title: "Biblioteca gratuita",
    description: "E-books, protocolos e vídeos abertos a todos.",
  },
  {
    id: "journey",
    title: "Minha Jornada",
    description: "Acompanhe favoritos e progresso na plataforma.",
  },
];

export const PREMIUM_BENEFITS: PremiumBenefit[] = [
  {
    id: "library-premium",
    title: "Biblioteca premium completa",
    description: "E-books, protocolos e vídeos exclusivos para assinantes.",
  },
  {
    id: "protocols",
    title: "Protocolos avançados",
    description: "Planos estruturados de longevidade, metabolismo e performance.",
  },
  {
    id: "club",
    title: "Clube Saúde & Bem",
    description: "Dashboard, recomendações, downloads e histórico de acesso.",
  },
  {
    id: "priority",
    title: "Novidades prioritárias",
    description: "Acesso antecipado a conteúdos e atualizações mensais.",
  },
];

export function getActiveBenefits(
  plan: ProfilePlan,
  isPremium: boolean,
): PremiumBenefit[] {
  if (plan === "admin" || isPremium) {
    return [...FREE_BENEFITS, ...PREMIUM_BENEFITS];
  }
  return FREE_BENEFITS;
}

export function hasPremiumBenefits(plan: ProfilePlan): boolean {
  return isPremiumPlan(plan);
}
