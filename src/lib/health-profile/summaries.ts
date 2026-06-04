import type { SavableToolSlug } from "./constants";
import type { ToolResultSummary } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function summarizeToolResult(
  toolSlug: SavableToolSlug,
  toolTitle: string,
  resultJson: Record<string, unknown>,
  recordedAt: string,
  resultId: string,
): ToolResultSummary {
  const r = asRecord(resultJson);

  switch (toolSlug) {
    case "calculadora-imc":
      return {
        toolSlug,
        toolTitle,
        summary: `IMC ${r.bmi ?? "—"}`,
        detail: typeof r.categoryLabel === "string" ? r.categoryLabel : undefined,
        recordedAt,
        resultId,
      };
    case "consumo-agua":
      return {
        toolSlug,
        toolTitle,
        summary: `${r.litersPerDay ?? "—"} L / dia`,
        detail:
          typeof r.glasses250ml === "number"
            ? `~${r.glasses250ml} copos de 250 ml`
            : undefined,
        recordedAt,
        resultId,
      };
    case "proteina-diaria":
      return {
        toolSlug,
        toolTitle,
        summary: `${r.gramsPerDay ?? "—"} g / dia`,
        detail:
          typeof r.gramsPerKg === "number" ? `${r.gramsPerKg} g/kg` : undefined,
        recordedAt,
        resultId,
      };
    case "metabolismo-basal":
      return {
        toolSlug,
        toolTitle,
        summary: `GET ~${r.tdeeKcal ?? "—"} kcal`,
        detail:
          typeof r.bmrKcal === "number" ? `TMB ${r.bmrKcal} kcal` : undefined,
        recordedAt,
        resultId,
      };
    case "quiz-saude-bem":
      return {
        toolSlug,
        toolTitle,
        summary:
          typeof r.profileTitle === "string" ? r.profileTitle : "Perfil de saúde",
        detail:
          typeof r.profileDescription === "string"
            ? r.profileDescription.slice(0, 120)
            : undefined,
        recordedAt,
        resultId,
      };
    default:
      return {
        toolSlug: toolSlug as SavableToolSlug,
        toolTitle,
        summary: "Resultado registrado",
        recordedAt,
        resultId,
      };
  }
}
