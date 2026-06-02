import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

const sizeStyles = {
  sm: "max-w-3xl",
  md: "max-w-[var(--container-max)]",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
} as const;

type Size = keyof typeof sizeStyles;

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: Size;
  noPadding?: boolean;
}

export function Container({
  size = "md",
  noPadding = false,
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        sizeStyles[size],
        !noPadding && "px-[var(--container-px)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
