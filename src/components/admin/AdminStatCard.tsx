import { Icon } from "@/components/icons";
import type { IconName } from "@/components/icons";

interface AdminStatCardProps {
  label: string;
  value: number;
  icon: IconName;
  accent?: "sage" | "gold" | "forest";
}

const accentStyles = {
  sage: "bg-sage/10 text-sage",
  gold: "bg-gold/15 text-forest",
  forest: "bg-forest/10 text-forest",
};

export function AdminStatCard({
  label,
  value,
  icon,
  accent = "sage",
}: AdminStatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-2 font-heading text-3xl font-semibold text-forest">
            {value.toLocaleString("pt-BR")}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${accentStyles[accent]}`}
        >
          <Icon name={icon} className="h-5 w-5" aria-hidden />
        </div>
      </div>
    </div>
  );
}
