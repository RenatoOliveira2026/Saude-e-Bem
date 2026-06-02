import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Icon, type IconName } from "@/components/icons";
import { routes } from "@/lib/routes";
import Link from "next/link";

interface DetailHeroProps {
  badge?: string;
  badgeVariant?: "default" | "gold" | "forest";
  title: string;
  description: string;
  meta?: Array<{ icon: IconName; label: string }>;
  cta?: { label: string; href: string; variant?: "primary" | "gold" | "outline" };
  premium?: boolean;
}

export function DetailHero({
  badge,
  badgeVariant = "gold",
  title,
  description,
  meta,
  cta,
  premium,
}: DetailHeroProps) {
  return (
    <section className="border-b border-border bg-surface pt-8 pb-12 md:pt-12 md:pb-16">
      <Container size="md">
        <div className="flex flex-wrap gap-2">
          {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
          {premium && <Badge variant="gold">Premium</Badge>}
        </div>
        <h1 className="mt-4 font-heading text-3xl text-forest text-balance md:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted text-pretty">
          {description}
        </p>
        {meta && meta.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-4">
            {meta.map((m) => (
              <span
                key={m.label}
                className="inline-flex items-center gap-2 text-sm text-muted"
              >
                <Icon name={m.icon} size={16} className="text-sage" />
                {m.label}
              </span>
            ))}
          </div>
        )}
        {cta && (
          <div className="mt-8">
            <Button href={cta.href} variant={cta.variant ?? "primary"} size="lg">
              {cta.label}
            </Button>
          </div>
        )}
        <div className="divider-gold mt-8" />
      </Container>
    </section>
  );
}

interface RelatedNavProps {
  title?: string;
  links: Array<{ label: string; href: string; description?: string }>;
}

export function RelatedNav({
  title = "Continue explorando",
  links,
}: RelatedNavProps) {
  return (
    <Section background="sage" spacing="compact">
      <Container>
        <h2 className="font-heading text-xl text-forest md:text-2xl">{title}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center justify-between rounded-xl border border-border bg-surface p-5 transition-all hover:border-sage hover:shadow-soft"
            >
              <div>
                <p className="font-heading font-semibold text-forest group-hover:text-sage transition-colors">
                  {link.label}
                </p>
                {link.description && (
                  <p className="mt-1 text-sm text-muted">{link.description}</p>
                )}
              </div>
              <Icon
                name="arrow-right"
                size={18}
                className="shrink-0 text-sage opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5"
              />
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function PremiumGate({
  title,
  description,
  upgradeHref,
  ctaLabel = "Acessar via Clube Saúde & Bem",
}: {
  title: string;
  description: string;
  upgradeHref?: string;
  ctaLabel?: string;
}) {
  const href = upgradeHref ?? routes.clubePremium;

  return (
    <Section background="gold" spacing="compact">
      <Container size="sm">
        <div className="flex flex-col items-center rounded-xl border border-gold/30 bg-surface p-8 text-center shadow-soft md:p-10">
          <Icon name="lock" size={32} className="text-gold" />
          <h2 className="mt-4 font-heading text-xl text-forest">{title}</h2>
          <p className="mt-3 text-muted text-pretty">{description}</p>
          <Button href={href} variant="gold" size="lg" className="mt-6">
            {ctaLabel}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
