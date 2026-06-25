export { PREMIUM_TRAILS, getPremiumTrailBySlug, getTrailsForObjective } from "./trails";
export type { PremiumTrail, PremiumTrailStep } from "./trails";
export {
  buildTrailProgress,
  buildAllTrailsProgress,
  pickRecommendedTrail,
  resolveTrailStepHref,
} from "./trail-progress";
export type { TrailProgress, TrailStepProgress, UserActivitySnapshot } from "./trail-progress";
export { fetchUserActivitySnapshot } from "./user-activity";
export {
  enrichLibraryItem,
  enrichLibraryCatalog,
  filterEnrichedLibrary,
  getLibraryNovidades,
  LIBRARY_OBJECTIVE_FILTERS,
  LIBRARY_DIFFICULTY_FILTERS,
  LIBRARY_DURATION_FILTERS,
} from "./library-enrichment";
export type {
  EnrichedLibraryItem,
  LibraryObjectiveFilterId,
  LibraryDifficultyFilterId,
  LibraryDurationFilterId,
} from "./library-enrichment";
export { getPremiumBenefitsHubData } from "./benefits-hub";
export type { PremiumBenefitsHubData, PremiumBenefitCard } from "./benefits-hub";
