export type WhatsAppMessageDirection = "inbound" | "outbound";
export type WhatsAppMessageStatus =
  | "queued"
  | "sent"
  | "delivered"
  | "read"
  | "failed"
  | "received";

export type WhatsAppTemplateKey =
  | "sb_boas_vindas"
  | "sb_nutricao_d1"
  | "sb_pagamento_confirmado"
  | "sb_renovacao_lembrete"
  | "sb_reengajamento";

export interface WhatsAppTemplate {
  id: string;
  templateKey: WhatsAppTemplateKey;
  metaName: string;
  languageCode: string;
  category: string;
  status: "pending" | "approved" | "rejected" | "paused";
  bodyPreview: string | null;
  variables: string[];
  active: boolean;
}

export interface WhatsAppMessage {
  id: string;
  leadId: string | null;
  userId: string | null;
  direction: WhatsAppMessageDirection;
  messageType: string;
  templateKey: string | null;
  phone: string;
  body: string | null;
  status: WhatsAppMessageStatus;
  providerMessageId: string | null;
  errorMessage: string | null;
  metadata: Record<string, unknown>;
  sentAt: string | null;
  deliveredAt: string | null;
  readAt: string | null;
  createdAt: string;
}

export interface WhatsAppAutomationRun {
  id: string;
  leadId: string;
  sequenceId: string;
  status: "active" | "completed" | "failed" | "paused";
  currentStepIndex: number;
  stepsCompleted: unknown[];
  nextStepAt: string | null;
  startedAt: string;
  completedAt: string | null;
  metadata: Record<string, unknown>;
}

export interface SendTemplateInput {
  phone: string;
  templateKey: WhatsAppTemplateKey;
  bodyParameters?: string[];
  leadId?: string | null;
  userId?: string | null;
  metadata?: Record<string, unknown>;
}

export interface WhatsAppWebhookPayload {
  object?: string;
  entry?: Array<{
    id?: string;
    changes?: Array<{
      field?: string;
      value?: {
        messaging_product?: string;
        metadata?: { display_phone_number?: string; phone_number_id?: string };
        contacts?: Array<{ profile?: { name?: string }; wa_id?: string }>;
        messages?: Array<{
          from?: string;
          id?: string;
          timestamp?: string;
          type?: string;
          text?: { body?: string };
        }>;
        statuses?: Array<{
          id?: string;
          status?: string;
          timestamp?: string;
          recipient_id?: string;
        }>;
      };
    }>;
  }>;
}
