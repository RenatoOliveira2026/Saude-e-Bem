import type { MarketplaceFilterId, MarketplaceFilterOption, MarketplaceItem } from "./marketplace.types";

export const MARKETPLACE_FILTERS: MarketplaceFilterOption[] = [
  { id: "todos", label: "Todos" },
  { id: "digitais", label: "Digitais" },
  { id: "afiliados", label: "Afiliados" },
  { id: "premium", label: "Premium" },
  { id: "ebooks", label: "E-books" },
];

export function filterMarketplaceItems(
  items: MarketplaceItem[],
  filterId: MarketplaceFilterId,
): MarketplaceItem[] {
  switch (filterId) {
    case "todos":
      return items;
    case "digitais":
      return items.filter((item) => item.fulfillment === "digital");
    case "afiliados":
      return items.filter((item) => item.fulfillment === "affiliate");
    case "premium":
      return items.filter((item) => item.isPremium);
    case "ebooks":
      return items.filter(
        (item) =>
          item.fulfillment === "digital" &&
          (item.productType === "ebook" || item.productType === "pdf"),
      );
    default:
      return items;
  }
}

export function getMarketplaceFilterLabel(filterId: MarketplaceFilterId): string {
  return MARKETPLACE_FILTERS.find((f) => f.id === filterId)?.label ?? "Todos";
}
