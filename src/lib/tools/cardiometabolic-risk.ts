export type Sex = "female" | "male";

export type ActivityLevel = "sedentary" | "moderate" | "active";

export interface CardiometabolicInput {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  waistCm: number;
  smokes: boolean;
  activity: ActivityLevel;
  familyHistory: boolean;
  hypertension: boolean;
  diabetes: boolean;
}

export type RiskLevel = "low" | "moderate" | "elevated" | "high";

export interface CardiometabolicResult {
  score: number;
  maxScore: number;
  level: RiskLevel;
  bmi: number;
  waistRisk: "normal" | "elevated" | "high";
  factors: string[];
  recommendations: string[];
}

const MAX_SCORE = 28;

export function calcBmi(weightKg: number, heightCm: number): number {
  const m = heightCm / 100;
  if (m <= 0) return 0;
  return Math.round((weightKg / (m * m)) * 10) / 10;
}

function waistThresholds(sex: Sex): { elevated: number; high: number } {
  return sex === "male"
    ? { elevated: 94, high: 102 }
    : { elevated: 80, high: 88 };
}

export function assessWaist(waistCm: number, sex: Sex): CardiometabolicResult["waistRisk"] {
  const { elevated, high } = waistThresholds(sex);
  if (waistCm >= high) return "high";
  if (waistCm >= elevated) return "elevated";
  return "normal";
}

function agePoints(age: number): number {
  if (age < 30) return 0;
  if (age < 45) return 1;
  if (age < 55) return 2;
  if (age < 65) return 3;
  return 4;
}

function bmiPoints(bmi: number): number {
  if (bmi < 25) return 0;
  if (bmi < 30) return 2;
  return 4;
}

function waistPoints(waistRisk: CardiometabolicResult["waistRisk"]): number {
  if (waistRisk === "elevated") return 2;
  if (waistRisk === "high") return 4;
  return 0;
}

function activityPoints(activity: ActivityLevel): number {
  if (activity === "sedentary") return 2;
  if (activity === "moderate") return 1;
  return 0;
}

export function scoreToLevel(score: number): RiskLevel {
  if (score <= 4) return "low";
  if (score <= 9) return "moderate";
  if (score <= 14) return "elevated";
  return "high";
}

export const riskLevelLabels: Record<RiskLevel, string> = {
  low: "Baixo",
  moderate: "Moderado",
  elevated: "Elevado",
  high: "Muito elevado",
};

export const riskLevelDescriptions: Record<RiskLevel, string> = {
  low: "Poucos fatores de risco identificados no perfil informado. Mantenha hábitos protetivos.",
  moderate:
    "Alguns fatores sugerem atenção à saúde cardiometabólica. Pequenas mudanças podem fazer diferença.",
  elevated:
    "Vários fatores convergem para risco cardiometabólico. Vale priorizar acompanhamento preventivo.",
  high: "Múltiplos fatores de risco. Recomendamos avaliação com profissional de saúde o quanto antes.",
};

export function evaluateCardiometabolicRisk(
  input: CardiometabolicInput,
): CardiometabolicResult {
  const bmi = calcBmi(input.weightKg, input.heightCm);
  const waistRisk = assessWaist(input.waistCm, input.sex);

  let score = 0;
  const factors: string[] = [];

  const agePts = agePoints(input.age);
  score += agePts;
  if (agePts >= 2) factors.push("Faixa etária com maior prevalência de risco cardiometabólico");

  const bmiPts = bmiPoints(bmi);
  score += bmiPts;
  if (bmi >= 30) factors.push("IMC na faixa de obesidade");
  else if (bmi >= 25) factors.push("IMC na faixa de sobrepeso");

  const waistPts = waistPoints(waistRisk);
  score += waistPts;
  if (waistRisk === "high") factors.push("Circunferência abdominal acima do limite alto");
  else if (waistRisk === "elevated") factors.push("Circunferência abdominal acima do limite de atenção");

  if (input.smokes) {
    score += 2;
    factors.push("Tabagismo");
  }

  score += activityPoints(input.activity);
  if (input.activity === "sedentary") factors.push("Baixa atividade física");
  else if (input.activity === "moderate") factors.push("Atividade física abaixo do ideal");

  if (input.familyHistory) {
    score += 2;
    factors.push("Histórico familiar de diabetes ou doença cardiovascular");
  }

  if (input.hypertension) {
    score += 3;
    factors.push("Pressão arterial elevada (relatada)");
  }

  if (input.diabetes) {
    score += 4;
    factors.push("Diabetes ou pré-diabetes (relatado)");
  }

  const level = scoreToLevel(score);
  const recommendations = buildRecommendations(level, input, bmi, waistRisk);

  return {
    score,
    maxScore: MAX_SCORE,
    level,
    bmi,
    waistRisk,
    factors,
    recommendations,
  };
}

