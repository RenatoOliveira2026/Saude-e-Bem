/** Ferramentas com persistência automática (Fase 4.3) — exclui risco-cardiometabolico */
export const SAVABLE_TOOL_SLUGS = [
  "calculadora-imc",
  "consumo-agua",
  "proteina-diaria",
  "metabolismo-basal",
  "quiz-saude-bem",
] as const;

export type SavableToolSlug = (typeof SAVABLE_TOOL_SLUGS)[number];

export function isSavableToolSlug(slug: string): slug is SavableToolSlug {
  return (SAVABLE_TOOL_SLUGS as readonly string[]).includes(slug);
}

export const TOOL_SLUG_LABELS: Record<SavableToolSlug, string> = {
  "calculadora-imc": "Calculadora de IMC",
  "consumo-agua": "Consumo diário de água",
  "proteina-diaria": "Proteína diária",
  "metabolismo-basal": "Metabolismo basal",
  "quiz-saude-bem": "Quiz Saúde & Bem",
};
