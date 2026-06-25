import { fetchIntelligentLibraryItems } from "@/lib/intelligent-library";
import { getProtocols } from "@/lib/data/repositories/protocols.repository";
import { getBlogArticles } from "@/lib/data/repositories/blog.repository";
import { fetchContentRankings } from "@/lib/club/services/intelligent-recommendations.service";
import { enrichLibraryCatalog, getLibraryNovidades } from "./library-enrichment";
import { routes } from "@/lib/routes";
import type { ContentRankingItem } from "@/lib/club/types";

export interface PremiumBenefitCard {
  id: string;
  title: string;
  description: string;
  href: string;
  badge?: string;
  isPremium: boolean;
}

export interface PremiumBenefitsHubData {
  novidades: PremiumBenefitCard[];
  destaques: PremiumBenefitCard[];
  maisAcessados: PremiumBenefitCard[];
  recomendacoesSemana: PremiumBenefitCard[];
}

function mapRanking(item: ContentRankingItem): PremiumBenefitCard {
  return {
    id: item.id,
    title: item.title,
    description: `${item.viewCount} visualizações no período`,
    href: item.href,
    badge: "Popular",
    isPremium: true,
  };
}

function mapLibrary(slug: string, title: string, description: string, isPremium: boolean): PremiumBenefitCard {
  return {
    id: `lib-${slug}`,
    title,
    description,
    href: routes.bibliotecaItem(slug),
    badge: isPremium ? "Premium" : "Gratuito",
    isPremium,
  };
}

export async function getPremiumBenefitsHubData(): Promise<PremiumBenefitsHubData> {
  const [libraryRaw, protocols, articles, rankings] = await Promise.all([
    fetchIntelligentLibraryItems(),
    getProtocols(),
    getBlogArticles(),
    fetchContentRankings("30d", 8).catch(() => [] as ContentRankingItem[]),
  ]);

  const library = enrichLibraryCatalog(libraryRaw);
  const novidadesItems = getLibraryNovidades(library, 6);

  const novidades: PremiumBenefitCard[] = novidadesItems.map((item) =>
    mapLibrary(item.slug, item.title, item.description, item.isPremium),
  );

  const destaquesProtocols = protocols.filter((p) => p.isPremium && p.featured).slice(0, 4);
  const destaquesArticles = articles.filter((a) => a.isPremium && a.featured).slice(0, 4);

  const destaques: PremiumBenefitCard[] = [
    ...destaquesProtocols.map((p) => ({
      id: `proto-${p.slug}`,
      title: p.title,
      description: p.description,
      href: routes.protocolo(p.slug),
      badge: "Protocolo",
      isPremium: true,
    })),
    ...destaquesArticles.map((a) => ({
      id: `art-${a.slug}`,
      title: a.title,
      description: a.excerpt,
      href: routes.artigo(a.slug),
      badge: "Artigo",
      isPremium: a.isPremium,
    })),
  ].slice(0, 6);

  const maisAcessados: PremiumBenefitCard[] =
    rankings.length > 0
      ? rankings.slice(0, 6).map(mapRanking)
      : library
          .filter((i) => i.isPremium)
          .slice(0, 6)
          .map((i) => mapLibrary(i.slug, i.title, i.description, true));

  const recomendacoesSemana: PremiumBenefitCard[] = [
    ...library.filter((i) => i.featured && i.isPremium).slice(0, 3).map((i) =>
      mapLibrary(i.slug, i.title, i.description, true),
    ),
    ...protocols.filter((p) => p.isPremium).slice(0, 3).map((p) => ({
      id: `rec-${p.slug}`,
      title: p.title,
      description: p.description,
      href: routes.protocolo(p.slug),
      badge: "Recomendado",
      isPremium: true,
    })),
  ].slice(0, 6);

  return { novidades, destaques, maisAcessados, recomendacoesSemana };
}
