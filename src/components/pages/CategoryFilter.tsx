"use client";

import { cn } from "@/lib/cn";

interface CategoryFilterProps {
  categories: ReadonlyArray<{ id: string; label: string }>;
  active: string;
  onChange: (id: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function CategoryFilter({
  categories,
  active,
  onChange,
  className,
  ariaLabel = "Filtrar por categoria",
}: CategoryFilterProps) {
  return (
    <div
      className={cn("flex flex-wrap gap-2", className)}
      role="tablist"
      aria-label={ariaLabel}
    >
      {categories.map((cat) => {
        const isActive = active === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(cat.id)}
            className={cn(
              "rounded-full px-4 py-2 font-heading text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-forest text-off-white shadow-soft"
                : "bg-surface text-muted border border-border hover:border-sage hover:text-forest",
            )}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
