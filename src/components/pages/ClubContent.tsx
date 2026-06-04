"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Icon, IconBox } from "@/components/icons";
import {
  clubBenefits,
  clubFaqs,
  clubPlans,
  clubStats,
  clubTestimonials,
  clubVipList,
} from "@/lib/data/club";
import { cn } from "@/lib/cn";
import { useState } from "react";

export function ClubStats() {
  return (
    <Section background="sage" spacing="compact">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {clubStats.map((stat) => (
          <div key={stat.label} className="text-center">
            <Icon name={stat.icon} size={28} className="mx-auto text-sage" />
            <p className="mt-3 font-heading text-3xl font-bold text-forest md:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function ClubBenefitsGrid() {
  return (
    <Section background="white">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-sage">
          Benefícios
        </p>
        <h2 className="mt-3 font-heading text-3xl text-forest text-balance">
          Tudo o que o Clube oferece
        </h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {clubBenefits.map((benefit) => (
          <Card key={benefit.title} variant="muted" padding="lg">
            <IconBox name={benefit.icon} size={22} className="bg-surface shadow-soft" />
            <h3 className="mt-4 font-heading text-lg text-forest">
              {benefit.title}
            </h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              {benefit.description}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

export function ClubVipList() {
  return (
    <Section background="default">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <Badge variant="gold" className="mb-4">
          Lista VIP
        </Badge>
        <h2 className="font-heading text-3xl text-forest text-balance">
          Vantagens exclusivas para quem entra agora
        </h2>
        <p className="mt-4 text-muted leading-relaxed">
          A lista VIP garante prioridade no lançamento, condições especiais de
          fundador e acesso antecipado ao ecossistema premium Saúde & Bem.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {clubVipList.map((item) => (
          <Card key={item.title} variant="default" padding="lg">
            <IconBox name={item.icon} size={22} className="bg-gold-muted text-forest" />
            <h3 className="mt-4 font-heading text-lg text-forest">{item.title}</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              {item.description}
            </p>
          </Card>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button href="#lista-espera" variant="gold" size="md">
          Entrar na lista VIP
        </Button>
      </div>
    </Section>
  );
}

export function ClubPricing() {
  return (
    <Section background="default">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <Badge variant="gold" className="mb-4">
          Pré-lançamento
        </Badge>
        <h2 className="font-heading text-3xl text-forest text-balance">
          Planos para cada jornada
        </h2>
        <p className="mt-4 text-muted">
          Preços de lançamento — disponíveis em breve para membros da lista de
          espera.
        </p>
      </div>
      <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
        {clubPlans.map((plan) => (
          <Card
            key={plan.id}
            variant={plan.highlighted ? "featured" : "default"}
            padding="lg"
            className={cn(
              "flex flex-col",
              plan.highlighted && "md:-translate-y-2",
            )}
          >
            {plan.badge && (
              <Badge variant="gold" className="mb-4 w-fit">
                {plan.badge}
              </Badge>
            )}
            <h3 className="font-heading text-xl text-forest">{plan.name}</h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-heading text-3xl font-bold text-forest">
                {plan.price}
              </span>
              <span className="text-sm text-muted">{plan.period}</span>
            </div>
            {plan.savingsLabel && (
              <p className="mt-2 text-sm font-semibold text-gold">
                {plan.savingsLabel}
              </p>
            )}
            <p className="mt-3 text-sm text-muted">{plan.description}</p>
            <ul className="mt-6 flex-1 space-y-2.5">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-sm text-graphite"
                >
                  <span className="mt-0.5 text-gold" aria-hidden="true">
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Button
              href="#lista-espera"
              variant={plan.highlighted ? "gold" : "outline"}
              size="md"
              className="mt-8 w-full justify-center"
            >
              Entrar na lista de espera
            </Button>
          </Card>
        ))}
      </div>
    </Section>
  );
}

export function ClubTestimonials() {
  return (
    <Section background="white">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="font-heading text-3xl text-forest">
          O que dizem os beta testers
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {clubTestimonials.map((t) => (
          <Card key={t.name} variant="default" padding="lg">
            <p className="text-sm leading-relaxed text-muted italic">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-muted font-heading text-xs font-bold text-forest">
                {t.avatar}
              </span>
              <div>
                <p className="text-sm font-medium text-forest">{t.name}</p>
                <p className="text-xs text-muted-light">{t.role}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

export function ClubFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section background="sage">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-8 text-center font-heading text-3xl text-forest">
          Perguntas frequentes
        </h2>
        <div className="space-y-3">
          {clubFaqs.map((faq, index) => {
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
                    <p className="text-sm leading-relaxed text-muted">
                      {faq.answer}
                    </p>
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

export function ClubWaitlist() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  }

  return (
    <Section background="forest" spacing="compact" id="lista-espera">
      <div className="mx-auto max-w-xl text-center">
        <Badge variant="gold" className="mb-4">
          Lista de espera
        </Badge>
        <h2 className="font-heading text-2xl text-off-white md:text-3xl">
          Garanta acesso antecipado
        </h2>
        <p className="mt-4 text-off-white/70 text-pretty">
          Seja notificado no lançamento e receba condições exclusivas de
          fundador.
        </p>
        {submitted ? (
          <p className="mt-8 rounded-xl bg-off-white/10 px-6 py-4 text-sm text-off-white">
            Você está na lista! Em breve entraremos em contato.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="club-email" className="sr-only">
              E-mail
            </label>
            <input
              id="club-email"
              type="email"
              required
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 flex-1 rounded-full border border-off-white/20 bg-off-white/10 px-5 text-sm text-off-white placeholder:text-off-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
            <Button type="submit" variant="gold" size="md" className="shrink-0">
              Quero participar
            </Button>
          </form>
        )}
      </div>
    </Section>
  );
}
