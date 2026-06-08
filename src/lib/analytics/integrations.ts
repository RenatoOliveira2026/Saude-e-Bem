/**
 * Integrações de analytics — GA4 ativo via GoogleAnalytics + PageViewTracker.
 * GTM, Meta Pixel e Search Console: ative via variáveis de ambiente.
 */
import { getGa4MeasurementId } from "./ga4-config";

export interface AnalyticsIntegrationsConfig {
  ga4: {
    enabled: boolean;
    measurementId: string | null;
  };
  metaPixel: {
    enabled: boolean;
    pixelId: string | null;
  };
  gtm: {
    enabled: boolean;
    containerId: string | null;
  };
  searchConsole: {
    enabled: boolean;
    verificationMeta: string | null;
  };
}

export function getAnalyticsIntegrationsConfig(): AnalyticsIntegrationsConfig {
  const ga4Id = getGa4MeasurementId();
  const metaId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || null;
  const gtmId = process.env.NEXT_PUBLIC_GTM_CONTAINER_ID?.trim() || null;
  const scMeta = process.env.NEXT_PUBLIC_SEARCH_CONSOLE_VERIFICATION?.trim() || null;

  return {
    ga4: {
      enabled: Boolean(ga4Id),
      measurementId: ga4Id,
    },
    metaPixel: {
      enabled: Boolean(metaId),
      pixelId: metaId,
    },
    gtm: {
      enabled: Boolean(gtmId),
      containerId: gtmId,
    },
    searchConsole: {
      enabled: Boolean(scMeta),
      verificationMeta: scMeta,
    },
  };
}
