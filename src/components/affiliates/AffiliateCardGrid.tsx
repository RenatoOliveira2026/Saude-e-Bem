import { AffiliateCard } from "@/components/affiliates/AffiliateCard";
import type { AffiliateSourceType } from "@/lib/affiliates/tracking";
import type { PublicAffiliateSummary } from "@/lib/affiliates/types";
import { cn } from "@/lib/cn";

interface AffiliateCardGridProps {
  links: PublicAffiliateSummary[];
  compact?: boolean;
  className?: string;
  sourcePage?: string;
  sourceType?: AffiliateSourceType;
}

export function AffiliateCardGrid({
  links,
  compact = false,
  className,
  sourcePage,
  sourceType,
}: AffiliateCardGridProps) {
  return (
    <div
      className={cn(
        "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
        compact && "lg:grid-cols-3",
        className,
      )}
    >
      {links.map((link) => (
        <AffiliateCard
          key={link.id}
          link={link}
          compact={compact}
          sourcePage={sourcePage}
          sourceType={sourceType}
        />
      ))}
    </div>
  );
}
