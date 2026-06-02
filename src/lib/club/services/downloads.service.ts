import type { FavoriteContentType } from "@/lib/favorites/types";
import { createClient } from "@/lib/supabase/server";
import type { UserDownloadRow } from "@/lib/supabase/types";
import type { UserDownload } from "../types";

function mapDownloadRow(row: UserDownloadRow): UserDownload {
  return {
    id: row.id,
    userId: row.user_id,
    contentType: row.content_type as FavoriteContentType,
    contentId: row.content_id,
    contentTitle: row.content_title,
    contentSlug: row.content_slug,
    createdAt: row.created_at,
  };
}

export async function fetchUserDownloads(userId: string): Promise<UserDownload[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_downloads")
    .select(
      "id, user_id, content_type, content_id, content_title, content_slug, created_at",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return (data ?? []).map(mapDownloadRow);
}

export async function recordUserDownload(input: {
  userId: string;
  contentType: FavoriteContentType;
  contentId: string;
  contentTitle: string;
  contentSlug?: string | null;
}): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("user_downloads").insert({
    user_id: input.userId,
    content_type: input.contentType,
    content_id: input.contentId,
    content_title: input.contentTitle,
    content_slug: input.contentSlug ?? null,
  });

  if (error) throw error;
}
