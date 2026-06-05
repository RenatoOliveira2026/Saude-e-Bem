import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

export type PlanBadgeTier = "free" | "premium";

interface PlanBadgeProps {
  tier: PlanBadgeTier;
  className?: string;
}

/** Badge comercial FREE / PREMIUM (Fase 4.7). */
export function PlanBadge({ tier, className }: PlanBadgeProps) {
  return (
    <Badge
      variant={tier === "premium" ? "gold" : "sage"}
      className={cn("font-heading tracking-wide", className)}
    >
      {tier === "premium" ? "PREMIUM" : "FREE"}
    </Badge>
  );
}
