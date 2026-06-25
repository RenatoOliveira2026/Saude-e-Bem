import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AnalyticsRankList } from "@/components/admin/analytics/AnalyticsRankList";
import { getGrowthDashboardData } from "@/lib/admin/services/growth.service";
import { requireAdmin } from "@/lib/admin/session";

export default async function AdminCrescimentoPage() {
  const { email, role } = await requireAdmin();
  const data = await getGrowthDashboardData();

  return (
    <>
      <AdminHeader
        title="Crescimento & Fidelização"
        description="KPIs de retenção, conversão e engajamento — Fase 9.5"
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
              icon="chart"
              accent="forest"
            />
          ))}
        </div>

        <section className="grid gap-6 lg:grid-cols-2">
          <AnalyticsRankList
            title="Protocolos mais acessados"
            items={data.topProtocols}
            emptyMessage="Nenhuma visualização de protocolo registrada."
          />
          <AnalyticsRankList
            title="Artigos mais lidos"
            items={data.topArticles}
            emptyMessage="Nenhuma visualização de artigo registrada."
          />
          <AnalyticsRankList
            title="Biblioteca mais baixada"
            items={data.topDownloads}
            emptyMessage="Nenhum download registrado."
          />
          <AnalyticsRankList
            title="Trilhas mais iniciadas (est.)"
            items={data.trailsStartedEstimate}
            emptyMessage="Sem dados de trilhas no período."
          />
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-heading text-lg text-forest">Conversão por origem (30d)</h2>
          <ul className="mt-4 space-y-2">
            {data.conversionByOrigin.length === 0 ? (
              <li className="text-sm text-muted">Sem dados de origem no período.</li>
            ) : (
              data.conversionByOrigin.map((row) => (
                <li key={row.origin} className="flex justify-between text-sm">
                  <span className="text-forest">{row.origin}</span>
                  <span className="text-muted">{row.count} eventos</span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-heading text-lg text-forest">Eventos de funil (GA4)</h2>
          <p className="mt-1 text-sm text-muted">
            Catálogo preparado — sem alterar integrações de pagamento ou Supabase.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {data.growthEventsCatalog.map((ev) => (
              <li key={ev.event} className="rounded-xl border border-border p-3">
                <p className="font-mono text-xs text-gold">{ev.event}</p>
                <p className="mt-1 text-sm font-medium text-forest">{ev.label}</p>
                <p className="text-xs text-muted">{ev.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
