import {
  ClubBenefitsGrid,
  ClubFaq,
  ClubStats,
  ClubTestimonials,
  ClubVipList,
  ClubWaitlist,
  CrossLinks,
} from "@/components/pages";
import {
  ClubBenefitsSplit,
  ClubCtaBand,
  ClubIntroSection,
  ClubMembershipPlans,
  ClubPlanComparison,
} from "@/components/club/ClubPublicSections";
import { ClubPremiumProtocolsSection } from "@/components/club/ClubPremiumProtocolsSection";
import { LaunchFunnelCta } from "@/components/launch";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLdScript } from "@/components/seo/JsonLd";
import { fetchActiveMembershipPlans } from "@/lib/membership";
import { routes } from "@/lib/routes";
import { webPageJsonLd } from "@/lib/seo/json-ld";
import { buildContentMetadata } from "@/lib/seo/metadata";

const CLUBE_TITLE = "Clube Saúde & Bem — Área Premium";
const CLUBE_DESCRIPTION =
  "Comunidade premium com protocolos exclusivos, ferramentas avançadas, biblioteca ampliada e acompanhamento contínuo para sua jornada de saúde e longevidade.";

export const metadata = buildContentMetadata({
  title: CLUBE_TITLE,
  description: CLUBE_DESCRIPTION,
  path: routes.clube,
  keywords: "clube, premium, assinatura, saúde, bem-estar, longevidade",
});

export default async function ClubePage() {
  const plans = await fetchActiveMembershipPlans();

  return (
    <>
      <JsonLdScript
        data={webPageJsonLd({
          title: CLUBE_TITLE,
          description: CLUBE_DESCRIPTION,
          path: routes.clube,
        })}
      />
      <PageHero
        badge="Clube Premium"
        title="Clube Saúde & Bem"
        description="O próximo nível da sua jornada de saúde. Acesso premium a protocolos avançados, ferramentas exclusivas, biblioteca ampliada e área de membros dedicada."
      />
      <ClubIntroSection />
      <ClubStats />
      <ClubBenefitsSplit />
      <ClubPremiumProtocolsSection />
      <ClubBenefitsGrid />
      <ClubPlanComparison />
      <ClubMembershipPlans plans={plans} />
      <ClubVipList />
      <ClubTestimonials />
      <ClubFaq />
      <ClubCtaBand />
      <ClubWaitlist />
      <LaunchFunnelCta background="gold" />
      <CrossLinks />
    </>
  );
}
