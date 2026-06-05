import type { Protocol } from "./protocol.types";

export const INTELLIGENT_PROTOCOL_CATALOG: Protocol[] = [
  {
    id: "emagrecimento-inteligente",
    slug: "emagrecimento-inteligente",
    title: "Emagrecimento Inteligente",
    description:
      "Plano estruturado de composição corporal com nutrição, movimento e hábitos sustentáveis — sem extremos.",
    categoryLabel: "Composição corporal",
    duration: "21 dias",
    level: "Iniciante",
    platformSlug: "detox-natural",
    focusSignals: ["bmi", "metabolism", "cardiometabolic", "quiz"],
    isPremium: false,
  },
  {
    id: "saude-cardiovascular",
    slug: "saude-cardiovascular",
    title: "Saúde Cardiovascular",
    description:
      "Prevenção cardiometabólica com foco em marcadores de risco, alimentação anti-inflamatória e condicionamento.",
    categoryLabel: "Cardiovascular",
    duration: "30 dias",
    level: "Intermediário",
    platformSlug: "longevidade-saudavel",
    focusSignals: ["cardiometabolic", "bmi", "quiz"],
    isPremium: true,
  },
  {
    id: "hidratacao-inteligente",
    slug: "hidratacao-inteligente",
    title: "Hidratação Inteligente",
    description:
      "Rotina personalizada de hidratação ao longo do dia, alinhada ao seu peso, clima e nível de atividade.",
    categoryLabel: "Hidratação",
    duration: "14 dias",
    level: "Iniciante",
    platformSlug: "energia-diaria",
    focusSignals: ["water", "metabolism"],
    isPremium: false,
  },
  {
    id: "longevidade-ativa",
    slug: "longevidade-ativa",
    title: "Longevidade Ativa",
    description:
      "Hábitos de longevidade baseados em evidências: nutrição, movimento, sono e gestão do estresse.",
    categoryLabel: "Longevidade",
    duration: "90 dias",
    level: "Avançado",
    platformSlug: "longevidade-saudavel",
    focusSignals: ["quiz", "cardiometabolic"],
    isPremium: true,
  },
  {
    id: "preservacao-massa-muscular",
    slug: "preservacao-massa-muscular",
    title: "Preservação de Massa Muscular",
    description:
      "Estratégia de proteína, treino e recuperação para manter ou ganhar massa magra com segurança.",
    categoryLabel: "Nutrição & força",
    duration: "28 dias",
    level: "Intermediário",
    platformSlug: "energia-diaria",
    focusSignals: ["protein", "metabolism", "bmi", "quiz"],
    isPremium: false,
  },
  {
    id: "habitos-saudaveis-essenciais",
    slug: "habitos-saudaveis-essenciais",
    title: "Hábitos Saudáveis Essenciais",
    description:
      "Fundamentos diários de sono, alimentação, movimento e equilíbrio emocional para consistência.",
    categoryLabel: "Bem-estar",
    duration: "14 dias",
    level: "Iniciante",
    platformSlug: "sono-reparador",
    focusSignals: ["quiz", "water", "bmi"],
    isPremium: false,
  },
];

export function getProtocolById(id: Protocol["id"]): Protocol | undefined {
  return INTELLIGENT_PROTOCOL_CATALOG.find((p) => p.id === id);
}
