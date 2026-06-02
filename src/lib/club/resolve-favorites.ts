import type { Favorite } from "@/lib/favorites/types";
import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";
import type { ResolvedFavorite } from "./types";

export async function resolveFavorites(
  favorites: Favorite[],
): Promise<ResolvedFavorite[]> {
  if (favorites.length === 0) return [];

  const supabase = await createClient();
  const byType = {
    article: favorites.filter((f) => f.contentType === "article"),
    protocol: favorites.filter((f) => f.contentType === "protocol"),
    ebook: favorites.filter((f) => f.contentType === "ebook"),
  };

  const [articles, protocols, ebooks] = await Promise.all([
    byType.article.length > 0
      ? supabase
          .from("articles")
          .select("id, slug, title, category_label, is_premium")
          .in(
            "id",
            byType.article.map((f) => f.contentId),
          )
      : Promise.resolve({ data: [], error: null }),
    byType.protocol.length > 0
      ? supabase
          .from("protocols")
          .select("id, slug, title, category_label, is_premium")
          .in(
            "id",
            byType.protocol.map((f) => f.contentId),
          )
      : Promise.resolve({ data: [], error: null }),
    byType.ebook.length > 0
      ? supabase
          .from("ebooks")
          .select("id, slug, title, category_label, is_premium")
          .in(
            "id",
            byType.ebook.map((f) => f.contentId),
          )
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (articles.error) throw articles.error;
  if (protocols.error) throw protocols.error;
  if (ebooks.error) throw ebooks.error;

  const articleMap = new Map(
    (articles.data ?? []).map((row) => [row.id, row]),
  );
  const protocolMap = new Map(
    (protocols.data ?? []).map((row) => [row.id, row]),
  );
  const ebookMap = new Map((ebooks.data ?? []).map((row) => [row.id, row]));

  const resolved: ResolvedFavorite[] = [];

  for (const favorite of favorites) {
    if (favorite.contentType === "article") {
      const row = articleMap.get(favorite.contentId);
      if (!row) continue;
      resolved.push({
        id: favorite.id,
        contentType: favorite.contentType,
        contentId: favorite.contentId,
        title: row.title,
        slug: row.slug,
        href: routes.artigo(row.slug),
        categoryLabel: row.category_label,
        isPremium: row.is_premium,
        createdAt: favorite.createdAt,
      });
      continue;
    }

    if (favorite.contentType === "protocol") {
      const row = protocolMap.get(favorite.contentId);
      if (!row) continue;
      resolved.push({
        id: favorite.id,
        contentType: favorite.contentType,
        contentId: favorite.contentId,
        title: row.title,
        slug: row.slug,
        href: routes.protocolo(row.slug),
        categoryLabel: row.category_label,
        isPremium: row.is_premium,
        createdAt: favorite.createdAt,
      });
      continue;
    }

    const row = ebookMap.get(favorite.contentId);
    if (!row) continue;
    resolved.push({
      id: favorite.id,
      contentType: favorite.contentType,
      contentId: favorite.contentId,
      title: row.title,
      slug: row.slug,
      href: routes.bibliotecaItem(row.slug),
      categoryLabel: row.category_label,
      isPremium: row.is_premium,
      createdAt: favorite.createdAt,
    });
  }

  return resolved;
}
