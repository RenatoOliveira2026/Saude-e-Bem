import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/icons";
import { crossNav, routes } from "@/lib/routes";
import Link from "next/link";

interface PageCtaProps {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  background?: "forest" | "sage" | "gold";
}

export function PageCta({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  background = "forest",
}: PageCtaProps) {
  const isForest = background === "forest";

  return (
    <Section background={background} spacing="compact">
      <div className="mx-auto max-w-2xl text-center">
        <h2
          className={`font-heading text-2xl text-balance md:text-3xl ${isForest ? "text-off-white" : "text-forest"}`}
        >
          {title}
        </h2>
        <p
          className={`mt-4 leading-relaxed text-pretty ${isForest ? "text-off-white/70" : "text-muted"}`}
        >
          {description}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            href={primaryHref}
            variant={isForest ? "gold" : "primary"}
            size="lg"
          >
            {primaryLabel}
          </Button>
          {secondaryLabel && secondaryHref && (
            <Button
              href={secondaryHref}
              variant="outline"
              size="lg"
              className={
                isForest
                  ? "border-off-white/30 text-off-white hover:bg-off-white/10 hover:text-off-white"
                  : undefined
              }
            >
              {secondaryLabel}
            </Button>
          )}
        </div>
      </div>
    </Section>
  );
}

export function CrossLinks() {
  return (
    <Section background="white" spacing="compact">
      <div className="text-center">
        <p className="font-heading text-sm font-semibold uppercase tracking-wider text-sage">
          Explore a plataforma
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {crossNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group inline-flex items-center gap-2.5 rounded-full border border-border bg-surface px-5 py-2.5 text-sm text-muted shadow-soft transition-all hover:border-sage hover:text-forest hover:shadow-card"
            >
              <Icon
                name={link.icon}
                size={16}
                className="text-sage transition-colors group-hover:text-forest"
              />
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
}
