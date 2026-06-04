import { ToolCard } from "@/components/pages/ToolCard";
import type { Tool } from "@/lib/data/types";

interface ToolsGridProps {
  tools: Tool[];
  className?: string;
}

export function ToolsGrid({ tools, className }: ToolsGridProps) {
  if (tools.length === 0) return null;

  return (
    <div
      className={
        className ??
        "mx-auto grid max-w-[var(--container-max)] gap-6 px-[var(--container-px)] sm:grid-cols-2 lg:grid-cols-3"
      }
    >
      {tools.map((tool) => (
        <ToolCard key={tool.slug} tool={tool} />
      ))}
    </div>
  );
}
