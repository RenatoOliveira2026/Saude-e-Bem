import { LeadCaptureSection } from "@/components/leads/LeadCaptureSection";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import {
  resolveConversionMapping,
  type ConversionContext,
} from "@/lib/conversion/conversion-mapping";
import { routes } from "@/lib/routes";

interface SmartConversionCtaProps {
  context: ConversionContext;
  category: string;
  categoryLabel: string;
  contentTitle: string;
  contentSlug: string;
}

export function SmartConversionCta({
  context,
  category,
  categoryLabel,
  contentTitle,
  contentSlug,
}: SmartConversionCtaProps) {
  const mapping = resolveConversionMapping({
    context,
    category,
    categoryLabel,
    contentTitle,
  });

  return (
    <>
      <LeadCaptureSection
        source={mapping.source}
        variant="forest"
        id="cta-conversao"
        title={mapping.headline}
        description={mapping.description}
        submitLabel={mapping.submitLabel}
        defaultInterest={mapping.interest}
        hideInterestSelect
        contentType={context}
        contentSlug={contentSlug}
        contentTitle={contentTitle}
      />

      <Section background="white" spacing="compact">
        <Container size="md">
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-gold/30 bg-gold-muted/20 p-6 sm:flex-row">
            <div>
              <p className="font-heading text-lg text-forest">Pronto para ir além?</p>
              <p className="mt-1 text-sm text-muted">
                Conteúdos premium, biblioteca ampliada e acompanhamento no Clube Saúde & Bem.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {mapping.landingHref && (
                <Button href={mapping.landingHref} variant="outline" size="sm">
                  Guia completo
                </Button>
              )}
              <Button href={routes.assinar} variant="gold" size="sm">
                Assinar Clube
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
