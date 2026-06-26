import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AnalyticsRankList } from "@/components/admin/analytics/AnalyticsRankList";
import { getRecommendationsAdminDashboard } from "@/lib/admin/services/recommendations-admin.service";
import { requireAdmin } from "@/lib/admin/session";

export default async function AdminRecomendacoesPage() {
  const { email, role } = await requireAdmin();
  const data = await getRecommendationsAdminDashboard();

  return (
    <>
      <AdminHeader
        title="Motor de Recomendações"
        description="KPIs do motor inteligente — Fase 10.0 (sem chatbot / sem OpenAI)"
        email={email}
        role={role}
      />
      <main className="flex-1 space-y-8 p-6 lg:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.kpis.map((kpi) => (
            <AdminStatCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              icon="sparkle"
              accent="gold"
            />
          ))}
        </div>

        <section className="grid gap-6 lg:grid-cols-2">
          <AnalyticsRankList
            title="Conteúdos mais recomendados (score motor)"
            items={data.topRecommendedRanked}
            emptyMessage="Catálogo vazio ou sem scores."
          />
          <AnalyticsRankList
            title="Conteúdos mais aceitos (30d)"
            items={data.topAcceptedRanked}
            emptyMessage="Sem dados em content_rankings."
          />
          <AnalyticsRankList
            title="Categorias com maior interesse"
            items={data.categoryInterestRanked}
            emptyMessage="Sem categorias calculadas."
          />
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-heading text-lg text-forest">Taxa de clique (proxy)</h2>
          <p className="mt-2 text-sm text-muted">
            Estimativa baseada em engajamento registrado em{" "}
            <code className="text-xs">content_rankings</code> versus impressões
            estimadas do catálogo. Cliques reais do motor são rastreados via GA4 (
            <code className="text-xs">recommendation_click</code>).
          </p>
          <p className="mt-4 font-heading text-3xl text-gold">
            {data.stats.clickThroughProxyPercent}%
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-heading text-lg text-forest">Eventos GA4 do motor</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {data.eventsCatalog
              .filter((ev) => ev.event === "recommendation_click")
              .map((ev) => (
                <li key={ev.event} className="rounded-xl border border-border p-3">
                  <p className="font-mono text-xs text-gold">{ev.event}</p>
                  <p className="mt-1 text-sm font-medium text-forest">{ev.label}</p>
                  <p className="mt-1 text-xs text-muted">{ev.description}</p>
                </li>
              ))}
          </ul>
        </section>
      </main>
    </>
  );
}
