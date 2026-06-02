import { cn } from "@/lib/cn";
import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

const variantStyles = {
  primary:
    "bg-forest text-off-white shadow-soft hover:bg-forest-light active:scale-[0.98]",
  secondary:
    "bg-sage text-off-white shadow-soft hover:bg-sage-light active:scale-[0.98]",
  gold: "bg-gold text-forest shadow-soft hover:bg-gold-light active:scale-[0.98]",
  outline:
    "border border-border-strong bg-transparent text-forest hover:bg-sage-muted active:scale-[0.98]",
  ghost:
    "bg-transparent text-forest hover:bg-sage-muted active:scale-[0.98]",
  link: "bg-transparent text-forest underline-offset-4 hover:text-sage hover:underline p-0 h-auto",
} as const;

const sizeStyles = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-6 text-sm gap-2",
  lg: "h-12 px-8 text-base gap-2.5",
} as const;

type Variant = keyof typeof variantStyles;
type Size = keyof typeof sizeStyles;

type BaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full font-heading font-semibold tracking-wide transition-all duration-250 cursor-pointer disabled:opacity-50 disabled:pointer-events-none",
    variant !== "link" && sizeStyles[size],
    variantStyles[variant],
    className,
  );

  if ("href" in props && props.href) {
    const { href, ...rest } = props as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button type="button" className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
