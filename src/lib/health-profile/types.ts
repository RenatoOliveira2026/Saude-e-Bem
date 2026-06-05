import type { SavableToolSlug } from "./constants";
import type {
  HealthScoreResult,
  PriorityAction,
  RecommendedTool,
} from "@/lib/recommendations/recommendation-types";

export interface UserToolResultRecord {
  id: string;
  userId: string;
  toolSlug: SavableToolSlug | string;
  resultJson: Record<string, unknown>;
  createdAt: string;
}

export interface ToolResultSummary {
  toolSlug: SavableToolSlug;
  toolTitle: string;
  summary: string;
  detail?: string;
  recordedAt: string;
  resultId: string;
}

export interface HealthRecommendation {
  protocolSlug: string;
  protocolTitle: string;
  categoryLabel: string;
  description?: string;
  reason: string;
  href: string;
  isPremium: boolean;
  priority?: number;
}

export interface HealthProfileData {
  displayName: string;
  latestByTool: ToolResultSummary[];
  history: UserToolResultRecord[];
  recommendations: HealthRecommendation[];
  healthScore: HealthScoreResult;
  recommendedTools: RecommendedTool[];
  priorities: PriorityAction[];
}
