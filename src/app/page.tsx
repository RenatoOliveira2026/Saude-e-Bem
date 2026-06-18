import {
  AffiliatesRecommendedSection,
  ClubPremiumSection,
  FeaturedHighlightSection,
  HeroSection,
  LibraryPremiumSection,
  NewsletterLeadSection,
  ObjectivesPremiumSection,
  ProtocolsPremiumSection,
} from "@/components/home";
import { LaunchFunnelCta } from "@/components/launch";
import { JsonLdScript } from "@/components/seo/JsonLd";
import { getHomePageContent } from "@/lib/content/home";
import { routes } from "@/lib/routes";
import { homeWebPageJsonLd } from "@/lib/seo/json-ld";
import { buildContentMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;

const HOME_TITLE = "Saúde & Bem — Sua jornada para uma vida mais saudável";
const HOME_DESCRIPTION =
  "Conteúdo confiável, hábitos saudáveis, protocolos e ferramentas para viver com mais energia, equilíbrio e longevidade.";

export const metadata = buildContentMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: routes.home,
  type: "website",
});

export default async function HomePage() {
  const {
    highlightArticles,
    highlightProtocols,
    highlightEbooks,
    protocols,
    freeLibrary,
    affiliates,
  } = await getHomePageContent();

  const hasHighlights =
    highlightArticles.length > 0 ||
    highlightProtocols.length > 0 ||
    highlightEbooks.length > 0;

  return (
    <>
      <JsonLdScript
        data={homeWebPageJsonLd({
          title: HOME_TITLE,
          description: HOME_DESCRIPTION,
        })}
      />
      <HeroSection />
      <ObjectivesPremiumSection />
      {hasHighlights ? (
        <FeaturedHighlightSection
          articles={highlightArticles}
          protocols={highlightProtocols}
          ebooks={highlightEbooks}
        />
      ) : null}
      <ProtocolsPremiumSection protocols={protocols} />
      <LibraryPremiumSection resources={freeLibrary} />
      <AffiliatesRecommendedSection affiliates={affiliates} />
      <NewsletterLeadSection />
      <LaunchFunnelCta background="gold" />
      <ClubPremiumSection />
    </>
  );
}
