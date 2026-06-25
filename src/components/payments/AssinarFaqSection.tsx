"use client";

import { Section } from "@/components/ui/Section";
import { assinarCheckoutFaqs } from "@/lib/conversion/assinar-content";
import { cn } from "@/lib/cn";
import { useState } from "react";

export function AssinarFaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section background="sage" spacing="compact">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-2 text-center font-heading text-2xl text-forest">
          Dúvidas sobre a assinatura
        </h2>
        <p className="mb-8 text-center text-sm text-muted">
          Transparência antes, durante e depois do pagamento.
        </p>
        <div className="space-y-3">
          {assinarCheckoutFaqs.map((faq, index) => {
            const isOpen = open === index;
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-xl border border-border bg-surface"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left font-heading text-sm font-semibold text-forest"
                  aria-expanded={isOpen}
                >
                  {faq.question}
                  <span
                    className={cn(
                      "ml-4 shrink-0 text-gold transition-transform",
                      isOpen && "rotate-45",
                    )}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="border-t border-border px-6 py-4">
                    <p className="text-sm leading-relaxed text-muted">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
