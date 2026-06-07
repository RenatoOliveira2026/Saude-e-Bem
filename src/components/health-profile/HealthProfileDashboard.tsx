import { SubscriptionStatusCard } from "@/components/subscription/SubscriptionStatusCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { HealthRecommendations } from "@/components/health-profile/HealthRecommendations";
import { HealthScoreCard } from "@/components/health-profile/HealthScoreCard";
import { PrioritiesSection } from "@/components/health-profile/PrioritiesSection";
import { RecommendedProductsSection } from "@/components/marketplace/RecommendedProductsSection";
import { RecommendedToolsSection } from "@/components/health-profile/RecommendedToolsSection";
import {
  ToolHistoryList,
  ToolResultSummaryGrid,
} from "@/components/health-profile/ToolResultCards";
import {
  isSavableToolSlug,
  SAVABLE_TOOL_SLUGS,
  TOOL_SLUG_LABELS,
} from "@/lib/health-profile/constants";
import { summarizeToolResult } from "@/lib/health-profile/summaries";
import type { HealthProfileData } from "@/lib/health-profile/types";
import { routes } from "@/lib/routes";

interface HealthProfileDashboardProps {
  data: HealthProfileData;
}

export function HealthProfileDashboard({ data }: HealthProfileDashboardProps) {
  const firstName = data.displayName.split(" ")[0];

  const historyItems = data.history
    .filter((r) => isSavableToolSlug(r.toolSlug))
    .map((record) => {
      const slug = record.toolSlug as (typeof SAVABLE_TOOL_SLUGS)[number];
      const summary = summarizeToolResult(
        slug,
        TOOL_SLUG_LABELS[slug],
        record.resultJson,
        record.createdAt,
        record.id,
      );
      return {
        id: record.id,
        toolSlug: record.toolSlug,
        toolTitle: summary.toolTitle,
        summary: summary.summary,
        createdAt: record.createdAt,
      };
    });

  const missingTools = SAVABLE_TOOL_SLUGS.filter(
    (slug) => !data.latestByTool.some((s) => s.toolSlug === slug),
  );

  return (
    <>
      <Section background="default" spacing="compact">
        <Container>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-8 md:p-10">
            <Badge variant="sage" className="mb-4">
              Perfil inteligente
            </Badge>
            <h1 className="font-heading text-3xl text-forest md:text-4xl">
              Minha Saúde
            </h1>
            <p className="mt-4 max-w-2xl text-muted leading-relaxed text-pretty">
              Olá, {firstName}. Acompanhe seu Score Saúde & Bem, resultados das
              ferramentas e recomendações personalizadas com base no seu histórico.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={routes.ferramentas} variant="primary" size="sm">
                Usar ferramentas
              </Button>
              <Button href={routes.minhaJornada} variant="outline" size="sm">
                Minha Jornada
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section background="white" spacing="compact">
        <Container>
          <SubscriptionStatusCard membership={data.membership} />
        </Container>
      </Section>

      <Section background="white">
        <Container>
          <h2 className="font-heading text-2xl text-forest">Seu Score Saúde & Bem</h2>
          <p className="mt-2 text-sm text-muted text-pretty">
            Pontuação normalizada de 0 a 100 — até 20 pontos por critério (IMC,
            água, proteína, metabolismo, risco cardiometabólico e hábitos do quiz).
          </p>
          <div className="mt-8">
            <HealthScoreCard score={data.healthScore} />
          </div>
        </Container>
      </Section>

      <Section background="default">
        <Container>
          <h2 className="font-heading text-2xl text-forest">Últimos resultados</h2>
          <p className="mt-2 text-sm text-muted">
            Um resumo por ferramenta — atualizado automaticamente ao calcular estando
            logado(a).
          </p>
          <div className="mt-8">
            <ToolResultSummaryGrid summaries={data.latestByTool} />
          </div>
          {missingTools.length > 0 && data.latestByTool.length > 0 && (
            <p className="mt-6 text-sm text-muted">
              Ainda não registrado:{" "}
              {missingTools.map((s) => TOOL_SLUG_LABELS[s]).join(", ")}.
            </p>
          )}
        </Container>
      </Section>

      <Section background="white">
        <Container>
          <h2 className="font-heading text-2xl text-forest">
            Protocolos Recomendados para Você
          </h2>
          <p className="mt-2 text-sm text-muted text-pretty">
            De 1 a 3 protocolos prioritários com base no IMC, hidratação, proteína,
            metabolismo, risco cardiometabólico e quiz Saúde & Bem.
          </p>
          <div className="mt-8">
            <HealthRecommendations recommendations={data.recommendations} />
          </div>
        </Container>
      </Section>

      <Section background="default">
        <Container>
          <h2 className="font-heading text-2xl text-forest">Ferramentas recomendadas</h2>
          <p className="mt-2 text-sm text-muted text-pretty">
            Ferramentas que mais impactam seu score e lacunas do seu perfil atual.
          </p>
          <div className="mt-8">
            <RecommendedToolsSection tools={data.recommendedTools} />
          </div>
        </Container>
      </Section>

      <Section background="default">
        <Container>
          <h2 className="font-heading text-2xl text-forest">Produtos recomendados para você</h2>
          <p className="mt-2 text-sm text-muted text-pretty">
            E-books, afiliados e assinatura Premium sugeridos com base no seu Score Saúde & Bem.
          </p>
          <div className="mt-8">
            <RecommendedProductsSection products={data.recommendedProducts} />
          </div>
        </Container>
      </Section>

      <Section background="white">
        <Container>
          <h2 className="font-heading text-2xl text-forest">Próximos passos</h2>
          <p className="mt-2 text-sm text-muted text-pretty">
            Prioridades ordenadas para evoluir seu perfil de saúde na plataforma.
          </p>
          <div className="mt-8">
            <PrioritiesSection priorities={data.priorities} />
          </div>
        </Container>
      </Section>

      <Section background="default">
        <Container>
          <h2 className="font-heading text-2xl text-forest">Histórico completo</h2>
          <p className="mt-2 text-sm text-muted">
            {historyItems.length} registro{historyItems.length !== 1 ? "s" : ""} salvos
          </p>
          <div className="mt-8">
            {historyItems.length > 0 ? (
              <ToolHistoryList history={historyItems} />
            ) : (
              <p className="text-sm text-muted">
                Seu histórico aparecerá aqui após usar as ferramentas com sua conta.
              </p>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
