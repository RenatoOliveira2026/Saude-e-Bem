import { AffiliateDetailView } from "@/components/affiliates/AffiliateDetailView";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLdScript } from "@/components/seo/JsonLd";
import {
  fetchActiveAffiliateBySlug,
  fetchActiveAffiliateSlugs,
} from "@/lib/supabase/services/affiliates.public";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo/json-ld";
import { buildContentMetadata } from "@/lib/seo/metadata";
import { assertValidPublicSlug } from "@/lib/seo/slug";
import { routes } from "@/lib/routes";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await fetchActiveAffiliateSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  assertValidPublicSlug(slug);
  const product = await fetchActiveAffiliateBySlug(slug);
  if (!product) notFound();

  return buildContentMetadata({
    title: product.seoTitle ?? product.title,
    description:
      product.seoDescription ??
      (product.description.slice(0, 160) || `Recurso recomendado: ${product.title}`),
    path: routes.recomendado(slug),
    imageUrl: product.imageUrl ?? undefined,
    keywords: product.seoKeywords ?? undefined,
  });
}

export default async function RecomendadoDetailPage({ params }: PageProps) {
  const { slug } = await params;
  assertValidPublicSlug(slug);
  const product = await fetchActiveAffiliateBySlug(slug);
  if (!product) notFound();

  const path = routes.recomendado(slug);

  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd([
            { name: "Início", path: routes.home },
            { name: "Recursos recomendados", path: routes.recomendados },
            { name: product.title },
          ]),
          productJsonLd({
            title: product.title,
            description: product.seoDescription ?? product.description,
            path,
            imageUrl: product.imageUrl ?? undefined,
            price: product.currentPrice,
          }),
        ]}
      />
      <Breadcrumbs
        items={[
          { label: "Início", href: routes.home },
          { label: "Recursos recomendados", href: routes.recomendados },
          { label: product.title },
        ]}
      />
      <AffiliateDetailView product={product} />
    </>
  );
}
