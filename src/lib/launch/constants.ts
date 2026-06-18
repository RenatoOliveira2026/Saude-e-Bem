import { routes } from "@/lib/routes";
import type { IconName } from "@/components/icons";

export const LAUNCH_BENEFITS: {
  icon: IconName;
  title: string;
  description: string;
}[] = [
  {
    icon: "vitality",
    title: "Conteúdo baseado em evidências",
    description:
      "Artigos, protocolos e materiais curados por especialistas — sem promessas vazias.",
  },
  {
    icon: "sparkle",
    title: "Protocolos práticos",
    description:
      "Rotinas estruturadas para sono, energia, nutrição e bem-estar em passos claros.",
  },
  {
    icon: "library",
    title: "Biblioteca inteligente",
    description:
      "E-books, vídeos e guias gratuitos e premium para evoluir no seu ritmo.",
  },
  {
    icon: "community",
    title: "Clube Premium",
    description:
      "Comunidade, ferramentas avançadas e acompanhamento contínuo para quem quer ir além.",
  },
  {
    icon: "chart",
    title: "Perfil de vitalidade",
    description:
      "Avaliação personalizada e recomendações alinhadas aos seus objetivos de saúde.",
  },
  {
    icon: "star",
    title: "Curadoria de produtos",
    description:
      "Marketplace com ofertas selecionadas e transparência em recomendações afiliadas.",
  },
];

export const LAUNCH_LEAD_MAGNETS = [
  {
    title: "Guia 30 Dias",
    description:
      "10 hábitos práticos para melhorar saúde, energia e bem-estar em um mês — passo a passo.",
    href: routes.guia30Dias,
    cta: "Baixar guia gratuito",
    icon: "book" as const,
  },
  {
    title: "Checklist de Hábitos Saudáveis",
    description:
      "Lista objetiva para revisar sua rotina diária e identificar quick wins imediatos.",
    href: routes.checklistHabitos,
    cta: "Baixar checklist",
    icon: "checklist" as const,
  },
  {
    title: "Avaliação de Perfil de Vitalidade",
    description:
      "Descubra seu perfil e receba recomendações personalizadas de conteúdos e protocolos.",
    href: routes.minhaSaude,
    cta: "Fazer avaliação",
    icon: "vitality" as const,
  },
] as const;
