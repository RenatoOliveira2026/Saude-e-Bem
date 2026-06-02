import { getAnalyticsIntegrationsConfig } from "@/lib/analytics/integrations";
import { isAnalyticsTableMissingError } from "@/lib/analytics/track-event";
import type {
  AnalyticsDashboardData,
  RankedContentItem,
} from "@/lib/analytics/types";
import { createClient } from "@/lib/supabase/server";

type EventRow = {
  event_type: string;
  content_id: string | null;
  content_title: string | null;
  created_at: string;
};

function aggregateTop(
  rows: EventRow[],
  eventType: string,
  limit = 5,
): RankedContentItem[] {
  const counts = new Map<string, RankedContentItem>();

  for (const row of rows) {
    if (row.event_type !== eventType) continue;
    const id = row.content_id ?? row.content_title ?? "unknown";
    const title = row.content_title ?? row.content_id ?? "Sem título";
    const existing = counts.get(id);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(id, { contentId: id, contentTitle: title, count: 1 });
    }
  }

  return [...counts.values()].sort((a, b) => b.count - a.count).slice(0, limit);
}

function countSince(rows: EventRow[], days: number): number {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return rows.filter((r) => new Date(r.created_at).getTime() >= cutoff).length;
}

function countType(rows: EventRow[], eventType: string): number {
  return rows.filter((r) => r.event_type === eventType).length;
}

const EMPTY_DASHBOARD: AnalyticsDashboardData = {
  totalEvents: 0,
  leadsCaptured: 0,
  affiliateClicks: 0,
  ebookDownloads: 0,
  eventsLast7Days: 0,
  eventsLast30Days: 0,
  topArticles: [],
  topProtocols: [],
  topAffiliates: [],
  integrationsStatus: {
    ga4: false,
    metaPixel: false,
    gtm: false,
    searchConsole: false,
  },
};

export async function getAnalyticsDashboard(): Promise<AnalyticsDashboardData> {
  const integrations = getAnalyticsIntegrationsConfig();

  try {
    const supabase = await createClient();

    const { data: events, error: eventsError } = await supabase
      .from("analytics_events")
      .select("event_type, content_id, content_title, created_at")
      .order("created_at", { ascending: false })
      .limit(5000);

    if (eventsError) {
      if (isAnalyticsTableMissingError(eventsError)) {
        return {
          ...EMPTY_DASHBOARD,
          integrationsStatus: {
            ga4: integrations.ga4.enabled,
            metaPixel: integrations.metaPixel.enabled,
            gtm: integrations.gtm.enabled,
            searchConsole: integrations.searchConsole.enabled,
          },
        };
      }
      throw eventsError;
    }

    const rows = (events ?? []) as EventRow[];

    const { count: newsletterCount } = await supabase
      .from("newsletter_subscribers")
      .select("id", { count: "exact", head: true });

    const leadFromEvents = countType(rows, "lead_submitted");
    const leadsCaptured = Math.max(leadFromEvents, newsletterCount ?? 0);

    return {
      totalEvents: rows.length,
      leadsCaptured,
      affiliateClicks: countType(rows, "affiliate_click"),
      ebookDownloads: countType(rows, "ebook_download"),
      eventsLast7Days: countSince(rows, 7),
      eventsLast30Days: countSince(rows, 30),
      topArticles: aggregateTop(rows, "article_view"),
      topProtocols: aggregateTop(rows, "protocol_view"),
      topAffiliates: aggregateTop(rows, "affiliate_click"),
      integrationsStatus: {
        ga4: integrations.ga4.enabled,
        metaPixel: integrations.metaPixel.enabled,
        gtm: integrations.gtm.enabled,
        searchConsole: integrations.searchConsole.enabled,
      },
    };
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      isAnalyticsTableMissingError(error as { code?: string; message?: string })
    ) {
      return {
        ...EMPTY_DASHBOARD,
        integrationsStatus: {
          ga4: integrations.ga4.enabled,
          metaPixel: integrations.metaPixel.enabled,
          gtm: integrations.gtm.enabled,
          searchConsole: integrations.searchConsole.enabled,
        },
      };
    }
    throw error;
  }
}
