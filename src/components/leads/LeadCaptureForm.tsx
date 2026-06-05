"use client";

import { Button } from "@/components/ui/Button";
import { saveLeadAction, type LeadCaptureActionState } from "@/lib/leads/actions/save-lead.action";
import { LEAD_INTERESTS } from "@/lib/leads/lead.constants";
import type { LeadSource } from "@/lib/leads/lead.types";
import { useActionState } from "react";

const initialState: LeadCaptureActionState = {};

type LeadFormVariant = "forest" | "light";

interface LeadCaptureFormProps {
  source: LeadSource;
  variant?: LeadFormVariant;
  submitLabel?: string;
  className?: string;
}

const inputStyles: Record<LeadFormVariant, string> = {
  forest:
    "h-12 w-full rounded-full border border-off-white/20 bg-off-white/10 px-5 text-sm text-off-white placeholder:text-off-white/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30",
  light:
    "h-12 w-full rounded-full border border-border-strong bg-surface px-5 text-sm text-graphite placeholder:text-muted-light shadow-soft focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20",
};

const selectStyles: Record<LeadFormVariant, string> = {
  forest:
    "h-12 w-full appearance-none rounded-full border border-off-white/20 bg-off-white/10 px-5 text-sm text-off-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30",
  light:
    "h-12 w-full appearance-none rounded-full border border-border-strong bg-surface px-5 text-sm text-graphite shadow-soft focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20",
};

export function LeadCaptureForm({
  source,
  variant = "light",
  submitLabel = "Quero receber conteúdos",
  className,
}: LeadCaptureFormProps) {
  const [state, formAction, pending] = useActionState(saveLeadAction, initialState);

  const errorClass =
    variant === "forest"
      ? "text-center text-sm text-gold-light"
      : "text-center text-sm text-amber-700";

  return (
    <form action={formAction} className={className ?? "space-y-3"}>
      <input type="hidden" name="source" value={source} />
      <div>
        <label htmlFor={`lead-name-${source}`} className="sr-only">
          Nome
        </label>
        <input
          id={`lead-name-${source}`}
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Seu nome"
          className={inputStyles[variant]}
        />
      </div>
      <div>
        <label htmlFor={`lead-email-${source}`} className="sr-only">
          E-mail
        </label>
        <input
          id={`lead-email-${source}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="seu@email.com"
          className={inputStyles[variant]}
        />
      </div>
      <div>
        <label htmlFor={`lead-interest-${source}`} className="sr-only">
          Interesse principal
        </label>
        <select
          id={`lead-interest-${source}`}
          name="interest"
          required
          defaultValue=""
          className={selectStyles[variant]}
        >
          <option value="" disabled>
            Interesse principal
          </option>
          {LEAD_INTERESTS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
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
