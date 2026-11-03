import { GoogleAnalytics, GoogleTagManager, MetaPixel, PageViewTracker } from "@/components/analytics";
import { brandIcons } from "@/components/brand/logo-config";
import { AppShell } from "@/components/layout/AppShell";
import { PwaProvider } from "@/components/pwa";
import { JsonLdScript } from "@/components/seo/JsonLd";
import {
  MANIFEST_URL,
  PWA_DESCRIPTION,
  PWA_NAME,
  PWA_SHORT_NAME,
  PWA_THEME_COLOR,
} from "@/lib/pwa/config";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
import { getMetadataBaseUrl } from "@/lib/seo/site-url";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { FONT_SCALE_INIT_SCRIPT } from "@/components/layout/FontSizeControl";
import { AdSenseScript } from "@/components/ads/AdSenseScript";

/**
 * Fontes servidas pelo próprio projeto (src/app/fonts, licença SIL OFL 1.1,
 * arquivos do Fontsource). Antes vinham de next/font/google, que baixava do
 * Google a cada build e derrubava o deploy quando o download falhava.
 */
const montserrat = localFont({
  variable: "--font-montserrat",
  display: "swap",
  src: [
    { path: "./fonts/montserrat-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/montserrat-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/montserrat-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/montserrat-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
});

const openSans = localFont({
  variable: "--font-open-sans",
  display: "swap",
  src: [
    { path: "./fonts/open-sans-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/open-sans-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/open-sans-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: PWA_THEME_COLOR },
    { media: "(prefers-color-scheme: dark)", color: PWA_THEME_COLOR },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

const searchConsoleVerification =
  process.env.NEXT_PUBLIC_SEARCH_CONSOLE_VERIFICATION?.trim() || undefined;

export const metadata: Metadata = {
  metadataBase: getMetadataBaseUrl(),
  title: {
    default: "Saúde & Bem — Longevidade & Vitalidade",
    template: "%s | Saúde & Bem",
  },
  description: PWA_DESCRIPTION,
  applicationName: PWA_SHORT_NAME,
  manifest: MANIFEST_URL,
  ...(searchConsoleVerification
    ? { verification: { google: searchConsoleVerification } }
    : {}),
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: PWA_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: brandIcons,
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": PWA_SHORT_NAME,
    "msapplication-TileColor": PWA_THEME_COLOR,
    "msapplication-config": "none",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${montserrat.variable} ${openSans.variable} h-full scroll-smooth antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: FONT_SCALE_INIT_SCRIPT }} />
        <AdSenseScript />
      </head>
      <body className="flex min-h-full flex-col bg-off-white font-body text-graphite">
        <GoogleAnalytics />
        <GoogleTagManager />
        <MetaPixel />
        <JsonLdScript data={[organizationJsonLd(), websiteJsonLd()]} />
        <PageViewTracker />
        <PwaProvider />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
