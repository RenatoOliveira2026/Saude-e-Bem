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

export interface ClubDashboardData {
  displayName: string;
  email: string;
  memberSince: string;
  membership: ClubMembership;
  favorites: ResolvedFavorite[];
  downloads: UserDownload[];
  payments: Payment[];
  favoritesCount: number;
  downloadsCount: number;
  nextRenewal: string | null;
}

export interface PremiumAccessContext {
  isLoggedIn: boolean;
  isPremium: boolean;
  canAccess: boolean;
}
