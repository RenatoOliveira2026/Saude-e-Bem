import type { FavoriteContentType } from "@/lib/favorites/types";
import type { IntelligentContentType } from "@/lib/content/intelligence";
import { fetchUserAccessHistory } from "@/lib/club/services/access-history.service";
import { fetchUserDownloads } from "@/lib/club/services/downloads.service";
import { fetchUserSavedProtocols } from "@/lib/club/services/saved-protocols.service";
import { resolveSavedProtocols } from "@/lib/club/resolve-saved-protocols";
import type { UserActivitySnapshot } from "./trail-progress";

function mapContentType(type: FavoriteContentType): IntelligentContentType | null {
  if (type === "article") return "article";
  if (type === "protocol") return "protocol";
  if (type === "ebook") return "library";
  return null;
}

/** Monta snapshot de atividade a partir de tabelas existentes (sem migrations). */
export async function fetchUserActivitySnapshot(
  userId: string,
): Promise<UserActivitySnapshot> {
  const accessed: UserActivitySnapshot["accessed"] = {
    article: new Set(),
    protocol: new Set(),
    library: new Set(),
    checklist: new Set(),
  };

  const protocolSlugsInProgress = new Set<string>();
  const protocolSlugsCompleted = new Set<string>();
  const downloadedLibrarySlugs = new Set<string>();

  try {
    const [history, downloads, savedRaw] = await Promise.all([
      fetchUserAccessHistory(userId, 80),
      fetchUserDownloads(userId),
      fetchUserSavedProtocols(userId),
    ]);

    for (const entry of history) {
      const mapped = mapContentType(entry.contentType);
      if (mapped && entry.contentSlug) {
        accessed[mapped]?.add(entry.contentSlug);
      }
      if (entry.sourcePath?.includes("checklist-habitos")) {
        accessed.checklist?.add("checklist-habitos");
      }
      if (entry.sourcePath?.includes("guia-30-dias")) {
        accessed.checklist?.add("guia-30-dias");
      }
    }

    for (const dl of downloads) {
      if (dl.contentSlug) {
        downloadedLibrarySlugs.add(dl.contentSlug);
        accessed.library?.add(dl.contentSlug);
      }
    }

    const saved = await resolveSavedProtocols(savedRaw);
    for (const item of saved) {
      if (item.status === "completed") {
        protocolSlugsCompleted.add(item.slug);
      } else {
        protocolSlugsInProgress.add(item.slug);
      }
      accessed.protocol?.add(item.slug);
    }
  } catch {
    /* Supabase indisponível — progresso zerado, UI ainda funciona */
  }

  return {
    accessed,
    protocolSlugsInProgress,
    protocolSlugsCompleted,
    downloadedLibrarySlugs,
  };
}
