import { healthProfiles } from "@/lib/home-content";

export type HealthProfileId = "metabolico" | "energetico" | "longevidade" | "equilibrio";

export type QuizAnswer = "low" | "mid" | "high";

export interface QuizQuestion {
  id: string;
  label: string;
  hint?: string;
  options: { value: QuizAnswer; label: string }[];
  /** Perfil que ganha pontos por resposta */
  weights: Partial<Record<HealthProfileId, Record<QuizAnswer, number>>>;
}

export interface ProtocolRecommendation {
  categorySlug: string;
  categoryLabel: string;
}

export interface HealthQuizResult {
  profileId: HealthProfileId;
  profileTitle: string;
  profileDescription: string;
  profileIcon: string;
  traits: readonly string[];
  scores: Record<HealthProfileId, number>;
  protocolCategories: ProtocolRecommendation[];
  recommendations: string[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "sleep",
    label: "Como você avalia seu sono na última semana?",
    hint: "Qualidade, continuidade e sensação ao acordar.",
    options: [
      { value: "low", label: "Ruim — acordo cansado(a) com frequência" },
      { value: "mid", label: "Regular — oscila entre bons e maus dias" },
      { value: "high", label: "Bom — descanso consistente" },
    ],
    weights: {
      energetico: { low: 3, mid: 1, high: 0 },
      equilibrio: { low: 2, mid: 1, high: 0 },
      longevidade: { low: 1, mid: 0, high: 0 },
    },
  },
  {
    id: "nutrition",
    label: "Como está sua alimentação no dia a dia?",
    options: [
      { value: "low", label: "Muitos ultraprocessados e pouca variedade" },
      { value: "mid", label: "Mista — tento equilibrar, mas oscilo" },
      { value: "high", label: "Predominantemente in natura e equilibrada" },
    ],
    weights: {
      metabolico: { low: 3, mid: 1, high: 0 },
      longevidade: { low: 2, mid: 1, high: 0 },
    },
  },
  {
    id: "stress",
    label: "Como você percebe seu nível de estresse?",
    options: [
      { value: "low", label: "Alto — afeta sono, humor ou foco" },
      { value: "mid", label: "Moderado — gerenciável na maior parte do tempo" },
      { value: "high", label: "Baixo — sinto-me equilibrado(a)" },
    ],
    weights: {
      equilibrio: { low: 3, mid: 1, high: 0 },
      energetico: { low: 1, mid: 0, high: 0 },
    },
  },
  {
    id: "activity",
    label: "Qual sua frequência de atividade física?",
    options: [
      { value: "low", label: "Sedentário(a) — quase não me movimento" },
      { value: "mid", label: "1–2x por semana" },
      { value: "high", label: "3+ vezes por semana (inclui força ou cardio)" },
    ],
    weights: {
      metabolico: { low: 2, mid: 1, high: 0 },
      energetico: { low: 2, mid: 1, high: 0 },
      longevidade: { low: 1, mid: 1, high: 0 },
    },
  },
  {
    id: "goal",
    label: "Qual é seu objetivo principal agora?",
    options: [
      { value: "low", label: "Mais energia e foco no dia a dia" },
      { value: "mid", label: "Composição corporal e metabolismo" },
      { value: "high", label: "Longevidade, prevenção e vitalidade" },
    ],
    weights: {
      energetico: { low: 3, mid: 0, high: 0 },
      metabolico: { low: 0, mid: 3, high: 0 },
      longevidade: { low: 0, mid: 1, high: 3 },
      equilibrio: { low: 1, mid: 0, high: 0 },
    },
  },
];

const profileProtocolMap: Record<HealthProfileId, ProtocolRecommendation[]> = {
  metabolico: [
    { categorySlug: "alimentacao-saudavel", categoryLabel: "Alimentação Saudável" },
    { categorySlug: "exercicios", categoryLabel: "Exercícios" },
    { categorySlug: "bem-estar-geral", categoryLabel: "Bem-Estar Geral" },
  ],
  energetico: [
    { categorySlug: "sono", categoryLabel: "Sono" },
    { categorySlug: "exercicios", categoryLabel: "Exercícios" },
    { categorySlug: "controle-estresse", categoryLabel: "Controle de Estresse" },
  ],
  longevidade: [
    { categorySlug: "bem-estar-geral", categoryLabel: "Bem-Estar Geral" },
    { categorySlug: "alimentacao-saudavel", categoryLabel: "Alimentação Saudável" },
    { categorySlug: "exercicios", categoryLabel: "Exercícios" },
  ],
  equilibrio: [
    { categorySlug: "saude-mental", categoryLabel: "Saúde Mental" },
    { categorySlug: "controle-estresse", categoryLabel: "Controle de Estresse" },
    { categorySlug: "sono", categoryLabel: "Sono" },
  ],
};

const profileIds: HealthProfileId[] = [
  "metabolico",
  "energetico",
  "longevidade",
  "equilibrio",
];

export function evaluateHealthQuiz(
  answers: Record<string, QuizAnswer>,
): HealthQuizResult | { error: string } {
  for (const q of quizQuestions) {
    const a = answers[q.id];
    if (a !== "low" && a !== "mid" && a !== "high") {
      return { error: `Responda todas as perguntas (${q.label}).` };
    }
  }

  const scores: Record<HealthProfileId, number> = {
    metabolico: 0,
    energetico: 0,
    longevidade: 0,
    equilibrio: 0,
  };

  for (const q of quizQuestions) {
    const answer = answers[q.id]!;
    for (const profileId of profileIds) {
      const w = q.weights[profileId]?.[answer];
      if (w) scores[profileId] += w;
    }
  }

  let profileId: HealthProfileId = "longevidade";
  let top = -1;
  for (const id of profileIds) {
    if (scores[id] > top) {
      top = scores[id];
      profileId = id;
    }
  }
  if (top === 0) profileId = "longevidade";

  const profile = healthProfiles.find((p) => p.id === profileId)!;

  const recommendations = [
    `Seu perfil dominante é ${profile.title}: ${profile.description}`,
    "Explore protocolos nas categorias sugeridas abaixo — filtre por tema na biblioteca de protocolos.",
    "Refaça o quiz periodicamente para acompanhar mudanças de hábitos e prioridades.",
  ];

  return {
    profileId,
    profileTitle: profile.title,
    profileDescription: profile.description,
    profileIcon: profile.icon,
    traits: profile.traits,
    scores,
    protocolCategories: profileProtocolMap[profileId],
    recommendations,
  };
}

export function parseHealthQuizForm(data: FormData): Record<string, QuizAnswer> | { error: string } {
  const answers: Record<string, QuizAnswer> = {};
  for (const q of quizQuestions) {
    const v = data.get(q.id);
    if (v !== "low" && v !== "mid" && v !== "high") {
      return { error: `Responda: ${q.label}` };
    }
    answers[q.id] = v;
  }
  return answers;
}
