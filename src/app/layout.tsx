import { PageViewTracker } from "@/components/analytics";
import { brandIcons } from "@/components/brand/logo-config";
import { AppShell } from "@/components/layout/AppShell";
import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: {
    default: "Saúde & Bem — Longevidade & Vitalidade",
    template: "%s | Saúde & Bem",
  },
  description:
    "Plataforma premium de saúde, bem-estar e longevidade. Protocolos, ferramentas e conteúdo científico para uma vida plena.",
  icons: brandIcons,
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
        <PageViewTracker />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
