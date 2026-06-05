import {
  SAVABLE_TOOL_SLUGS,
  type SavableToolSlug,
} from "@/lib/health-profile/constants";
import type { UserToolResultRecord } from "@/lib/health-profile/types";
import { calculateHealthScore } from "@/lib/recommendations/health-score";
import { routes } from "@/lib/routes";
import { INTELLIGENT_PROTOCOL_CATALOG } from "./protocol-catalog";
import type {
  Protocol,
  ProtocolMatchScore,
  RecommendedIntelligentProtocol,
} from "./protocol.types";

const MIN_MATCH_SCORE = 12;
const MAX_RECOMMENDATIONS = 3;

function latestBySlug(
  records: UserToolResultRecord[],
): Partial<Record<SavableToolSlug, Record<string, unknown>>> {
  const map: Partial<Record<SavableToolSlug, UserToolResultRecord>> = {};

  for (const record of records) {
    if (!(SAVABLE_TOOL_SLUGS as readonly string[]).includes(record.toolSlug)) {
      continue;
    }
    const slug = record.toolSlug as SavableToolSlug;
    const existing = map[slug];
    if (!existing || record.createdAt > existing.createdAt) {
      map[slug] = record;
    }
  }

  const out: Partial<Record<SavableToolSlug, Record<string, unknown>>> = {};
  for (const slug of SAVABLE_TOOL_SLUGS) {
    if (map[slug]) out[slug] = map[slug]!.resultJson;
  }
  return out;
}

function sumQuizDistress(scores: Record<string, unknown>): number {
  return Object.values(scores).reduce<number>(
    (sum, v) => sum + (typeof v === "number" ? v : 0),
    0,
  );
}

function scoreEmagrecimento(
  data: Partial<Record<SavableToolSlug, Record<string, unknown>>>,
): ProtocolMatchScore | null {
  let score = 0;
  const reasons: string[] = [];

  const bmi = data["calculadora-imc"];
  const category = bmi?.category;
  if (
    category === "overweight" ||
    category === "obese1" ||
    category === "obese2" ||
    category === "obese3"
  ) {
    score += 38;
    reasons.push("IMC acima da faixa ideal");
  }

  const cardio = data["risco-cardiometabolico"];
  const level = cardio?.level;
  if (level === "moderate" || level === "elevated" || level === "high") {
    score += level === "high" ? 28 : 18;
    reasons.push("Risco cardiometabólico requer atenção");
  }

  const quiz = data["quiz-saude-bem"];
  if (quiz?.profileId === "metabolico") {
    score += 16;
    reasons.push("Perfil metabólico no quiz");
  }

  if (data["metabolismo-basal"]) {
    score += 8;
    reasons.push("Gasto energético mapeado");
  }

  if (score === 0) return null;
  return {
    protocol: INTELLIGENT_PROTOCOL_CATALOG[0],
    score,
    reason: reasons.join(" · "),
  };
}

function scoreCardiovascular(
  data: Partial<Record<SavableToolSlug, Record<string, unknown>>>,
): ProtocolMatchScore | null {
  let score = 0;
  const reasons: string[] = [];

  const cardio = data["risco-cardiometabolico"];
  const level = cardio?.level;
  if (level === "elevated" || level === "high") {
    score += 42;
    reasons.push("Triagem com risco cardiometabólico elevado");
  } else if (level === "moderate") {
    score += 28;
    reasons.push("Risco cardiometabólico moderado");
  }

  const bmi = data["calculadora-imc"];
  if (
    bmi?.category === "obese1" ||
    bmi?.category === "obese2" ||
    bmi?.category === "obese3"
  ) {
    score += 18;
    reasons.push("IMC na faixa de obesidade");
  }

  if (score === 0) return null;
  return {
    protocol: INTELLIGENT_PROTOCOL_CATALOG[1],
    score,
    reason: reasons.join(" · "),
  };
}

function scoreHidratacao(
  data: Partial<Record<SavableToolSlug, Record<string, unknown>>>,
): ProtocolMatchScore | null {
  const water = data["consumo-agua"];
  if (!water) return null;

  let score = 0;
  const reasons: string[] = [];
  const liters = water.litersPerDay;

  if (typeof liters === "number") {
    if (liters < 1.5) {
      score += 40;
      reasons.push("Meta de água abaixo do mínimo orientativo");
    } else if (liters > 5) {
      score += 22;
      reasons.push("Meta de hidratação acima do usual — revisar hábitos");
    } else {
      score += 14;
      reasons.push("Consolidar rotina de hidratação personalizada");
    }
  }

  if (data["metabolismo-basal"]) {
    score += 10;
    reasons.push("Ajuste hídrico alinhado ao gasto energético");
  }

  return {
    protocol: INTELLIGENT_PROTOCOL_CATALOG[2],
    score,
    reason: reasons.join(" · "),
  };
}

