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
import { getHomePageContent } from "@/lib/content/home";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Saúde & Bem — Sua jornada para uma vida mais saudável",
  description:
    "Conteúdo confiável, hábitos saudáveis, protocolos e ferramentas para viver com mais energia, equilíbrio e longevidade.",
};

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
      <ClubPremiumSection />
    </>
  );
}
