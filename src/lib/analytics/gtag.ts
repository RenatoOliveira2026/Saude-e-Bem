import { getGa4MeasurementId } from "./ga4-config";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Envia page_view ao GA4 (SPA — send_page_view desativado no config inicial). */
export function sendGa4PageView(pagePath: string): void {
  if (typeof window === "undefined") return;

  const measurementId = getGa4MeasurementId();
  if (!measurementId || !window.gtag) return;

  window.gtag("event", "page_view", {
    page_path: pagePath,
    page_location: window.location.href,
    page_title: document.title,
    send_to: measurementId,
  });
}

export interface Ga4GenerateLeadParams {
  source?: string;
  interest?: string;
  leadScore?: string;
  existing?: boolean;
}

/** Conversão de lead — evento recomendado GA4 `generate_lead`. */
export function sendGa4GenerateLead(params: Ga4GenerateLeadParams): void {
  if (typeof window === "undefined") return;

  const measurementId = getGa4MeasurementId();
  if (!measurementId || !window.gtag) return;

  window.gtag("event", "generate_lead", {
    send_to: measurementId,
    event_timestamp: Date.now(),
    source: params.source ?? "unknown",
    interest: params.interest ?? undefined,
    lead_score: params.leadScore ?? undefined,
    is_existing_lead: params.existing ?? false,
  });
}

export interface Ga4WhatsAppClickParams {
  sourcePage: string;
  buttonType: string;
}

export interface Ga4NewsletterEventParams {
  sourcePage: string;
  source: string;
  deviceCategory?: string;
  existing?: boolean;
}

function getGa4DeviceCategory(): string {
  if (typeof window === "undefined") return "unknown";
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

/** Inscrição na newsletter global — Fase 5.2 */
export function sendGa4NewsletterSignup(params: Ga4NewsletterEventParams): void {
  if (typeof window === "undefined") return;

  const measurementId = getGa4MeasurementId();
  if (!measurementId || !window.gtag) return;

  window.gtag("event", "newsletter_signup", {
    send_to: measurementId,
    event_timestamp: Date.now(),
    source_page: params.sourcePage,
    page_source: params.source,
    device_category: params.deviceCategory ?? getGa4DeviceCategory(),
    is_existing_subscriber: params.existing ?? false,
  });
}

/** Conversão do lead magnet /guia-30-dias — Fase 5.2 */
export function sendGa4LeadMagnetDownload(params: Ga4NewsletterEventParams): void {
  if (typeof window === "undefined") return;

  const measurementId = getGa4MeasurementId();
  if (!measurementId || !window.gtag) return;

  window.gtag("event", "lead_magnet_download", {
    send_to: measurementId,
    event_timestamp: Date.now(),
    source_page: params.sourcePage,
    page_source: params.source,
    device_category: params.deviceCategory ?? getGa4DeviceCategory(),
    is_existing_subscriber: params.existing ?? false,
  });
}

/** Clique em link de afiliado — Fase 5.3 */
export function sendGa4AffiliateClick(params: {
  slug: string;
  sourcePage: string;
  sourceType: string;
}): void {
  if (typeof window === "undefined") return;

  const measurementId = getGa4MeasurementId();
  if (!measurementId || !window.gtag) return;

  window.gtag("event", "affiliate_click", {
    send_to: measurementId,
    event_timestamp: Date.now(),
    product_slug: params.slug,
    source_page: params.sourcePage,
    page_source: params.sourceType,
    device_category: getGa4DeviceCategory(),
  });
}

/** Clique em botão WhatsApp (wa.me / floating / seção de captação). */
export function sendGa4WhatsAppClick(params: Ga4WhatsAppClickParams): void {
  if (typeof window === "undefined") return;

  const measurementId = getGa4MeasurementId();
  if (!measurementId || !window.gtag) return;

  window.gtag("event", "whatsapp_click", {
    send_to: measurementId,
    event_timestamp: Date.now(),
    source_page: params.sourcePage,
    button_type: params.buttonType,
  });
}