function scoreLongevidade(
  data: Partial<Record<SavableToolSlug, Record<string, unknown>>>,
): ProtocolMatchScore | null {
  let score = 0;
  const reasons: string[] = [];

  const quiz = data["quiz-saude-bem"];
  if (quiz?.profileId === "longevidade") {
    score += 40;
    reasons.push("Perfil Longevidade no quiz");
  } else if (quiz?.profileId === "equilibrio") {
    score += 18;
    reasons.push("Perfil equilíbrio — foco preventivo");
  }

  const scores =
    quiz?.scores && typeof quiz.scores === "object" && !Array.isArray(quiz.scores)
      ? (quiz.scores as Record<string, unknown>)
      : null;
  if (scores) {
    const distress = sumQuizDistress(scores);
    if (distress <= 8) {
      score += 12;
      reasons.push("Hábitos favoráveis à longevidade");
    }
  }

  const cardio = data["risco-cardiometabolico"];
  if (cardio?.level === "low") {
    score += 10;
    reasons.push("Baixo risco cardiometabólico — otimização avançada");
  }

  if (score === 0) return null;
  return {
    protocol: INTELLIGENT_PROTOCOL_CATALOG[3],
    score,
    reason: reasons.join(" · "),
  };
}

function scoreMassaMuscular(
  data: Partial<Record<SavableToolSlug, Record<string, unknown>>>,
): ProtocolMatchScore | null {
  let score = 0;
  const reasons: string[] = [];

  const protein = data["proteina-diaria"];
  const gramsPerKg = protein?.gramsPerKg;
  if (typeof gramsPerKg === "number") {
    if (gramsPerKg < 1.2) {
      score += 36;
      reasons.push("Ingestão proteica abaixo do mínimo");
    } else if (gramsPerKg < 1.6) {
      score += 22;
      reasons.push("Proteína adequada, mas abaixo do ideal para massa magra");
    } else {
      score += 12;
      reasons.push("Manter estratégia proteica atual");
    }
  }

  const bmi = data["calculadora-imc"];
  if (bmi?.category === "underweight") {
    score += 24;
    reasons.push("IMC abaixo do ideal — suporte nutricional");
  }

  if (quizProfileIs(data, "metabolico")) {
    score += 14;
    reasons.push("Perfil metabólico no quiz");
  }

  if (data["metabolismo-basal"]) {
    score += 8;
    reasons.push("Calibrar proteína ao gasto energético");
  }

  if (score === 0) return null;
  return {
    protocol: INTELLIGENT_PROTOCOL_CATALOG[4],
    score,
    reason: reasons.join(" · "),
  };
}

function scoreHabitos(
  data: Partial<Record<SavableToolSlug, Record<string, unknown>>>,
  healthScorePercentage: number,
): ProtocolMatchScore {
  let score = 8;
  const reasons: string[] = ["Base de hábitos para evolução contínua"];

  const quiz = data["quiz-saude-bem"];
  const scores =
    quiz?.scores && typeof quiz.scores === "object" && !Array.isArray(quiz.scores)
      ? (quiz.scores as Record<string, unknown>)
      : null;

  if (scores) {
    const distress = sumQuizDistress(scores);
    if (distress >= 14) {
      score += 34;
      reasons.push("Quiz indica oportunidades em sono, estresse ou rotina");
    } else if (distress >= 10) {
      score += 20;
      reasons.push("Hábitos do quiz pedem refinamento");
    }
  }

  if (quiz?.profileId === "equilibrio" || quiz?.profileId === "energetico") {
    score += 16;
    reasons.push(`Perfil ${quiz.profileTitle ?? "de bem-estar"} no quiz`);
  }

  if (healthScorePercentage < 50) {
    score += 12;
    reasons.push("Score geral abaixo de 50 — reforço de fundamentos");
  }

  if (!data["consumo-agua"]) {
    score += 10;
    reasons.push("Hidratação ainda não mapeada");
  }

  return {
    protocol: INTELLIGENT_PROTOCOL_CATALOG[5],
    score,
    reason: reasons.join(" · "),
  };
}

function quizProfileIs(
  data: Partial<Record<SavableToolSlug, Record<string, unknown>>>,
  profileId: string,
): boolean {
  return data["quiz-saude-bem"]?.profileId === profileId;
}

function toRecommendation(
  match: ProtocolMatchScore,
  priority: number,
): RecommendedIntelligentProtocol {
  const { protocol } = match;
  return {
    protocolSlug: protocol.slug,
    protocolTitle: protocol.title,
    categoryLabel: protocol.categoryLabel,
    description: protocol.description,
    reason: match.reason,
    href: routes.protocolo(protocol.platformSlug),
    isPremium: protocol.isPremium,
    priority,
    matchScore: match.score,
    relatedSignals: protocol.focusSignals,
  };
}

/**
 * Motor Fase 4.5 — recomenda 1 a 3 protocolos com base em user_tool_results.
 */
export function recommendIntelligentProtocols(
  records: UserToolResultRecord[],
): RecommendedIntelligentProtocol[] {
  const data = latestBySlug(records);
  const healthScore = calculateHealthScore(records);

  const matches = [
    scoreEmagrecimento(data),
    scoreCardiovascular(data),
    scoreHidratacao(data),
    scoreLongevidade(data),
    scoreMassaMuscular(data),
    scoreHabitos(data, healthScore.percentage),
  ]
    .filter((m): m is ProtocolMatchScore => m !== null)
    .sort((a, b) => b.score - a.score);

  const qualified = matches.filter((m) => m.score >= MIN_MATCH_SCORE);

  const selected =
    qualified.length > 0
      ? qualified.slice(0, MAX_RECOMMENDATIONS)
      : matches.length > 0
        ? [matches[0]!]
        : [scoreHabitos(data, healthScore.percentage)];

  return selected.map((match, index) => toRecommendation(match, index + 1));
}

export function getIntelligentProtocolCatalog(): Protocol[] {
  return INTELLIGENT_PROTOCOL_CATALOG;
}
