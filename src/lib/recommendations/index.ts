export { calculateHealthScore, getUnmetCriteria, SCORE_CRITERION_ORDER } from "./health-score";
export { buildIntelligentRecommendations } from "./recommendation-engine";
export type {
  HealthScoreResult,
  IntelligentRecommendations,
  PriorityAction,
  PriorityLevel,
  RecommendedProtocol,
  RecommendedTool,
  ScoreCriterionId,
  ScoreCriterionResult,
} from "./recommendation-types";
