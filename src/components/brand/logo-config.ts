import type { Metadata } from "next";

export type LogoVariant = "dark" | "light" | "mono";

/** Contextos oficiais de exibição do lockup PNG */
export type LogoContext = "header" | "footer" | "auth";

export const brandColors = {
  sage: "#6F8F72",
  forest: "#2E4A3D",
  gold: "#C9A86A",
  offWhite: "#F8F6F2",
  graphite: "#333333",
  sageMuted: "#E8EFE9",
  sageLight: "#8AA88D",
} as const;

export interface LogoPalette {
  bg: string;
  heart: string;
  leafPrimary: string;
  leafSecondary: string;
  accent: string;
  showBg: boolean;
}

export const logoPalettes: Record<LogoVariant, LogoPalette> = {
  dark: {
    bg: brandColors.sageMuted,
    heart: brandColors.forest,
    leafPrimary: brandColors.sage,
    leafSecondary: brandColors.sageLight,
    accent: brandColors.gold,
    showBg: true,
  },
  light: {
    bg: "rgba(248, 246, 242, 0.12)",
    heart: brandColors.offWhite,
    leafPrimary: brandColors.sageLight,
    leafSecondary: brandColors.sage,
    accent: brandColors.gold,
    showBg: true,
  },
  mono: {
    bg: "transparent",
    heart: "currentColor",
    leafPrimary: "currentColor",
    leafSecondary: "currentColor",
    accent: "currentColor",
    showBg: false,
  },
};

/** Asset oficial — public/logo-saude-bem.png */
export const OFFICIAL_LOGO_PNG = "/logo-saude-bem.png";

export const LOGO_ALT = "Saúde & Bem — Longevidade & Vitalidade";

/** Proporção intrínseca do lockup (object-contain preserva sem distorção) */
export const OFFICIAL_LOGO_INTRINSIC_WIDTH = 560;
export const OFFICIAL_LOGO_INTRINSIC_HEIGHT = 140;

/** Alturas responsivas por contexto */
export const logoContextClasses: Record<LogoContext, string> = {
  header: "h-8 w-auto max-w-[168px] sm:max-w-[200px] md:h-9 md:max-w-[220px]",
  footer: "h-10 w-auto max-w-[200px] md:h-11 md:max-w-[240px]",
  auth: "h-12 w-auto max-w-[240px] sm:h-14 sm:max-w-[280px]",
};

/** Favicon e Apple Touch Icon — temporário via PNG oficial */
export const brandIcons: Metadata["icons"] = {
  icon: [{ url: OFFICIAL_LOGO_PNG, type: "image/png" }],
  apple: [{ url: OFFICIAL_LOGO_PNG, type: "image/png", sizes: "180x180" }],
};

/** @deprecated Use LogoContext */
export type LogoSize = LogoContext;

/** @deprecated Use logoContextClasses */
export const logoSizeClasses = logoContextClasses;

export const LOGO_MARK_VIEWBOX = "0 0 48 48";
export const LOGO_LOCKUP_VIEWBOX = "0 0 220 48";
