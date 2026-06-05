import { routes } from "@/lib/routes";
import { getSiteUrl } from "@/lib/seo/site-url";
import { getBlogSlugs } from "@/lib/data/repositories/blog.repository";
import { fetchLibraryItemSlugsFromDb } from "@/lib/supabase/services/library-items.public";
import { fetchMarketplaceProductSlugsFromDb } from "@/lib/supabase/services/marketplace-products.public";
import { getContentEngineLibraryCatalog } from "@/lib/content-engine/mappers";
import { getContentEngineMarketplaceCatalog } from "@/lib/content-engine/mappers";
import type { MetadataRoute } from "next";

function url(path: string, lastModified = new Date()): MetadataRoute.Sitemap[number] {
  return {
    url: `${getSiteUrl()}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority: path === routes.home ? 1 : 0.7,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    routes.home,
    routes.blog,
    routes.biblioteca,
    routes.marketplace,
    routes.protocolos,
    routes.ferramentas,
    routes.recomendados,
    routes.clube,
    routes.assinar,
  ];

  const [articleSlugs, librarySlugs, marketplaceSlugs] = await Promise.all([
    getBlogSlugs().catch(() => [] as string[]),
    fetchLibraryItemSlugsFromDb().catch(() =>
      getContentEngineLibraryCatalog().map((i) => i.slug),
    ),
    fetchMarketplaceProductSlugsFromDb().catch(() =>
      getContentEngineMarketplaceCatalog().map((i) => i.slug),
    ),
  ]);

  return [
    ...staticRoutes.map((path) => url(path)),
    ...articleSlugs.map((slug) => url(routes.artigo(slug))),
    ...librarySlugs.map((slug) => url(routes.bibliotecaItem(slug))),
    ...marketplaceSlugs.map((slug) => url(routes.marketplaceItem(slug))),
  ];
}
