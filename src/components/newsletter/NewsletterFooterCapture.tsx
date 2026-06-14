"use client";

import { NewsletterCaptureForm } from "@/components/newsletter/NewsletterCaptureForm";
import {
  GLOBAL_NEWSLETTER_CTA,
  GLOBAL_NEWSLETTER_SUBTITLE,
} from "@/components/newsletter/NewsletterCaptureSection";

/** Formulário compacto para o rodapé — Fase 5.2 */
export function NewsletterFooterCapture() {
  return (
    <div className="rounded-2xl border border-off-white/10 bg-off-white/5 p-6">
      <p className="font-heading text-sm font-semibold text-gold">Newsletter</p>
      <p className="mt-2 text-sm leading-relaxed text-off-white/80 text-pretty">
        {GLOBAL_NEWSLETTER_CTA}
      </p>
      <p className="mt-1 text-xs text-off-white/50">{GLOBAL_NEWSLETTER_SUBTITLE}</p>
      <div className="mt-4">
        <NewsletterCaptureForm
          source="footer"
          variant="forest"
          submitLabel="Cadastrar grátis"
        />
      </div>
    </div>
  );
}
