import { LeadCaptureSection } from "@/components/leads/LeadCaptureSection";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/icons";
import type { LandingPageConfig } from "@/lib/conversion/landing-pages.config";
import { routes } from "@/lib/routes";
import Image from "next/image";
import Link from "next/link";

interface LandingPageViewProps {
  config: LandingPageConfig;
}

export function LandingPageView({ config }: LandingPageViewProps) {
  return (
    <>
      <section className="border-b border-border bg-gradient-to-br from-sage-muted via-off-white to-gold-muted/20 py-14 md:py-20">
        <Container size="md">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Badge variant="gold" className="mb-4">
                {config.badge}
              </Badge>
              <h1 className="font-heading text-3xl leading-snug text-forest text-balance md:text-4xl">
                {config.title}
              </h1>
              <p className="mt-3 text-sm font-medium uppercase tracking-wider text-sage">
                {config.subtitle}
              </p>
              <p className="mt-5 text-muted leading-relaxed text-pretty">
                {config.heroDescription}
              </p>
              <ul className="mt-8 space-y-3">
                {config.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-sm text-forest">
                    <Icon name="checklist" size={18} className="mt-0.5 shrink-0 text-sage" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
              <Image
                src={config.coverImage}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </Container>
      </section>

      <LeadCaptureSection
        source={config.source}
        variant="forest"
        id="captura"
        title={config.ctaTitle}
        description={config.ctaDescription}
        submitLabel="Quero receber gratuitamente"
        defaultInterest={config.interest}
        hideInterestSelect
        lpSlug={config.slug}
      />

      <Section background="white">
        <Container size="md">
          <h2 className="font-heading text-2xl text-forest">O que você recebe</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {config.bullets.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-border bg-surface p-5 text-sm text-muted shadow-soft"
              >
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href={routes.assinar} variant="outline">
              Conhecer Clube Premium
            </Button>
            <Button href={routes.blog} variant="ghost">
              Ler artigos gratuitos
            </Button>
          </div>
          <p className="mt-8 text-xs text-muted-light">
            Conteúdo educativo. Não substitui acompanhamento médico ou nutricional.
          </p>
        </Container>
      </Section>

      <Section background="sage" spacing="compact">
        <Container size="sm" className="text-center">
          <p className="text-sm text-muted">
            Já é assinante?{" "}
            <Link href={routes.clube} className="font-medium text-forest underline-offset-2 hover:underline">
              Acesse o Clube
            </Link>
          </p>
        </Container>
      </Section>
    </>
  );
}
