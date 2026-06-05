import type { LibraryFilterId, LibraryFilterOption, LibraryItem } from "./library.types";

export const LIBRARY_FILTERS: LibraryFilterOption[] = [
  { id: "todos", label: "Todos" },
  { id: "gratuitos", label: "Gratuitos" },
  { id: "premium", label: "Premium" },
  { id: "ebooks", label: "E-books" },
  { id: "protocolos", label: "Protocolos" },
  { id: "videos", label: "Vídeos" },
];

export function filterLibraryItems(
  items: LibraryItem[],
  filterId: LibraryFilterId,
): LibraryItem[] {
  switch (filterId) {
    case "todos":
      return items;
    case "gratuitos":
      return items.filter((item) => !item.isPremium);
    case "premium":
      return items.filter((item) => item.isPremium);
    case "ebooks":
      return items.filter((item) => item.type === "ebook" || item.type === "pdf");
    case "protocolos":
      return items.filter((item) => item.type === "protocolo");
    case "videos":
      return items.filter((item) => item.type === "video");
    default:
      return items;
  }
}

export function getFilterLabel(filterId: LibraryFilterId): string {
  return LIBRARY_FILTERS.find((f) => f.id === filterId)?.label ?? "Todos";
}
