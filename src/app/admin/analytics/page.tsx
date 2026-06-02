import { AnalyticsRankList } from "@/components/admin/analytics/AnalyticsRankList";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { getAnalyticsDashboard } from "@/lib/admin/services/analytics.service";
import { requireAdmin } from "@/lib/admin/session";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Analytics — Admin" };

export default async function AdminAnalyticsPage() {
  const { email, role } = await requireAdmin();
  const data = await getAnalyticsDashboard();

  const isEmpty = data.totalEvents === 0;

  return (
    <>
      <AdminHeader
        title="Analytics"
        description="Métricas de crescimento, leads, afiliados e engajamento"
        email={email}
        role={role}
      />
      <main className="flex-1 space-y-8 p-6 lg:p-8">
        {isEmpty && (
          <div className="rounded-2xl border border-dashed border-border bg-off-white p-8 text-center">
            <p className="font-heading text-lg font-semibold text-forest">
              Nenhum evento registrado ainda
            </p>
            <p className="mt-2 text-sm text-muted">
              Navegue pelo portal público, inscreva leads ou clique em afiliados para
              popular o painel. Execute a migration 013 se a tabela ainda não existir.
            </p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard
            label="Total de eventos"
            value={data.totalEvents}
            icon="chart"
            accent="forest"
          />
          <AdminStatCard
            label="Leads captados"
            value={data.leadsCaptured}
            icon="users"
            accent="sage"
          />
          <AdminStatCard
            label="Cliques em afiliados"
            value={data.affiliateClicks}
            icon="star"
            accent="gold"
          />
          <AdminStatCard
            label="Downloads de e-books"
            value={data.ebookDownloads}
            icon="download"
            accent="forest"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AdminStatCard
            label="Eventos (7 dias)"
            value={data.eventsLast7Days}
            icon="activity"
            accent="sage"
          />
          <AdminStatCard
            label="Eventos (30 dias)"
            value={data.eventsLast30Days}
            icon="chart"
            accent="gold"
          />
        </div>

        <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <h2 className="font-heading text-lg font-semibold text-forest">
            Integrações futuras
          </h2>
          <p className="mt-1 text-sm text-muted">
            Estrutura preparada — ative via variáveis de ambiente quando for publicar.
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            <li className="text-sm text-graphite">
              Google Analytics 4:{" "}
              <span className="font-medium">
                {data.integrationsStatus.ga4 ? "Configurado" : "Pendente"}
              </span>
            </li>
            <li className="text-sm text-graphite">
              Meta Pixel:{" "}
              <span className="font-medium">
                {data.integrationsStatus.metaPixel ? "Configurado" : "Pendente"}
              </span>
            </li>
            <li className="text-sm text-graphite">
              Google Tag Manager:{" "}
              <span className="font-medium">
                {data.integrationsStatus.gtm ? "Configurado" : "Pendente"}
              </span>
            </li>
            <li className="text-sm text-graphite">
              Search Console:{" "}
              <span className="font-medium">
                {data.integrationsStatus.searchConsole ? "Configurado" : "Pendente"}
              </span>
            </li>
          </ul>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <AnalyticsRankList
            title="Artigos mais acessados"
            items={data.topArticles}
            emptyMessage="Nenhuma visualização de artigo registrada."
          />
          <AnalyticsRankList
            title="Protocolos mais acessados"
            items={data.topProtocols}
            emptyMessage="Nenhuma visualização de protocolo registrada."
          />
          <AnalyticsRankList
            title="Afiliados mais clicados"
            items={data.topAffiliates}
            emptyMessage="Nenhum clique de afiliado registrado."
          />
        </div>
      </main>
    </>
  );
}
