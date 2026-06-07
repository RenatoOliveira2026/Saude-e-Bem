import { recordLeadInteraction } from "@/lib/crm/interactions";
import { sendWhatsAppTemplate } from "./client";
import { canSendWhatsApp } from "./config";
import {
  findLeadByEmailForWhatsApp,
  insertWhatsAppMessage,
} from "./messages.service";
import type { SendTemplateInput, WhatsAppTemplateKey } from "./types";

async function canSendToLead(lead: {
  whatsappOptIn: boolean;
  whatsappOptOutAt: string | null;
}): Promise<boolean> {
  return lead.whatsappOptIn && !lead.whatsappOptOutAt;
}

export async function sendWhatsAppTemplateToLead(
  input: SendTemplateInput & { skipOptInCheck?: boolean },
): Promise<{ ok: boolean; messageId: string | null; error?: string }> {
  if (!canSendWhatsApp()) {
    return { ok: false, messageId: null, error: "WhatsApp não configurado." };
  }

  const queued = await insertWhatsAppMessage({
    leadId: input.leadId,
    userId: input.userId,
    direction: "outbound",
    templateKey: input.templateKey,
    phone: input.phone,
    status: "queued",
    metadata: input.metadata,
  });

  const result = await sendWhatsAppTemplate(input);

  if (!result.ok) {
    if (queued) {
      await insertWhatsAppMessage({
        leadId: input.leadId,
        userId: input.userId,
        direction: "outbound",
        templateKey: input.templateKey,
        phone: input.phone,
        status: "failed",
        errorMessage: result.error,
        metadata: input.metadata,
      });
    }
    return { ok: false, messageId: null, error: result.error };
  }

  const sent = await insertWhatsAppMessage({
    leadId: input.leadId,
    userId: input.userId,
    direction: "outbound",
    templateKey: input.templateKey,
    phone: input.phone,
    status: result.stub ? "sent" : "sent",
    providerMessageId: result.providerMessageId,
    metadata: { ...input.metadata, stub: result.stub },
  });

  if (input.leadId) {
    await recordLeadInteraction({
      leadId: input.leadId,
      eventType: "whatsapp_sent",
      title: `WhatsApp: ${input.templateKey}`,
      description: result.stub ? "Envio simulado (stub)" : "Template enviado",
      source: "whatsapp",
      metadata: {
        template_key: input.templateKey,
        provider_message_id: result.providerMessageId,
      },
    });
  }

  return { ok: true, messageId: sent?.id ?? null };
}

export async function sendPremiumConfirmationWhatsApp(input: {
  userId: string;
  email: string;
  planName: string;
}): Promise<void> {
  const lead = await findLeadByEmailForWhatsApp(input.email);
  if (!lead?.phone || !(await canSendToLead(lead))) return;

  await sendWhatsAppTemplateToLead({
    phone: lead.phone,
    templateKey: "sb_pagamento_confirmado",
    bodyParameters: [input.planName],
    leadId: lead.id,
    userId: input.userId,
    metadata: { trigger: "subscription_activated", plan_name: input.planName },
    skipOptInCheck: true,
  });
}

export async function sendWelcomeWhatsApp(input: {
  leadId: string;
  phone: string;
  name: string;
}): Promise<void> {
  await sendWhatsAppTemplateToLead({
    phone: input.phone,
    templateKey: "sb_boas_vindas",
    bodyParameters: [input.name],
    leadId: input.leadId,
    metadata: { trigger: "lead_opt_in" },
  });
}

export async function sendRenewalReminderWhatsApp(input: {
  leadId: string;
  phone: string;
  renewalDate: string;
}): Promise<void> {
  await sendWhatsAppTemplateToLead({
    phone: input.phone,
    templateKey: "sb_renovacao_lembrete",
    bodyParameters: [input.renewalDate],
    leadId: input.leadId,
    metadata: { trigger: "renewal_reminder" },
  });
}

export type { WhatsAppTemplateKey };
