import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

const variantStyles = {
  default: "bg-surface shadow-card border border-border",
  muted: "bg-sage-muted border border-transparent",
  featured:
    "bg-surface shadow-elevated border border-gold/30 ring-1 ring-gold/10",
  outline: "bg-transparent border border-border-strong shadow-none",
} as const;

const paddingStyles = {
  sm: "p-5",
  md: "p-7",
  lg: "p-9",
} as const;

type Variant = keyof typeof variantStyles;
type Padding = keyof typeof paddingStyles;

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  padding?: Padding;
  hover?: boolean;
}

export function Card({
  variant = "default",
  padding = "md",
  hover = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl transition-all duration-250",
        variantStyles[variant],
        paddingStyles[padding],
        hover &&
          "hover:shadow-elevated hover:-translate-y-0.5 cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4 space-y-2", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-heading text-xl text-forest", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-muted text-sm leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}
