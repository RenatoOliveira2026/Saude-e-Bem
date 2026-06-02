import {
  sanitizeContentField,
  sanitizeMetadata,
  sanitizeSourcePage,
  sanitizeSourceType,
} from "@/lib/analytics/sanitize";
import type { AnalyticsEventType, TrackEventInput } from "@/lib/analytics/types";
import { ANALYTICS_EVENT_TYPES } from "@/lib/analytics/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

function isValidEventType(value: string): value is AnalyticsEventType {
  return (ANALYTICS_EVENT_TYPES as readonly string[]).includes(value);
}

export function isAnalyticsTableMissingError(error: {
  code?: string;
  message?: string;
}): boolean {
  const code = error.code ?? "";
  const message = (error.message ?? "").toLowerCase();

  if (code === "PGRST205" || code === "42P01") return true;

  return (
    message.includes('relation "public.analytics_events" does not exist') ||
    (message.includes("could not find the table") &&
      message.includes("analytics_events"))
  );
}

/**
 * Registra evento comportamental no Supabase.
 * Falhas são silenciosas para não bloquear UX do portal.
 */
export async function trackEvent(input: TrackEventInput): Promise<void> {
  if (!isSupabaseConfigured()) return;

  if (!isValidEventType(input.eventType)) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[analytics] event_type inválido:", input.eventType);
    }
    return;
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = input.userId ?? user?.id ?? null;

    const { error } = await supabase.from("analytics_events").insert({
      event_type: input.eventType,
      source_page: sanitizeSourcePage(input.sourcePage),
      source_type: sanitizeSourceType(input.sourceType),
      content_id: sanitizeContentField(input.contentId),
      content_title: sanitizeContentField(input.contentTitle),
      user_id: userId,
      metadata: sanitizeMetadata(input.metadata),
    });

    if (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[analytics:trackEvent]", {
          eventType: input.eventType,
          code: error.code,
          message: error.message,
        });
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[analytics:trackEvent] exception", error);
    }
  }
}
