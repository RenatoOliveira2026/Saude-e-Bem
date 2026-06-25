import { GlobalNewsletterSection } from "@/components/newsletter/NewsletterCaptureSection";
import { LaunchFunnelCta } from "@/components/launch";
import { CrossLinks, PageCta } from "@/components/pages";
import { PremiumLibraryExplorer } from "@/components/intelligent-library/PremiumLibraryExplorer";
import { PageHero } from "@/components/layout/PageHero";
import {
  computeLibraryStats,
  fetchFeaturedIntelligentLibraryItem,
  fetchIntelligentLibraryItems,
} from "@/lib/intelligent-library";
import { enrichLibraryCatalog } from "@/lib/premium/library-enrichment";
import { routes } from "@/lib/routes";
import { buildContentMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;

export const metadata = buildContentMetadata({
  title: "Biblioteca Saúde & Bem",
  description:
    "Biblioteca inteligente com e-books, protocolos e vídeos — filtre por objetivo, nível e tempo. Materiais gratuitos e premium.",
  path: routes.biblioteca,
});

export default async function BibliotecaPage() {
  const [itemsRaw, featuredRaw] = await Promise.all([
    fetchIntelligentLibraryItems(),
    fetchFeaturedIntelligentLibraryItem(),
  ]);

  const items = enrichLibraryCatalog(itemsRaw);
  const featured = featuredRaw ? enrichLibraryCatalog([featuredRaw])[0] : null;
  const stats = computeLibraryStats(itemsRaw);

  return (
    <>
      <PageHero
        badge="Biblioteca Inteligente"
        title="Biblioteca Saúde & Bem"
        description="E-books, protocolos e vídeos curados — filtre por objetivo, dificuldade e tempo estimado. Destaque em Novidades para lançamentos premium."
      />
      <PremiumLibraryExplorer items={items} featured={featured} />
      <GlobalNewsletterSection source="biblioteca" />
      <PageCta
        title="Biblioteca premium no Clube"
        description={`${stats.premium} materiais premium e ${stats.free} gratuitos no catálogo — assinantes têm acesso completo a e-books, protocolos e vídeos exclusivos.`}
        primaryLabel="Assinar Clube Saúde & Bem"
        primaryHref={routes.assinar}
        secondaryLabel="Trilhas Premium"
        secondaryHref={routes.clubeTrilhas}
      />
      <LaunchFunnelCta />
      <CrossLinks />
    </>
  );
}
