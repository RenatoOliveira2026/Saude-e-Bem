import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";
import type { ResolvedSavedProtocol, SavedProtocol } from "./types";

export async function resolveSavedProtocols(
  saved: SavedProtocol[],
): Promise<ResolvedSavedProtocol[]> {
  if (saved.length === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("protocols")
    .select("id, slug, title, category_label, is_premium")
    .in(
      "id",
      saved.map((s) => s.protocolId),
    );

  if (error) throw error;

  const map = new Map((data ?? []).map((row) => [row.id, row]));
  const resolved: ResolvedSavedProtocol[] = [];

  for (const item of saved) {
    const row = map.get(item.protocolId);
    if (!row) continue;
    resolved.push({
      id: item.id,
      protocolId: item.protocolId,
      title: row.title,
      slug: row.slug,
      href: routes.protocolo(row.slug),
      categoryLabel: row.category_label,
      isPremium: row.is_premium,
      status: item.status,
      savedAt: item.savedAt,
      updatedAt: item.updatedAt,
    });
  }

  return resolved;
}