function buildRecommendations(
  level: RiskLevel,
  input: CardiometabolicInput,
  bmi: number,
  waistRisk: CardiometabolicResult["waistRisk"],
): string[] {
  const tips: string[] = [
    "Esta ferramenta é educativa e não substitui exame clínico, exames laboratoriais ou diagnóstico médico.",
  ];

  if (input.smokes) {
    tips.push("Considere um plano estruturado para reduzir ou parar de fumar — um dos maiores impactos no risco cardiovascular.");
  }
  if (bmi >= 25 || waistRisk !== "normal") {
    tips.push("Priorize alimentação com mais fibras, proteína magra e gorduras de qualidade; reduza ultraprocessados e açúcares adicionados.");
  }
  if (input.activity !== "active") {
    tips.push("Inclua movimento regular: meta inicial de 150 min/semana de atividade moderada + treino de força 2x/semana.");
  }
  if (input.hypertension || input.diabetes || level === "elevated" || level === "high") {
    tips.push("Agende consulta médica para pressão arterial, glicemia, perfil lipídico e avaliação de risco cardiovascular.");
  }
  if (level === "low" || level === "moderate") {
    tips.push("Mantenha sono de 7–9 h, hidratação adequada e rotina de check-ups preventivos conforme sua idade.");
  }
  tips.push("Explore protocolos de nutrição e longevidade na plataforma Saúde & Bem para apoiar sua jornada.");

  return tips;
}

export function parseCardiometabolicForm(
  data: FormData,
): CardiometabolicInput | { error: string } {
  const age = Number(data.get("age"));
  const heightCm = Number(data.get("heightCm"));
  const weightKg = Number(data.get("weightKg"));
  const waistCm = Number(data.get("waistCm"));

  if (!Number.isFinite(age) || age < 18 || age > 100) {
    return { error: "Informe uma idade entre 18 e 100 anos." };
  }
  if (!Number.isFinite(heightCm) || heightCm < 120 || heightCm > 230) {
    return { error: "Informe altura entre 120 e 230 cm." };
  }
  if (!Number.isFinite(weightKg) || weightKg < 35 || weightKg > 250) {
    return { error: "Informe peso entre 35 e 250 kg." };
  }
  if (!Number.isFinite(waistCm) || waistCm < 50 || waistCm > 200) {
    return { error: "Informe circunferência abdominal entre 50 e 200 cm." };
  }

  const sex = data.get("sex");
  if (sex !== "female" && sex !== "male") {
    return { error: "Selecione o sexo biológico para referência de cintura." };
  }

  const activity = data.get("activity");
  if (activity !== "sedentary" && activity !== "moderate" && activity !== "active") {
    return { error: "Selecione seu nível de atividade física." };
  }

  return {
    age,
    sex,
    heightCm,
    weightKg,
    waistCm,
    smokes: data.get("smokes") === "yes",
    activity,
    familyHistory: data.get("familyHistory") === "yes",
    hypertension: data.get("hypertension") === "yes",
    diabetes: data.get("diabetes") === "yes",
  };
}
