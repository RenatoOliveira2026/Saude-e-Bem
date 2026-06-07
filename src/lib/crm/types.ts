import type { LeadScoreId } from "@/lib/leads/lead-score";
import type { LeadSource } from "@/lib/leads/lead.types";
import type { EmailAutomationProviderId } from "@/lib/email-automation/types";

export type LeadInteractionEventType =
  | "lead_captured"
  | "lead_recaptured"
  | "score_upgraded"
  | "sequence_started"
  | "sequence_step_sent"
  | "sequence_step_scheduled"
  | "sequence_completed"
  | "sequence_failed"
  | "esp_synced"
  | "esp_sync_failed"
  | "whatsapp_inbound"
  | "whatsapp_sent"
  | "whatsapp_opt_out";

export type LeadAutomationRunStatus = "active" | "completed" | "failed" | "paused";

export interface LeadInteractionRecord {
  id: string;
  leadId: string;
  eventType: LeadInteractionEventType;
  title: string;
  description: string | null;
  source: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface LeadAutomationRunRecord {
  id: string;
  leadId: string;
  sequenceId: string;
  status: LeadAutomationRunStatus;
  currentStepIndex: number;
  stepsCompleted: unknown[];
  nextStepAt: string | null;
  espProvider: EmailAutomationProviderId | null;
  startedAt: string;
  completedAt: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface PipelineColumn {
  score: LeadScoreId;
  label: string;
  count: number;
  leads: {
    id: string;
    name: string | null;
    email: string;
    source: LeadSource;
    interest: string | null;
    updatedAt: string;
  }[];
}

export interface SourceConversionMetric {
  source: LeadSource;
  label: string;
  total: number;
  hotCount: number;
  hotRate: number;
  last7Days: number;
  last30Days: number;
}

export interface ConversionDashboardData {
  totalLeads: number;
  hotLeads: number;
  hotRate: number;
  activeAutomations: number;
  pendingSteps: number;
  espConfigured: boolean;
  configuredProviders: EmailAutomationProviderId[];
  pipeline: PipelineColumn[];
  bySource: SourceConversionMetric[];
  recentInteractions: LeadInteractionRecord[];
}
