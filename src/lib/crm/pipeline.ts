import {
  LEAD_SCORE_LABELS,
  LEAD_SCORE_ORDER,
  type LeadScoreId,
} from "@/lib/leads/lead-score";
import { LEAD_SOURCE_LABELS, parseLeadSource } from "@/lib/leads/lead.constants";
import type { LeadSource } from "@/lib/leads/lead.types";
import type { PipelineColumn, SourceConversionMetric } from "@/lib/crm/types";
import { createClient } from "@/lib/supabase/server";

const HOT_SCORES: LeadScoreId[] = ["quente", "muito_quente"];

export async function getPipelineColumns(limitPerColumn = 8): Promise<PipelineColumn[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("newsletter_leads")
    .select("id, name, email, source, interest, lead_score, updated_at, created_at")
    .order("updated_at", { ascending: false });

  if (error) throw error;

  const rows = data ?? [];

  return LEAD_SCORE_ORDER.map((score) => {
    const columnLeads = rows
      .filter((row) => (row.lead_score as LeadScoreId) === score)
      .slice(0, limitPerColumn)
      .map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        source: parseLeadSource(row.source),
        interest: row.interest,
        updatedAt: row.updated_at ?? row.created_at,
      }));

    return {
      score,
      label: LEAD_SCORE_LABELS[score],
      count: rows.filter((row) => row.lead_score === score).length,
      leads: columnLeads,
    };
  });
}

export function buildSourceConversionMetrics(
  rows: {
    source: string;
    lead_score: string;
    created_at: string;
  }[],
): SourceConversionMetric[] {
  const now = Date.now();
  const day7 = now - 7 * 24 * 60 * 60 * 1000;
  const day30 = now - 30 * 24 * 60 * 60 * 1000;

  const bySource = new Map<
    LeadSource,
    { total: number; hot: number; last7: number; last30: number }
  >();

  for (const row of rows) {
    const source = parseLeadSource(row.source);
    const current = bySource.get(source) ?? { total: 0, hot: 0, last7: 0, last30: 0 };
    current.total += 1;
    if (HOT_SCORES.includes(row.lead_score as LeadScoreId)) current.hot += 1;

    const created = new Date(row.created_at).getTime();
    if (created >= day7) current.last7 += 1;
    if (created >= day30) current.last30 += 1;

    bySource.set(source, current);
  }

  return [...bySource.entries()]
    .map(([source, stats]) => ({
      source,
      label: LEAD_SOURCE_LABELS[source] ?? source,
      total: stats.total,
      hotCount: stats.hot,
      hotRate: stats.total > 0 ? Math.round((stats.hot / stats.total) * 100) : 0,
      last7Days: stats.last7,
      last30Days: stats.last30,
    }))
    .sort((a, b) => b.total - a.total);
}
