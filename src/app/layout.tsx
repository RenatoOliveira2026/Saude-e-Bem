import { GoogleAnalytics, GoogleTagManager, PageViewTracker } from "@/components/analytics";
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
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
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
    >
      <body className="flex min-h-full flex-col bg-off-white font-body text-graphite">
        <GoogleAnalytics />
        <GoogleTagManager />
        <JsonLdScript data={[organizationJsonLd(), websiteJsonLd()]} />
        <PageViewTracker />
        <PwaProvider />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
