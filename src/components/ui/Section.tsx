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
    compact: "py-8 md:py-10",
    default: "py-[var(--section-py)]",
    spacious: "py-12 md:py-16",
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
        "mb-8 md:mb-10 max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}


/**
 * O `cn` do projeto só junta classes; quando duas classes Tailwind mexem na
 * mesma propriedade, vence a que vier depois no CSS gerado, não a passada por
 * último. Aqui o padrão de cor e de tamanho só entra se o chamador não mandou o seu.
 */
const COLOR_CLASS = /(^|\s)text-(forest|sage|gold|off-white|white|graphite|muted|muted-light|surface)(\/\d+)?(\s|$)/;
const SIZE_CLASS = /(^|\s)text-(xs|sm|base|lg|xl|[2-9]xl|\[[^\]]+\])(\s|$)/;

function withDefaults(
  className: string | undefined,
  defaults: { base: string; color?: string; size?: string },
): string {
  const custom = className ?? "";
  return cn(
    defaults.base,
    defaults.size && !SIZE_CLASS.test(custom) ? defaults.size : undefined,
    defaults.color && !COLOR_CLASS.test(custom) ? defaults.color : undefined,
    custom,
  );
}

export function SectionLabel({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={withDefaults(className, {
        base: "inline-block mb-3 font-heading text-xs font-semibold uppercase tracking-[0.2em]",
        color: "text-sage",
      })}
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
      className={withDefaults(className, {
        base: "font-heading text-balance",
        size: "text-3xl md:text-4xl lg:text-[2.75rem]",
        color: "text-forest",
      })}
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
      className={withDefaults(className, {
        base: "mt-4 leading-relaxed text-pretty",
        size: "text-lg",
        color: "text-muted",
      })}
      {...props}
    >
      {children}
    </p>
  );
}
