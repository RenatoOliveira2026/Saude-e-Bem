import { JsonLdScript } from "@/components/seo/JsonLd";
import { MarketplaceDetail } from "@/components/marketplace";
import {
  fetchMarketplaceItemBySlug,
  fetchMarketplaceSlugs,
} from "@/lib/marketplace";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo/json-ld";
import { buildContentMetadata } from "@/lib/seo/metadata";
import { assertValidPublicSlug } from "@/lib/seo/slug";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await fetchMarketplaceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  assertValidPublicSlug(slug);
  const item = await fetchMarketplaceItemBySlug(slug);
  if (!item) notFound();
  return buildContentMetadata({
    title: item.seoTitle ?? item.title,
    description: item.seoDescription ?? item.description,
    path: routes.marketplaceItem(slug),
    imageUrl: item.ogImageUrl ?? item.imageUrl ?? undefined,
    keywords: item.seoKeywords,
  });
}

export default async function MarketplaceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  assertValidPublicSlug(slug);
  const item = await fetchMarketplaceItemBySlug(slug);
  if (!item) notFound();

  const path = routes.marketplaceItem(slug);

  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd([
            { name: "Início", path: routes.home },
            { name: "Marketplace", path: routes.marketplace },
            { name: item.title },
          ]),
          productJsonLd({
            title: item.title,
            description: item.seoDescription ?? item.description,
            path,
            imageUrl: item.ogImageUrl ?? item.imageUrl ?? undefined,
            price: item.currentPrice,
          }),
        ]}
      />
      <MarketplaceDetail item={item} />
    </>
  );
}
