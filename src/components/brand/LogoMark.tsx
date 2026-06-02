import { cn } from "@/lib/cn";
import {
  LOGO_MARK_VIEWBOX,
  logoPalettes,
  type LogoVariant,
} from "./logo-config";

export interface LogoMarkProps {
  size?: number;
  variant?: LogoVariant;
  className?: string;
  title?: string;
}

/**
 * Símbolo oficial Saúde & Bem — coração integrado com folha.
 * Variantes: dark (fundos claros), light (fundos escuros), mono.
 */
export function LogoMark({
  size = 48,
  variant = "dark",
  className,
  title = "Saúde & Bem",
}: LogoMarkProps) {
  const palette = logoPalettes[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox={LOGO_MARK_VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={cn("shrink-0", className)}
    >
      {palette.showBg && (
        <circle cx="24" cy="24" r="23" fill={palette.bg} />
      )}

      {/* Coração */}
      <path
        d="M24 37.5C24 37.5 10.5 28.5 10.5 19C10.5 14 14.5 10.5 18.5 10.5C21 10.5 23 11.8 24 14.2C25 11.8 27 10.5 29.5 10.5C33.5 10.5 37.5 14 37.5 19C37.5 28.5 24 37.5 24 37.5Z"
        fill={palette.heart}
      />

      {/* Folha direita — integrada ao ápice do coração */}
      <path
        d="M24 14.2C24 14.2 28.5 7 35 8.5C37.2 9 38.5 11.2 37.8 13.8C36.5 17.5 29.5 20 24 16.8"
        fill={palette.leafPrimary}
        opacity={variant === "mono" ? 1 : 0.92}
      />

      {/* Folha esquerda */}
      <path
        d="M24 14.2C24 14.2 19.5 7 13 8.5C10.8 9 9.5 11.2 10.2 13.8C11.5 17.5 18.5 20 24 16.8"
        fill={palette.leafSecondary}
        opacity={variant === "mono" ? 0.72 : 0.78}
      />

      {/* Veio central — folha + coração */}
      <path
        d="M24 10.5V16.8C24 16.8 25.8 21.5 24 26.5C22.2 21.5 24 16.8 24 16.8Z"
        fill={palette.accent}
        opacity={variant === "mono" ? 0.55 : 0.88}
      />

      {/* Caule */}
      <path
        d="M24 10.5V14.2"
        stroke={palette.accent}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity={variant === "mono" ? 0.6 : 0.75}
      />
    </svg>
  );
}

/** SVG string para favicon e assets estáticos */
export function getLogoMarkSvg(variant: LogoVariant = "dark"): string {
  const p = logoPalettes[variant];
  const bg = p.showBg
    ? `<circle cx="24" cy="24" r="23" fill="${p.bg}"/>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" role="img" aria-label="Saúde &amp; Bem">${bg}<path d="M24 37.5C24 37.5 10.5 28.5 10.5 19C10.5 14 14.5 10.5 18.5 10.5C21 10.5 23 11.8 24 14.2C25 11.8 27 10.5 29.5 10.5C33.5 10.5 37.5 14 37.5 19C37.5 28.5 24 37.5 24 37.5Z" fill="${p.heart}"/><path d="M24 14.2C24 14.2 28.5 7 35 8.5C37.2 9 38.5 11.2 37.8 13.8C36.5 17.5 29.5 20 24 16.8" fill="${p.leafPrimary}" opacity="0.92"/><path d="M24 14.2C24 14.2 19.5 7 13 8.5C10.8 9 9.5 11.2 10.2 13.8C11.5 17.5 18.5 20 24 16.8" fill="${p.leafSecondary}" opacity="0.78"/><path d="M24 10.5V16.8C24 16.8 25.8 21.5 24 26.5C22.2 21.5 24 16.8 24 16.8Z" fill="${p.accent}" opacity="0.88"/><path d="M24 10.5V14.2" stroke="${p.accent}" stroke-width="1.4" stroke-linecap="round" opacity="0.75"/></svg>`;
}
