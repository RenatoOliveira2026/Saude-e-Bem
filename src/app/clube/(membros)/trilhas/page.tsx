import { PremiumTrailsListing } from "@/components/premium/PremiumTrailsListing";
import { getPremiumTrailsPageData } from "@/lib/premium/get-trails-page-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trilhas Premium — Clube Saúde & Bem",
  description:
    "Trilhas organizadas por objetivo com artigos, protocolos, biblioteca e checklists premium.",
};

export default async function ClubeTrilhasPage() {
  const { trails } = await getPremiumTrailsPageData();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-gold">Premium</p>
        <h1 className="mt-2 font-heading text-3xl text-forest">Trilhas por objetivo</h1>
        <p className="mt-3 max-w-2xl text-muted leading-relaxed">
          Percursos curados que reúnem artigos, protocolos, materiais da biblioteca e
          checklists. Seu progresso é calculado automaticamente conforme você consome
          conteúdo na plataforma.
        </p>
      </header>
      <PremiumTrailsListing trails={trails} />
    </div>
  );
}
