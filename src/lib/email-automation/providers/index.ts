import type {
  EmailAutomationProviderId,
  LeadAutomationPayload,
} from "../types";
import {
  isBrevoConfigured,
  isBrevoLiveSyncEnabled,
  upsertBrevoContact,
} from "@/lib/brevo";
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

  if (isBrevoConfigured()) return ["brevo"];

  return [];
}

export async function syncLeadToProviders(
  lead: LeadAutomationPayload,
  sequenceId: string,
): Promise<LeadEspSyncResult> {
  const active = getActiveProviders();

  if (active.length === 0) {
    return {
      skipped: true,
      reason: "Nenhum ESP configurado. Defina BREVO_API_KEY como provedor principal.",
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
  if (!isBrevoConfigured()) {
    return { provider: "brevo", skipped: true, reason: "BREVO_API_KEY ausente." };
  }

  if (!isBrevoLiveSyncEnabled()) {
    return {
      provider: "brevo",
      skipped: true,
      reason: "Sync Brevo desativado (LEAD_ESP_LIVE_SYNC=false). Lead salvo no Supabase.",
    };
  }

  try {
    const body = buildBrevoContactBody(payload);
    const result = await upsertBrevoContact(body);

    return {
      provider: "brevo",
      externalId: result.externalId ?? payload.email,
      skipped: false,
      reason: result.duplicate ? "Contato já existia — atualizado no Brevo." : undefined,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro Brevo";
    return { provider: "brevo", skipped: true, reason: message };
  }
}

/** Provedor futuro — ativar com LEAD_ESP_PROVIDER=hubspot quando implementado. */
async function hubSpotSyncLead(payload: EspContactPayload): Promise<LeadEspSyncResult> {
  const apiKey = process.env.HUBSPOT_API_KEY?.trim();
  if (!apiKey) {
    return { provider: "hubspot", skipped: true, reason: "HUBSPOT_API_KEY ausente." };
  }

  buildHubSpotContactBody(payload);

  return {
    provider: "hubspot",
    skipped: true,
    reason: "HubSpot reservado para fase futura — use Brevo como provedor principal.",
  };
}

/** Provedor futuro — ativar com LEAD_ESP_PROVIDER=rdstation quando implementado. */
async function rdStationSyncLead(payload: EspContactPayload): Promise<LeadEspSyncResult> {
  const apiKey = process.env.RDSTATION_API_KEY?.trim();
  if (!apiKey) {
    return { provider: "rdstation", skipped: true, reason: "RDSTATION_API_KEY ausente." };
  }

  buildRdStationContactBody(payload);

  return {
    provider: "rdstation",
    skipped: true,
    reason: "RD Station reservado para fase futura — use Brevo como provedor principal.",
  };
}

/** Provedor futuro — ativar com LEAD_ESP_PROVIDER=mailerlite quando implementado. */
async function mailerLiteSyncLead(_payload: EspContactPayload): Promise<LeadEspSyncResult> {
  return {
    provider: "mailerlite",
    skipped: true,
    reason: "MailerLite reservado para fase futura — use Brevo como provedor principal.",
  };
}

export function isEmailAutomationConfigured(): boolean {
  return getActiveProviders().length > 0;
}

export function configuredEmailProviders(): EmailAutomationProviderId[] {
  return getActiveProviders();
}
