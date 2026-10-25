import { AdSlot } from "@/components/ads/AdSlot";
import { getAdsenseClientId, getAdsenseSlotId, type AdPlacementId } from "@/lib/ads/config";
import { canAccessPremiumContent } from "@/lib/club/access";

interface AdPlacementProps {
  placement: AdPlacementId;
  className?: string;
}

/**
 * Espaço de anúncio. Não aparece quando o AdSense não está configurado
 * nem para membros do Clube (navegação sem anúncios é um benefício do plano).
 */
export async function AdPlacement({ placement, className }: AdPlacementProps) {
  const client = getAdsenseClientId();
  const slot = getAdsenseSlotId(placement);
  if (!client || !slot) return null;

  if (await canAccessPremiumContent()) return null;

  return <AdSlot client={client} slot={slot} className={className} />;
}
