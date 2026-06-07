import { getWhatsAppConfig } from "./config";

/** Normaliza telefone brasileiro para E.164 (+55...). */
export function normalizeWhatsAppPhone(
  input: string,
  countryCode = getWhatsAppConfig().defaultCountryCode,
): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length < 10) return null;

  if (digits.startsWith(countryCode) && digits.length >= countryCode.length + 10) {
    return `+${digits}`;
  }

  if (digits.length === 10 || digits.length === 11) {
    return `+${countryCode}${digits}`;
  }

  if (input.startsWith("+") && digits.length >= 12) {
    return `+${digits}`;
  }

  return null;
}

export function validateWhatsAppPhone(input: string): string | null {
  const normalized = normalizeWhatsAppPhone(input);
  if (!normalized) {
    return "Informe um telefone válido com DDD (ex.: 11 99999-9999).";
  }
  return null;
}

export function formatPhoneDisplay(e164: string): string {
  const digits = e164.replace(/\D/g, "");
  if (digits.startsWith("55") && digits.length >= 12) {
    const ddd = digits.slice(2, 4);
    const rest = digits.slice(4);
    if (rest.length === 9) {
      return `+55 (${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
    }
    if (rest.length === 8) {
      return `+55 (${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
    }
  }
  return e164;
}

/** Converte wa_id do webhook Meta para E.164. */
export function waIdToE164(waId: string): string {
  const digits = waId.replace(/\D/g, "");
  return digits.startsWith("+") ? digits : `+${digits}`;
}
