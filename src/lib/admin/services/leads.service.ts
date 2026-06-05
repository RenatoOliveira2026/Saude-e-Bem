import type { LeadScoreId } from "@/lib/leads/lead-score";
import { LEAD_SCORE_LABELS, LEAD_SCORE_ORDER } from "@/lib/leads/lead-score";
import {
  getLeadInterestLabel,
  LEAD_SOURCE_LABELS,
  parseLeadSource,
} from "@/lib/leads/lead.constants";
import type { LeadSource } from "@/lib/leads/lead.types";
import { createClient } from "@/lib/supabase/server";
import type { NewsletterLeadRow } from "@/lib/supabase/types";

export interface AdminLeadRecord {
  id: string;
  name: string | null;
  email: string;
  source: LeadSource;
  interest: string | null;
  leadScore: LeadScoreId;
  contentContext: Record<string, unknown>;
  interactionCount: number;
  lastInteractionAt: string | null;
  espProvider: string | null;
  espSyncedAt: string | null;
  espSyncError: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLeadStats {
  total: number;
  last7Days: number;
  last30Days: number;
  byScore: Record<LeadScoreId, number>;
  bySource: Partial<Record<LeadSource, number>>;
}

function mapRow(row: NewsletterLeadRow): AdminLeadRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    source: parseLeadSource(row.source),
    interest: row.interest,
    leadScore: (row.lead_score as LeadScoreId) ?? "frio",
    contentContext: row.content_context ?? {},
    interactionCount: row.interaction_count ?? 0,
    lastInteractionAt: row.last_interaction_at,
    espProvider: row.esp_provider,
    espSyncedAt: row.esp_synced_at,
    espSyncError: row.esp_sync_error,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? row.created_at,
  };
}

export async function getAdminLeadById(id: string): Promise<AdminLeadRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("newsletter_leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapRow(data) : null;
}

export async function adminListLeads(options?: {
  source?: LeadSource;
  interest?: string;
  score?: LeadScoreId;
  limit?: number;
}): Promise<AdminLeadRecord[]> {
  const supabase = await createClient();
  let query = supabase
    .from("newsletter_leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (options?.source) query = query.eq("source", options.source);
  if (options?.interest) query = query.eq("interest", options.interest);
  if (options?.score) query = query.eq("lead_score", options.score);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map(mapRow);
}

export async function getAdminLeadStats(): Promise<AdminLeadStats> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("newsletter_leads")
    .select("source, lead_score, created_at");

  if (error) throw error;

  const rows = data ?? [];
  const now = Date.now();
  const day7 = now - 7 * 24 * 60 * 60 * 1000;
  const day30 = now - 30 * 24 * 60 * 60 * 1000;

  const byScore = Object.fromEntries(
    LEAD_SCORE_ORDER.map((s) => [s, 0]),
  ) as Record<LeadScoreId, number>;
  const bySource: Partial<Record<LeadSource, number>> = {};

  let last7Days = 0;
  let last30Days = 0;

  for (const row of rows) {
    const score = (row.lead_score as LeadScoreId) ?? "frio";
    if (score in byScore) byScore[score] += 1;

    const source = parseLeadSource(row.source);
    bySource[source] = (bySource[source] ?? 0) + 1;

    const created = new Date(row.created_at).getTime();
    if (created >= day7) last7Days += 1;
    if (created >= day30) last30Days += 1;
  }

  return {
    total: rows.length,
    last7Days,
    last30Days,
    byScore,
    bySource,
  };
}

export function leadsToCsv(rows: AdminLeadRecord[]): string {
  const header = [
    "id",
    "name",
    "email",
    "source",
    "interest",
    "lead_score",
    "content_type",
    "content_slug",
    "created_at",
  ];
  const lines = rows.map((row) => {
    const ctx = row.contentContext;
    return [
      row.id,
      row.name ?? "",
      row.email,
      LEAD_SOURCE_LABELS[row.source] ?? row.source,
      row.interest ? getLeadInterestLabel(row.interest) ?? row.interest : "",
      LEAD_SCORE_LABELS[row.leadScore],
      String(ctx.content_type ?? ""),
      String(ctx.content_slug ?? ""),
      row.createdAt,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",");
  });
  return [header.join(","), ...lines].join("\n");
}
