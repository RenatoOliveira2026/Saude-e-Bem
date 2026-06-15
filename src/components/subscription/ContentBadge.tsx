import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

export type ContentBadgeVariant = "free" | "premium" | "coming_soon";

interface ContentBadgeProps {
  variant: ContentBadgeVariant;
  className?: string;
}

const LABELS: Record<ContentBadgeVariant, string> = {
  free: "Gratuito",
  premium: "Premium",
  coming_soon: "Em breve",
};

const VARIANTS: Record<ContentBadgeVariant, "sage" | "gold" | "default"> = {
  free: "sage",
  premium: "gold",
  coming_soon: "default",
};

/** Badge de acesso ao conteúdo — Gratuito, Premium ou Em breve (Fase 6.0). */
export function ContentBadge({ variant, className }: ContentBadgeProps) {
  return (
    <Badge
      variant={VARIANTS[variant]}
      className={cn("font-heading tracking-wide", className)}
    >
      {LABELS[variant]}
    </Badge>
  );
}

export function contentBadgeFromFlags(input: {
  isPremium?: boolean;
  comingSoon?: boolean;
}): ContentBadgeVariant {
  if (input.comingSoon) return "coming_soon";
  if (input.isPremium) return "premium";
  return "free";
}
