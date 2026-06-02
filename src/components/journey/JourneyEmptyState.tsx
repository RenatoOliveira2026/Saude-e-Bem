import type { IconName } from "@/components/icons";
import { IconBox } from "@/components/icons";

interface JourneyEmptyStateProps {
  icon: IconName;
  title: string;
  description: string;
}

export function JourneyEmptyState({
  icon,
  title,
  description,
}: JourneyEmptyStateProps) {
  return (
    <div className="mt-4 rounded-xl border border-dashed border-border-strong bg-sage-muted/30 px-5 py-4">
      <div className="flex items-start gap-3">
        <IconBox name={icon} size={20} className="shrink-0 bg-surface" />
        <div>
          <p className="font-heading text-sm font-semibold text-forest">
            {title}
          </p>
          <p className="mt-1 text-xs text-muted leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
