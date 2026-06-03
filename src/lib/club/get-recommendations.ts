import { getBlogArticles } from "@/lib/data/repositories/blog.repository";
import { getLibraryResources } from "@/lib/data/repositories/library.repository";
import { getProtocols } from "@/lib/data/repositories/protocols.repository";
import {
  goalDescriptions,
  goalLabels,
  goalToLibraryCategory,
  goalToProtocolCategory,
} from "@/lib/journey/constants";
import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";
import type { ClubRecommendation } from "./types";

export async function getClubRecommendations(input: {
  userId: string;
  isPremium: boolean;
  limit?: number;
}): Promise<ClubRecommendation[]> {
  const limit = input.limit ?? 6;
  const supabase = await createClient();
  const { data: preferences } = await supabase
    .from("user_preferences")
    .select("goal")
    .eq("user_id", input.userId)
    .maybeSingle();

  const goalKey = preferences?.goal ?? null;
  const goalLabel = goalKey ? (goalLabels[goalKey] ?? null) : null;
  const reason = goalLabel
    ? `Com base no seu objetivo: ${goalLabel}`
    : "Sugestões para começar sua jornada";

  const [protocols, library, articles] = await Promise.all([
    getProtocols(),
    getLibraryResources(),
    getBlogArticles(),
  ]);

  const protocolCategory = goalKey
    ? goalToProtocolCategory[goalKey]
    : undefined;
  const libraryCategory = goalKey ? goalToLibraryCategory[goalKey] : undefined;

  const protocolPool = protocols.filter(
    (p) => input.isPremium || !p.isPremium,
  );
  const libraryPool = library;
  const articlePool = articles.filter(
    (a) => input.isPremium || !a.isPremium,
  );

  const matchedProtocols = protocolCategory
    ? protocolPool.filter((p) => p.category === protocolCategory)
    : protocolPool;
  const matchedLibrary = libraryCategory
    ? libraryPool.filter((r) => r.category === libraryCategory)
    : libraryPool;
  const matchedArticles = goalKey
    ? articlePool.slice(0, 2)
    : articlePool.slice(0, 1);

  const items: ClubRecommendation[] = [];

  for (const p of matchedProtocols.slice(0, 3)) {
    items.push({
      id: p.id,
      contentType: "protocol",
      title: p.title,
      description: p.description,
      href: routes.protocolo(p.slug),
      categoryLabel: p.categoryLabel,
      isPremium: p.isPremium,
      reason,
    });
  }

  for (const r of matchedLibrary.slice(0, 2)) {
    items.push({
      id: r.id,
      contentType: "ebook",
      title: r.title,
      description: r.description,
      href: routes.bibliotecaItem(r.slug),
      categoryLabel: r.categoryLabel,
      isPremium: r.isPremium,
      reason,
    });
  }

  for (const a of matchedArticles.slice(0, 1)) {
    items.push({
      id: a.id,
      contentType: "article",
      title: a.title,
      description: a.excerpt,
      href: routes.artigo(a.slug),
      categoryLabel: a.categoryLabel,
      isPremium: a.isPremium,
      reason,
    });
  }

  if (items.length >= limit) return items.slice(0, limit);

  const usedIds = new Set(items.map((i) => i.id));
  for (const p of protocolPool) {
    if (items.length >= limit) break;
    if (usedIds.has(p.id)) continue;
    usedIds.add(p.id);
    items.push({
      id: p.id,
      contentType: "protocol",
      title: p.title,
      description: p.description,
      href: routes.protocolo(p.slug),
      categoryLabel: p.categoryLabel,
      isPremium: p.isPremium,
      reason: goalKey
        ? (goalDescriptions[goalKey] ?? reason)
        : "Popular na plataforma",
    });
  }

  return items.slice(0, limit);
}
