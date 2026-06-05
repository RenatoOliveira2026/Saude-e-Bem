import { LeadTimeline } from "@/components/admin/crm/LeadTimeline";
import { PipelineBoard } from "@/components/admin/crm/PipelineBoard";
import { SourceMetricsTable } from "@/components/admin/crm/SourceMetricsTable";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { Button } from "@/components/ui/Button";
import { getConversionDashboard } from "@/lib/admin/services/conversion.service";
import { requireAdmin } from "@/lib/admin/session";
import { adminRoutes } from "@/lib/routes";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Conversão — Admin" };

export default async function AdminConversaoPage() {
  const { email, role } = await requireAdmin();
  const data = await getConversionDashboard();

  return (
    <>
      <AdminHeader
        title="Dashboard de conversão"
        description="Pipeline CRM, métricas por origem e automação de nutrição"
        email={email}
        role={role}
        action={
          <Button href={adminRoutes.leads} variant="outline" size="sm">
            Ver todos os leads
          </Button>
        }
      />
      <main className="flex-1 space-y-8 p-6 lg:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <AdminStatCard label="Total de leads" value={data.totalLeads} icon="users" accent="forest" />
          <AdminStatCard label="Leads quentes" value={data.hotLeads} icon="star" accent="gold" />
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <p className="text-sm font-medium text-muted">Taxa quente</p>
            <p className="mt-2 font-heading text-3xl font-semibold text-forest">{data.hotRate}%</p>
          </div>
          <AdminStatCard label="Automações ativas" value={data.activeAutomations} icon="activity" accent="forest" />
          <AdminStatCard label="Steps pendentes" value={data.pendingSteps} icon="sparkle" accent="gold" />
        </div>

        <section className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted shadow-soft">
          <p>
            <span className="font-medium text-forest">ESP:</span>{" "}
            {data.espConfigured
              ? `Configurado (${data.configuredProviders.join(", ")})`
              : "Configure BREVO_API_KEY, HUBSPOT_API_KEY ou RDSTATION_API_KEY"}
          </p>
          <p className="mt-2 text-xs text-muted-light">
            Use LEAD_ESP_PROVIDER para forçar provedor. LEAD_ESP_LIVE_SYNC=true ativa sync real (Brevo).
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-heading text-xl font-semibold text-forest">
            Pipeline de leads
          </h2>
          <PipelineBoard columns={data.pipeline} />
        </section>

        <section>
          <h2 className="mb-4 font-heading text-xl font-semibold text-forest">
            Conversão por origem
          </h2>
          <SourceMetricsTable metrics={data.bySource} />
        </section>

        {data.recentInteractions.length > 0 && (
          <section>
            <h2 className="mb-4 font-heading text-xl font-semibold text-forest">
              Interações recentes
            </h2>
            <LeadTimeline interactions={data.recentInteractions} />
          </section>
        )}
      </main>
    </>
  );
}
