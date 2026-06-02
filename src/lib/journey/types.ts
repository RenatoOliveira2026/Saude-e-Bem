import type { IconName } from "@/components/icons";
import type { LibraryResource, Protocol } from "@/lib/data/types";
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
}
