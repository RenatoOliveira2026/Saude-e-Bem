import { sendGa4WhatsAppClick } from "@/lib/analytics/gtag";

export type WhatsAppButtonType =
  | "floating"
  | "capture_button"
  | "capture_section";

export function trackWhatsAppClick(buttonType: WhatsAppButtonType): void {
  const sourcePage =
    typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.search}`
      : "/";

  sendGa4WhatsAppClick({
    sourcePage,
    buttonType,
  });
}
