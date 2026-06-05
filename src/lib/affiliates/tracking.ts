export type AffiliateSourceType =
  | "direct"
  | "home"
  | "listing"
  | "detail"
  | "blog"
  | "protocol"
  | "related"
  | "marketplace"
  | "minha-saude";

export function buildAffiliateGoUrl(
  slug: string,
  options: { sourcePage: string; sourceType: AffiliateSourceType },
): string {
  const params = new URLSearchParams({
    source_page: options.sourcePage,
    source_type: options.sourceType,
  });
  return `/api/affiliates/${encodeURIComponent(slug)}/go?${params.toString()}`;
}

export function youtubeEmbedId(url: string | null | undefined): string | null {
  if (!url?.trim()) return null;
  const trimmed = url.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/)([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

export function formatBrl(value: number | null | undefined): string | null {
  if (value == null || Number.isNaN(value)) return null;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
