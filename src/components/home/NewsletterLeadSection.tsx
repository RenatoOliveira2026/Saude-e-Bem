"use client";

import { Button } from "@/components/ui/Button";
import { Section, SectionTitle } from "@/components/ui/Section";
import {
  subscribeNewsletterAction,
  type NewsletterActionState,
} from "@/lib/actions/newsletter.actions";
import { useActionState } from "react";

const initialState: NewsletterActionState = {};

export function NewsletterLeadSection() {
  const [state, formAction, pending] = useActionState(
    subscribeNewsletterAction,
    initialState,
  );

  const done = Boolean(state.success);

  return (
    <Section background="forest" id="newsletter" spacing="spacious">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-gold/90">
          Newsletter
        </p>
        <SectionTitle className="mt-4 text-2xl text-off-white md:text-3xl text-balance">
          Receba conteúdos exclusivos sobre saúde, hábitos e longevidade
        </SectionTitle>
        <p className="mt-4 text-off-white/70 leading-relaxed text-pretty">
          Uma curadoria mensal com artigos, protocolos e insights práticos — sem
          spam, apenas valor.
        </p>

        {done ? (
          <div
            className="mt-10 rounded-2xl border border-off-white/15 bg-off-white/10 px-6 py-6 backdrop-blur-sm"
            role="status"
          >
            <p className="font-heading text-lg font-semibold text-off-white">
              Obrigado por se inscrever!
            </p>
            <p className="mt-2 text-sm text-off-white/70">
              {state.fallback
                ? "Seu interesse foi registrado. Em breve ativaremos o envio por e-mail."
                : "Em breve você receberá nossos melhores conteúdos."}
            </p>
          </div>
        ) : (
          <form action={formAction} className="mt-10 space-y-3 text-left sm:mx-auto sm:max-w-md">
            <div>
              <label htmlFor="lead-name" className="sr-only">
                Nome
              </label>
              <input
                id="lead-name"
                name="name"
                type="text"
                required
                placeholder="Seu nome"
                className="h-12 w-full rounded-full border border-off-white/20 bg-off-white/10 px-5 text-sm text-off-white placeholder:text-off-white/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>
            <div>
              <label htmlFor="lead-email" className="sr-only">
                E-mail
              </label>
              <input
                id="lead-email"
                name="email"
                type="email"
                required
                placeholder="seu@email.com"
                className="h-12 w-full rounded-full border border-off-white/20 bg-off-white/10 px-5 text-sm text-off-white placeholder:text-off-white/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>
            {state.error && (
              <p className="text-center text-sm text-gold-light">{state.error}</p>
            )}
            <Button
              type="submit"
              variant="gold"
              size="lg"
              disabled={pending}
              className="w-full justify-center"
            >
              {pending ? "Enviando…" : "Quero receber"}
            </Button>
          </form>
        )}

        <p className="mt-6 text-xs text-off-white/50">
          Respeitamos sua privacidade. Cancele quando quiser.
        </p>
      </div>
    </Section>
  );
}
