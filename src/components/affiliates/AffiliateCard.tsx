import { AffiliateTrackLink } from "@/components/affiliates/AffiliateTrackLink";
import { Badge } from "@/components/ui/Badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Icon } from "@/components/icons";
import { AFFILIATE_CTA_LABEL } from "@/lib/affiliates/constants";
import { getAffiliateCategoryLabel } from "@/lib/affiliates/categories";
import { formatBrl } from "@/lib/affiliates/tracking";
import type { AffiliateSourceType } from "@/lib/affiliates/tracking";
import type { PublicAffiliateSummary } from "@/lib/affiliates/types";
import { routes } from "@/lib/routes";
import Image from "next/image";
import Link from "next/link";

function categoryDisplay(category: string): string {
  return getAffiliateCategoryLabel(category);
}

function productTypeLabel(type: string): string {
  return type.replace(/-/g, " ");
}

interface AffiliateCardProps {
  link: PublicAffiliateSummary;
  compact?: boolean;
  sourcePage?: string;
  sourceType?: AffiliateSourceType;
}

export function AffiliateCard({
  link,
  compact = false,
  sourcePage = "/recomendados",
  sourceType = "listing",
}: AffiliateCardProps) {
  const price = formatBrl(link.currentPrice);

  return (
    <Card
      variant="default"
      hover
      padding={compact ? "sm" : "md"}
      className="flex h-full flex-col bg-surface/95"
    >
      <Link href={routes.recomendado(link.slug)} className="group block">
        {link.imageUrl ? (
          <div
            className={
              compact
                ? "relative mb-3 aspect-[4/3] overflow-hidden rounded-xl"
                : "relative mb-4 aspect-video overflow-hidden rounded-xl"
            }
          >
            <Image
              src={link.imageUrl}
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
            <Icon name="star" size={compact ? 22 : 28} aria-hidden />
          </div>
        )}

        <div className="mb-2 flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-sage">
            {categoryDisplay(link.category)}
          </p>
          {link.editorChoice && (
            <Badge variant="gold" className="text-[10px]">
              Escolha do editor
            </Badge>
          )}
        </div>

        <CardHeader className="mb-0 mt-0 flex-1">
          <CardTitle className={compact ? "text-sm leading-snug" : "text-base leading-snug"}>
            {link.title}
          </CardTitle>
          {link.brand && (
            <p className="mt-1 text-xs text-muted">
              {link.brand}
              {link.productType ? ` · ${productTypeLabel(link.productType)}` : ""}
            </p>
          )}
          {link.shortDescription || link.description ? (
            <CardDescription
              className={
                compact ? "mt-1.5 line-clamp-2 text-xs" : "mt-2 line-clamp-3 text-sm"
              }
            >
              {link.shortDescription || link.description}
            </CardDescription>
          ) : null}
          {link.benefits.length > 0 && (
            <ul className="mt-3 space-y-1 text-left">
              {link.benefits.slice(0, compact ? 2 : 3).map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-2 text-xs text-muted"
                >
                  <Icon name="checklist" size={14} className="mt-0.5 shrink-0 text-sage" />
                  <span className="line-clamp-2">{benefit}</span>
                </li>
              ))}
            </ul>
          )}
        </CardHeader>
      </Link>

      {(link.rating != null || price) && (
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
          {link.rating != null && (
            <span className="flex items-center gap-1 text-forest">
              <Icon name="star" size={14} className="text-gold" aria-hidden />
              {link.rating.toFixed(1)}
              {link.reviewsCount > 0 && (
                <span className="text-muted">({link.reviewsCount})</span>
              )}
            </span>
          )}
          {price && <span className="font-semibold text-forest">{price}</span>}
        </div>
      )}

      <AffiliateTrackLink
        slug={link.slug}
        label={AFFILIATE_CTA_LABEL}
        sourcePage={sourcePage}
        sourceType={sourceType}
        className="mt-4"
      />
    </Card>
  );
}
