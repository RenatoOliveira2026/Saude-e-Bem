/**
 * Integrações futuras — apenas leitura de env e flags.
 * Não envia dados a terceiros nesta fase.
 */
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
  const ga4Id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim() || null;
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
