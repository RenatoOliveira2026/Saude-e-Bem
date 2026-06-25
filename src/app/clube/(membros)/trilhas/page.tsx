import { PremiumTrailsListing } from "@/components/premium/PremiumTrailsListing";
import { JsonLdScript } from "@/components/seo/JsonLd";
import { getPremiumTrailsPageData } from "@/lib/premium/get-trails-page-data";
import { routes } from "@/lib/routes";
import { breadcrumbJsonLd, learningResourceJsonLd } from "@/lib/seo/json-ld";
import { buildContentMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = buildContentMetadata({
  title: "Trilhas Premium — Clube Saúde & Bem",
  description:
    "Trilhas organizadas por objetivo com artigos, protocolos, biblioteca e checklists premium.",
  path: routes.clubeTrilhas,
  imageUrl: "/logo-saude-bem.png",
});

export default async function ClubeTrilhasPage() {
  const { trails } = await getPremiumTrailsPageData();

  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd([
            { name: "Clube", path: routes.clubeDashboard },
            { name: "Trilhas Premium" },
          ]),
          learningResourceJsonLd({
            title: "Trilhas Premium por objetivo",
            description:
              "Percursos curados com artigos, protocolos, biblioteca e checklists.",
            path: routes.clubeTrilhas,
            isPremium: true,
          }),
        ]}
      />
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
    </>
  );
}
