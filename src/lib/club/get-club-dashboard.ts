import { getSessionProfile } from "@/lib/auth/session";
import {
  formatMemberSince,
  getDaysOnJourney,
  getProfileComplete,
  goalLabels,
} from "@/lib/journey/constants";
import { fetchUserPayments } from "@/lib/payments/services/payments.service";
import { fetchUserFavorites } from "@/lib/supabase/services/favorites.service";
import { getClubMembership, touchClubJoined } from "./access";
import { getClubRecommendations } from "./get-recommendations";
import { resolveFavorites } from "./resolve-favorites";
import { resolveSavedProtocols } from "./resolve-saved-protocols";
import {
  countUserAccessHistory,
  fetchUserAccessHistory,
} from "./services/access-history.service";
import { fetchUserDownloads } from "./services/downloads.service";
import {
  fetchContentRankings,
  fetchContinueReading,
  fetchIntelligentRecommendations,
} from "./services/intelligent-recommendations.service";
import {
  countSavedProtocolsByStatus,
  fetchUserSavedProtocols,
} from "./services/saved-protocols.service";
import type { ClubDashboardData } from "./types";

export async function getClubDashboardData(): Promise<ClubDashboardData> {
  const { user, profile } = await getSessionProfile();
  const email = user.email ?? "";
  const displayName =
    profile.profile?.name?.trim() || email.split("@")[0] || "Membro";

  void touchClubJoined(user.id);

  const memberSinceRaw = profile.profile?.created_at ?? user.created_at;
  const goalKey = profile.preferences?.goal ?? null;
  const hasName = Boolean(profile.profile?.name?.trim());
  const hasGoal = Boolean(goalKey);

  const [
    membership,
    favoritesRaw,
    downloads,
    payments,
    savedRaw,
    accessHistory,
    protocolCounts,
    accessCount,
  ] = await Promise.all([
    getClubMembership(user.id),
    fetchUserFavorites(user.id),
    fetchUserDownloads(user.id),
    fetchUserPayments(user.id),
    fetchUserSavedProtocols(user.id),
    fetchUserAccessHistory(user.id, 30),
    countSavedProtocolsByStatus(user.id),
    countUserAccessHistory(user.id),
  ]);

  const [
    favorites,
    savedProtocols,
    intelligentRecommendations,
    continueReading,
    contentRankings,
    fallbackRecommendations,
  ] = await Promise.all([
    resolveFavorites(favoritesRaw),
    resolveSavedProtocols(savedRaw),
    fetchIntelligentRecommendations({
      userId: user.id,
      isPremium: membership.isPremium,
      limit: 12,
    }),
    fetchContinueReading(user.id, 5),
    fetchContentRankings("30d", 8),
    getClubRecommendations({
      userId: user.id,
      isPremium: membership.isPremium,
      limit: 6,
    }),
  ]);

  const recommendations =
    intelligentRecommendations.length > 0
      ? intelligentRecommendations
      : fallbackRecommendations;

  return {
    displayName,
    email,
    memberSince: formatMemberSince(memberSinceRaw),
    membership,
    favorites,
    downloads,
    payments,
    savedProtocols,
    accessHistory,
    recommendations,
    intelligentRecommendations: recommendations,
    continueReading,
    contentRankings,
    stats: {
      daysAsMember: getDaysOnJourney(memberSinceRaw),
      favoritesCount: favorites.length,
      downloadsCount: downloads.length,
      protocolsSavedCount: protocolCounts.total,
      protocolsCompletedCount: protocolCounts.completed,
      accessCount,
      profileComplete: getProfileComplete(hasName, hasGoal),
      goalLabel: goalKey ? (goalLabels[goalKey] ?? null) : null,
    },
    favoritesCount: favorites.length,
    downloadsCount: downloads.length,
    nextRenewal: membership.isPremium ? membership.expiresAt : null,
  };
}
