import { AFFILIATE_EXTERNAL_REL } from "@/lib/affiliates/constants";
import type { AffiliateSourceType } from "@/lib/affiliates/tracking";
import { buildAffiliateGoUrl } from "@/lib/affiliates/tracking";
import { cn } from "@/lib/cn";

interface AffiliateTrackLinkProps {
  slug: string;
  label: string;
  sourcePage: string;
  sourceType: AffiliateSourceType;
  className?: string;
  variant?: "button" | "text";
}

export function AffiliateTrackLink({
  slug,
  label,
  sourcePage,
  sourceType,
  className,
  variant = "button",
}: AffiliateTrackLinkProps) {
  const href = buildAffiliateGoUrl(slug, { sourcePage, sourceType });

  if (variant === "text") {
    return (
      <a
        href={href}
        target="_blank"
        rel={AFFILIATE_EXTERNAL_REL}
        className={cn(
          "inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-forest underline-offset-4 hover:text-sage hover:underline",
          className,
        )}
      >
        {label}
        <span aria-hidden>↗</span>
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel={AFFILIATE_EXTERNAL_REL}
      className={cn(
        "inline-flex h-9 w-full items-center justify-center rounded-full border border-border-strong bg-transparent px-4 text-sm font-heading font-semibold tracking-wide text-forest transition-all duration-250 hover:bg-sage-muted active:scale-[0.98]",
        className,
      )}
    >
      {label}
    </a>
  );
}
