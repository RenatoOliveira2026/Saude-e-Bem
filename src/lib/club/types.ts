import type { FavoriteContentType } from "@/lib/favorites/types";

import type { Payment } from "@/lib/payments/types";

export type MembershipPlan = "free" | "premium";

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "expired"
  | "pending";

export type SubscriptionProvider = "manual" | "stripe" | "internal" | "mercadopago";

export interface Subscription {
  id: string;
  userId: string;
  plan: MembershipPlan;
  status: SubscriptionStatus;
  provider: SubscriptionProvider;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  canceledAt: string | null;
  billingPlanId: string | null;
  autoRenew: boolean;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClubMembership {
  plan: MembershipPlan;
  isPremium: boolean;
  subscription: Subscription | null;
  expiresAt: string | null;
  status: SubscriptionStatus | "none";
  provider: SubscriptionProvider | null;
}

export interface UserDownload {
  id: string;
  userId: string;
  contentType: FavoriteContentType;
  contentId: string;
  contentTitle: string;
  contentSlug: string | null;
  createdAt: string;
}

export interface ResolvedFavorite {
  id: string;
  contentType: FavoriteContentType;
  contentId: string;
  title: string;
  slug: string | null;
  href: string;
  categoryLabel: string | null;
  isPremium: boolean;
  createdAt: string;
}

export type SavedProtocolStatus = "saved" | "in_progress" | "completed";

export interface SavedProtocol {
  id: string;
  userId: string;
  protocolId: string;
  status: SavedProtocolStatus;
  notes: string | null;
  savedAt: string;
  updatedAt: string;
}

export interface ResolvedSavedProtocol {
  id: string;
  protocolId: string;
  title: string;
  slug: string;
  href: string;
  categoryLabel: string | null;
  isPremium: boolean;
  status: SavedProtocolStatus;
  savedAt: string;
  updatedAt: string;
}

export interface ContentAccessEntry {
  id: string;
  contentType: FavoriteContentType;
  contentId: string;
  contentTitle: string;
  contentSlug: string | null;
  sourcePath: string | null;
  createdAt: string;
  href: string;
}

export type RecommendationKind =
  | "continue_reading"
  | "personalized"
  | "trending"
  | "related";

export interface ClubRecommendation {
  id: string;
  contentType: "protocol" | "ebook" | "article";
  title: string;
  description: string;
  href: string;
  categoryLabel: string | null;
  isPremium: boolean;
  reason: string;
  kind?: RecommendationKind;
  score?: number;
  source?: "ai" | "analytics" | "goal";
}

export interface ContentRankingItem {
  id: string;
  contentType: "protocol" | "ebook" | "article";
  contentKey: string;
  title: string;
  slug: string | null;
  href: string;
  viewCount: number;
  downloadCount: number;
  score: number;
  rankPosition: number;
  period: "all_time" | "30d" | "7d";
}

export interface ContinueReadingItem {
  id: string;
  contentType: FavoriteContentType;
  contentId: string;
  title: string;
  slug: string | null;
  href: string;
  accessCount: number;
  lastAccessedAt: string;
  completed: boolean;
}

export interface ClubUserStats {
  daysAsMember: number;
  favoritesCount: number;
  downloadsCount: number;
  protocolsSavedCount: number;
  protocolsCompletedCount: number;
  accessCount: number;
  profileComplete: boolean;
  goalLabel: string | null;
}

export interface ClubDashboardData {
  displayName: string;
  email: string;
  memberSince: string;
  membership: ClubMembership;
  favorites: ResolvedFavorite[];
  downloads: UserDownload[];
  payments: Payment[];
  savedProtocols: ResolvedSavedProtocol[];
  accessHistory: ContentAccessEntry[];
  recommendations: ClubRecommendation[];
  intelligentRecommendations: ClubRecommendation[];
  continueReading: ContinueReadingItem[];
  contentRankings: ContentRankingItem[];
  stats: ClubUserStats;
  favoritesCount: number;
  downloadsCount: number;
  nextRenewal: string | null;
}

export interface PremiumAccessContext {
  isLoggedIn: boolean;
  isPremium: boolean;
  canAccess: boolean;
}
