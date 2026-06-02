import { cn } from "@/lib/cn";
import type { TextareaHTMLAttributes } from "react";

const ltrTextStyle = { direction: "ltr", textAlign: "left" } as const;

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Textarea({
  label,
  error,
  hint,
  className,
  id,
  dir,
  style,
  ...props
}: TextareaProps) {
  const textareaId = id ?? props.name;

  return (
    <div className="w-full">
      <label
        htmlFor={textareaId}
        className="mb-2 block font-heading text-sm font-medium text-forest"
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        dir={dir ?? "ltr"}
        style={{ ...ltrTextStyle, ...style }}
        className={cn(
          "min-h-[120px] w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-graphite transition-colors placeholder:text-muted-light focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20",
          error && "border-red-400 focus:border-red-400 focus:ring-red-400/20",
          className,
        )}
        {...props}
      />
      {hint && !error && (
        <p className="mt-1.5 text-xs text-muted-light">{hint}</p>
      )}
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
