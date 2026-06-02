import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

const backgroundStyles = {
  default: "bg-off-white",
  white: "bg-surface",
  forest: "bg-forest text-off-white [&_h2]:text-off-white [&_h3]:text-off-white [&_p]:text-off-white/80",
  sage: "bg-sage-muted",
  gold: "bg-gold-muted",
} as const;

type Background = keyof typeof backgroundStyles;

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  background?: Background;
  spacing?: "default" | "compact" | "spacious";
  container?: boolean;
}

export function Section({
  background = "default",
  spacing = "default",
  container = true,
  className,
  children,
  ...props
}: SectionProps) {
  const spacingStyles = {
    compact: "py-12 md:py-16",
    default: "py-[var(--section-py)]",
    spacious: "py-24 md:py-32",
  };

  return (
    <section
      className={cn(
        backgroundStyles[background],
        spacingStyles[spacing],
        className,
      )}
      {...props}
    >
      {container ? (
        <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--container-px)]">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
}

export function SectionHeader({
  className,
  align = "center",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { align?: "left" | "center" }) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16 max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SectionLabel({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-block mb-3 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-sage",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function SectionTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "font-heading text-3xl md:text-4xl lg:text-[2.75rem] text-forest text-balance",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function SectionDescription({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "mt-4 text-muted text-lg leading-relaxed text-pretty",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
