import { AffiliateDisclosure } from "@/components/affiliates/AffiliateDisclosure";
import { AffiliateTrackLink } from "@/components/affiliates/AffiliateTrackLink";
import { CrossLinks, PageCta } from "@/components/pages";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DetailHero } from "@/components/layout/DetailPage";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { formatBrl } from "@/lib/affiliates/tracking";
import { getMarketplaceItemHref, type MarketplaceItem } from "@/lib/marketplace";
import { routes } from "@/lib/routes";

const fulfillmentLabels: Record<MarketplaceItem["fulfillment"], string> = {
  digital: "Produto digital",
  affiliate: "Produto afiliado",
  subscription: "Assinatura",
};

interface MarketplaceDetailProps {
  item: MarketplaceItem;
}

export function MarketplaceDetail({ item }: MarketplaceDetailProps) {
  const price = formatBrl(item.currentPrice ?? null);
  const contentHref = getMarketplaceItemHref(item);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Início", href: routes.home },
          { label: "Marketplace", href: routes.marketplace },
          { label: item.title },
        ]}
      />

      <DetailHero
        badge={item.categoryLabel}
        title={item.title}
        description={item.description}
        premium={item.isPremium}
        meta={[
          { icon: "star", label: fulfillmentLabels[item.fulfillment] },
          ...(price ? [{ icon: "chart" as const, label: price }] : []),
        ]}
      />

      <Section background="white">
        <Container size="md">
          <div className="flex flex-wrap gap-2">
            <Badge variant={item.isPremium ? "gold" : "sage"}>
              {item.isPremium ? "PREMIUM" : "FREE"}
            </Badge>
            <Badge variant="default">{item.productType}</Badge>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {item.fulfillment === "affiliate" && item.affiliateSlug ? (
              <>
                <AffiliateTrackLink
                  slug={item.affiliateSlug}
                  label="Ver oferta do parceiro"
                  sourcePage={routes.marketplaceItem(item.slug)}
                  sourceType="detail"
                />
                <Button href={routes.recomendado(item.affiliateSlug)} variant="outline" size="md">
                  Página completa do produto
                </Button>
              </>
            ) : item.fulfillment === "subscription" ? (
              <Button href={routes.assinar} variant="gold" size="lg">
                Assinar Clube Premium
              </Button>
            ) : (
              <Button
                href={contentHref}
                variant={item.isPremium ? "secondary" : "primary"}
                size="lg"
              >
                {item.isPremium ? "Assinar para acessar" : "Acessar conteúdo"}
              </Button>
            )}
          </div>

          {item.fulfillment === "affiliate" && (
            <div className="mt-8">
              <AffiliateDisclosure />
            </div>
          )}
        </Container>
      </Section>

      <PageCta
        title="Explore mais produtos"
        description="E-books próprios, afiliados curados e assinatura Premium — tudo no Marketplace Saúde & Bem."
        primaryLabel="Voltar ao marketplace"
        primaryHref={routes.marketplace}
        secondaryLabel="Minha Saúde"
        secondaryHref={routes.minhaSaude}
        background="gold"
      />
      <CrossLinks />
    </>
  );
}
