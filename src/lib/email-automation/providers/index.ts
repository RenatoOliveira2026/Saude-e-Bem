import type {
  AutomationDispatchResult,
  EmailAutomationProviderId,
  LeadAutomationPayload,
} from "../types";
import {
  buildBrevoContactBody,
  buildHubSpotContactBody,
  buildRdStationContactBody,
  getPreferredEspProvider,
  type EspContactPayload,
} from "@/lib/crm/esp-sync";

export interface LeadEspSyncResult {
  provider?: EmailAutomationProviderId;
  externalId?: string;
  skipped: boolean;
  reason?: string;
}

function toEspPayload(
  lead: LeadAutomationPayload,
  sequenceId: string,
): EspContactPayload {
  return {
    email: lead.email,
    name: lead.name,
    source: lead.source,
    interest: lead.interest,
    leadScore: lead.leadScore,
    sequenceId,
  };
}

function getActiveProviders(): EmailAutomationProviderId[] {
  const preferred = getPreferredEspProvider();
  if (preferred) return [preferred];

  const providers: EmailAutomationProviderId[] = [];
  if (process.env.BREVO_API_KEY?.trim()) providers.push("brevo");
  if (process.env.HUBSPOT_API_KEY?.trim()) providers.push("hubspot");
  if (process.env.RDSTATION_API_KEY?.trim()) providers.push("rdstation");
  if (process.env.MAILERLITE_API_KEY?.trim()) providers.push("mailerlite");
  return providers;
}

export async function syncLeadToProviders(
  lead: LeadAutomationPayload,
  sequenceId: string,
): Promise<LeadEspSyncResult> {
  const active = getActiveProviders();

  if (active.length === 0) {
    return {
      skipped: true,
      reason: "Nenhum ESP configurado (Brevo, HubSpot, RD Station ou MailerLite).",
    };
  }

  const provider = active[0];
  const payload = toEspPayload(lead, sequenceId);

  switch (provider) {
    case "brevo":
      return brevoSyncLead(payload);
    case "hubspot":
      return hubSpotSyncLead(payload);
    case "rdstation":
      return rdStationSyncLead(payload);
    case "mailerlite":
      return mailerLiteSyncLead(payload);
    default:
      return { skipped: true, reason: "Provedor não suportado." };
  }
}

async function brevoSyncLead(payload: EspContactPayload): Promise<LeadEspSyncResult> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey) {
    return { provider: "brevo", skipped: true, reason: "BREVO_API_KEY ausente." };
  }

  const body = buildBrevoContactBody(payload);

  if (process.env.LEAD_ESP_LIVE_SYNC === "true") {
    try {
      const response = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const text = await response.text();
        return { provider: "brevo", skipped: true, reason: `Brevo: ${text.slice(0, 200)}` };
      }

      const data = (await response.json()) as { id?: number };
      return { provider: "brevo", externalId: data.id ? String(data.id) : undefined, skipped: false };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro Brevo";
      return { provider: "brevo", skipped: true, reason: message };
    }
  }

  return {
    provider: "brevo",
    skipped: true,
    reason: "Payload Brevo pronto — ative LEAD_ESP_LIVE_SYNC=true para envio real.",
  };
}

async function hubSpotSyncLead(payload: EspContactPayload): Promise<LeadEspSyncResult> {
  const apiKey = process.env.HUBSPOT_API_KEY?.trim();
  if (!apiKey) {
    return { provider: "hubspot", skipped: true, reason: "HUBSPOT_API_KEY ausente." };
  }

  buildHubSpotContactBody(payload);

  return {
    provider: "hubspot",
    skipped: true,
    reason: "Payload HubSpot pronto — implementar CRM v3 contacts quando LEAD_ESP_LIVE_SYNC=true.",
  };
}

async function rdStationSyncLead(payload: EspContactPayload): Promise<LeadEspSyncResult> {
  const apiKey = process.env.RDSTATION_API_KEY?.trim();
  if (!apiKey) {
    return { provider: "rdstation", skipped: true, reason: "RDSTATION_API_KEY ausente." };
  }

  buildRdStationContactBody(payload);

  return {
    provider: "rdstation",
    skipped: true,
    reason: "Payload RD Station pronto — implementar conversion API quando LEAD_ESP_LIVE_SYNC=true.",
  };
}

async function mailerLiteSyncLead(_payload: EspContactPayload): Promise<LeadEspSyncResult> {
  return {
    provider: "mailerlite",
    skipped: true,
    reason: "MailerLite mantido como fallback — foco 5.3: Brevo, HubSpot, RD Station.",
  };
}

export function isEmailAutomationConfigured(): boolean {
  return getActiveProviders().length > 0;
}

export function configuredEmailProviders(): EmailAutomationProviderId[] {
  return getActiveProviders();
}
