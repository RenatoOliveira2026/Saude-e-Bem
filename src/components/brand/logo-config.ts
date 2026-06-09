import type { Metadata } from "next";

export type LogoVariant = "dark" | "light" | "mono";

/** Contextos oficiais de exibição do lockup PNG */
export type LogoContext = "header" | "footer" | "auth";

/** Paleta oficial Fase 4.1 */
export const brandColors = {
  primary: "#2E6B1F",
  secondary: "#4F8F3A",
  accent: "#E97D4B",
  background: "#F8FAF7",
  text: "#1F2937",
  /** Aliases semânticos (Tailwind: forest, sage, gold, off-white, graphite) */
  forest: "#2E6B1F",
  sage: "#4F8F3A",
  gold: "#E97D4B",
  offWhite: "#F8FAF7",
  graphite: "#1F2937",
  sageMuted: "#E8F3E4",
  sageLight: "#6BA85A",
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
    bg: "rgba(248, 250, 247, 0.15)",
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

/** Logo oficial — lockup PNG */
export const OFFICIAL_LOGO_PNG = "/logo-saude-bem.png";

export const LOGO_ALT = "Saúde & Bem — Longevidade & Vitalidade";

/** Proporção intrínseca do lockup (object-contain preserva sem distorção) */
export const OFFICIAL_LOGO_INTRINSIC_WIDTH = 560;
export const OFFICIAL_LOGO_INTRINSIC_HEIGHT = 140;

/**
 * Alturas visuais do lockup (Fase 4.1.1) — apenas CSS, arquivos PNG inalterados.
 * Proporção lockup ~4:1 → max-width acompanha a altura.
 */
export const logoDisplayHeights = {
  headerMobileMin: 50,
  headerMobileMax: 60,
  headerDesktop: 64,
  auth: 160,
} as const;

/** Classes Tailwind por contexto */
export const logoContextClasses: Record<LogoContext, string> = {
  /** Mobile 50px → sm 56px → md+ 64px */
  header:
    "h-[50px] w-auto max-w-[220px] sm:h-14 sm:max-w-[248px] md:h-16 md:max-w-[280px]",
  footer: "h-10 w-auto max-w-[200px] md:h-11 md:max-w-[240px]",
  /** Login / cadastro — 160px, centralizado */
  auth: "mx-auto h-[160px] w-auto max-w-[min(100%,40rem)] object-contain object-center",
};

/** Favicon e ícones PWA (gerados via npm run generate:brand-icons) */
export const brandIcons: Metadata["icons"] = {
  icon: [
    { url: "/favicon.ico", sizes: "any" },
    { url: "/icon.png", sizes: "32x32", type: "image/png" },
    { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
  ],
  apple: [
    {
      url: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
  ],
  shortcut: [{ url: "/icon.png", sizes: "32x32", type: "image/png" }],
};

/** @deprecated Use LogoContext */
export type LogoSize = LogoContext;

/** @deprecated Use logoContextClasses */
export const logoSizeClasses = logoContextClasses;

export const LOGO_MARK_VIEWBOX = "0 0 48 48";
export const LOGO_LOCKUP_VIEWBOX = "0 0 220 48";
