import { getBlogArticles } from "@/lib/data/repositories/blog.repository";
import { getLibraryResources } from "@/lib/data/repositories/library.repository";
import { getProtocols } from "@/lib/data/repositories/protocols.repository";
import { fetchFeaturedAffiliateLinks } from "@/lib/supabase/services/affiliates.public";
import type { BlogArticle, LibraryResource, Protocol } from "@/lib/data/types";
import type { PublicAffiliateLink } from "@/lib/supabase/services/affiliates.public";

const FEATURED_LIMIT = 3;
const PROTOCOLS_HOME_LIMIT = 4;
const LIBRARY_HOME_LIMIT = 4;

function pickFeaturedOnly<T extends { featured?: boolean }>(
  items: T[],
  limit: number,
): T[] {
  return items.filter((item) => item.featured).slice(0, limit);
}

function pickForHome<T extends { featured?: boolean }>(
  items: T[],
  limit: number,
): T[] {
  const featured = items.filter((item) => item.featured);
  const rest = items.filter((item) => !item.featured);
  return [...featured, ...rest].slice(0, limit);
}

export interface HomePageContent {
  /** Apenas itens com featured=true */
  highlightArticles: BlogArticle[];
  highlightProtocols: Protocol[];
  highlightEbooks: LibraryResource[];
  /** Protocolos publicados para seção dedicada */
  protocols: Protocol[];
  /** E-books gratuitos publicados */
  freeLibrary: LibraryResource[];
  affiliates: PublicAffiliateLink[];
}

export async function getHomePageContent(): Promise<HomePageContent> {
  const [articles, protocols, ebooks, affiliates] = await Promise.all([
    getBlogArticles(),
    getProtocols(),
    getLibraryResources(),
    fetchFeaturedAffiliateLinks(4),
  ]);

  const freePublished = ebooks.filter((e) => !e.isPremium);
  const publicProtocols = protocols.filter((p) => !p.isPremium);

  return {
    highlightArticles: pickFeaturedOnly(articles, FEATURED_LIMIT),
    highlightProtocols: pickFeaturedOnly(publicProtocols, FEATURED_LIMIT),
    highlightEbooks: pickFeaturedOnly(
      freePublished,
      FEATURED_LIMIT,
    ),
    protocols: pickForHome(publicProtocols, PROTOCOLS_HOME_LIMIT),
    freeLibrary: pickForHome(freePublished, LIBRARY_HOME_LIMIT),
    affiliates,
  };
}

/** @deprecated Use highlight* fields — mantido para compatibilidade */
export async function getLegacyHomeSlices() {
  const data = await getHomePageContent();
  return {
    featuredArticles: data.highlightArticles.length
      ? data.highlightArticles
      : data.protocols.slice(0, 3),
    featuredProtocols: data.protocols,
    freeLibrary: data.freeLibrary,
  };
}
