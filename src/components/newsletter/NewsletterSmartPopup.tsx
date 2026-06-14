"use client";

import { NewsletterCaptureForm } from "@/components/newsletter/NewsletterCaptureForm";
import {
  GLOBAL_NEWSLETTER_CTA,
  GLOBAL_NEWSLETTER_SUBTITLE,
} from "@/components/newsletter/NewsletterCaptureSection";
import { Button } from "@/components/ui/Button";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "sb_newsletter_popup_dismissed";
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
const DELAY_MS = 45_000;

const EXCLUDED_PREFIXES = [
  "/admin",
  "/entrar",
  "/cadastro",
  "/obrigado",
  "/obrigado-newsletter",
  "/guia-30-dias",
  "/dev-login",
];

function isExcludedPath(pathname: string): boolean {
  return EXCLUDED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isInCooldown(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const dismissedAt = Number(raw);
    if (Number.isNaN(dismissedAt)) return false;
    return Date.now() - dismissedAt < COOLDOWN_MS;
  } catch {
    return false;
  }
}

function markDismissed(): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

/** Popup inteligente — 45s ou 50% scroll; cooldown 7 dias. */
export function NewsletterSmartPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const dismiss = useCallback(() => {
    setOpen(false);
    markDismissed();
  }, []);

  useEffect(() => {
    if (!pathname || isExcludedPath(pathname) || isInCooldown()) return;

    let triggered = false;

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const ratio = window.scrollY / scrollable;
      if (ratio >= 0.5) trigger();
    };

    const trigger = () => {
      if (triggered) return;
      triggered = true;
      setOpen(true);
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };

    const timer = setTimeout(trigger, DELAY_MS);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-popup-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-forest/60 backdrop-blur-sm"
        aria-label="Fechar popup"
        onClick={dismiss}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-elevated">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-heading text-xs uppercase tracking-[0.2em] text-sage">
              Newsletter Saúde &amp; Bem
            </p>
            <h2
              id="newsletter-popup-title"
              className="mt-3 font-heading text-xl font-semibold text-forest text-balance"
            >
              {GLOBAL_NEWSLETTER_CTA}
            </h2>
            <p className="mt-2 text-sm text-muted">{GLOBAL_NEWSLETTER_SUBTITLE}</p>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={dismiss}>
            ✕
          </Button>
        </div>
        <div className="mt-6">
          <NewsletterCaptureForm
            source="popup"
            variant="light"
            submitLabel="Quero receber"
          />
        </div>
      </div>
    </div>
  );
}
