import { SAVABLE_TOOL_SLUGS, type SavableToolSlug } from "@/lib/health-profile/constants";
import type { UserToolResultRecord } from "@/lib/health-profile/types";
import type {
  HealthScoreResult,
  ScoreCriterionId,
  ScoreCriterionResult,
} from "./recommendation-types";

const POINTS_PER_CRITERION = 20;

function latestResultFor(
  records: UserToolResultRecord[],
  slug: SavableToolSlug,
): UserToolResultRecord | null {
  return records.find((r) => r.toolSlug === slug) ?? null;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function scoreLevel(
  percentage: number,
): HealthScoreResult["level"] {
  if (percentage >= 80) return "excelente";
  if (percentage >= 60) return "bom";
  if (percentage >= 40) return "evolucao";
  return "iniciante";
}

const levelLabels: Record<HealthScoreResult["level"], string> = {
  iniciante: "Iniciante",
  evolucao: "Em evolução",
  bom: "Bom",
  excelente: "Excelente",
};

const levelSummaries: Record<HealthScoreResult["level"], string> = {
  iniciante:
    "Complete mais ferramentas para montar seu panorama e elevar o score.",
  evolucao:
    "Você já tem dados importantes; refine hábitos nas áreas com menor pontuação.",
  bom:
    "Perfil equilibrado na maioria dos critérios — mantenha consistência.",
  excelente:
    "Excelente alinhamento nos indicadores avaliados — continue monitorando.",
};

function evaluateBmiCriterion(
  records: UserToolResultRecord[],
): ScoreCriterionResult {
  const record = latestResultFor(records, "calculadora-imc");
  const r = asRecord(record?.resultJson);
  const category = r.category;

  if (!record) {
    return {
      id: "bmi",
      label: "IMC saudável",
      points: 0,
      maxPoints: POINTS_PER_CRITERION,
      met: false,
      detail: "Use a calculadora de IMC para registrar sua faixa.",
      toolSlug: "calculadora-imc",
    };
  }

  const met = category === "normal";
  return {
    id: "bmi",
    label: "IMC saudável",
    points: met ? POINTS_PER_CRITERION : 0,
    maxPoints: POINTS_PER_CRITERION,
    met,
    detail: met
      ? `IMC na faixa adequada (${r.bmi ?? "—"}).`
      : `Último IMC: ${r.categoryLabel ?? category ?? "—"} — foco em composição corporal.`,
    toolSlug: "calculadora-imc",
  };
}

function evaluateWaterCriterion(
  records: UserToolResultRecord[],
): ScoreCriterionResult {
  const record = latestResultFor(records, "consumo-agua");
  const r = asRecord(record?.resultJson);
  const liters = typeof r.litersPerDay === "number" ? r.litersPerDay : null;

  if (!record || liters === null) {
    return {
      id: "water",
      label: "Água adequada",
      points: 0,
      maxPoints: POINTS_PER_CRITERION,
      met: false,
      detail: "Calcule sua meta diária de hidratação.",
      toolSlug: "consumo-agua",
    };
  }

  const met = liters >= 1.5 && liters <= 5;
  return {
    id: "water",
    label: "Água adequada",
    points: met ? POINTS_PER_CRITERION : 0,
    maxPoints: POINTS_PER_CRITERION,
    met,
    detail: met
      ? `Meta registrada: ${liters} L/dia.`
      : `Meta calculada (${liters} L/dia) — revise hábitos de hidratação.`,
    toolSlug: "consumo-agua",
  };
}

function evaluateProteinCriterion(
  records: UserToolResultRecord[],
): ScoreCriterionResult {
  const record = latestResultFor(records, "proteina-diaria");
  const r = asRecord(record?.resultJson);
  const gramsPerKg = typeof r.gramsPerKg === "number" ? r.gramsPerKg : null;

  if (!record || gramsPerKg === null) {
    return {
      id: "protein",
      label: "Proteína adequada",
      points: 0,
      maxPoints: POINTS_PER_CRITERION,
      met: false,
      detail: "Defina sua meta diária de proteína.",
      toolSlug: "proteina-diaria",
    };
  }

  const met = gramsPerKg >= 1.2;
  return {
    id: "protein",
    label: "Proteína adequada",
    points: met ? POINTS_PER_CRITERION : 0,
    maxPoints: POINTS_PER_CRITERION,
    met,
    detail: met
      ? `Meta: ${r.gramsPerDay ?? "—"} g/dia (~${gramsPerKg} g/kg).`
      : `Meta abaixo do mínimo orientativo (${gramsPerKg} g/kg).`,
    toolSlug: "proteina-diaria",
  };
}

function evaluateMetabolismCriterion(
  records: UserToolResultRecord[],
): ScoreCriterionResult {
  const record = latestResultFor(records, "metabolismo-basal");
  const r = asRecord(record?.resultJson);
  const bmr = typeof r.bmrKcal === "number" ? r.bmrKcal : null;
  const tdee = typeof r.tdeeKcal === "number" ? r.tdeeKcal : null;

  if (!record || bmr === null || tdee === null) {
    return {
      id: "metabolism",
      label: "Metabolismo na faixa",
      points: 0,
      maxPoints: POINTS_PER_CRITERION,
      met: false,
      detail: "Estime TMB e gasto energético total.",
      toolSlug: "metabolismo-basal",
    };
  }

  const met = bmr >= 1000 && bmr <= 3500 && tdee >= 1200 && tdee <= 4500;
  return {
    id: "metabolism",
    label: "Metabolismo na faixa",
    points: met ? POINTS_PER_CRITERION : 0,
    maxPoints: POINTS_PER_CRITERION,
    met,
    detail: met
      ? `TMB ${bmr} kcal · GET ${tdee} kcal — valores plausíveis.`
      : `TMB ${bmr} / GET ${tdee} kcal — revise medidas ou atividade.`,
    toolSlug: "metabolismo-basal",
  };
}

function evaluateCardiometabolicCriterion(
  records: UserToolResultRecord[],
): ScoreCriterionResult {
  const record = latestResultFor(records, "risco-cardiometabolico");
  const r = asRecord(record?.resultJson);
  const level = r.level;

  if (!record) {
    return {
      id: "cardiometabolic",
      label: "Risco cardiometabólico baixo",
      points: 0,
      maxPoints: POINTS_PER_CRITERION,
      met: false,
      detail: "Faça a triagem de risco cardiometabólico.",
      toolSlug: "risco-cardiometabolico",
    };
  }

  const met = level === "low";
  const levelText =
    level === "low"
      ? "baixo"
      : level === "moderate"
        ? "moderado"
        : level === "elevated"
          ? "elevado"
          : level === "high"
            ? "muito elevado"
            : String(level);

  return {
    id: "cardiometabolic",
    label: "Risco cardiometabólico baixo",
    points: met ? POINTS_PER_CRITERION : 0,
    maxPoints: POINTS_PER_CRITERION,
    met,
    detail: met
      ? "Triagem com risco baixo no último registro."
      : `Último nível: risco ${levelText}.`,
    toolSlug: "risco-cardiometabolico",
  };
}

const evaluators: ((
  records: UserToolResultRecord[],
) => ScoreCriterionResult)[] = [
  evaluateBmiCriterion,
  evaluateWaterCriterion,
  evaluateProteinCriterion,
  evaluateMetabolismCriterion,
  evaluateCardiometabolicCriterion,
];

export function calculateHealthScore(
  records: UserToolResultRecord[],
): HealthScoreResult {
  const criteria = evaluators.map((fn) => fn(records));
  const total = criteria.reduce((sum, c) => sum + c.points, 0);
  const maxTotal = criteria.reduce((sum, c) => sum + c.maxPoints, 0);
  const percentage = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;
  const level = scoreLevel(percentage);

  const toolsUsed = SAVABLE_TOOL_SLUGS.filter((slug) =>
    records.some((r) => r.toolSlug === slug),
  ).length;

  return {
    total,
    maxTotal,
    percentage,
    level,
    levelLabel: levelLabels[level],
    summary: levelSummaries[level],
    criteria,
    toolsUsed,
    toolsTotal: SAVABLE_TOOL_SLUGS.length,
  };
}

export function getUnmetCriteria(
  score: HealthScoreResult,
): ScoreCriterionResult[] {
  return score.criteria.filter((c) => !c.met);
}
