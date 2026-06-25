import type { IconName } from "@/components/icons";
import type { ContentObjective, IntelligentContentType } from "@/lib/content/intelligence";
import { TRAIL_OBJECTIVE_ICONS } from "@/lib/content/intelligence";

export interface PremiumTrailStep {
  id: string;
  type: IntelligentContentType;
  slug: string;
  label: string;
  description?: string;
  isPremium?: boolean;
}

export interface PremiumTrail {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  durationLabel: string;
  objective: ContentObjective;
  icon: IconName;
  isPremium: boolean;
  steps: PremiumTrailStep[];
}

/** Trilhas Premium organizadas por objetivo (Fase 9.4). */
export const PREMIUM_TRAILS: PremiumTrail[] = [
  {
    id: "dormir-melhor",
    slug: "dormir-melhor",
    title: "Dormir Melhor",
    subtitle: "Rotina de 7 dias para sono reparador",
    durationLabel: "7 dias",
    objective: "sono",
    icon: TRAIL_OBJECTIVE_ICONS.sono,
    isPremium: true,
    steps: [
      {
        id: "dm-1",
        type: "article",
        slug: "dormir-melhor-sem-medicamentos",
        label: "Dormir melhor sem medicamentos",
        isPremium: false,
      },
      {
        id: "dm-2",
        type: "protocol",
        slug: "sono-reparador",
        label: "Protocolo Sono Reparador",
        isPremium: false,
      },
      {
        id: "dm-3",
        type: "library",
        slug: "sono-reparador-ebook",
        label: "E-book Sono Reparador",
        isPremium: false,
      },
      {
        id: "dm-4",
        type: "checklist",
        slug: "checklist-habitos",
        label: "Checklist de hábitos noturnos",
        isPremium: false,
      },
      {
        id: "dm-5",
        type: "protocol",
        slug: "sono-restaurador",
        label: "Protocolo Premium Sono Restaurador",
        description: "21 dias — aprofundamento",
        isPremium: true,
      },
    ],
  },
  {
    id: "reducao-ansiedade",
    slug: "reducao-ansiedade",
    title: "Redução da Ansiedade",
    subtitle: "Ferramentas práticas em 21 dias",
    durationLabel: "21 dias",
    objective: "ansiedade",
    icon: TRAIL_OBJECTIVE_ICONS.ansiedade,
    isPremium: true,
    steps: [
      {
        id: "ra-1",
        type: "article",
        slug: "controle-ansiedade",
        label: "Controle da ansiedade",
      },
      {
        id: "ra-2",
        type: "article",
        slug: "tecnicas-respiracao",
        label: "Técnicas de respiração",
      },
      {
        id: "ra-3",
        type: "protocol",
        slug: "reducao-estresse",
        label: "Protocolo Redução do Estresse",
        isPremium: true,
      },
      {
        id: "ra-4",
        type: "article",
        slug: "saude-mental-rotina",
        label: "Saúde mental na rotina",
      },
      {
        id: "ra-5",
        type: "library",
        slug: "sono-restaurador",
        label: "Sono como aliado da calma",
        isPremium: true,
      },
    ],
  },
  {
    id: "alimentacao-saudavel",
    slug: "alimentacao-saudavel",
    title: "Alimentação Saudável",
    subtitle: "Base nutricional em 30 dias",
    durationLabel: "30 dias",
    objective: "alimentacao",
    icon: TRAIL_OBJECTIVE_ICONS.alimentacao,
    isPremium: true,
    steps: [
      {
        id: "as-1",
        type: "article",
        slug: "alimentacao-saudavel-iniciantes",
        label: "Alimentação saudável para iniciantes",
      },
      {
        id: "as-2",
        type: "article",
        slug: "saude-intestinal-bem-estar",
        label: "Saúde intestinal e bem-estar",
      },
      {
        id: "as-3",
        type: "protocol",
        slug: "saude-intestinal-premium",
        label: "Protocolo Saúde Intestinal",
        isPremium: true,
      },
      {
        id: "as-4",
        type: "protocol",
        slug: "habitos-saudaveis-30-dias",
        label: "Desafio 30 dias — Hábitos Saudáveis",
        isPremium: true,
      },
      {
        id: "as-5",
        type: "library",
        slug: "guia-hidratacao",
        label: "Guia de hidratação inteligente",
      },
    ],
  },
  {
    id: "emagrecimento-inteligente",
    slug: "emagrecimento-inteligente",
    title: "Emagrecimento Inteligente",
    subtitle: "Perda de gordura sustentável",
    durationLabel: "28 dias",
    objective: "emagrecimento",
    icon: TRAIL_OBJECTIVE_ICONS.emagrecimento,
    isPremium: true,
    steps: [
      {
        id: "ei-1",
        type: "article",
        slug: "emagrecimento-sustentavel",
        label: "Emagrecimento sustentável",
      },
      {
        id: "ei-2",
        type: "protocol",
        slug: "emagrecimento-saudavel",
        label: "Protocolo Emagrecimento Saudável",
        isPremium: true,
      },
      {
        id: "ei-3",
        type: "library",
        slug: "guia-emagrecimento-metabolico",
        label: "Guia Emagrecimento Metabólico",
        isPremium: true,
      },
      {
        id: "ei-4",
        type: "article",
        slug: "alongamento-diario",
        label: "Alongamento diário",
      },
      {
        id: "ei-5",
        type: "protocol",
        slug: "mobilidade-alongamento",
        label: "Mobilidade e Alongamento",
        isPremium: true,
      },
    ],
  },
  {
    id: "saude-feminina",
    slug: "saude-feminina",
    title: "Saúde Feminina",
    subtitle: "Equilíbrio hormonal e vitalidade",
    durationLabel: "21 dias",
    objective: "saude-feminina",
    icon: TRAIL_OBJECTIVE_ICONS["saude-feminina"],
    isPremium: true,
    steps: [
      {
        id: "sf-1",
        type: "protocol",
        slug: "menopausa-saudavel",
        label: "Protocolo Menopausa Saudável",
      },
      {
        id: "sf-2",
        type: "article",
        slug: "magnesio-qualidade-sono",
        label: "Magnésio e qualidade do sono",
      },
      {
        id: "sf-3",
        type: "protocol",
        slug: "sono-restaurador",
        label: "Sono Restaurador",
        isPremium: true,
      },
      {
        id: "sf-4",
        type: "library",
        slug: "coracao-saudavel",
        label: "Guia Coração Saudável",
        isPremium: true,
      },
      {
        id: "sf-5",
        type: "article",
        slug: "como-melhorar-imunidade",
        label: "Como melhorar a imunidade",
      },
    ],
  },
  {
    id: "saude-masculina",
    slug: "saude-masculina",
    title: "Saúde Masculina",
    subtitle: "Energia, foco e performance",
    durationLabel: "14 dias",
    objective: "saude-masculina",
    icon: TRAIL_OBJECTIVE_ICONS["saude-masculina"],
    isPremium: true,
    steps: [
      {
        id: "sm-1",
        type: "article",
        slug: "como-aumentar-energia-naturalmente",
        label: "Aumentar energia naturalmente",
      },
      {
        id: "sm-2",
        type: "protocol",
        slug: "energia-diaria-premium",
        label: "Protocolo Energia Diária",
        isPremium: true,
      },
      {
        id: "sm-3",
        type: "protocol",
        slug: "foco-produtividade",
        label: "Foco e Produtividade",
        isPremium: true,
      },
      {
        id: "sm-4",
        type: "article",
        slug: "exercicios-para-iniciantes",
        label: "Exercícios para iniciantes",
      },
      {
        id: "sm-5",
        type: "protocol",
        slug: "mobilidade-alongamento",
        label: "Mobilidade e Alongamento",
        isPremium: true,
      },
    ],
  },
  {
    id: "longevidade",
    slug: "longevidade",
    title: "Longevidade",
    subtitle: "Pilares do envelhecimento saudável",
    durationLabel: "90 dias",
    objective: "longevidade",
    icon: TRAIL_OBJECTIVE_ICONS.longevidade,
    isPremium: true,
    steps: [
      {
        id: "lo-1",
        type: "article",
        slug: "longevidade-qualidade-vida",
        label: "Longevidade e qualidade de vida",
      },
      {
        id: "lo-2",
        type: "library",
        slug: "manual-longevidade",
        label: "Manual de Longevidade",
        isPremium: true,
      },
      {
        id: "lo-3",
        type: "protocol",
        slug: "longevidade-premium",
        label: "Protocolo Longevidade",
        isPremium: true,
      },
      {
        id: "lo-4",
        type: "article",
        slug: "pilares-longevidade-2026",
        label: "Pilares da longevidade",
      },
      {
        id: "lo-5",
        type: "library",
        slug: "checklist-saude-preventiva",
        label: "Checklist saúde preventiva",
      },
    ],
  },
  {
    id: "energia-disposicao",
    slug: "energia-disposicao",
    title: "Energia e Disposição",
    subtitle: "Vitalidade estável ao longo do dia",
    durationLabel: "14 dias",
    objective: "energia",
    icon: TRAIL_OBJECTIVE_ICONS.energia,
    isPremium: true,
    steps: [
      {
        id: "ed-1",
        type: "article",
        slug: "habitos-matinais-saudaveis",
        label: "Hábitos matinais saudáveis",
      },
      {
        id: "ed-2",
        type: "protocol",
        slug: "energia-diaria",
        label: "Protocolo Energia Diária (gratuito)",
      },
      {
        id: "ed-3",
        type: "protocol",
        slug: "energia-diaria-premium",
        label: "Energia Diária Premium",
        isPremium: true,
      },
      {
        id: "ed-4",
        type: "library",
        slug: "guia-hidratacao",
        label: "Guia de hidratação",
      },
      {
        id: "ed-5",
        type: "protocol",
        slug: "hidratacao-inteligente",
        label: "Hidratação Inteligente",
        isPremium: true,
      },
    ],
  },
];

export function getPremiumTrailBySlug(slug: string): PremiumTrail | undefined {
  return PREMIUM_TRAILS.find((t) => t.slug === slug);
}

export function getTrailsForObjective(
  objective: ContentObjective,
): PremiumTrail[] {
  return PREMIUM_TRAILS.filter((t) => t.objective === objective);
}
