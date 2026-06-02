import { cn } from "@/lib/cn";
import type { InputHTMLAttributes } from "react";

const ltrInputStyle = { direction: "ltr", textAlign: "left" } as const;

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Input({
  label,
  error,
  hint,
  className,
  id,
  dir,
  style,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="mb-2 block font-heading text-sm font-medium text-forest"
      >
        {label}
      </label>
      <input
        id={inputId}
        dir={dir ?? "ltr"}
        style={{ ...ltrInputStyle, ...style }}
        className={cn(
          "h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm text-graphite transition-colors placeholder:text-muted-light focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20",
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

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

export function Select({
  label,
  options,
  error,
  className,
  id,
  dir,
  style,
  ...props
}: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <div className="w-full">
      <label
        htmlFor={selectId}
        className="mb-2 block font-heading text-sm font-medium text-forest"
      >
        {label}
      </label>
      <select
        id={selectId}
        dir={dir ?? "ltr"}
        style={{ ...ltrInputStyle, ...style }}
        className={cn(
          "h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm text-graphite transition-colors focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20",
          error && "border-red-400 focus:border-red-400 focus:ring-red-400/20",
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
