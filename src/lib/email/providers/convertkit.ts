import type { EmailContactInput, EmailContactResult } from "../types";

/** Stub ConvertKit — conectar quando CONVERTKIT_API_KEY estiver configurada. */
export async function convertKitAddContact(
  _input: EmailContactInput,
): Promise<EmailContactResult> {
  const apiKey = process.env.CONVERTKIT_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("CONVERTKIT_API_KEY não configurada.");
  }
  throw new Error("Integração ConvertKit ainda não implementada.");
}
