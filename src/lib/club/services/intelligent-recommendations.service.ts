import type { FavoriteContentType } from "@/lib/favorites/types";
import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";
import type {
  ClubRecommendation,
  ContentRankingItem,
  ContinueReadingItem,
  RecommendationKind,
} from "../types";
import { getClubRecommendations as getFallbackRecommendations } from "../get-recommendations";

type RpcRecommendationRow = {
  kind: string;
  content_type: string;
  content_id: string;
  content_title: string;
  content_slug: string;
  category_label: string | null;
  is_premium: boolean;
  reason: string;
  score: number;
};

function buildHref(
  contentType: string,
  slug: string | null,
): string {
  if (!slug) return routes.clubeDashboard;
  if (contentType === "article") return routes.artigo(slug);
  if (contentType === "protocol") return routes.protocolo(slug);
  return routes.bibliotecaItem(slug);
}

function mapRpcRow(row: RpcRecommendationRow): ClubRecommendation {
  const contentType = row.content_type as ClubRecommendation["contentType"];
  return {
    id: row.content_id,
    contentType,
    title: row.content_title,
    description: row.reason,
    href: buildHref(contentType, row.content_slug || null),
    categoryLabel: row.category_label,
    isPremium: row.is_premium,
    reason: row.reason,
    kind: row.kind as RecommendationKind,
    score: Number(row.score),
    source: "ai",
  };
}

export async function fetchIntelligentRecommendations(input: {
  userId: string;
  isPremium: boolean;
  limit?: number;
}): Promise<ClubRecommendation[]> {
  const supabase = await createClient();
  const limit = input.limit ?? 12;

  const { data, error } = await supabase.rpc("get_user_recommendations", {
    p_user_id: input.userId,
    p_limit: limit,
    p_include_premium: input.isPremium,
  });

  if (error) {
    return getFallbackRecommendations({
      userId: input.userId,
      isPremium: input.isPremium,
      limit,
    });
  }

  return ((data ?? []) as RpcRecommendationRow[]).map(mapRpcRow);
}

export async function fetchContinueReading(
  userId: string,
  limit = 5,
): Promise<ContinueReadingItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_content_history")
    .select(
      "id, content_type, content_id, content_title, content_slug, access_count, last_accessed_at, completed",
    )
    .eq("user_id", userId)
    .eq("completed", false)
    .order("last_accessed_at", { ascending: false })
    .limit(limit);

  if (error) {
    if (error.code === "42P01") return [];
    throw error;
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    contentType: row.content_type as FavoriteContentType,
    contentId: row.content_id,
    title: row.content_title,
    slug: row.content_slug,
    href: buildHref(row.content_type, row.content_slug),
    accessCount: row.access_count,
    lastAccessedAt: row.last_accessed_at,
    completed: row.completed,
  }));
}

export async function fetchContentRankings(
  period: "30d" | "7d" | "all_time" = "30d",
  limit = 10,
): Promise<ContentRankingItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_rankings")
    .select(
      "id, content_type, content_key, content_title, content_slug, view_count, download_count, score, rank_position, ranking_period",
    )
    .eq("ranking_period", period)
    .order("rank_position", { ascending: true })
    .limit(limit);

  if (error) {
    if (error.code === "42P01") return [];
    throw error;
  }

  return (data ?? []).map((row) => {
    const contentType = row.content_type as ContentRankingItem["contentType"];
    const slug = row.content_slug;
    return {
      id: row.id,
      contentType,
      contentKey: row.content_key,
      title: row.content_title,
      slug,
      href: buildHref(contentType, slug),
      viewCount: row.view_count,
      downloadCount: row.download_count,
      score: Number(row.score),
      rankPosition: row.rank_position,
      period: row.ranking_period as ContentRankingItem["period"],
    };
  });
}

export async function fetchRelatedRecommendations(input: {
  userId: string;
  isPremium: boolean;
  contentType: FavoriteContentType;
  contentId: string;
  limit?: number;
}): Promise<ClubRecommendation[]> {
  const all = await fetchIntelligentRecommendations({
    userId: input.userId,
    isPremium: input.isPremium,
    limit: input.limit ?? 4,
  });

  return all.filter((item) => item.kind === "related");
}

export async function refreshContentRankings(): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("refresh_content_rankings");
  if (error) throw error;
  return typeof data === "number" ? data : 0;
}
