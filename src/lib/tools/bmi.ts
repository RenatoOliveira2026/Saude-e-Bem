import { parsePositiveNumber } from "./form-utils";

export type BmiCategory =
  | "underweight"
  | "normal"
  | "overweight"
  | "obese1"
  | "obese2"
  | "obese3";

export interface BmiResult {
  bmi: number;
  category: BmiCategory;
  categoryLabel: string;
  guidance: string;
  recommendations: string[];
}

export function calcBmi(weightKg: number, heightCm: number): number {
  const m = heightCm / 100;
  if (m <= 0) return 0;
  return Math.round((weightKg / (m * m)) * 10) / 10;
}

const categoryMeta: Record<
  BmiCategory,
  { label: string; guidance: string }
> = {
  underweight: {
    label: "Abaixo do peso",
    guidance:
      "Seu IMC está abaixo da faixa considerada adequada pela OMS. Avalie ingestão calórica, densidade nutricional e possíveis causas com profissional de saúde.",
  },
  normal: {
    label: "Peso adequado",
    guidance:
      "Seu IMC está na faixa considerada saudável para a maioria dos adultos. Mantenha hábitos equilibrados de alimentação, movimento e sono.",
  },
  overweight: {
    label: "Sobrepeso",
    guidance:
      "Seu IMC indica sobrepeso. Pequenas mudanças sustentáveis em alimentação e atividade física costumam melhorar composição corporal e marcadores metabólicos.",
  },
  obese1: {
    label: "Obesidade grau I",
    guidance:
      "Seu IMC está na faixa de obesidade grau I. Um plano estruturado com suporte profissional pode reduzir risco cardiometabólico e melhorar qualidade de vida.",
  },
  obese2: {
    label: "Obesidade grau II",
    guidance:
      "Seu IMC está na faixa de obesidade grau II. Recomendamos acompanhamento médico e nutricional para metas seguras e progressivas.",
  },
  obese3: {
    label: "Obesidade grau III",
    guidance:
      "Seu IMC está na faixa de obesidade grau III. Priorize avaliação clínica completa para orientar mudanças de estilo de vida com segurança.",
  },
};

export function classifyBmi(bmi: number): BmiCategory {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  if (bmi < 35) return "obese1";
  if (bmi < 40) return "obese2";
  return "obese3";
}

export function evaluateBmi(weightKg: number, heightCm: number): BmiResult {
  const bmi = calcBmi(weightKg, heightCm);
  const category = classifyBmi(bmi);
  const meta = categoryMeta[category];

  const recommendations: string[] = [
    "O IMC não distingue massa muscular de gordura; atletas podem ter IMC elevado sem excesso de gordura.",
    "Combine esta métrica com circunferência abdominal, hábitos e exames quando possível.",
  ];

  if (category === "normal") {
    recommendations.push(
      "Mantenha proteína adequada, fibras, hidratação e treino de força para preservar massa magra.",
    );
  } else if (category === "underweight") {
    recommendations.push(
      "Priorize refeições nutritivas e densas em energia; evite restrções extremas sem orientação.",
    );
  } else {
    recommendations.push(
      "Explore protocolos de nutrição e movimento na plataforma para apoiar sua meta de composição corporal.",
    );
  }

  return {
    bmi,
    category,
    categoryLabel: meta.label,
    guidance: meta.guidance,
    recommendations,
  };
}

export function parseBmiForm(data: FormData): { weightKg: number; heightCm: number } | { error: string } {
  const weightKg = parsePositiveNumber(data, "weightKg", "Peso", 35, 250);
  if (typeof weightKg !== "number") return weightKg;

  const heightCm = parsePositiveNumber(data, "heightCm", "Altura", 120, 230);
  if (typeof heightCm !== "number") return heightCm;

  return { weightKg, heightCm };
}
