import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { HealthRecommendations } from "@/components/health-profile/HealthRecommendations";
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
              Olá, {firstName}. Aqui você acompanha os resultados das ferramentas
              interativas e recebe sugestões de protocolos alinhados ao seu perfil.
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

      <Section background="white">
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

      <Section background="default">
        <Container>
          <h2 className="font-heading text-2xl text-forest">
            Protocolos recomendados
          </h2>
          <p className="mt-2 text-sm text-muted text-pretty">
            Sugestões automáticas com base no quiz, IMC e demais resultados salvos —
            integradas à biblioteca de protocolos.
          </p>
          <div className="mt-8">
            <HealthRecommendations recommendations={data.recommendations} />
          </div>
        </Container>
      </Section>

      <Section background="white">
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
