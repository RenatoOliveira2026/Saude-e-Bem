import type { FavoriteContentType } from "@/lib/favorites/types";
import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";
import type { UserContentAccessRow } from "@/lib/supabase/types";
import type { ContentAccessEntry } from "../types";

function buildHref(
  contentType: FavoriteContentType,
  slug: string | null,
): string {
  if (!slug) return routes.clubeDashboard;
  if (contentType === "article") return routes.artigo(slug);
  if (contentType === "protocol") return routes.protocolo(slug);
  return routes.bibliotecaItem(slug);
}

function mapAccessRow(row: UserContentAccessRow): ContentAccessEntry {
  return {
    id: row.id,
    contentType: row.content_type,
    contentId: row.content_id,
    contentTitle: row.content_title,
    contentSlug: row.content_slug,
    sourcePath: row.source_path,
    createdAt: row.created_at,
    href: buildHref(row.content_type, row.content_slug),
  };
}

export async function fetchUserAccessHistory(
  userId: string,
  limit = 30,
): Promise<ContentAccessEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_content_access")
    .select(
      "id, user_id, content_type, content_id, content_title, content_slug, source_path, created_at",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map(mapAccessRow);
}

export async function recordContentAccess(input: {
  userId: string;
  contentType: FavoriteContentType;
  contentId: string;
  contentTitle: string;
  contentSlug?: string | null;
  sourcePath?: string | null;
}): Promise<void> {
  const supabase = await createClient();

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const { data: recent } = await supabase
    .from("user_content_access")
    .select("id")
    .eq("user_id", input.userId)
    .eq("content_type", input.contentType)
    .eq("content_id", input.contentId)
    .gte("created_at", fiveMinutesAgo)
    .limit(1)
    .maybeSingle();

  if (recent) return;

  const { error } = await supabase.from("user_content_access").insert({
    user_id: input.userId,
    content_type: input.contentType,
    content_id: input.contentId,
    content_title: input.contentTitle,
    content_slug: input.contentSlug ?? null,
    source_path: input.sourcePath ?? null,
  });

  if (error) throw error;
}

export async function countUserAccessHistory(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("user_content_access")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) throw error;
  return count ?? 0;
}
