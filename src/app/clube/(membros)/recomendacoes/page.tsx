import { ClubRecommendationsList } from "@/components/club";
import { getClubDashboardData } from "@/lib/club/get-club-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recomendações — Clube Saúde & Bem",
};

export default async function ClubeRecomendacoesPage() {
  const data = await getClubDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-forest">
          Recomendações personalizadas
        </h1>
        <p className="mt-2 text-muted">
          Sugestões com base no seu objetivo de saúde e plano atual.
          {data.stats.goalLabel && (
            <>
              {" "}
              Objetivo: <strong className="text-forest">{data.stats.goalLabel}</strong>
            </>
          )}
        </p>
      </div>
      <ClubRecommendationsList recommendations={data.recommendations} />
    </div>
  );
}
