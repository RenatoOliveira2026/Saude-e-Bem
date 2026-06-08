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
