import { brandColors } from "@/components/brand/logo-config";

export const PWA_ID = "saude-e-bem-portal";
export const PWA_NAME = "Saúde & Bem";
export const PWA_SHORT_NAME = "Saúde & Bem";
export const PWA_DESCRIPTION =
  "Protocolos, ferramentas e conteúdo de saúde, bem-estar e longevidade.";
export const PWA_THEME_COLOR = brandColors.forest;
export const PWA_BACKGROUND_COLOR = brandColors.offWhite;
export const PWA_START_URL = "/";
export const PWA_SCOPE = "/";
export const PWA_DISPLAY = "standalone" as const;
export const SW_URL = "/sw.js";
export const MANIFEST_URL = "/manifest.json";
export const OFFLINE_URL = "/offline";

export const PWA_CACHE_VERSION = "saude-bem-pwa-v1";
