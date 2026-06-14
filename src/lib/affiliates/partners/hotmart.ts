import type { AffiliatePartnerAdapter } from "./types";

function hostIncludes(url: string, fragment: string): boolean {
  try {
    return new URL(url).hostname.toLowerCase().includes(fragment);
  } catch {
    return url.toLowerCase().includes(fragment);
  }
}

export const hotmartPartner: AffiliatePartnerAdapter = {
  id: "hotmart",
  label: "Hotmart",
  matchesUrl: (url) => hostIncludes(url, "hotmart"),
  buildAffiliateUrl: ({ productUrl }) => productUrl,
};
