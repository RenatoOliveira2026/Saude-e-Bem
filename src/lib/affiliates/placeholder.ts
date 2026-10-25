/**
 * Links de exemplo usados nos seeds (example.com). Não devem aparecer no portal:
 * o visitante não chegaria a loja nenhuma e o clique não geraria comissão.
 */
const PLACEHOLDER_HOSTS = ["example.com", "example.org", "example.net"];

export function isPlaceholderAffiliateUrl(url: string | null | undefined): boolean {
  if (!url || !url.trim()) return true;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return PLACEHOLDER_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return true;
  }
}

/** Um afiliado só é publicável quando tem ao menos um link real de destino. */
export function hasRealAffiliateDestination(row: {
  affiliate_url?: string | null;
  url?: string | null;
}): boolean {
  return (
    !isPlaceholderAffiliateUrl(row.affiliate_url) || !isPlaceholderAffiliateUrl(row.url)
  );
}
