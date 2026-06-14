import type { AffiliatePartnerAdapter } from "./types";

function hostIncludes(url: string, fragment: string): boolean {
  try {
    return new URL(url).hostname.toLowerCase().includes(fragment);
  } catch {
    return url.toLowerCase().includes(fragment);
  }
}

export const braipPartner: AffiliatePartnerAdapter = {
  id: "braip",
  label: "Braip",
  matchesUrl: (url) => hostIncludes(url, "braip"),
  buildAffiliateUrl: ({ productUrl }) => productUrl,
};
