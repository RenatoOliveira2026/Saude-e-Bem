import type { LeadInterestId, LeadSource } from "@/lib/leads/lead.types";
import type { LeadScoreId } from "@/lib/leads/lead-score";

export type EmailAutomationProviderId =
  | "brevo"
  | "mailerlite"
  | "rdstation"
  | "hubspot";

export type EmailAutomationStepType = "immediate" | "delay" | "tag";

export interface EmailAutomationStep {
  id: string;
  type: EmailAutomationStepType;
  delayHours?: number;
  subject: string;
  templateKey: string;
}

export interface EmailAutomationSequence {
  id: string;
  name: string;
  interest: LeadInterestId | "default";
  minScore: LeadScoreId;
  steps: EmailAutomationStep[];
}

export interface LeadAutomationPayload {
  email: string;
  name: string | null;
  source: LeadSource;
  interest: LeadInterestId;
  leadScore: LeadScoreId;
  contentContext?: Record<string, unknown>;
}

export interface AutomationDispatchResult {
  ok: boolean;
  provider?: EmailAutomationProviderId;
  sequenceId?: string;
  runId?: string;
  skipped?: boolean;
  reason?: string;
}
