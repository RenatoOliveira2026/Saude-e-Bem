import type { SavableToolSlug } from "@/lib/health-profile/constants";

export type ScoreCriterionId =
  | "bmi"
  | "water"
  | "protein"
  | "metabolism"
  | "cardiometabolic";

export interface ScoreCriterionResult {
  id: ScoreCriterionId;
  label: string;
  points: number;
  maxPoints: number;
  met: boolean;
  detail: string;
  toolSlug?: SavableToolSlug;
}

export interface HealthScoreResult {
  total: number;
  maxTotal: number;
  percentage: number;
  level: "iniciante" | "evolucao" | "bom" | "excelente";
  levelLabel: string;
  summary: string;
  criteria: ScoreCriterionResult[];
  toolsUsed: number;
  toolsTotal: number;
}

export interface RecommendedProtocol {
  protocolSlug: string;
  protocolTitle: string;
  categoryLabel: string;
  reason: string;
  href: string;
  isPremium: boolean;
  priority: number;
}

export interface RecommendedTool {
  toolSlug: SavableToolSlug;
  toolTitle: string;
  reason: string;
  href: string;
  priority: number;
}

export type PriorityLevel = "alta" | "media" | "baixa";

export interface PriorityAction {
  id: string;
  title: string;
  description: string;
  href: string;
  level: PriorityLevel;
  relatedToolSlug?: SavableToolSlug;
  relatedCriterionId?: ScoreCriterionId;
}

export interface IntelligentRecommendations {
  healthScore: HealthScoreResult;
  protocols: RecommendedProtocol[];
  tools: RecommendedTool[];
  priorities: PriorityAction[];
}
