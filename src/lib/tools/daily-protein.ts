import { parsePositiveNumber } from "./form-utils";

export type ProteinGoal = "maintenance" | "muscle" | "longevity" | "weight_loss";
export type ProteinActivity = "sedentary" | "moderate" | "active";

export interface DailyProteinResult {
  gramsPerDay: number;
  gramsPerKg: number;
  perMeal4: number;
  perMeal3: number;
  guidance: string;
  recommendations: string[];
}

const goalGramsPerKg: Record<ProteinGoal, { base: number; activeBonus: number }> = {
  maintenance: { base: 1.2, activeBonus: 0.15 },
  muscle: { base: 1.8, activeBonus: 0.2 },
  longevity: { base: 1.3, activeBonus: 0.1 },
  weight_loss: { base: 1.6, activeBonus: 0.15 },
};

const activityBonus: Record<ProteinActivity, number> = {
  sedentary: 0,
  moderate: 0.1,
  active: 0.2,
};

const goalLabels: Record<ProteinGoal, string> = {
  maintenance: "manutenção da massa magra",
  muscle: "ganho ou preservação muscular",
  longevity: "longevidade e saúde metabólica",
  weight_loss: "perda de gordura com preservação muscular",
};

export function evaluateDailyProtein(
  weightKg: number,
  goal: ProteinGoal,
  activity: ProteinActivity,
): DailyProteinResult {
  const cfg = goalGramsPerKg[goal];
  const gramsPerKg =
    Math.round((cfg.base + activityBonus[activity] + (activity === "active" ? cfg.activeBonus : 0)) * 10) /
    10;
  const gramsPerDay = Math.round(weightKg * gramsPerKg);

  const guidance = `Para ${goalLabels[goal]}, uma meta orientativa é cerca de ${gramsPerDay} g de proteína por dia (~${gramsPerKg} g/kg).`;

  const recommendations = [
    `Distribua em 3–4 refeições: ~${Math.round(gramsPerDay / 3)} g (3 refeições) ou ~${Math.round(gramsPerDay / 4)} g (4 refeições).`,
    "Priorize fontes magras: ovos, peixes, frango, leguminosas, laticínios e proteína vegetal combinada.",
    "Ajuste com nutricionista se houver doença renal ou condição clínica específica.",
  ];

  if (goal === "muscle") {
    recommendations.push(
      "Combine com treino de resistência e sono adequado para maximizar adaptação muscular.",
    );
  }

  return {
    gramsPerDay,
    gramsPerKg,
    perMeal3: Math.round(gramsPerDay / 3),
    perMeal4: Math.round(gramsPerDay / 4),
    guidance,
    recommendations,
  };
}

export function parseDailyProteinForm(
  data: FormData,
): { weightKg: number; goal: ProteinGoal; activity: ProteinActivity } | { error: string } {
  const weightKg = parsePositiveNumber(data, "weightKg", "Peso", 35, 250);
  if (typeof weightKg !== "number") return weightKg;

  const goal = data.get("goal");
  if (
    goal !== "maintenance" &&
    goal !== "muscle" &&
    goal !== "longevity" &&
    goal !== "weight_loss"
  ) {
    return { error: "Selecione seu objetivo principal." };
  }

  const activity = data.get("activity");
  if (activity !== "sedentary" && activity !== "moderate" && activity !== "active") {
    return { error: "Selecione o nível de atividade física." };
  }

  return { weightKg, goal, activity };
}
