import type { IconName } from "@/components/icons";
import { routes } from "@/lib/routes";

export const premiumObjectives: {
  title: string;
  description: string;
  icon: IconName;
  href: string;
}[] = [
  {
    title: "Mais Energia",
    description: "Vitalidade estável e foco ao longo do dia.",
    icon: "bolt",
    href: routes.protocolos,
  },
  {
    title: "Dormir Melhor",
    description: "Sono reparador e ritmo circadiano equilibrado.",
    icon: "moon",
    href: routes.protocolos,
  },
  {
    title: "Emagrecimento Saudável",
    description: "Hábitos sustentáveis para composição corporal.",
    icon: "scale",
    href: routes.protocolos,
  },
  {
    title: "Saúde Mental",
    description: "Equilíbrio emocional e clareza mental.",
    icon: "brain",
    href: routes.blog,
  },
  {
    title: "Longevidade",
    description: "Envelhecer com qualidade e prevenção ativa.",
    icon: "sparkle",
    href: routes.blog,
  },
  {
    title: "Nutrição",
    description: "Guias e materiais para alimentação consciente.",
    icon: "leaf",
    href: routes.biblioteca,
  },
];

export const clubPremiumBenefits = [
  "Protocolos exclusivos",
  "Biblioteca premium",
  "Desafios mensais",
  "IA Saúde & Bem",
] as const;
