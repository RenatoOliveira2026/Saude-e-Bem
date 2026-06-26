import type { IconName } from "@/components/icons";
import type {
  ContentObjective,
  IntelligentContentType,
} from "@/lib/content/intelligence";
import type { ContentLevel } from "@/lib/data/types";

export interface CategoryScore {
  objective: ContentObjective;
  label: string;
  score: number;
}

export interface IntelligentUserProfile {
  userId: string;
  goalKey: string | null;
  goalObjective: ContentObjective | null;
  goalLabel: string | null;
  isPremium: boolean;
  categoryScores: CategoryScore[];
  consumedKeys: string[];
  trailsCompleted: number;
  trailsStarted: number;
  protocolsInProgress: number;
  articlesRead: number;
  libraryDownloads: number;
  preferredLevel: ContentLevel;
  availableMinutes: number;
}

export interface CatalogItem {
  key: string;
  type: IntelligentContentType;
  slug: string;
  title: string;
  description: string;
  href: string;
  objective: ContentObjective;
  category: string;
  level: ContentLevel;
  estimatedMinutes: number;
  isPremium: boolean;
  isNew: boolean;
  icon: IconName;
}

export interface IntelligentRecommendation {
  id: string;
  type: IntelligentContentType;
  slug: string;
  title: string;
  description: string;
  href: string;
  reason: string;
  score: number;
  isPremium: boolean;
  objective: ContentObjective;
  level: ContentLevel;
  estimatedMinutes: number;
  kind:
    | "daily"
    | "next_step"
    | "article"
    | "protocol"
    | "library"
    | "tool"
    | "related";
}

export interface AlsoBenefitSuggestion {
  id: string;
  sourceType: IntelligentContentType;
  sourceSlug: string;
  targetType: IntelligentContentType;
  targetSlug: string;
  title: string;
  description: string;
  href: string;
  message: string;
}

export interface IntelligentJourneyPanel {
  recommendationOfTheDay: IntelligentRecommendation | null;
  nextStep: IntelligentRecommendation | null;
  recommendedArticle: IntelligentRecommendation | null;
  recommendedProtocol: IntelligentRecommendation | null;
  recommendedLibrary: IntelligentRecommendation | null;
  alsoBenefitFrom: AlsoBenefitSuggestion[];
  topRecommendations: IntelligentRecommendation[];
}

export interface RecommendationAdminStats {
  topRecommended: { title: string; slug: string; type: string; score: number }[];
  topAccepted: { title: string; slug: string; type: string; views: number }[];
  categoryInterest: { objective: string; label: string; score: number }[];
  clickThroughProxyPercent: number;
  totalCatalogItems: number;
  registryCoveragePercent: number;
}
