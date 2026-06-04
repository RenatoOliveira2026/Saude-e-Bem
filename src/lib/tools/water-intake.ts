import { parsePositiveNumber } from "./form-utils";

export type WaterActivity = "sedentary" | "moderate" | "active";
export type WaterClimate = "mild" | "warm" | "hot";

export interface WaterIntakeResult {
  litersPerDay: number;
  millilitersPerDay: number;
  glasses250ml: number;
  guidance: string;
  recommendations: string[];
}

const activityFactor: Record<WaterActivity, number> = {
  sedentary: 1,
  moderate: 1.1,
  active: 1.2,
};

const climateFactor: Record<WaterClimate, number> = {
  mild: 1,
  warm: 1.12,
  hot: 1.22,
};

export function evaluateWaterIntake(
  weightKg: number,
  activity: WaterActivity,
  climate: WaterClimate,
): WaterIntakeResult {
  const baseMl = weightKg * 35;
  const ml = Math.round(baseMl * activityFactor[activity] * climateFactor[climate]);
  const litersPerDay = Math.round((ml / 1000) * 10) / 10;
  const glasses250ml = Math.round(ml / 250);

  let guidance =
    `Meta estimada de ${litersPerDay} L por dia (~${glasses250ml} copos de 250 ml), considerando seu peso, atividade e clima.`;

  if (activity === "active") {
    guidance += " Atividade intensa pode exigir reposição extra antes, durante e após o treino.";
  }
  if (climate === "hot") {
    guidance += " Em clima quente, aumente a atenção à sede e à cor da urina (amarelo claro).";
  }

  const recommendations = [
    "Distribua a ingestão ao longo do dia; não espere sentir sede intensa para beber.",
    "Água, chás sem açúcar e caldos leves contam; refrigerantes e sucos açucarados não substituem hidratação.",
    "Em dias de treino longo, considere eletrólitos se a sudorese for alta.",
  ];

  return {
    litersPerDay,
    millilitersPerDay: ml,
    glasses250ml,
    guidance,
    recommendations,
  };
}

export function parseWaterIntakeForm(
  data: FormData,
): { weightKg: number; activity: WaterActivity; climate: WaterClimate } | { error: string } {
  const weightKg = parsePositiveNumber(data, "weightKg", "Peso", 35, 250);
  if (typeof weightKg !== "number") return weightKg;

  const activity = data.get("activity");
  if (activity !== "sedentary" && activity !== "moderate" && activity !== "active") {
    return { error: "Selecione o nível de atividade física." };
  }

  const climate = data.get("climate");
  if (climate !== "mild" && climate !== "warm" && climate !== "hot") {
    return { error: "Selecione o clima habitual." };
  }

  return { weightKg, activity, climate };
}
