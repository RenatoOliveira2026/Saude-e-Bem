import {
  AiRecommendationsPanel,
  ContinueReadingSection,
  ContentRankingsList,
} from "@/components/club";
import { Badge } from "@/components/ui/Badge";
import { getClubDashboardData } from "@/lib/club/get-club-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recomendações IA — Clube Saúde & Bem",
  description:
    "Recomendações inteligentes personalizadas com base no seu perfil, histórico e analytics.",
};

export default async function ClubeRecomendacoesIaPage() {
  const data = await getClubDashboardData();

  const personalized = data.intelligentRecommendations.filter(
    (item) => item.kind === "personalized",
  );
  const trending = data.intelligentRecommendations.filter(
    (item) => item.kind === "trending",
  );
  const related = data.intelligentRecommendations.filter(
    (item) => item.kind === "related",
  );

  return (
    <div className="space-y-10">
      <div>
        <Badge variant="gold" className="mb-3">
          Inteligência
        </Badge>
        <h1 className="font-heading text-3xl text-forest md:text-4xl">
          Recomendações IA
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Sugestões geradas a partir do seu objetivo, histórico de acesso,
          protocolos em andamento e popularidade na plataforma (analytics).
          {data.stats.goalLabel && (
            <>
              {" "}
              Objetivo:{" "}
              <strong className="text-forest">{data.stats.goalLabel}</strong>
            </>
          )}
        </p>
      </div>

      <ContinueReadingSection items={data.continueReading} />

      <AiRecommendationsPanel
        recommendations={personalized.length > 0 ? personalized : data.intelligentRecommendations.slice(0, 6)}
        title="Personalizadas para você"
      />

      {trending.length > 0 && (
        <AiRecommendationsPanel
          recommendations={trending}
          title="Em alta na plataforma"
        />
      )}

      {related.length > 0 && (
        <AiRecommendationsPanel
          recommendations={related}
          title="Conteúdos relacionados"
        />
      )}

      <ContentRankingsList
        rankings={data.contentRankings}
        title="Ranking de conteúdos (30 dias)"
      />
    </div>
  );
}
