"use client";

import { Button } from "@/components/ui/Button";
import {
  subscribeNewsletterAction,
  type NewsletterActionState,
} from "@/lib/actions/newsletter.actions";
import type { NewsletterSource } from "@/lib/newsletter/types";
import { useActionState } from "react";

const initialState: NewsletterActionState = {};

type NewsletterVariant = "forest" | "light";

interface NewsletterCaptureFormProps {
  source: NewsletterSource;
  variant?: NewsletterVariant;
  submitLabel?: string;
  className?: string;
}

const inputStyles: Record<NewsletterVariant, string> = {
  forest:
    "h-12 w-full rounded-full border border-off-white/20 bg-off-white/10 px-5 text-sm text-off-white placeholder:text-off-white/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30",
  light:
    "h-12 w-full rounded-full border border-border-strong bg-surface px-5 text-sm text-graphite placeholder:text-muted-light shadow-soft focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20",
};

export function NewsletterCaptureForm({
  source,
  variant = "light",
  submitLabel = "Quero receber",
  className,
}: NewsletterCaptureFormProps) {
  const [state, formAction, pending] = useActionState(
    subscribeNewsletterAction,
    initialState,
  );

  const errorClass =
    variant === "forest"
      ? "text-center text-sm text-gold-light"
      : "text-center text-sm text-amber-700";

  return (
    <form action={formAction} className={className ?? "space-y-3"}>
      <input type="hidden" name="source" value={source} />
      <div>
        <label htmlFor={`newsletter-name-${source}`} className="sr-only">
          Nome
        </label>
        <input
          id={`newsletter-name-${source}`}
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Seu nome"
          className={inputStyles[variant]}
        />
      </div>
      <div>
        <label htmlFor={`newsletter-email-${source}`} className="sr-only">
          E-mail
        </label>
        <input
          id={`newsletter-email-${source}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="seu@email.com"
          className={inputStyles[variant]}
        />
      </div>
      {state.error && <p className={errorClass}>{state.error}</p>}
      <Button
        type="submit"
        variant={variant === "forest" ? "gold" : "primary"}
        size="lg"
        disabled={pending}
        className="w-full justify-center"
      >
        {pending ? "Enviando…" : submitLabel}
      </Button>
    </form>
  );
}
