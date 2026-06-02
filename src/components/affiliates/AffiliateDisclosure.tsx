import { AFFILIATE_DISCLOSURE } from "@/lib/affiliates/constants";
import { cn } from "@/lib/cn";

interface AffiliateDisclosureProps {
  className?: string;
}

export function AffiliateDisclosure({ className }: AffiliateDisclosureProps) {
  return (
    <p
      className={cn(
        "text-center text-xs leading-relaxed text-muted",
        className,
      )}
    >
      {AFFILIATE_DISCLOSURE}
    </p>
  );
}
