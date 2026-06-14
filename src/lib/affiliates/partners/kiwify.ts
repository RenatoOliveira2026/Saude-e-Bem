import type { AffiliatePartnerAdapter } from "./types";

function hostIncludes(url: string, fragment: string): boolean {
  try {
    return new URL(url).hostname.toLowerCase().includes(fragment);
  } catch {
    return url.toLowerCase().includes(fragment);
  }
}

export const kiwifyPartner: AffiliatePartnerAdapter = {
  id: "kiwify",
  label: "Kiwify",
  matchesUrl: (url) => hostIncludes(url, "kiwify"),
  buildAffiliateUrl: ({ productUrl }) => productUrl,
};
