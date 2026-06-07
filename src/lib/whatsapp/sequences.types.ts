import type { WhatsAppTemplateKey } from "./types";

export interface WhatsAppSequenceContext {
  name?: string | null;
  interestLabel?: string | null;
  planName?: string | null;
  renewalDate?: string | null;
}

export interface WhatsAppAutomationStep {
  id: string;
  type: "immediate" | "delay";
  delayHours?: number;
  templateKey: WhatsAppTemplateKey;
  buildParameters: (ctx: WhatsAppSequenceContext) => string[];
}

export interface WhatsAppSequence {
  id: string;
  name: string;
  minScore?: string;
  steps: WhatsAppAutomationStep[];
}
