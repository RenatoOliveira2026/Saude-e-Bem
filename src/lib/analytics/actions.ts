"use server";

import { trackEvent } from "@/lib/analytics/track-event";
import type { AnalyticsEventType } from "@/lib/analytics/types";
import { ANALYTICS_EVENT_TYPES } from "@/lib/analytics/types";
import {
  sanitizeContentField,
  sanitizeMetadata,
  sanitizeSourcePage,
  sanitizeSourceType,
} from "@/lib/analytics/sanitize";

type ClientTrackPayload = {
  eventType: string;
  sourcePage?: string;
  sourceType?: string;
  contentId?: string;
  contentTitle?: string;
  metadata?: Record<string, unknown>;
};

function parseClientPayload(payload: ClientTrackPayload): Parameters<typeof trackEvent>[0] | null {
  if (!ANALYTICS_EVENT_TYPES.includes(payload.eventType as AnalyticsEventType)) {
    return null;
  }

  return {
    eventType: payload.eventType as AnalyticsEventType,
    sourcePage: sanitizeSourcePage(payload.sourcePage),
    sourceType: sanitizeSourceType(payload.sourceType),
    contentId: sanitizeContentField(payload.contentId) ?? undefined,
    contentTitle: sanitizeContentField(payload.contentTitle) ?? undefined,
    metadata: sanitizeMetadata(
      payload.metadata as import("@/lib/analytics/types").AnalyticsMetadata,
    ),
  };
}

/** Chamada segura a partir de componentes client (page_view, ebook_download) */
export async function trackAnalyticsFromClientAction(
  payload: ClientTrackPayload,
): Promise<void> {
  const parsed = parseClientPayload(payload);
  if (!parsed) return;
  await trackEvent(parsed);
}
