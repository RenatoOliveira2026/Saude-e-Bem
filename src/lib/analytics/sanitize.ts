import type { AnalyticsMetadata } from "@/lib/analytics/types";

const BLOCKED_KEYS = new Set([
  "email",
  "password",
  "senha",
  "name",
  "nome",
  "phone",
  "telefone",
  "cpf",
  "rg",
  "diagnosis",
  "diagnostico",
  "medical",
  "health_data",
  "token",
  "secret",
  "api_key",
]);

const MAX_STRING = 500;
const MAX_PAGE = 500;
const MAX_TYPE = 64;

function truncate(value: string, max: number): string {
  return value.length > max ? value.slice(0, max) : value;
}

export function sanitizeMetadata(
  raw: AnalyticsMetadata | undefined,
): Record<string, unknown> {
  if (!raw || typeof raw !== "object") return {};

  const out: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(raw)) {
    const lower = key.toLowerCase();
    if (BLOCKED_KEYS.has(lower)) continue;

    if (key === "integrations" && value && typeof value === "object") {
      const flags = value as Record<string, unknown>;
      out.integrations = {
        ga4_ready: flags.ga4_ready === true,
        meta_pixel_ready: flags.meta_pixel_ready === true,
        gtm_ready: flags.gtm_ready === true,
        search_console_ready: flags.search_console_ready === true,
      };
      continue;
    }

    if (typeof value === "string") {
      out[key] = truncate(value, MAX_STRING);
    } else if (typeof value === "boolean") {
      out[key] = value;
    }
  }

  return out;
}

export function sanitizeSourcePage(page?: string): string {
  if (!page) return "";
  return truncate(page.replace(/\s+/g, " ").trim(), MAX_PAGE);
}

export function sanitizeSourceType(type?: string): string {
  if (!type) return "direct";
  return truncate(type.trim(), MAX_TYPE);
}

export function sanitizeContentField(value?: string): string | null {
  if (!value?.trim()) return null;
  return truncate(value.trim(), MAX_STRING);
}
