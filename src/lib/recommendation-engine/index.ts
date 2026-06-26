export { loadRecommendationCatalog } from "./catalog";
export { buildIntelligentUserProfile } from "./user-profile";
export {
  generateRecommendations,
  pickNextStep,
  pickRecommendationOfTheDay,
  pickByType,
  scoreCatalogItem,
} from "./engine";
export {
  getAlsoBenefitSuggestions,
  getAlsoBenefitFromLastConsumed,
} from "./relationships";
export { getIntelligentJourneyPanel, buildIntelligentJourneyPanel } from "./journey-panel";
export { getRecommendationAdminStats } from "./admin-stats";
export {
  createRecommendationEngineBridge,
  type RecommendationEngineService,
  type RecommendationEngineQuery,
  type RecommendationEngineContext,
} from "./ai-bridge";
export {
  loadRecommendationEngineContext,
  loadRecommendationEngineContextForSession,
  recommendationEngineBridge,
} from "./bridge-loader";
export type {
  IntelligentUserProfile,
  IntelligentRecommendation,
  IntelligentJourneyPanel,
  AlsoBenefitSuggestion,
  CategoryScore,
  CatalogItem,
  RecommendationAdminStats,
} from "./types";
