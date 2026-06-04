import { parsePositiveNumber } from "./form-utils";

export type BmrSex = "female" | "male";
export type BmrActivity =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export interface BasalMetabolismResult {
  bmrKcal: number;
  tdeeKcal: number;
  activityLabel: string;
  guidance: string;
  recommendations: string[];
}

const activityFactor: Record<BmrActivity, { factor: number; label: string }> = {
  sedentary: { factor: 1.2, label: "Sedentário (pouco ou nenhum exercício)" },
  light: { factor: 1.375, label: "Leve (1–3 dias/semana)" },
  moderate: { factor: 1.55, label: "Moderado (3–5 dias/semana)" },
  active: { factor: 1.725, label: "Intenso (6–7 dias/semana)" },
  very_active: { factor: 1.9, label: "Muito intenso + trabalho físico" },
};

/** Taxa metabólica basal — Mifflin-St Jeor (kcal/dia) */
export function calcBmr(
  sex: BmrSex,
  weightKg: number,
  heightCm: number,
  age: number,
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const bmr = sex === "male" ? base + 5 : base - 161;
  return Math.round(bmr);
}

export function evaluateBasalMetabolism(
  sex: BmrSex,
  age: number,
  weightKg: number,
  heightCm: number,
  activity: BmrActivity,
): BasalMetabolismResult {
  const bmrKcal = calcBmr(sex, weightKg, heightCm, age);
  const { factor, label: activityLabel } = activityFactor[activity];
  const tdeeKcal = Math.round(bmrKcal * factor);

  const guidance = `Sua TMB estimada é ${bmrKcal} kcal/dia (repouso). Com seu nível de atividade, o gasto energético total diário (GET) fica em torno de ${tdeeKcal} kcal/dia.`;

  const recommendations = [
    "Estimativa educativa; variações individuais, hormônios, sono e composição corporal alteram o gasto real.",
    `Para manutenção de peso, a ingestão média costuma ficar próxima do GET (~${tdeeKcal} kcal).`,
    `Déficit moderado (~300–500 kcal abaixo do GET) ou superávit leve pode ser usado com orientação profissional.`,
    "Combine com monitoramento de energia, performance e composição corporal — não apenas a balança.",
  ];

  return {
    bmrKcal,
    tdeeKcal,
    activityLabel,
    guidance,
    recommendations,
  };
}

export function parseBasalMetabolismForm(
  data: FormData,
):
  | { sex: BmrSex; age: number; weightKg: number; heightCm: number; activity: BmrActivity }
  | { error: string } {
  const age = parsePositiveNumber(data, "age", "Idade", 15, 100);
  if (typeof age !== "number") return age;

  const weightKg = parsePositiveNumber(data, "weightKg", "Peso", 35, 250);
  if (typeof weightKg !== "number") return weightKg;

  const heightCm = parsePositiveNumber(data, "heightCm", "Altura", 120, 230);
  if (typeof heightCm !== "number") return heightCm;

  const sex = data.get("sex");
  if (sex !== "female" && sex !== "male") {
    return { error: "Selecione o sexo biológico para o cálculo." };
  }

  const activity = data.get("activity");
  if (
    activity !== "sedentary" &&
    activity !== "light" &&
    activity !== "moderate" &&
    activity !== "active" &&
    activity !== "very_active"
  ) {
    return { error: "Selecione o nível de atividade física." };
  }

  return { sex, age, weightKg, heightCm, activity };
}
