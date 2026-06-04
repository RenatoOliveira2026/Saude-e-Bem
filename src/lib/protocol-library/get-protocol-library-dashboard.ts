import { getCurrentUser, getSessionProfile } from "@/lib/auth/session";
import { getClubMembership } from "@/lib/club/access";
import { resolveFavorites } from "@/lib/club/resolve-favorites";
import { fetchIntelligentRecommendations } from "@/lib/club/services/intelligent-recommendations.service";
import { fetchUserFavorites } from "@/lib/supabase/services/favorites.service";
import {
  enrichProtocols,
  getProtocolLibraryItems,
  sortProtocolsNewest,
} from "./services/library.service";
import { fetchUserProtocolHistory } from "./services/history.service";
import type { ProtocolLibraryDashboardData, ProtocolLibraryItem } from "./types";

function mapRecommendationsToProtocols(
  items: Awaited<ReturnType<typeof fetchIntelligentRecommendations>>,
  all: ProtocolLibraryItem[],
): ProtocolLibraryItem[] {
  const byId = new Map(all.map((p) => [p.id, p]));
  const bySlug = new Map(all.map((p) => [p.slug, p]));

  return items
    .filter((r) => r.contentType === "protocol")
    .map((r) => {
      const slug = r.href?.replace("/protocolos/", "") ?? "";
      return byId.get(r.id) ?? bySlug.get(slug) ?? null;
    })
    .filter((p): p is ProtocolLibraryItem => p !== null);
}

export async function getProtocolLibraryDashboard(): Promise<ProtocolLibraryDashboardData> {
  const all = await getProtocolLibraryItems();
  const newest = sortProtocolsNewest(all).slice(0, 6);
  const freeHighlights = all.filter((p) => !p.isPremium).slice(0, 6);
  const premiumHighlights = all.filter((p) => p.isPremium).slice(0, 6);

  const user = await getCurrentUser();
  if (!user) {
    return {
      recommended: [],
      favorites: [],
      recentlyViewed: [],
      newest,
      freeHighlights,
      premiumHighlights,
      isLoggedIn: false,
      isPremium: false,
    };
  }

  const { profile } = await getSessionProfile();
  const membership = await getClubMembership(user.id);

  const [favoritesRaw, history, intelligent] = await Promise.all([
    fetchUserFavorites(user.id),
    fetchUserProtocolHistory(user.id, 8),
    fetchIntelligentRecommendations({
      userId: user.id,
      isPremium: membership.isPremium,
      limit: 8,
    }),
  ]);

  const favoritesResolved = await resolveFavorites(
    favoritesRaw.filter((f) => f.contentType === "protocol"),
  );

  const favoriteProtocols = favoritesResolved
    .filter((f) => f.contentType === "protocol")
    .map((f) => all.find((p) => p.id === f.contentId || p.slug === f.slug))
    .filter((p): p is ProtocolLibraryItem => Boolean(p));

  let recommended = mapRecommendationsToProtocols(intelligent, all);
  if (recommended.length === 0 && profile.preferences?.goal) {
    recommended = all.slice(0, 6);
  }

  return {
    recommended,
    favorites: favoriteProtocols,
    recentlyViewed: history,
    newest,
    freeHighlights,
    premiumHighlights,
    isLoggedIn: true,
    isPremium: membership.isPremium,
  };
}

export async function getProtocolFavoritesForUser(
  userId: string,
): Promise<ProtocolLibraryItem[]> {
  const all = await getProtocolLibraryItems();
  const raw = await fetchUserFavorites(userId);
  const resolved = await resolveFavorites(
    raw.filter((f) => f.contentType === "protocol"),
  );
  return resolved
    .filter((f) => f.contentType === "protocol")
    .map((f) => all.find((p) => p.id === f.contentId || p.slug === f.slug))
    .filter((p): p is ProtocolLibraryItem => Boolean(p));
}
