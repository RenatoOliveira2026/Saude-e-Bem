import { AffiliateDisclosure } from "@/components/affiliates/AffiliateDisclosure";
import { AffiliateTrackLink } from "@/components/affiliates/AffiliateTrackLink";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatBrl } from "@/lib/affiliates/tracking";
import type { RecommendedMarketplaceProduct } from "@/lib/marketplace/marketplace.types";
import { routes } from "@/lib/routes";
import Link from "next/link";

interface RecommendedProductsSectionProps {
  products: RecommendedMarketplaceProduct[];
}

export function RecommendedProductsSection({
  products,
}: RecommendedProductsSectionProps) {
  if (products.length === 0) {
    return (
      <p className="text-sm text-muted">
        Complete ferramentas e o quiz para receber produtos alinhados ao seu Score Saúde & Bem.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map(({ item, reason, priority, href, matchScore: _score }) => (
        <Card key={item.id} variant="outline" padding="md" hover>
          <div className="flex flex-wrap gap-2">
            <Badge variant="sage">Prioridade {priority}</Badge>
            <Badge variant="default">{item.categoryLabel}</Badge>
            {item.isPremium && <Badge variant="gold">PREMIUM</Badge>}
          </div>
          <h3 className="mt-3 font-heading text-lg text-forest">{item.title}</h3>
          <p className="mt-2 text-sm text-muted text-pretty line-clamp-2">
            {item.description}
          </p>
          <p className="mt-2 text-sm text-forest/80 text-pretty">{reason}</p>
          {item.currentPrice != null && (
            <p className="mt-2 text-sm font-semibold text-forest">
              {formatBrl(item.currentPrice)}
            </p>
          )}
          <div className="mt-4 flex flex-col gap-2">
            {item.fulfillment === "affiliate" && item.affiliateSlug ? (
              <>
                <AffiliateTrackLink
                  slug={item.affiliateSlug}
                  label="Ver oferta"
                  sourcePage={routes.minhaSaude}
                  sourceType="minha-saude"
                />
                <Link
                  href={routes.recomendado(item.affiliateSlug)}
                  className="text-center text-xs text-muted hover:text-forest"
                >
                  Detalhes do produto
                </Link>
              </>
            ) : (
              <Button href={href} variant="outline" size="sm" className="w-full justify-center">
                {item.fulfillment === "subscription"
                  ? "Assinar agora"
                  : item.isPremium
                    ? "Assinar para acessar"
                    : "Acessar conteúdo"}
              </Button>
            )}
          </div>
        </Card>
      ))}
      <div className="sm:col-span-2 lg:col-span-3 flex flex-wrap gap-3 pt-2">
        <Button href={routes.marketplace} variant="secondary" size="md">
          Explorar marketplace
        </Button>
        <Button href={routes.recomendados} variant="outline" size="md">
          Ver afiliados
        </Button>
      </div>
      <div className="sm:col-span-2 lg:col-span-3">
        <AffiliateDisclosure />
      </div>
    </div>
  );
}
