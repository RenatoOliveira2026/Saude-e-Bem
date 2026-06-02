"use client";

import { cn } from "@/lib/cn";

interface ContentSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function ContentSearch({
  value,
  onChange,
  placeholder = "Buscar por palavra-chave…",
  className,
}: ContentSearchProps) {
  return (
    <div className={cn("max-w-xl", className)}>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-border bg-surface px-4 py-2.5 font-heading text-sm text-forest placeholder:text-muted-light focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20"
        aria-label="Buscar conteúdo"
      />
    </div>
  );
}
