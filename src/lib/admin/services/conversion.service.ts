import {
  countActiveAutomations,
  countPendingSteps,
} from "@/lib/crm/automation-runs";
import { listRecentInteractions } from "@/lib/crm/interactions";
import { buildSourceConversionMetrics, getPipelineColumns } from "@/lib/crm/pipeline";
import type { ConversionDashboardData } from "@/lib/crm/types";
import {
  configuredEmailProviders,
  isEmailAutomationConfigured,
} from "@/lib/email-automation";
import { LEAD_SCORE_ORDER, type LeadScoreId } from "@/lib/leads/lead-score";
import { createClient } from "@/lib/supabase/server";

export async function getConversionDashboard(): Promise<ConversionDashboardData> {
  const supabase = await createClient();
  const [leadsResult, pipeline, recentInteractions, activeAutomations, pendingSteps] =
    await Promise.all([
      supabase.from("newsletter_leads").select("source, lead_score, created_at"),
      getPipelineColumns(6),
      listRecentInteractions(15),
      countActiveAutomations(),
      countPendingSteps(),
    ]);

  if (leadsResult.error) throw leadsResult.error;

  const rows = leadsResult.data ?? [];
  const hotLeads = rows.filter((row) =>
    (["quente", "muito_quente"] as LeadScoreId[]).includes(row.lead_score as LeadScoreId),
  ).length;

  return {
    totalLeads: rows.length,
    hotLeads,
    hotRate: rows.length > 0 ? Math.round((hotLeads / rows.length) * 100) : 0,
    activeAutomations,
    pendingSteps,
    espConfigured: isEmailAutomationConfigured(),
    configuredProviders: configuredEmailProviders(),
    pipeline,
    bySource: buildSourceConversionMetrics(rows),
    recentInteractions,
  };
}
