export type AffiliatePartnerId =
  | "amazon"
  | "hotmart"
  | "kiwify"
  | "eduzz"
  | "braip";

export interface AffiliatePartnerLinkInput {
  productUrl: string;
  affiliateTag?: string;
  trackingId?: string;
}

export interface AffiliatePartnerAdapter {
  id: AffiliatePartnerId;
  label: string;
  /** Detecta se a URL pertence a esta plataforma */
  matchesUrl(url: string): boolean;
  /** Normaliza URL de afiliado (stub — integração futura) */
  buildAffiliateUrl(input: AffiliatePartnerLinkInput): string;
}

export type AffiliatePartnerSyncResult =
  | { ok: true; partner: AffiliatePartnerId; externalId: string }
  | { ok: false; skipped: true; reason: string }
  | { ok: false; skipped: false; error: string };
