import { createClient } from "@/lib/supabase/server";
import { getWhatsAppConfigSummary } from "@/lib/whatsapp/config";
import type { WhatsAppMessage, WhatsAppTemplate } from "@/lib/whatsapp/types";

export interface WhatsAppDashboardStats {
  optInLeads: number;
  messagesSent30d: number;
  messagesFailed30d: number;
  inbound30d: number;
  activeAutomations: number;
  pendingSteps: number;
}

export interface AdminWhatsAppDashboard {
  stats: WhatsAppDashboardStats;
  config: ReturnType<typeof getWhatsAppConfigSummary>;
  recentMessages: WhatsAppMessage[];
  templates: WhatsAppTemplate[];
}

function mapTemplate(row: {
  id: string;
  template_key: string;
  meta_name: string;
  language_code: string;
  category: string;
  status: string;
  body_preview: string | null;
  variables: unknown;
  active: boolean;
}): WhatsAppTemplate {
  return {
    id: row.id,
    templateKey: row.template_key as WhatsAppTemplate["templateKey"],
    metaName: row.meta_name,
    languageCode: row.language_code,
    category: row.category,
    status: row.status as WhatsAppTemplate["status"],
    bodyPreview: row.body_preview,
    variables: Array.isArray(row.variables) ? (row.variables as string[]) : [],
    active: row.active,
  };
}

function mapMessage(row: {
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
    direction: row.direction as WhatsAppMessage["direction"],
    messageType: row.message_type,
    templateKey: row.template_key as WhatsAppMessage["templateKey"],
    phone: row.phone,
    body: row.body,
    status: row.status as WhatsAppMessage["status"],
    providerMessageId: row.provider_message_id,
    errorMessage: row.error_message,
    metadata: row.metadata ?? {},
    sentAt: row.sent_at,
    deliveredAt: row.delivered_at,
    readAt: row.read_at,
    createdAt: row.created_at,
  };
}

export async function getAdminWhatsAppDashboard(): Promise<AdminWhatsAppDashboard> {
  const supabase = await createClient();

  const { data: statsRaw, error: statsError } = await supabase.rpc(
    "get_whatsapp_dashboard_stats",
  );
  if (statsError) throw statsError;

  const statsJson = (statsRaw ?? {}) as Record<string, number>;
  const stats: WhatsAppDashboardStats = {
    optInLeads: statsJson.opt_in_leads ?? 0,
    messagesSent30d: statsJson.messages_sent_30d ?? 0,
    messagesFailed30d: statsJson.messages_failed_30d ?? 0,
    inbound30d: statsJson.inbound_30d ?? 0,
    activeAutomations: statsJson.active_automations ?? 0,
    pendingSteps: statsJson.pending_steps ?? 0,
  };

  const { data: messagesRaw } = await supabase
    .from("whatsapp_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(25);

  const { data: templatesRaw } = await supabase
    .from("whatsapp_templates")
    .select("*")
    .order("template_key", { ascending: true });

  return {
    stats,
    config: getWhatsAppConfigSummary(),
    recentMessages: (messagesRaw ?? []).map(mapMessage),
    templates: (templatesRaw ?? []).map(mapTemplate),
  };
}

export async function listWhatsAppTemplates(): Promise<WhatsAppTemplate[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("whatsapp_templates")
    .select("*")
    .order("template_key", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapTemplate);
}
