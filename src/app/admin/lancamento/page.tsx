import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminTable, AdminTableCell } from "@/components/admin/AdminTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getLaunchDashboard } from "@/lib/admin/services/launch.service";
import { requireAdmin } from "@/lib/admin/session";
import {
  LEAD_SCORE_LABELS,
  leadScoreBadgeVariant,
} from "@/lib/leads/lead-score";
import { adminRoutes } from "@/lib/routes";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Lançamento — Admin" };

export default async function AdminLancamentoPage() {
  const { email, role } = await requireAdmin();
  const data = await getLaunchDashboard();

  const exportHref = `${adminRoutes.leadsExport}?source=lista-vip-lancamento`;

  return (
    <>
      <AdminHeader
        title="Funil de lançamento"
        description="Lista VIP, origens de leads, sincronização Brevo e sequência de nutrição"
        email={email}
        role={role}
        action={
          <div className="flex flex-wrap gap-2">
            <Button href={exportHref} variant="gold" size="sm">
              Exportar CSV (VIP)
            </Button>
            <Button href={adminRoutes.leads} variant="outline" size="sm">
              Todos os leads
            </Button>
          </div>
        }
      />
      <main className="flex-1 space-y-8 p-6 lg:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard
            label="Leads lista VIP"
            value={data.vipTotal}
            icon="users"
            accent="gold"
          />
          <AdminStatCard
            label="VIP últimos 7 dias"
            value={data.vipLast7Days}
            icon="activity"
            accent="sage"
          />
          <AdminStatCard
            label="VIP últimos 30 dias"
            value={data.vipLast30Days}
            icon="chart"
            accent="forest"
          />
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <p className="text-sm font-medium text-muted">Taxa de engajamento</p>
            <p className="mt-2 font-heading text-3xl font-semibold text-forest">
              {data.engagementRate}%
            </p>
            <p className="mt-1 text-xs text-muted-light">
              Leads VIP com 2+ interações · {data.vipSharePercent}% do total de leads
            </p>
          </div>
        </div>

        <section className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted shadow-soft">
          <p>
            <span className="font-medium text-forest">Brevo / ESP:</span>{" "}
            {data.espConfigured
              ? `Configurado (${data.configuredProviders.join(", ")})`
              : "Configure BREVO_API_KEY para sincronizar contatos."}
          </p>
          <p className="mt-2">
            <span className="font-medium text-forest">Sync lista VIP:</span>{" "}
            {data.brevoSynced} sincronizados · {data.brevoPending} pendentes ·{" "}
            {data.brevoErrors} com erro
          </p>
          <p className="mt-2 text-xs text-muted-light">
            Sequência local: <code>{data.sequenceId}</code> ({data.automationSteps}{" "}
            e-mails). Disparo automático requer workflow no painel Brevo — templates
            abaixo devem ser criados manualmente.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-heading text-xl font-semibold text-forest">
            Origem dos leads (funil)
          </h2>
          {data.byOrigin.length === 0 ? (
            <p className="text-sm text-muted">Nenhum lead registrado ainda.</p>
          ) : (
            <AdminTable columns={["Origem", "Total"]}>
              {data.byOrigin.map((row) => (
                <tr key={row.source}>
                  <AdminTableCell>{row.label}</AdminTableCell>
                  <AdminTableCell>{row.count}</AdminTableCell>
                </tr>
              ))}
            </AdminTable>
          )}
        </section>

        <section>
          <h2 className="mb-4 font-heading text-xl font-semibold text-forest">
            Templates Brevo — sequência de lançamento
          </h2>
          <AdminTable
            columns={["Chave", "Nome Brevo", "Assunto", "Delay (h)", "Descrição"]}
          >
            {data.emailTemplates.map((tpl) => (
              <tr key={tpl.templateKey}>
                <AdminTableCell>
                  <code className="text-xs">{tpl.templateKey}</code>
                </AdminTableCell>
                <AdminTableCell>{tpl.brevoName}</AdminTableCell>
                <AdminTableCell>{tpl.subject}</AdminTableCell>
                <AdminTableCell>{tpl.delayHours}</AdminTableCell>
                <AdminTableCell className="max-w-md text-xs text-muted">
                  {tpl.description}
                </AdminTableCell>
              </tr>
            ))}
          </AdminTable>
        </section>

        <section>
          <h2 className="mb-4 font-heading text-xl font-semibold text-forest">
            Últimos cadastros — lista VIP
          </h2>
          {data.recentVipLeads.length === 0 ? (
            <p className="text-sm text-muted">Nenhum lead VIP ainda.</p>
          ) : (
            <AdminTable
              columns={["Nome", "E-mail", "Score", "Brevo", "Data"]}
            >
              {data.recentVipLeads.map((lead) => (
                <tr key={lead.id}>
                  <AdminTableCell>{lead.name ?? "—"}</AdminTableCell>
                  <AdminTableCell>{lead.email}</AdminTableCell>
                  <AdminTableCell>
                    <Badge variant={leadScoreBadgeVariant(lead.leadScore)}>
                      {LEAD_SCORE_LABELS[lead.leadScore]}
                    </Badge>
                  </AdminTableCell>
                  <AdminTableCell>
                    {lead.espSyncError ? (
                      <Badge variant="gold">Erro</Badge>
                    ) : lead.espSyncedAt ? (
                      <Badge variant="sage">OK</Badge>
                    ) : (
                      <Badge variant="default">Pendente</Badge>
                    )}
                  </AdminTableCell>
                  <AdminTableCell>
                    {new Date(lead.createdAt).toLocaleString("pt-BR")}
                  </AdminTableCell>
                </tr>
              ))}
            </AdminTable>
          )}
        </section>
      </main>
    </>
  );
}
