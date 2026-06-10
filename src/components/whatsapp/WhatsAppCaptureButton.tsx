"use client";

import { buildWhatsAppClickToChatUrl } from "@/lib/whatsapp/config";
import {
  trackWhatsAppClick,
  type WhatsAppButtonType,
} from "@/lib/whatsapp/track-click";

interface WhatsAppCaptureButtonProps {
  message?: string;
  label?: string;
  className?: string;
  buttonType?: WhatsAppButtonType;
}

export function WhatsAppCaptureButton({
  message = "Olá! Quero saber mais sobre o Saúde & Bem.",
  label = "Falar no WhatsApp",
  className,
  buttonType = "capture_button",
}: WhatsAppCaptureButtonProps) {
  const href = buildWhatsAppClickToChatUrl(message);

  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick(buttonType)}
      className={
        className ??
        "inline-flex items-center justify-center rounded-full border border-sage bg-surface px-6 py-3 text-sm font-medium text-forest transition-colors hover:bg-sage-muted/30"
      }
    >
      {label}
    </a>
  );
}
