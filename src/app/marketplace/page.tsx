import { CrossLinks, PageCta } from "@/components/pages";
import { MarketplaceListing } from "@/components/marketplace";
import { PageHero } from "@/components/layout/PageHero";
import {
  computeMarketplaceStats,
  fetchMarketplaceItems,
} from "@/lib/marketplace";
import { routes } from "@/lib/routes";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Marketplace Saúde & Bem",
  description:
    "E-books próprios, produtos afiliados curados e assinatura Premium — monetização alinhada à sua jornada de saúde.",
};

export default async function MarketplacePage() {
  const items = await fetchMarketplaceItems();
  const stats = computeMarketplaceStats(items);

  return (
    <>
      <PageHero
        badge="Marketplace"
        title="Marketplace Saúde & Bem"
        description="Produtos digitais da plataforma, ofertas afiliadas selecionadas e Clube Premium — curadoria editorial com transparência."
      />
      <MarketplaceListing items={items} />
      <PageCta
        title="Personalizado para você"
        description={`${stats.digital} digitais · ${stats.affiliate} afiliados · ${stats.own} próprios · ${stats.premium} premium — recomendações inteligentes no seu perfil em Minha Saúde.`}
        primaryLabel="Ver Minha Saúde"
        primaryHref={routes.minhaSaude}
        secondaryLabel="Biblioteca gratuita"
        secondaryHref={routes.biblioteca}
        background="sage"
      />
      <CrossLinks />
    </>
  );
}
