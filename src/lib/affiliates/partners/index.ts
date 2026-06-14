import { amazonPartner } from "./amazon";
import { braipPartner } from "./braip";
import { eduzzPartner } from "./eduzz";
import { hotmartPartner } from "./hotmart";
import { kiwifyPartner } from "./kiwify";
import type {
  AffiliatePartnerAdapter,
  AffiliatePartnerId,
  AffiliatePartnerLinkInput,
  AffiliatePartnerSyncResult,
} from "./types";

export type {
  AffiliatePartnerAdapter,
  AffiliatePartnerId,
  AffiliatePartnerLinkInput,
  AffiliatePartnerSyncResult,
} from "./types";

const PARTNERS: AffiliatePartnerAdapter[] = [
  amazonPartner,
  hotmartPartner,
  kiwifyPartner,
  eduzzPartner,
  braipPartner,
];

export function getAffiliatePartners(): AffiliatePartnerAdapter[] {
  return PARTNERS;
}

export function detectAffiliatePartner(url: string): AffiliatePartnerAdapter | null {
  return PARTNERS.find((partner) => partner.matchesUrl(url)) ?? null;
}

export function buildPartnerAffiliateUrl(
  productUrl: string,
  options?: { affiliateTag?: string; trackingId?: string; partnerId?: AffiliatePartnerId },
): string {
  const partner =
    (options?.partnerId
      ? PARTNERS.find((item) => item.id === options.partnerId)
      : null) ?? detectAffiliatePartner(productUrl);

  if (!partner) return productUrl;

  return partner.buildAffiliateUrl({
    productUrl,
    affiliateTag: options?.affiliateTag,
    trackingId: options?.trackingId,
  });
}

/** Stub para sync futuro com APIs de parceiros */
export async function syncAffiliateProductWithPartner(_input: {
  partnerId: AffiliatePartnerId;
  externalProductId: string;
}): Promise<AffiliatePartnerSyncResult> {
  return {
    ok: false,
    skipped: true,
    reason: "Integração com API de parceiros não configurada nesta fase.",
  };
}
