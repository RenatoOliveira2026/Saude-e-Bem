import { getServiceRoleClient } from "@/lib/supabase/service-role";
import type {
  WhatsAppMessage,
  WhatsAppMessageDirection,
  WhatsAppMessageStatus,
} from "./types";

function mapRow(row: {
  id: string;
  lead_id: string | null;
  user_id: string | null;
  direction: string;
  message_type: string;
  template_key: string | null;
  phone: string;
  body: string | null;
  status: string;
  provider_message_id: string | null;
  error_message: string | null;
  metadata: Record<string, unknown> | null;
  sent_at: string | null;
  delivered_at: string | null;
  read_at: string | null;
  created_at: string;
}): WhatsAppMessage {
  return {
    id: row.id,
    leadId: row.lead_id,
    userId: row.user_id,
    direction: row.direction as WhatsAppMessageDirection,
    messageType: row.message_type,
    templateKey: row.template_key,
    phone: row.phone,
    body: row.body,
    status: row.status as WhatsAppMessageStatus,
    providerMessageId: row.provider_message_id,
    errorMessage: row.error_message,
    metadata: row.metadata ?? {},
    sentAt: row.sent_at,
    deliveredAt: row.delivered_at,
    readAt: row.read_at,
    createdAt: row.created_at,
  };
}

export async function insertWhatsAppMessage(input: {
  leadId?: string | null;
  userId?: string | null;
  direction: WhatsAppMessageDirection;
  messageType?: string;
  templateKey?: string | null;
  phone: string;
  body?: string | null;
  status: WhatsAppMessageStatus;
  providerMessageId?: string | null;
  errorMessage?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<WhatsAppMessage | null> {
  const admin = getServiceRoleClient();
  if (!admin) return null;

  const { data, error } = await admin
    .from("whatsapp_messages")
    .insert({
      lead_id: input.leadId ?? null,
      user_id: input.userId ?? null,
      direction: input.direction,
      message_type: input.messageType ?? (input.templateKey ? "template" : "text"),
      template_key: input.templateKey ?? null,
      phone: input.phone,
      body: input.body ?? null,
      status: input.status,
      provider_message_id: input.providerMessageId ?? null,
      error_message: input.errorMessage ?? null,
      metadata: input.metadata ?? {},
      sent_at: input.status === "sent" ? new Date().toISOString() : null,
    })
    .select("*")
    .single();

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[whatsapp:insert]", error);
    }
    return null;
  }

  return mapRow(data);
}

export async function updateWhatsAppMessageStatus(input: {
  providerMessageId: string;
  status: WhatsAppMessageStatus;
}): Promise<void> {
  const admin = getServiceRoleClient();
  if (!admin) return;

  const patch: Partial<{
    status: string;
    delivered_at: string;
    read_at: string;
  }> = { status: input.status };
  const now = new Date().toISOString();
  if (input.status === "delivered") patch.delivered_at = now;
  if (input.status === "read") patch.read_at = now;

  await admin
    .from("whatsapp_messages")
    .update(patch)
    .eq("provider_message_id", input.providerMessageId);
}

export async function listRecentWhatsAppMessages(limit = 30): Promise<WhatsAppMessage[]> {
  const admin = getServiceRoleClient();
  if (!admin) return [];

  const { data, error } = await admin
    .from("whatsapp_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function listLeadWhatsAppMessages(
  leadId: string,
  limit = 30,
): Promise<WhatsAppMessage[]> {
  const admin = getServiceRoleClient();
  if (!admin) return [];

  const { data, error } = await admin
    .from("whatsapp_messages")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function findLeadByPhone(phone: string): Promise<{
  id: string;
  name: string | null;
  email: string;
  whatsappOptIn: boolean;
  whatsappOptOutAt: string | null;
} | null> {
  const admin = getServiceRoleClient();
  if (!admin) return null;

  const { data } = await admin
    .from("newsletter_leads")
    .select("id, name, email, whatsapp_opt_in, whatsapp_opt_out_at")
    .eq("phone", phone)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    whatsappOptIn: data.whatsapp_opt_in,
    whatsappOptOutAt: data.whatsapp_opt_out_at,
  };
}

export async function findLeadByEmailForWhatsApp(email: string): Promise<{
  id: string;
  name: string | null;
  phone: string | null;
  whatsappOptIn: boolean;
  whatsappOptOutAt: string | null;
} | null> {
  const admin = getServiceRoleClient();
  if (!admin) return null;

  const { data } = await admin
    .from("newsletter_leads")
    .select("id, name, phone, whatsapp_opt_in, whatsapp_opt_out_at")
    .eq("email", email.toLowerCase().trim())
    .not("phone", "is", null)
    .eq("whatsapp_opt_in", true)
    .is("whatsapp_opt_out_at", null)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data?.phone) return null;
  return {
    id: data.id,
    name: data.name,
    phone: data.phone,
    whatsappOptIn: data.whatsapp_opt_in,
    whatsappOptOutAt: data.whatsapp_opt_out_at,
  };
}
