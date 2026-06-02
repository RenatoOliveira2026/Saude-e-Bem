import { AffiliateCardGrid } from "@/components/affiliates/AffiliateCardGrid";
import { AffiliateDisclosure } from "@/components/affiliates/AffiliateDisclosure";
import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { routes } from "@/lib/routes";
import type { PublicAffiliateLink } from "@/lib/supabase/services/affiliates.public";

interface AffiliatesRecommendedSectionProps {
  affiliates: PublicAffiliateLink[];
}

export function AffiliatesRecommendedSection({
  affiliates,
}: AffiliatesRecommendedSectionProps) {
  if (affiliates.length === 0) return null;

  return (
    <Section background="gold" id="recursos" spacing="spacious">
      <HomeSectionHeader
        label="Seleção editorial"
        title="Recursos recomendados para sua jornada"
        description="Ferramentas e produtos que complementam hábitos saudáveis — curadoria discreta, sem pressão de compra."
        align="center"
        className="mb-14"
      />

      <AffiliateCardGrid
        links={affiliates}
        className="lg:grid-cols-4"
        sourcePage="/"
        sourceType="home"
      />

      <div className="mt-10 flex flex-col items-center gap-5">
        <AffiliateDisclosure />
        <Button href={routes.recomendados} variant="outline" size="sm">
          Explorar recomendações
        </Button>
      </div>
    </Section>
  );
}
