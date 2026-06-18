import type { LeadInterestId, LeadSource } from "./lead.types";

export type LeadScoreId = "frio" | "morno" | "quente" | "muito_quente";

export const LEAD_SCORE_LABELS: Record<LeadScoreId, string> = {
  frio: "Frio",
  morno: "Morno",
  quente: "Quente",
  muito_quente: "Muito quente",
};

export const LEAD_SCORE_ORDER: LeadScoreId[] = [
  "frio",
  "morno",
  "quente",
  "muito_quente",
];

const SCORE_RANK: Record<LeadScoreId, number> = {
  frio: 0,
  morno: 1,
  quente: 2,
  muito_quente: 3,
};

export interface LeadScoreInput {
  source: LeadSource;
  interest?: LeadInterestId | null;
  hasContentContext?: boolean;
}

export function computeLeadScore(input: LeadScoreInput): LeadScoreId {
  const { source, hasContentContext } = input;

  if (source === "assinar" || source === "lista-vip-lancamento") return "muito_quente";
  if (source.startsWith("lp-")) return "quente";
  if (source === "artigo" || source === "protocolo") return "quente";
  if (source === "biblioteca" && hasContentContext) return "quente";
  if (source === "blog" || source === "biblioteca" || source === "minha-saude") {
    return "morno";
  }
  return "frio";
}

export function isHotterScore(current: LeadScoreId, next: LeadScoreId): boolean {
  return SCORE_RANK[next] > SCORE_RANK[current];
}

export function leadScoreBadgeVariant(
  score: LeadScoreId,
): "default" | "sage" | "gold" | "forest" {
  switch (score) {
    case "muito_quente":
      return "gold";
    case "quente":
      return "forest";
    case "morno":
      return "sage";
    default:
      return "default";
  }
}
