import type { Protocol } from "@/lib/data/types";

export interface ProtocolLibraryItem extends Protocol {
  normalizedCategory: string;
}

export interface ProtocolHistoryEntry {
  id: string;
  protocolId: string;
  protocolSlug: string;
  protocolTitle: string;
  viewCount: number;
  lastViewedAt: string;
  isPremium: boolean;
}

export interface ProtocolLibraryDashboardData {
  recommended: ProtocolLibraryItem[];
  favorites: ProtocolLibraryItem[];
  recentlyViewed: ProtocolHistoryEntry[];
  newest: ProtocolLibraryItem[];
  freeHighlights: ProtocolLibraryItem[];
  premiumHighlights: ProtocolLibraryItem[];
  isLoggedIn: boolean;
  isPremium: boolean;
}
