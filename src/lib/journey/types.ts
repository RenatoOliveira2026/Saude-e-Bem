import type { IconName } from "@/components/icons";
import type { LibraryResource, Protocol } from "@/lib/data/types";
import type { ContinueReadingItem } from "@/lib/club/types";
import type { TrailProgress } from "@/lib/premium/trail-progress";
import type { EngagementSnapshot } from "@/lib/engagement";
import type { LoyaltySnapshot } from "@/lib/loyalty";
import type { IntelligentJourneyPanel } from "@/lib/recommendation-engine/types";
import type { UserProfileData } from "@/lib/supabase/types";
import type { User } from "@supabase/supabase-js";

export interface JourneyChecklistItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: IconName;
  completed: boolean;
}

export interface JourneyProgressStats {
  trailsStarted: number;
  trailsCompleted: number;
  materialsCompleted: number;
  protocolsStarted: number;
  protocolsCompleted: number;
  overallPercent: number;
}

export interface JourneyData {
  user: User;
  profileData: UserProfileData;
  displayName: string;
  email: string;
  goalKey: string | null;
  goalLabel: string | null;
  goalDescription: string | null;
  hasGoal: boolean;
  profileComplete: boolean;
  memberSince: string;
  daysOnJourney: number;
  recommendedProtocols: Protocol[];
  librarySuggestions: LibraryResource[];
  checklist: JourneyChecklistItem[];
  /** Fase 9.4 — trilhas premium com progresso */
  trails: TrailProgress[];
  activeTrail: TrailProgress | null;
  progress: JourneyProgressStats;
  continueReading: ContinueReadingItem[];
  /** Fase 9.5 — engajamento e fidelização */
  engagement: EngagementSnapshot;
  loyalty: LoyaltySnapshot;
  /** Fase 10.0 — motor de recomendação inteligente */
  intelligentPanel: IntelligentJourneyPanel;
}
