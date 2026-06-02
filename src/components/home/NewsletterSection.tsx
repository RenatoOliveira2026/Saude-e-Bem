"use client";

import { Button } from "@/components/ui/Button";
import { Section, SectionTitle } from "@/components/ui/Section";
import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  }

  return (
    <Section background="sage" id="newsletter" spacing="compact">
      <div className="mx-auto max-w-2xl text-center">
        <SectionTitle className="text-2xl md:text-3xl">
          Receba insights sobre saúde e longevidade
        </SectionTitle>
        <p className="mt-4 text-muted text-pretty leading-relaxed">
          Newsletter semanal com artigos, protocolos e dicas práticas — sem
          spam, apenas conteúdo que importa.
        </p>

        {submitted ? (
          <div
            className="mt-8 rounded-xl border border-sage/30 bg-surface px-6 py-5 shadow-soft"
            role="status"
          >
            <p className="font-heading font-semibold text-forest">
              Obrigado por se inscrever!
            </p>
            <p className="mt-1 text-sm text-muted">
              Em breve você receberá nossos melhores conteúdos.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Seu e-mail
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-full border border-border-strong bg-surface px-5 text-sm text-graphite placeholder:text-muted-light shadow-soft focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20 sm:max-w-xs"
            />
            <Button type="submit" variant="primary" size="md" className="shrink-0">
              Inscrever-se
            </Button>
          </form>
        )}

        <p className="mt-4 text-xs text-muted-light">
          Respeitamos sua privacidade. Cancele quando quiser.
        </p>
      </div>
    </Section>
  );
}
