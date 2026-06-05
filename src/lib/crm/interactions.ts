import type { LeadInteractionEventType, LeadInteractionRecord } from "@/lib/crm/types";
import { getCrmDbClient } from "@/lib/crm/db";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

export interface RecordLeadInteractionInput {
  leadId: string;
  eventType: LeadInteractionEventType;
  title: string;
  description?: string;
  source?: string;
  metadata?: Record<string, unknown>;
}

function mapRow(row: {
  id: string;
  lead_id: string;
  event_type: string;
  title: string;
  description: string | null;
  source: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}): LeadInteractionRecord {
  return {
    id: row.id,
    leadId: row.lead_id,
    eventType: row.event_type as LeadInteractionEventType,
    title: row.title,
    description: row.description,
    source: row.source,
    metadata: row.metadata ?? {},
    createdAt: row.created_at,
  };
}

export async function recordLeadInteraction(
  input: RecordLeadInteractionInput,
): Promise<LeadInteractionRecord | null> {
  const admin = getServiceRoleClient();
  if (!admin) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[crm:interaction] SUPABASE_SERVICE_ROLE_KEY ausente — interação não persistida.");
    }
    return null;
  }

  const { data, error } = await admin
    .from("lead_interactions")
    .insert({
      lead_id: input.leadId,
      event_type: input.eventType,
      title: input.title,
      description: input.description ?? null,
      source: input.source ?? null,
      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[crm:interaction]", error);
    }
    return null;
  }

  return mapRow(data);
}

export async function listLeadInteractions(
  leadId: string,
  limit = 50,
): Promise<LeadInteractionRecord[]> {
  const client = await getCrmDbClient();

  const { data, error } = await client
    .from("lead_interactions")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function listRecentInteractions(limit = 20): Promise<LeadInteractionRecord[]> {
  const client = await getCrmDbClient();

  const { data, error } = await client
    .from("lead_interactions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map(mapRow);
}
