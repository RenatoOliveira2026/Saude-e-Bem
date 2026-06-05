import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/icons";
import { routes } from "@/lib/routes";

interface PremiumGateProps {
  title: string;
  description: string;
  upgradeHref?: string;
  ctaLabel?: string;
}

/**
 * Bloqueia conteúdo premium e direciona para assinatura (Fase 4.7).
 */
export function PremiumGate({
  title,
  description,
  upgradeHref,
  ctaLabel = "Assinar agora",
}: PremiumGateProps) {
  const href = upgradeHref ?? routes.assinar;

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
