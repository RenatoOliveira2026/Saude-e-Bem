import {
  ClubBenefitsGrid,
  ClubFaq,
  ClubStats,
  ClubTestimonials,
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
import { ClubTrustSection } from "@/components/club/ClubTrustSection";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLdScript } from "@/components/seo/JsonLd";
import { clubFaqs } from "@/lib/data/club";
import { fetchActiveMembershipPlans } from "@/lib/membership";
import { routes } from "@/lib/routes";
import { faqJsonLd, webPageJsonLd } from "@/lib/seo/json-ld";
import { buildContentMetadata } from "@/lib/seo/metadata";

const CLUBE_TITLE = "Clube Saúde & Bem — Assinatura Premium";
const CLUBE_DESCRIPTION =
  "Assine o Clube Saúde & Bem Premium: protocolos exclusivos, ferramentas avançadas, biblioteca ampliada e checkout seguro via Mercado Pago. Compare plano gratuito e premium.";

export const metadata = buildContentMetadata({
  title: CLUBE_TITLE,
  description: CLUBE_DESCRIPTION,
  path: routes.clube,
  keywords: "clube, premium, assinatura, saúde, bem-estar, longevidade, mercado pago",
});

export default async function ClubePage() {
  const plans = await fetchActiveMembershipPlans();

  return (
    <>
      <JsonLdScript
        data={[
          webPageJsonLd({
            title: CLUBE_TITLE,
            description: CLUBE_DESCRIPTION,
            path: routes.clube,
          }),
          faqJsonLd([...clubFaqs]),
        ]}
      />
      <PageHero
        badge="Premium disponível"
        title="Clube Saúde & Bem"
        description="Assinatura ativa — protocolos avançados, ferramentas exclusivas, biblioteca ampliada e área de membros com checkout seguro via Mercado Pago."
      />
      <ClubIntroSection />
      <ClubStats />
      <ClubBenefitsSplit />
      <ClubPremiumProtocolsSection />
      <ClubBenefitsGrid />
      <ClubPlanComparison />
      <ClubMembershipPlans plans={plans} />
      <ClubTestimonials />
      <ClubTrustSection />
      <ClubFaq />
      <ClubCtaBand />
      <CrossLinks />
    </>
  );
}
