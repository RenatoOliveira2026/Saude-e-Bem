import {
  adminListLeads,
  getAdminLeadStats,
  type AdminLeadRecord,
} from "@/lib/admin/services/leads.service";
import {
  configuredEmailProviders,
  isEmailAutomationConfigured,
} from "@/lib/email-automation";
import { LAUNCH_EMAIL_TEMPLATES, LAUNCH_SEQUENCE_ID } from "@/lib/email-automation/launch-templates";
import { EMAIL_AUTOMATION_SEQUENCES } from "@/lib/email-automation/sequences";
import type { LeadSource } from "@/lib/leads/lead.types";
import { LEAD_SOURCE_LABELS } from "@/lib/leads/lead.constants";

const VIP_SOURCE: LeadSource = "lista-vip-lancamento";

const LAUNCH_FUNNEL_SOURCES: LeadSource[] = [
  "lista-vip-lancamento",
  "home",
  "blog",
  "biblioteca",
  "protocolo",
  "assinar",
];

export interface LaunchDashboardData {
  vipTotal: number;
  vipLast7Days: number;
  vipLast30Days: number;
  vipSharePercent: number;
  engagementRate: number;
  brevoSynced: number;
  brevoErrors: number;
  brevoPending: number;
  espConfigured: boolean;
  configuredProviders: string[];
  sequenceId: string;
  emailTemplates: typeof LAUNCH_EMAIL_TEMPLATES;
  automationSteps: number;
  byOrigin: { source: LeadSource; label: string; count: number }[];
  recentVipLeads: AdminLeadRecord[];
}

export async function getLaunchDashboard(): Promise<LaunchDashboardData> {
  const [vipLeads, stats] = await Promise.all([
    adminListLeads({ source: VIP_SOURCE }),
    getAdminLeadStats(),
  ]);

  const now = Date.now();
  const day7 = now - 7 * 24 * 60 * 60 * 1000;
  const day30 = now - 30 * 24 * 60 * 60 * 1000;

  const vipLast7Days = vipLeads.filter(
    (l) => new Date(l.createdAt).getTime() >= day7,
  ).length;
  const vipLast30Days = vipLeads.filter(
    (l) => new Date(l.createdAt).getTime() >= day30,
  ).length;

  const brevoSynced = vipLeads.filter((l) => l.espSyncedAt && !l.espSyncError).length;
  const brevoErrors = vipLeads.filter((l) => l.espSyncError).length;
  const brevoPending = vipLeads.length - brevoSynced - brevoErrors;

  const engaged = vipLeads.filter((l) => l.interactionCount > 1).length;
  const engagementRate =
    vipLeads.length > 0 ? Math.round((engaged / vipLeads.length) * 100) : 0;

  const vipSharePercent =
    stats.total > 0 ? Math.round((vipLeads.length / stats.total) * 100) : 0;

  const byOrigin = LAUNCH_FUNNEL_SOURCES.map((source) => ({
    source,
    label: LEAD_SOURCE_LABELS[source],
    count: stats.bySource[source] ?? 0,
  })).filter((row) => row.count > 0);

  const launchSequence = EMAIL_AUTOMATION_SEQUENCES.find(
    (s) => s.id === LAUNCH_SEQUENCE_ID,
  );

  return {
    vipTotal: stats.bySource[VIP_SOURCE] ?? vipLeads.length,
    vipLast7Days,
    vipLast30Days,
    vipSharePercent,
    engagementRate,
    brevoSynced,
    brevoErrors,
    brevoPending,
    espConfigured: isEmailAutomationConfigured(),
    configuredProviders: configuredEmailProviders(),
    sequenceId: LAUNCH_SEQUENCE_ID,
    emailTemplates: LAUNCH_EMAIL_TEMPLATES,
    automationSteps: launchSequence?.steps.length ?? 5,
    byOrigin,
    recentVipLeads: vipLeads.slice(0, 20),
  };
}
