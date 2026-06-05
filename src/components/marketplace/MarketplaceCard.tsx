import { AffiliateTrackLink } from "@/components/affiliates/AffiliateTrackLink";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Icon } from "@/components/icons";
import { formatBrl } from "@/lib/affiliates/tracking";
import type { AffiliateSourceType } from "@/lib/affiliates/tracking";
import { resolveItemHref } from "@/lib/marketplace/marketplace-matching";
import type { MarketplaceItem } from "@/lib/marketplace/marketplace.types";
import { routes } from "@/lib/routes";
import Image from "next/image";
import Link from "next/link";

const fulfillmentLabels: Record<MarketplaceItem["fulfillment"], string> = {
  digital: "Digital",
  affiliate: "Afiliado",
  subscription: "Assinatura",
};

interface MarketplaceCardProps {
  item: MarketplaceItem;
  compact?: boolean;
  sourcePage?: string;
  sourceType?: AffiliateSourceType;
}

export function MarketplaceCard({
  item,
  compact = false,
  sourcePage = routes.marketplace,
  sourceType = "marketplace",
}: MarketplaceCardProps) {
  const href = resolveItemHref(item);
  const price = formatBrl(item.currentPrice ?? null);
  const detailHref = routes.marketplaceItem(item.slug);

  return (
    <Card
      variant="default"
      hover
      padding={compact ? "sm" : "md"}
      className="flex h-full flex-col bg-surface/95"
    >
      <Link href={detailHref} className="group block">
        {item.imageUrl ? (
          <div
            className={
              compact
                ? "relative mb-3 aspect-[4/3] overflow-hidden rounded-xl"
                : "relative mb-4 aspect-video overflow-hidden rounded-xl"
            }
          >
            <Image
              src={item.imageUrl}
              alt=""
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              unoptimized
            />
          </div>
        ) : (
          <div
            className={
              compact
                ? "mb-3 flex aspect-[4/3] items-center justify-center rounded-xl bg-sage-muted/40 text-sage"
                : "mb-4 flex aspect-video items-center justify-center rounded-xl bg-sage-muted/40 text-sage"
            }
          >
            <Icon
              name={item.fulfillment === "digital" ? "book" : "star"}
              size={compact ? 22 : 28}
              aria-hidden
            />
          </div>
        )}

        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant={item.isPremium ? "gold" : "sage"}>
            {item.isPremium ? "PREMIUM" : "FREE"}
          </Badge>
          <Badge variant="default">{fulfillmentLabels[item.fulfillment]}</Badge>
          {item.editorChoice && (
            <Badge variant="gold" className="text-[10px]">
              Editor
            </Badge>
          )}
        </div>

        <CardHeader className="mb-0 mt-0 flex-1">
          <CardTitle className={compact ? "text-sm leading-snug" : "text-base leading-snug"}>
            {item.title}
          </CardTitle>
          <p className="mt-1 text-xs text-muted">
            {item.categoryLabel} · {item.productType}
          </p>
          {item.description && (
            <CardDescription
              className={
                compact ? "mt-1.5 line-clamp-2 text-xs" : "mt-2 line-clamp-3 text-sm"
              }
            >
              {item.description}
            </CardDescription>
          )}
        </CardHeader>
      </Link>

      {price && (
        <p className="mt-2 text-xs font-semibold text-forest">{price}</p>
      )}

      <div className="mt-4 border-t border-border pt-4">
        {item.fulfillment === "affiliate" && item.affiliateSlug ? (
          <AffiliateTrackLink
            slug={item.affiliateSlug}
            label="Ver oferta"
            sourcePage={sourcePage}
            sourceType={sourceType}
          />
        ) : item.fulfillment === "subscription" ? (
          <Button href={routes.assinar} variant="gold" size="sm" className="w-full justify-center">
            Assinar agora
          </Button>
        ) : item.isPremium ? (
          <Button href={routes.assinar} variant="secondary" size="sm" className="w-full justify-center">
            Assinar para acessar
          </Button>
        ) : (
          <Button href={href} variant="outline" size="sm" className="w-full justify-center">
            Acessar conteúdo
          </Button>
        )}
      </div>
    </Card>
  );
}
