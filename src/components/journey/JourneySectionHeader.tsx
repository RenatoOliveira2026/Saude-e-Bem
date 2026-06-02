import { cn } from "@/lib/cn";
import Link from "next/link";

interface JourneySectionHeaderProps {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  compact?: boolean;
}

export function JourneySectionHeader({
  title,
  description,
  href,
  linkLabel = "Ver mais",
  compact = false,
}: JourneySectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        compact && "mb-0",
      )}
    >
      <div>
        <h2
          className={cn(
            "font-heading text-forest",
            compact ? "text-xl" : "text-2xl",
          )}
        >
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-xl text-sm text-muted leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="shrink-0 font-heading text-sm font-semibold text-forest hover:text-sage"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
