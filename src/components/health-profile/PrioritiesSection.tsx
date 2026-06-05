import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/icons";
import type { PriorityAction, PriorityLevel } from "@/lib/recommendations/recommendation-types";
import Link from "next/link";

const levelVariant: Record<PriorityLevel, "forest" | "gold" | "outline"> = {
  alta: "forest",
  media: "gold",
  baixa: "outline",
};

const levelLabel: Record<PriorityLevel, string> = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
};

export function PrioritiesSection({
  priorities,
}: {
  priorities: PriorityAction[];
}) {
  if (priorities.length === 0) {
    return (
      <p className="text-sm text-muted">
        Nenhum passo prioritário no momento — continue usando as ferramentas.
      </p>
    );
  }

  return (
    <ol className="space-y-4">
      {priorities.map((item, index) => (
        <li
          key={item.id}
          className="flex gap-4 rounded-2xl border border-border bg-surface p-5 sm:p-6"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-muted font-heading text-sm font-semibold text-forest"
            aria-hidden
          >
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-heading text-base font-semibold text-forest">
                {item.title}
              </h3>
              <Badge variant={levelVariant[item.level]} className="text-xs">
                {levelLabel[item.level]}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted text-pretty">{item.description}</p>
            <Link
              href={item.href}
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-forest hover:text-sage"
            >
              Ver ação
              <Icon name="arrow-right" size={16} />
            </Link>
          </div>
        </li>
      ))}
    </ol>
  );
}
