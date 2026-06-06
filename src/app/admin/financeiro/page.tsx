import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminTable, AdminTableCell } from "@/components/admin/AdminTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  getAdminFinanceDashboard,
} from "@/lib/admin/services/finance.service";
import { requireAdmin } from "@/lib/admin/session";
import {
  formatPaymentAmount,
  paymentMethodLabels,
  paymentStatusLabels,
} from "@/lib/payments/constants";
import { getPaymentsConfigSummary } from "@/lib/payments/config";
import { adminRoutes } from "@/lib/routes";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Financeiro — Admin" };

function formatBrl(cents: number): string {
  return formatPaymentAmount(cents, "BRL");
}

export default async function AdminFinanceiroPage() {
  const { email, role } = await requireAdmin();
  const [data, config] = await Promise.all([
    getAdminFinanceDashboard(),
    Promise.resolve(getPaymentsConfigSummary()),
  ]);

  return (
    <>
      <AdminHeader
        title="Dashboard financeiro"
        description="Receita, assinaturas, pagamentos Mercado Pago e webhooks"
        email={email}
        role={role}
        action={
          <Button href={adminRoutes.financeExport} variant="outline" size="sm">
            Exportar pagamentos CSV
          </Button>
        }
      />
      <main className="flex-1 space-y-8 p-6 lg:p-8">
        <div className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted shadow-soft">
          <p>
            <span className="font-medium text-forest">Mercado Pago:</span>{" "}
            {config.realCheckoutEnabled
              ? "Checkout real ativo"
              : config.stubMode
                ? "Modo stub (dev)"
                : "Token não configurado"}
            {" · "}
            Webhook: {config.webhookSecretConfigured ? "secret OK" : "configure MERCADOPAGO_WEBHOOK_SECRET"}
            {" · "}
            URL: {config.siteUrl}/api/payments/webhook
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <p className="text-sm font-medium text-muted">Receita total</p>
            <p className="mt-2 font-heading text-3xl font-semibold text-forest">
              {formatBrl(data.stats.totalRevenueCents)}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <p className="text-sm font-medium text-muted">Receita 30 dias</p>
            <p className="mt-2 font-heading text-3xl font-semibold text-forest">
              {formatBrl(data.stats.revenueLast30DaysCents)}
            </p>
          </div>
          <AdminStatCard
            label="Assinaturas ativas"
            value={data.stats.activeSubscriptions}
            icon="users"
            accent="sage"
          />
          <AdminStatCard
            label="Pagamentos pendentes"
            value={data.stats.pendingPayments}
            icon="activity"
            accent="forest"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-surface px-4 py-3 text-center shadow-soft">
            <p className="text-xs uppercase tracking-wide text-muted">MRR estimado</p>
            <p className="mt-1 font-heading text-2xl text-forest">
              {formatBrl(data.stats.estimatedMrrCents)}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-4 py-3 text-center shadow-soft">
            <p className="text-xs uppercase tracking-wide text-muted">Mensais ativos</p>
            <p className="mt-1 font-heading text-2xl text-forest">
              {data.stats.monthlySubscribers}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-4 py-3 text-center shadow-soft">
            <p className="text-xs uppercase tracking-wide text-muted">Anuais ativos</p>
            <p className="mt-1 font-heading text-2xl text-forest">
              {data.stats.annualSubscribers}
            </p>
          </div>
        </div>

        {data.revenueByMethod.length > 0 && (
          <section>
            <h2 className="mb-4 font-heading text-lg font-semibold text-forest">
              Receita por método
            </h2>
            <AdminTable columns={["Método", "Transações", "Total"]}>
              {data.revenueByMethod.map((row) => (
                <tr key={row.method}>
                  <AdminTableCell>
                    {row.method === "unknown"
                      ? "Outros"
                      : paymentMethodLabels[row.method as keyof typeof paymentMethodLabels] ?? row.method}
                  </AdminTableCell>
                  <AdminTableCell>{row.count}</AdminTableCell>
                  <AdminTableCell>{formatBrl(row.totalCents)}</AdminTableCell>
                </tr>
              ))}
            </AdminTable>
          </section>
        )}

        <section>
          <h2 className="mb-4 font-heading text-lg font-semibold text-forest">
            Pagamentos recentes
          </h2>
          <AdminTable
            columns={["Usuário", "Plano", "Valor", "Método", "Status", "Data"]}
          >
            {data.recentPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-sage-muted/20">
                <AdminTableCell>{payment.userName ?? payment.userId.slice(0, 8)}</AdminTableCell>
                <AdminTableCell>
                  {payment.billingPlanId ??
                    (typeof payment.metadata?.plan === "string"
                      ? payment.metadata.plan
                      : "—")}
                </AdminTableCell>
                <AdminTableCell>
                  {formatBrl(payment.amountCents)}
                </AdminTableCell>
                <AdminTableCell>
                  {payment.paymentMethod
                    ? paymentMethodLabels[payment.paymentMethod]
                    : "—"}
                </AdminTableCell>
                <AdminTableCell>
                  <Badge variant={payment.status === "approved" ? "gold" : "default"}>
                    {paymentStatusLabels[payment.status]}
                  </Badge>
                </AdminTableCell>
                <AdminTableCell className="text-sm text-muted">
                  {new Date(payment.createdAt).toLocaleDateString("pt-BR")}
                </AdminTableCell>
              </tr>
            ))}
          </AdminTable>
        </section>

        <section>
          <h2 className="mb-4 font-heading text-lg font-semibold text-forest">
            Assinaturas recentes
          </h2>
          <AdminTable columns={["Usuário", "Plano", "Status", "Renovação auto", "Válido até"]}>
            {data.recentSubscriptions.map((sub) => (
              <tr key={sub.id}>
                <AdminTableCell>{sub.userName ?? sub.userId.slice(0, 8)}</AdminTableCell>
                <AdminTableCell>{sub.billingPlanId ?? "—"}</AdminTableCell>
                <AdminTableCell>{sub.status}</AdminTableCell>
                <AdminTableCell>{sub.autoRenew ? "Sim" : "Não"}</AdminTableCell>
                <AdminTableCell>
                  {sub.currentPeriodEnd
                    ? new Date(sub.currentPeriodEnd).toLocaleDateString("pt-BR")
                    : "—"}
                </AdminTableCell>
              </tr>
            ))}
          </AdminTable>
        </section>

        {data.webhookFailures.length > 0 && (
          <section>
            <h2 className="mb-4 font-heading text-lg font-semibold text-forest">
              Webhooks com alerta
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
      </main>
    </>
  );
}
