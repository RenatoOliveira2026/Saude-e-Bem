/**
 * Google AdSense — tudo desligado até as variáveis serem preenchidas na Vercel:
 *   NEXT_PUBLIC_ADSENSE_CLIENT          ex.: ca-pub-1234567890123456
 *   NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE    id do bloco exibido no fim dos artigos
 *   NEXT_PUBLIC_ADSENSE_SLOT_LISTING    id do bloco exibido na listagem de artigos
 * Sem o client, nenhum script do Google é carregado e nenhum espaço vazio aparece.
 */
export type AdPlacementId = "article" | "listing";

const CLIENT_PATTERN = /^ca-pub-\d{10,20}$/;
const SLOT_PATTERN = /^\d{6,20}$/;

export function getAdsenseClientId(): string | null {
  const value = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  return value && CLIENT_PATTERN.test(value) ? value : null;
}

/** Id de publicador usado no ads.txt (pub-XXXX, sem o prefixo "ca-"). */
export function getAdsensePublisherId(): string | null {
  const client = getAdsenseClientId();
  return client ? client.replace(/^ca-/, "") : null;
}

export function getAdsenseSlotId(placement: AdPlacementId): string | null {
  const raw =
    placement === "article"
      ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE
      : process.env.NEXT_PUBLIC_ADSENSE_SLOT_LISTING;
  const value = raw?.trim();
  return value && SLOT_PATTERN.test(value) ? value : null;
}
