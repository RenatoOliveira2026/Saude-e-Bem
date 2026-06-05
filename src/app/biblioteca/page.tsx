import { NewsletterCaptureSection } from "@/components/newsletter";
import { CrossLinks, PageCta } from "@/components/pages";
import { IntelligentLibraryListing } from "@/components/intelligent-library";
import { PageHero } from "@/components/layout/PageHero";
import {
  computeLibraryStats,
  fetchFeaturedIntelligentLibraryItem,
  fetchIntelligentLibraryItems,
} from "@/lib/intelligent-library";
import { routes } from "@/lib/routes";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Biblioteca Saúde & Bem",
  description:
    "Biblioteca inteligente com e-books, protocolos e vídeos — materiais gratuitos e premium curados para sua evolução em saúde e longevidade.",
};

export default async function BibliotecaPage() {
  const [items, featured] = await Promise.all([
    fetchIntelligentLibraryItems(),
    fetchFeaturedIntelligentLibraryItem(),
  ]);

  const stats = computeLibraryStats(items);

  return (
    <>
      <PageHero
        badge="Biblioteca Inteligente"
        title="Biblioteca Saúde & Bem"
        description="E-books, protocolos e vídeos curados — gratuitos e premium. Filtre por tipo, acesse conteúdos ou assine para desbloquear materiais exclusivos."
      />
      <IntelligentLibraryListing
        items={items}
        featured={featured ?? null}
      />
      <NewsletterCaptureSection source="biblioteca" />
      <PageCta
        title="Biblioteca premium no Clube"
        description={`${stats.premium} materiais premium e ${stats.free} gratuitos no catálogo — assinantes têm acesso completo a e-books, protocolos e vídeos exclusivos.`}
        primaryLabel="Assinar Clube Saúde & Bem"
        primaryHref={routes.assinar}
        secondaryLabel="Conhecer o Clube"
        secondaryHref={routes.clubePremium}
      />
      <CrossLinks />
    </>
  );
}
