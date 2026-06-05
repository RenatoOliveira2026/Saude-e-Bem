export const ANALYTICS_EVENT_TYPES = [
  "page_view",
  "lead_submitted",
  "affiliate_click",
  "ebook_download",
  "protocol_view",
  "article_view",
] as const;

export type AnalyticsEventType = (typeof ANALYTICS_EVENT_TYPES)[number];

/** Metadados permitidos — sem PII, senha ou dados médicos */
export type AnalyticsMetadata = {
  slug?: string;
  category?: string;
  source?: string;
  interest?: string;
  leadScore?: string;
  /** Flags de integração futura (sem enviar dados a terceiros nesta fase) */
  integrations?: {
    ga4_ready?: boolean;
    meta_pixel_ready?: boolean;
    gtm_ready?: boolean;
    search_console_ready?: boolean;
  };
};

export interface TrackEventInput {
  eventType: AnalyticsEventType;
  sourcePage?: string;
  sourceType?: string;
  contentId?: string;
  contentTitle?: string;
  userId?: string | null;
  metadata?: AnalyticsMetadata;
}

export interface RankedContentItem {
  contentId: string;
  contentTitle: string;
  count: number;
}

export interface AnalyticsDashboardData {
  totalEvents: number;
  leadsCaptured: number;
  affiliateClicks: number;
  ebookDownloads: number;
  eventsLast7Days: number;
  eventsLast30Days: number;
  topArticles: RankedContentItem[];
  topProtocols: RankedContentItem[];
  topAffiliates: RankedContentItem[];
  integrationsStatus: {
    ga4: boolean;
    metaPixel: boolean;
    gtm: boolean;
    searchConsole: boolean;
  };
}
