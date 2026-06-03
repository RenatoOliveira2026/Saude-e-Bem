import { getSessionProfile } from "@/lib/auth/session";
import { formatMemberSince } from "@/lib/journey/constants";
import { fetchUserFavorites } from "@/lib/supabase/services/favorites.service";
import { fetchUserPayments } from "@/lib/payments/services/payments.service";
import { getClubMembership, touchClubJoined } from "./access";
import { resolveFavorites } from "./resolve-favorites";
import { fetchUserDownloads } from "./services/downloads.service";
import type { ClubDashboardData } from "./types";

export async function getClubDashboardData(): Promise<ClubDashboardData> {
  const { user, profile } = await getSessionProfile();
  const email = user.email ?? "";
  const displayName =
    profile.profile?.name?.trim() || email.split("@")[0] || "Membro";

  void touchClubJoined(user.id);

  const [membership, favoritesRaw, downloads, payments] = await Promise.all([
    getClubMembership(user.id),
    fetchUserFavorites(user.id),
    fetchUserDownloads(user.id),
    fetchUserPayments(user.id),
  ]);

  const favorites = await resolveFavorites(favoritesRaw);
  const memberSinceRaw = profile.profile?.created_at ?? user.created_at;

  return {
    displayName,
    email,
    memberSince: formatMemberSince(memberSinceRaw),
    membership,
    favorites,
    downloads,
    payments,
    favoritesCount: favorites.length,
    downloadsCount: downloads.length,
    nextRenewal: membership.isPremium ? membership.expiresAt : null,
  };
}
