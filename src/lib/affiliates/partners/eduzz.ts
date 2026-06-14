import type { AffiliatePartnerAdapter } from "./types";

function hostIncludes(url: string, fragment: string): boolean {
  try {
    return new URL(url).hostname.toLowerCase().includes(fragment);
  } catch {
    return url.toLowerCase().includes(fragment);
  }
}

export const eduzzPartner: AffiliatePartnerAdapter = {
  id: "eduzz",
  label: "Eduzz",
  matchesUrl: (url) => hostIncludes(url, "eduzz"),
  buildAffiliateUrl: ({ productUrl }) => productUrl,
};
