import { getBrevoApiKey } from "./config";

const BREVO_API_BASE = "https://api.brevo.com/v3";

export interface BrevoContactPayload {
  email: string;
  attributes?: Record<string, string | number | boolean>;
  listIds?: number[];
  updateEnabled?: boolean;
}

export interface BrevoUpsertResult {
  externalId?: string;
  created: boolean;
  duplicate: boolean;
}

export class BrevoApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: string,
  ) {
    super(message);
    this.name = "BrevoApiError";
  }
}

export async function upsertBrevoContact(
  payload: BrevoContactPayload,
): Promise<BrevoUpsertResult> {
  const apiKey = getBrevoApiKey();
  if (!apiKey) {
    throw new BrevoApiError("BREVO_API_KEY não configurada.", 0);
  }

  const response = await fetch(`${BREVO_API_BASE}/contacts`, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      updateEnabled: true,
      ...payload,
    }),
  });

  const text = await response.text();

  if (response.ok) {
    let externalId: string | undefined;
    try {
      const data = JSON.parse(text) as { id?: number };
      externalId = data.id != null ? String(data.id) : undefined;
    } catch {
      externalId = undefined;
    }
    return { externalId, created: true, duplicate: false };
  }

  if (response.status === 400 && /already exist|duplicate/i.test(text)) {
    await updateBrevoContact(payload.email, {
      attributes: payload.attributes,
      listIds: payload.listIds,
    });
    return { created: false, duplicate: true };
  }

  throw new BrevoApiError(
    `Brevo API ${response.status}: ${text.slice(0, 300)}`,
    response.status,
    text,
  );
}

/** Atualiza atributos e listas de um contato existente. */
export async function updateBrevoContact(
  email: string,
  input: { attributes?: Record<string, string | number | boolean>; listIds?: number[] },
): Promise<void> {
  const apiKey = getBrevoApiKey();
  if (!apiKey) {
    throw new BrevoApiError("BREVO_API_KEY não configurada.", 0);
  }

  const response = await fetch(
    `${BREVO_API_BASE}/contacts/${encodeURIComponent(email)}`,
    {
      method: "PUT",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(input),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new BrevoApiError(
      `Brevo API ${response.status}: ${text.slice(0, 300)}`,
      response.status,
      text,
    );
  }
}
