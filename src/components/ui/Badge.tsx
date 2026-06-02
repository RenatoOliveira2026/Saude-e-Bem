import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

const variantStyles = {
  default: "bg-sage-muted text-forest",
  forest: "bg-forest text-off-white",
  gold: "bg-gold-muted text-forest",
  sage: "bg-sage text-off-white",
  outline: "bg-transparent border border-border-strong text-forest",
} as const;

type Variant = keyof typeof variantStyles;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 font-heading text-xs font-semibold uppercase tracking-wider",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
