import {
  canSendWhatsApp,
  getWhatsAppConfig,
  isWhatsAppConfigured,
  isWhatsAppStubMode,
} from "./config";
import type { SendTemplateInput } from "./types";

const GRAPH_API = "https://graph.facebook.com/v21.0";

export interface SendTemplateResult {
  ok: boolean;
  providerMessageId: string | null;
  stub: boolean;
  error?: string;
}

export async function sendWhatsAppTemplate(
  input: SendTemplateInput,
): Promise<SendTemplateResult> {
  if (!canSendWhatsApp()) {
    return {
      ok: false,
      providerMessageId: null,
      stub: false,
      error: "WhatsApp não configurado.",
    };
  }

  if (isWhatsAppStubMode() && !isWhatsAppConfigured()) {
    return {
      ok: true,
      providerMessageId: `stub_${Date.now()}`,
      stub: true,
    };
  }

  const { accessToken, phoneNumberId } = getWhatsAppConfig();
  const phoneDigits = input.phone.replace(/\D/g, "");

  const body = {
    messaging_product: "whatsapp",
    to: phoneDigits,
    type: "template",
    template: {
      name: input.templateKey,
      language: { code: "pt_BR" },
      components: input.bodyParameters?.length
        ? [
            {
              type: "body",
              parameters: input.bodyParameters.map((text) => ({
                type: "text",
                text,
              })),
            },
          ]
        : undefined,
    },
  };

  const response = await fetch(`${GRAPH_API}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as {
    messages?: Array<{ id?: string }>;
    error?: { message?: string };
  };

  if (!response.ok) {
    return {
      ok: false,
      providerMessageId: null,
      stub: false,
      error: data.error?.message ?? "Falha ao enviar template WhatsApp.",
    };
  }

  return {
    ok: true,
    providerMessageId: data.messages?.[0]?.id ?? null,
    stub: false,
  };
}
