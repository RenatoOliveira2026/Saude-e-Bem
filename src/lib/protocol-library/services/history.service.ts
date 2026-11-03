import { createClient } from "@/lib/supabase/server";
import { routes } from "@/lib/routes";
import { isUuid } from "../utils";
import type { ProtocolHistoryEntry } from "../types";

export { isUuid } from "../utils";

export async function recordProtocolView(
  userId: string,
  protocolId: string,
): Promise<void> {
  if (!isUuid(protocolId)) return;

  const supabase = await createClient();
  const { error } = await supabase.rpc("record_protocol_view", {
    p_user_id: userId,
    p_protocol_id: protocolId,
  });

  if (error) throw error;
}

export async function fetchUserProtocolHistory(
  userId: string,
  limit = 12,
): Promise<ProtocolHistoryEntry[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_protocol_history")
    .select("id, protocol_id, view_count, last_viewed_at")
    .eq("user_id", userId)
    .order("last_viewed_at", { ascending: false })
    .limit(limit);

  if (error) {
    return fetchProtocolHistoryFromContentHistory(userId, limit);
  }

  const rows = data ?? [];
  if (rows.length === 0) return [];

  // T-05: título e slug vêm do catálogo público (protocolos premium não
  // aparecem na tabela para quem não é assinante).
  const { data: protocols, error: protocolsError } = await supabase
    .from("protocols_public")
    .select("id, slug, title, is_premium")
    .in(
      "id",
      rows.map((row) => row.protocol_id),
    );

  if (protocolsError) {
    return fetchProtocolHistoryFromContentHistory(userId, limit);
  }

  const byId = new Map((protocols ?? []).map((p) => [p.id, p]));

  return rows
    .map((row) => {
      const protocol = byId.get(row.protocol_id);
      if (!protocol?.slug) return null;
      return {
        id: row.id,
        protocolId: row.protocol_id,
        protocolSlug: protocol.slug,
        protocolTitle: protocol.title,
        viewCount: row.view_count,
        lastViewedAt: row.last_viewed_at,
        isPremium: protocol.is_premium,
      } satisfies ProtocolHistoryEntry;
    })
    .filter((e): e is ProtocolHistoryEntry => e !== null);
}

async function fetchProtocolHistoryFromContentHistory(
  userId: string,
  limit: number,
): Promise<ProtocolHistoryEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_content_history")
    .select("id, content_id, content_title, content_slug, access_count, last_accessed_at")
    .eq("user_id", userId)
    .eq("content_type", "protocol")
    .order("last_accessed_at", { ascending: false })
    .limit(limit);

  if (error) return [];

  return (data ?? []).map((row) => ({
    id: row.id,
    protocolId: row.content_id,
    protocolSlug: row.content_slug ?? "",
    protocolTitle: row.content_title,
    viewCount: row.access_count,
    lastViewedAt: row.last_accessed_at,
    isPremium: false,
  }));
}

export function historyEntryHref(entry: ProtocolHistoryEntry): string {
  return entry.protocolSlug
    ? routes.protocolo(entry.protocolSlug)
    : routes.protocolos;
}
