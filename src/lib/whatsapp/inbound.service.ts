import { recordLeadInteraction } from "@/lib/crm/interactions";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import {
  findLeadByPhone,
  insertWhatsAppMessage,
  updateWhatsAppMessageStatus,
} from "./messages.service";
import { waIdToE164 } from "./phone";
import type { WhatsAppWebhookPayload } from "./types";

export async function processWhatsAppWebhook(
  payload: WhatsAppWebhookPayload,
): Promise<{ processed: number }> {
  let processed = 0;

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value;
      if (!value) continue;

      for (const message of value.messages ?? []) {
        if (!message.from || !message.id) continue;

        const phone = waIdToE164(message.from);
        const body =
          message.type === "text" ? (message.text?.body ?? null) : null;

        const lead = await findLeadByPhone(phone);

        await insertWhatsAppMessage({
          leadId: lead?.id,
          direction: "inbound",
          messageType: message.type ?? "text",
          phone,
          body,
          status: "received",
          providerMessageId: message.id,
          metadata: {
            timestamp: message.timestamp,
            contact_name: value.contacts?.[0]?.profile?.name,
          },
        });

        if (lead) {
          const lower = body?.toLowerCase() ?? "";
          if (
            lower.includes("sair") ||
            lower.includes("cancelar") ||
            lower.includes("stop")
          ) {
            const admin = getServiceRoleClient();
            if (admin) {
              await admin
                .from("newsletter_leads")
                .update({
                  whatsapp_opt_in: false,
                  whatsapp_opt_out_at: new Date().toISOString(),
                })
                .eq("id", lead.id);
            }
            await recordLeadInteraction({
              leadId: lead.id,
              eventType: "whatsapp_opt_out",
              title: "Opt-out WhatsApp",
              description: body ?? "Solicitação de opt-out",
              source: "whatsapp",
            });
          } else {
            await recordLeadInteraction({
              leadId: lead.id,
              eventType: "whatsapp_inbound",
              title: "Mensagem recebida",
              description: body ?? `[${message.type}]`,
              source: "whatsapp",
              metadata: { provider_message_id: message.id },
            });
          }
        }

        processed += 1;
      }

      for (const status of value.statuses ?? []) {
        if (!status.id || !status.status) continue;

        const mapped =
          status.status === "delivered"
            ? "delivered"
            : status.status === "read"
              ? "read"
              : status.status === "sent"
                ? "sent"
                : status.status === "failed"
                  ? "failed"
                  : null;

        if (mapped) {
          await updateWhatsAppMessageStatus({
            providerMessageId: status.id,
            status: mapped,
          });
          processed += 1;
        }
      }
    }
  }

  return { processed };
}
