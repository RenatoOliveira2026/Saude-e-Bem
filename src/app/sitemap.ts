import { routes } from "@/lib/routes";
import { getSiteUrl } from "@/lib/seo/site-url";
import { filterValidPublicSlugs } from "@/lib/seo/slug";
import { getBlogSlugs } from "@/lib/data/repositories/blog.repository";
import { getProtocolSlugs } from "@/lib/data/repositories/protocols.repository";
import { getToolSlugs } from "@/lib/data/repositories/tools.repository";
import { fetchLibraryItemSlugsFromDb } from "@/lib/supabase/services/library-items.public";
import { fetchMarketplaceProductSlugsFromDb } from "@/lib/supabase/services/marketplace-products.public";
import { fetchActiveAffiliateSlugs } from "@/lib/supabase/services/affiliates.public";
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
    routes.privacidade,
    routes.termos,
    routes.cookies,
  ];

  const [
    articleSlugs,
    librarySlugs,
    marketplaceSlugs,
    protocolSlugs,
    toolSlugs,
    affiliateSlugs,
  ] = await Promise.all([
    getBlogSlugs().catch(() => [] as string[]),
    fetchLibraryItemSlugsFromDb().catch(() =>
      getContentEngineLibraryCatalog().map((i) => i.slug),
    ),
    fetchMarketplaceProductSlugsFromDb().catch(() =>
      getContentEngineMarketplaceCatalog().map((i) => i.slug),
    ),
    getProtocolSlugs().catch(() => [] as string[]),
    getToolSlugs().catch(() => [] as string[]),
    fetchActiveAffiliateSlugs().catch(() => [] as string[]),
  ]);

  const validArticles = filterValidPublicSlugs(articleSlugs);
  const validLibrary = filterValidPublicSlugs(librarySlugs);
  const validMarketplace = filterValidPublicSlugs(marketplaceSlugs);
  const validProtocols = filterValidPublicSlugs(protocolSlugs);
  const validTools = filterValidPublicSlugs(toolSlugs);
  const validAffiliates = filterValidPublicSlugs(affiliateSlugs);

  return [
    ...staticRoutes.map((path) => url(path)),
    ...validArticles.map((slug) => url(routes.artigo(slug))),
    ...validLibrary.map((slug) => url(routes.bibliotecaItem(slug))),
    ...validMarketplace.map((slug) => url(routes.marketplaceItem(slug))),
    ...validProtocols.map((slug) => url(routes.protocolo(slug))),
    ...validTools.map((slug) => url(routes.ferramenta(slug))),
    ...validAffiliates.map((slug) => url(routes.recomendado(slug))),
  ];
}
