import { LandingPageView } from "@/components/conversion/LandingPageView";
import { LANDING_PAGES } from "@/lib/conversion/landing-pages.config";
import type { Metadata } from "next";

const config = LANDING_PAGES["lp-sono"];

export const metadata: Metadata = {
  title: config.title,
  description: config.heroDescription,
  robots: { index: false, follow: true },
};

export default function LpSonoPage() {
  return <LandingPageView config={config} />;
}
