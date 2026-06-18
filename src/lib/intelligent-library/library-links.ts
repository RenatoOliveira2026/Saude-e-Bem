import type { LibraryItem } from "./library.types";
import { routes } from "@/lib/routes";

export function getLibraryProtocolSlug(item: LibraryItem): string {
  return item.assets?.protocolSlug ?? item.slug;
}

export function getLibraryItemHref(item: LibraryItem): string {
  if (item.type === "protocolo") {
    return routes.protocolo(getLibraryProtocolSlug(item));
  }
  return routes.bibliotecaItem(item.slug);
}
