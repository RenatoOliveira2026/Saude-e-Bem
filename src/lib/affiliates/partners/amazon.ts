import type { AffiliatePartnerAdapter } from "./types";

function hostIncludes(url: string, fragment: string): boolean {
  try {
    return new URL(url).hostname.toLowerCase().includes(fragment);
  } catch {
    return url.toLowerCase().includes(fragment);
  }
}

export const amazonPartner: AffiliatePartnerAdapter = {
  id: "amazon",
  label: "Amazon Associados",
  matchesUrl: (url) => hostIncludes(url, "amazon."),
  buildAffiliateUrl: ({ productUrl, affiliateTag }) => {
    if (!affiliateTag?.trim()) return productUrl;
    const parsed = new URL(productUrl);
    parsed.searchParams.set("tag", affiliateTag.trim());
    return parsed.toString();
  },
};
