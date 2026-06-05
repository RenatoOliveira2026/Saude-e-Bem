import { MarketplaceDetail } from "@/components/marketplace";
import {
  fetchMarketplaceItemBySlug,
  getMarketplaceSlugs,
} from "@/lib/marketplace";
import { routes } from "@/lib/routes";
import { buildContentMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = getMarketplaceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await fetchMarketplaceItemBySlug(slug);
  if (!item) return { title: "Produto não encontrado" };
  return buildContentMetadata({
    title: item.title,
    description: item.description,
    path: routes.marketplaceItem(slug),
    imageUrl: item.imageUrl ?? undefined,
  });
}

export default async function MarketplaceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await fetchMarketplaceItemBySlug(slug);
  if (!item) notFound();

  return <MarketplaceDetail item={item} />;
}
