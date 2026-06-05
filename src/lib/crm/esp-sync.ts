import type { EmailAutomationProviderId } from "@/lib/email-automation/types";
import type { LeadInterestId } from "@/lib/leads/lead.types";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

export interface EspContactPayload {
  email: string;
  name: string | null;
  source: string;
  interest: LeadInterestId;
  leadScore: string;
  sequenceId: string;
}

export interface EspSyncUpdate {
  provider: EmailAutomationProviderId;
  externalId?: string | null;
  syncError?: string | null;
}

export async function updateLeadEspSync(
  email: string,
  update: EspSyncUpdate,
): Promise<void> {
  const admin = getServiceRoleClient();
  if (!admin) return;

  await admin
    .from("newsletter_leads")
    .update({
      esp_provider: update.provider,
      esp_external_id: update.externalId ?? null,
      esp_synced_at: update.syncError ? null : new Date().toISOString(),
      esp_sync_error: update.syncError ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("email", email.toLowerCase().trim());
}

export function getPreferredEspProvider(): EmailAutomationProviderId | null {
  const configured = process.env.LEAD_ESP_PROVIDER?.trim().toLowerCase();
  if (
    configured === "brevo" ||
    configured === "hubspot" ||
    configured === "rdstation" ||
    configured === "mailerlite"
  ) {
    return configured;
  }

  if (process.env.BREVO_API_KEY?.trim()) return "brevo";
  if (process.env.HUBSPOT_API_KEY?.trim()) return "hubspot";
  if (process.env.RDSTATION_API_KEY?.trim()) return "rdstation";
  if (process.env.MAILERLITE_API_KEY?.trim()) return "mailerlite";
  return null;
}

export function buildBrevoContactBody(payload: EspContactPayload) {
  return {
    email: payload.email,
    attributes: {
      FIRSTNAME: payload.name ?? "",
      LEAD_SOURCE: payload.source,
      LEAD_INTEREST: payload.interest,
      LEAD_SCORE: payload.leadScore,
      SEQUENCE_ID: payload.sequenceId,
    },
    updateEnabled: true,
  };
}

export function buildHubSpotContactBody(payload: EspContactPayload) {
  return {
    properties: {
      email: payload.email,
      firstname: payload.name ?? "",
      lead_source: payload.source,
      lead_interest: payload.interest,
      lead_score: payload.leadScore,
      automation_sequence: payload.sequenceId,
    },
  };
}

export function buildRdStationContactBody(payload: EspContactPayload) {
  return {
    event_type: "CONVERSION",
    event_family: "CDP",
    payload: {
      conversion_identifier: payload.sequenceId,
      email: payload.email,
      name: payload.name ?? undefined,
      cf_lead_source: payload.source,
      cf_lead_interest: payload.interest,
      cf_lead_score: payload.leadScore,
    },
  };
}
