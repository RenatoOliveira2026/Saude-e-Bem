import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Json } from "@/lib/supabase/types";
import {
  isSavableToolSlug,
  SAVABLE_TOOL_SLUGS,
  TOOL_SLUG_LABELS,
  type SavableToolSlug,
} from "../constants";
import { summarizeToolResult } from "../summaries";
import type { ToolResultSummary, UserToolResultRecord } from "../types";

function mapRow(row: {
  id: string;
  user_id: string;
  tool_slug: string;
  result_json: Json;
  created_at: string;
}): UserToolResultRecord {
  return {
    id: row.id,
    userId: row.user_id,
    toolSlug: row.tool_slug,
    resultJson:
      row.result_json && typeof row.result_json === "object" && !Array.isArray(row.result_json)
        ? (row.result_json as Record<string, unknown>)
        : {},
    createdAt: row.created_at,
  };
}

export async function insertUserToolResult(
  userId: string,
  toolSlug: SavableToolSlug,
  resultJson: Record<string, unknown>,
): Promise<{ ok: boolean; error?: string; id?: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase não configurado" };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || user.id !== userId) {
    return { ok: false, error: "Usuário não autenticado" };
  }

  const { data, error } = await supabase.rpc("save_user_tool_result", {
    p_tool_slug: toolSlug,
    p_result_json: resultJson as Json,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, id: data ?? undefined };
}

export async function fetchUserToolResults(
  userId: string,
  limit = 100,
): Promise<UserToolResultRecord[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_tool_results")
    .select("id, user_id, tool_slug, result_json, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data.map(mapRow);
}

export function buildLatestSummaries(
  records: UserToolResultRecord[],
): ToolResultSummary[] {
  const latest = new Map<SavableToolSlug, UserToolResultRecord>();

  for (const record of records) {
    if (!isSavableToolSlug(record.toolSlug)) continue;
    if (!latest.has(record.toolSlug)) {
      latest.set(record.toolSlug, record);
    }
  }

  return SAVABLE_TOOL_SLUGS.filter((slug) => latest.has(slug)).map((slug) => {
    const record = latest.get(slug)!;
    return summarizeToolResult(
      slug,
      TOOL_SLUG_LABELS[slug],
      record.resultJson,
      record.createdAt,
      record.id,
    );
  });
}

export function formatHealthDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
