import { withBase } from "./base";
import type { Protocol } from "./types";

export { protocolLibraryFilterCategories as protocolCategories } from "@/lib/protocol-library/constants";

const rawProtocols: Omit<Protocol, "status" | "createdAt" | "updatedAt">[] = [
  {
    id: "1",
    slug: "energia-diaria",
    title: "Energia Diária",
    description:
      "Rotina matinal e hábitos diários para vitalidade consistente, sem depender de estimulantes artificiais.",
    objective: "Manter energia estável e foco ao longo de todo o dia.",
    longDescription:
      "Protocolo de 14 dias que reorganiza seu ritmo circadiano, alimentação matinal e micro-hábitos para energia sustentável baseada em ciência.",
    category: "energia",
    categoryLabel: "Energia",
    duration: "14 dias",
    level: "Iniciante",
    benefits: ["Foco prolongado", "Menos fadiga vespertina", "Sono mais reparador"],
    steps: [
      { title: "Dias 1–5", description: "Exposição solar matinal e hidratação estratégica." },
      { title: "Dias 6–10", description: "Alimentação energizante e movimento leve." },
      { title: "Dias 11–14", description: "Rotina consolidada personalizada." },
    ],
    isPremium: false,
    featured: true,
    tag: "Mais popular",
    participants: 3240,
  },
  {
    id: "2",
    slug: "sono-reparador",
    title: "Sono Reparador",
    description:
      "Resete seu ritmo circadiano com higiene do sono baseada em evidências científicas.",
    objective: "Dormir mais rápido, profundamente e acordar com disposição.",
    longDescription:
      "Em 7 dias, você implementará rotinas noturnas, otimização do ambiente e estratégias comportamentais para noites restauradoras.",
    category: "sono",
    categoryLabel: "Sono",
    duration: "7 dias",
    level: "Iniciante",
    benefits: ["Latência reduzida", "Mais energia matinal", "Humor equilibrado"],
    steps: [
      { title: "Dia 1–2", description: "Mapeamento do ritmo e horários fixos." },
      { title: "Dia 3–4", description: "Ambiente e redução de luz azul." },
      { title: "Dia 5–7", description: "Rotina noturna consolidada." },
    ],
    isPremium: false,
    participants: 4120,
  },
  {
    id: "3",
    slug: "saude-intestinal",
    title: "Saúde Intestinal",
    description:
      "Restaure o equilíbrio da microbiota com alimentação funcional e hábitos de lifestyle.",
    objective: "Melhorar digestão, absorção de nutrientes e bem-estar intestinal.",
    longDescription:
      "Protocolo de 21 dias focado em fibras prebióticas, probióticos naturais, redução de inflamação intestinal e reconexão intestino-cérebro.",
    category: "intestinal",
    categoryLabel: "Saúde Intestinal",
    duration: "21 dias",
    level: "Intermediário",
    benefits: ["Digestão otimizada", "Menos inchaço", "Imunidade fortalecida"],
    steps: [
      { title: "Semana 1", description: "Eliminação de provocadores intestinais." },
      { title: "Semana 2", description: "Introdução de alimentos funcionais." },
      { title: "Semana 3", description: "Consolidação e personalização." },
    ],
    isPremium: false,
    participants: 2890,
  },
  {
    id: "4",
    slug: "detox-natural",
    title: "Detox Natural",
    description:
      "Desintoxicação gentil e sustentável — sem dietas restritivas ou promessas milagrosas.",
    objective: "Apoiar funções naturais de detoxificação do fígado e eliminação de toxinas.",
    longDescription:
      "Plano de 10 dias com alimentos detoxificantes, hidratação, movimento e sono para apoiar os processos naturais do corpo.",
    category: "detox",
    categoryLabel: "Detox",
    duration: "10 dias",
    level: "Iniciante",
    benefits: ["Mais leveza", "Pele radiante", "Clareza mental"],
    steps: [
      { title: "Dias 1–3", description: "Hidratação e alimentos crucíferos." },
      { title: "Dias 4–7", description: "Suporte hepático e eliminação." },
      { title: "Dias 8–10", description: "Reintrodução consciente." },
    ],
    isPremium: false,
    participants: 1950,
  },
  {
    id: "5",
    slug: "longevidade-saudavel",
    title: "Longevidade Saudável",
    description:
      "Os pilares comprovados da ciência para envelhecer com qualidade, vitalidade e independência.",
    objective: "Implementar hábitos de longevidade baseados em evidências científicas.",
    longDescription:
      "Protocolo integrado de 90 dias cobrindo nutrição, movimento, sono, gestão do estresse e biomarcadores de envelhecimento saudável.",
    category: "longevidade",
    categoryLabel: "Longevidade",
    duration: "90 dias",
    level: "Avançado",
    benefits: ["Marcadores otimizados", "Mais energia", "Resiliência biológica"],
    steps: [
      { title: "Fase 1", description: "Baseline e avaliação de biomarcadores." },
      { title: "Fase 2", description: "Implementação dos 5 pilares." },
      { title: "Fase 3", description: "Otimização e manutenção." },
    ],
    isPremium: true,
    tag: "Premium",
    participants: 870,
  },
  {
    id: "6",
    slug: "menopausa-saudavel",
    title: "Menopausa Saudável",
    description:
      "Acompanhamento integrado para equilíbrio hormonal, energia e bem-estar na maturidade feminina.",
    objective: "Navegar a menopausa com vitalidade, clareza e qualidade de vida.",
    longDescription:
      "Protocolo de 30 dias com foco em nutrição hormonal, movimento adaptado, gestão de sintomas e saúde óssea e cardiovascular.",
    category: "menopausa",
    categoryLabel: "Menopausa",
    duration: "30 dias",
    level: "Intermediário",
    benefits: ["Equilíbrio hormonal", "Ossos fortes", "Energia estável"],
    steps: [
      { title: "Semana 1", description: "Mapeamento de sintomas e alimentação base." },
      { title: "Semana 2", description: "Movimento e suplementação estratégica." },
      { title: "Semanas 3–4", description: "Consolidação e acompanhamento." },
    ],
    isPremium: true,
    participants: 640,
  },
];

export const protocols: Protocol[] = rawProtocols.map((p) => withBase(p));
export const featuredProtocol = protocols.find((p) => p.featured)!;
