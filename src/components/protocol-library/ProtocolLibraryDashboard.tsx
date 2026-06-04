import { AiRecommendationsPanel } from "@/components/club/AiRecommendationsPanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fetchIntelligentRecommendations } from "@/lib/club/services/intelligent-recommendations.service";
import type { ProtocolLibraryDashboardData } from "@/lib/protocol-library/types";
import { routes } from "@/lib/routes";
import Link from "next/link";
import { ProtocolHistoryList } from "./ProtocolHistoryList";
import { ProtocolLibrarySection } from "./ProtocolLibrarySection";

interface ProtocolLibraryDashboardProps {
  data: ProtocolLibraryDashboardData;
  userId: string;
  favoriteIds: string[];
}

export async function ProtocolLibraryDashboard({
  data,
  userId,
  favoriteIds,
}: ProtocolLibraryDashboardProps) {
  const aiRecommendations = await fetchIntelligentRecommendations({
    userId,
    isPremium: data.isPremium,
    limit: 6,
  });

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-border bg-gradient-to-br from-sage-muted/60 via-surface to-gold-muted/30 p-6 shadow-soft md:p-8">
        <Badge variant="forest" className="mb-3">
          Biblioteca Inteligente
        </Badge>
        <h1 className="font-heading text-3xl text-forest md:text-4xl">
          Seu painel de protocolos
        </h1>
        <p className="mt-3 max-w-2xl text-muted leading-relaxed">
          Recomendações personalizadas pela IA, favoritos, histórico e novidades
          da biblioteca — integrado à Fase 3.9.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={routes.protocolos} variant="primary" size="sm">
            Explorar biblioteca
          </Button>
          <Button href={routes.clubeFavoritos} variant="outline" size="sm">
            Todos os favoritos
          </Button>
          <Button href={routes.protocolosRecentes} variant="outline" size="sm">
            Histórico completo
          </Button>
        </div>
      </section>

      <section>
        <AiRecommendationsPanel
          recommendations={aiRecommendations.filter(
            (r) => r.contentType === "protocol",
          )}
          title="Recomendados para você (IA)"
        />
        {data.recommended.length > 0 && (
          <p className="mt-4 text-sm text-muted">
            <Link href={routes.clubeRecomendacoesIa} className="text-forest underline">
              Ver todas as recomendações IA no Clube
            </Link>
          </p>
        )}
      </section>

      <ProtocolLibrarySection
        title="Seus favoritos"
        description="Protocolos que você salvou."
        items={data.favorites}
        favoriteIds={favoriteIds}
        isLoggedIn
        actionLabel="Ver favoritos do Clube"
        actionHref={routes.clubeFavoritos}
        background="white"
      />

      <section className="rounded-2xl border border-border bg-surface p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-xl text-forest">
            Recentemente visualizados
          </h2>
          <Button href={routes.protocolosRecentes} variant="outline" size="sm">
            Ver todos
          </Button>
        </div>
        <ProtocolHistoryList entries={data.recentlyViewed} />
      </section>

      <ProtocolLibrarySection
        title="Novidades"
        description="Protocolos publicados ou atualizados recentemente."
        items={data.newest}
        favoriteIds={favoriteIds}
        isLoggedIn
        background="default"
      />

      <ProtocolLibrarySection
        title="Destaques gratuitos"
        description="Acesso liberado para todos os membros."
        items={data.freeHighlights}
        favoriteIds={favoriteIds}
        isLoggedIn
        background="white"
      />

      {!data.isPremium && data.premiumHighlights.length > 0 && (
        <ProtocolLibrarySection
          title="Protocolos Premium"
          description="Assine o Clube para desbloquear o conteúdo completo."
          items={data.premiumHighlights}
          favoriteIds={favoriteIds}
          isLoggedIn
          actionLabel="Conhecer Premium"
          actionHref={routes.clubePremium}
          background="sage"
        />
      )}
    </div>
  );
}
