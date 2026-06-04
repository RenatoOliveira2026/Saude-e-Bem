import { getProtocols } from "@/lib/data/repositories/protocols.repository";
import type { Protocol } from "@/lib/data/types";
import { normalizeProtocolCategory } from "../constants";
import type { ProtocolLibraryItem } from "../types";

export function enrichProtocol(protocol: Protocol): ProtocolLibraryItem {
  const normalized = normalizeProtocolCategory(protocol.category);
  return {
    ...protocol,
    normalizedCategory: normalized,
    categoryLabel:
      protocol.categoryLabel ||
      protocol.category,
  };
}

export function enrichProtocols(protocols: Protocol[]): ProtocolLibraryItem[] {
  return protocols.map(enrichProtocol);
}

export async function getProtocolLibraryItems(): Promise<ProtocolLibraryItem[]> {
  const protocols = await getProtocols();
  return enrichProtocols(protocols);
}

export function filterProtocols(
  items: ProtocolLibraryItem[],
  options: {
    category?: string;
    query?: string;
    tier?: "all" | "free" | "premium";
  },
): ProtocolLibraryItem[] {
  const q = options.query?.trim().toLowerCase() ?? "";
  return items.filter((item) => {
    if (options.category && options.category !== "todos") {
      const cat = item.normalizedCategory;
      if (cat !== options.category && item.category !== options.category) {
        return false;
      }
    }
    if (options.tier === "free" && item.isPremium) return false;
    if (options.tier === "premium" && !item.isPremium) return false;
    if (!q) return true;
    const haystack = [
      item.title,
      item.description,
      item.objective,
      item.categoryLabel,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function sortProtocolsNewest(items: ProtocolLibraryItem[]): ProtocolLibraryItem[] {
  return [...items].sort((a, b) => {
    const da = a.updatedAt ?? a.createdAt ?? "";
    const db = b.updatedAt ?? b.createdAt ?? "";
    return db.localeCompare(da);
  });
}
