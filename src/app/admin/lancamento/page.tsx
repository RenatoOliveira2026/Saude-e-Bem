import { AdminHeader } from "@/components/admin/AdminHeader";
import { LaunchDailyChecklist } from "@/components/admin/LaunchDailyChecklist";
import { LaunchHealthPanel } from "@/components/admin/LaunchHealthPanel";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminTable, AdminTableCell } from "@/components/admin/AdminTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getOperationsDashboard } from "@/lib/admin/services/operations.service";
import { getSystemHealthReport } from "@/lib/admin/services/system-health.service";
import { requireAdmin } from "@/lib/admin/session";
import { formatPaymentAmount } from "@/lib/payments/constants";
import { adminRoutes } from "@/lib/routes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Operação de lançamento — Admin",
};

export default async function AdminLancamentoPage() {
  const { email, role } = await requireAdmin();
  const [data, health] = await Promise.all([
    getOperationsDashboard(),
    getSystemHealthReport(),
  ]);
  const { kpis, launch } = data;

  return (
    <>
      <AdminHeader
        title="Operação de lançamento"
        description="Acompanhe cadastros, pagamentos, Premium e saúde do sistema nos primeiros dias"
        email={email}
        role={role}
        action={
          <div className="flex flex-wrap gap-2">
            <Button href={adminRoutes.financeiro} variant="outline" size="sm">
              Financeiro
            </Button>
            <Button href={adminRoutes.usuarios} variant="outline" size="sm">
              Usuários
            </Button>
            <Button href={adminRoutes.memberships} variant="gold" size="sm">
              Assinaturas
            </Button>
          </div>
        }
      />
      <main className="flex-1 space-y-8 p-6 lg:p-8">
        <LaunchHealthPanel
          checkedAt={health.checkedAt}
          overall={health.overall}
          items={health.items}
        />

        <LaunchDailyChecklist />

        <section>
          <h2 className="mb-4 font-heading text-xl font-semibold text-forest">
            Indicadores do lançamento
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard
              label="Cadastros totais"
              value={kpis.newSignupsTotal}
              icon="users"
              accent="forest"
            />
            <AdminStatCard
              label="Novos (24h)"
              value={kpis.newSignupsLast24h}
              icon="activity"
              accent="sage"
            />
            <AdminStatCard
              label="Novos (7 dias)"
              value={kpis.newSignupsLast7Days}
              icon="chart"
              accent="gold"
            />
            <AdminStatCard
              label="E-mails confirmados"
              value={kpis.emailsConfirmed}
              icon="checklist"
              accent="sage"
            />
            <AdminStatCard
              label="E-mail pendente"
              value={kpis.emailsPending}
              icon="activity"
              accent="gold"
            />
            <AdminStatCard
              label="Perfis completos"
              value={kpis.profilesComplete}
              icon="checklist"
              accent="forest"
            />
            <AdminStatCard
              label="Perfis incompletos"
              value={kpis.profilesIncomplete}
              icon="users"
              accent="gold"
            />
            <AdminStatCard
              label="Pagamentos pending"
              value={kpis.paymentsPending}
              icon="activity"
              accent="gold"
            />
            <AdminStatCard
              label="Pagamentos approved"
              value={kpis.paymentsApproved}
              icon="star"
              accent="forest"
            />
            <AdminStatCard
              label="Premium ativos"
              value={kpis.premiumActive}
              icon="community"
              accent="sage"
            />
            <AdminStatCard
              label="Alertas webhook"
              value={kpis.webhookFailures}
              icon="activity"
              accent="gold"
            />
            <AdminStatCard
              label="Leads newsletter"
              value={kpis.newsletterLeadsTotal}
              icon="book"
              accent="forest"
            />
          </div>
          <p className="mt-3 text-xs text-muted-light">
            Newsletter últimos 7 dias: {kpis.newsletterLeadsLast7Days} · Origem do
            cadastro = objetivo de saúde escolhido no formulário.
          </p>
        </section>

        <section>
          <h2 className="mb-4 font-heading text-xl font-semibold text-forest">
            Últimos cadastros
          </h2>
          {data.recentSignups.length === 0 ? (
            <p className="text-sm text-muted">Nenhum usuário cadastrado ainda.</p>
          ) : (
            <AdminTable
              columns={[
                "Nome",
                "E-mail",
                "Objetivo",
                "E-mail OK",
                "Perfil",
                "Data",
              ]}
            >
              {data.recentSignups.map((row) => (
                <tr key={row.id}>
                  <AdminTableCell>{row.name ?? "—"}</AdminTableCell>
                  <AdminTableCell>{row.email}</AdminTableCell>
                  <AdminTableCell>{row.goalLabel}</AdminTableCell>
                  <AdminTableCell>
                    <Badge variant={row.emailConfirmed ? "sage" : "default"}>
                      {row.emailConfirmed ? "Confirmado" : "Pendente"}
                    </Badge>
                  </AdminTableCell>
                  <AdminTableCell>
                    <Badge variant={row.billingComplete ? "sage" : "gold"}>
                      {row.billingComplete ? "Completo" : "Incompleto"}
                    </Badge>
                  </AdminTableCell>
                  <AdminTableCell>
                    {new Date(row.createdAt).toLocaleString("pt-BR")}
                  </AdminTableCell>
                </tr>
              ))}
            </AdminTable>
          )}
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="mb-4 font-heading text-lg font-semibold text-forest">
              Origem do cadastro (objetivo)
            </h2>
            {data.signupByOrigin.length === 0 ? (
              <p className="text-sm text-muted">Sem dados ainda.</p>
            ) : (
              <AdminTable columns={["Objetivo", "Usuários"]}>
                {data.signupByOrigin.map((row) => (
                  <tr key={row.origin}>
                    <AdminTableCell>{row.label}</AdminTableCell>
                    <AdminTableCell>{row.count}</AdminTableCell>
                  </tr>
                ))}
              </AdminTable>
            )}
          </section>

          <section>
            <h2 className="mb-4 font-heading text-lg font-semibold text-forest">
              Newsletter por origem
            </h2>
            {data.newsletterBySource.length === 0 ? (
              <p className="text-sm text-muted">Nenhum lead de newsletter.</p>
            ) : (
              <AdminTable columns={["Origem", "Total"]}>
                {data.newsletterBySource.map((row) => (
                  <tr key={row.source}>
                    <AdminTableCell>{row.source}</AdminTableCell>
                    <AdminTableCell>{row.count}</AdminTableCell>
                  </tr>
                ))}
              </AdminTable>
            )}
            <Button
              href={adminRoutes.newsletter}
              variant="ghost"
              size="sm"
              className="mt-3"
            >
              Ver newsletter →
            </Button>
          </section>
        </div>

        {data.paymentAlerts.length > 0 && (
          <section>
            <h2 className="mb-4 font-heading text-lg font-semibold text-forest">
              Alertas de pagamento
            </h2>
            <AdminTable
              columns={["Usuário", "Referência", "Valor", "Status", "Mensagem", "Data"]}
            >
              {data.paymentAlerts.map((row) => (
                <tr key={row.id}>
                  <AdminTableCell>{row.userName ?? row.userId.slice(0, 8)}</AdminTableCell>
                  <AdminTableCell>
                    <code className="text-xs">{row.externalReference}</code>
                  </AdminTableCell>
                  <AdminTableCell>
                    {formatPaymentAmount(row.amountCents, "BRL")}
                  </AdminTableCell>
                  <AdminTableCell>
                    <Badge variant="gold">{row.statusLabel}</Badge>
                  </AdminTableCell>
                  <AdminTableCell className="text-sm text-muted">
                    {row.message}
                  </AdminTableCell>
                  <AdminTableCell>
                    {new Date(row.createdAt).toLocaleString("pt-BR")}
                  </AdminTableCell>
                </tr>
              ))}
            </AdminTable>
          </section>
        )}

        {data.webhookFailures.length > 0 && (
          <section>
            <h2 className="mb-4 font-heading text-lg font-semibold text-forest">
              Falhas / alertas de webhook
            </h2>
            <AdminTable columns={["Tópico", "Recurso", "Mensagem", "Processado"]}>
              {data.webhookFailures.map((event) => (
                <tr key={event.id}>
                  <AdminTableCell>{event.topic}</AdminTableCell>
                  <AdminTableCell>{event.resourceId ?? "—"}</AdminTableCell>
                  <AdminTableCell className="text-sm text-muted">
                    {event.message ?? "—"}
                  </AdminTableCell>
                  <AdminTableCell>
                    {new Date(event.processedAt).toLocaleString("pt-BR")}
                  </AdminTableCell>
                </tr>
              ))}
            </AdminTable>
          </section>
        )}

        <section className="rounded-2xl border border-dashed border-border bg-off-white p-6">
          <h2 className="font-heading text-lg font-semibold text-forest">
            Lista VIP e funil de captação
          </h2>
          <p className="mt-1 text-sm text-muted">
            Leads pré-lançamento e sincronização Brevo.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard
              label="Leads VIP"
              value={launch.vipTotal}
              icon="users"
              accent="gold"
            />
            <AdminStatCard
              label="VIP 7 dias"
              value={launch.vipLast7Days}
              icon="activity"
              accent="sage"
            />
            <AdminStatCard
              label="Brevo sync OK"
              value={launch.brevoSynced}
              icon="checklist"
              accent="forest"
            />
            <AdminStatCard
              label="Brevo pendente"
              value={launch.brevoPending}
              icon="book"
              accent="gold"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              href={`${adminRoutes.leadsExport}?source=lista-vip-lancamento`}
              variant="outline"
              size="sm"
            >
              Exportar VIP CSV
            </Button>
            <Button href={adminRoutes.leads} variant="ghost" size="sm">
              Todos os leads
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}
