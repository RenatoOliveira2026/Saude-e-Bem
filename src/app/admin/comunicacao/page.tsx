import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminTable, AdminTableCell } from "@/components/admin/AdminTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getAdminWhatsAppDashboard } from "@/lib/admin/services/whatsapp.service";
import { requireAdmin } from "@/lib/admin/session";
import { formatPhoneDisplay } from "@/lib/whatsapp";
import { adminRoutes } from "@/lib/routes";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Comunicação WhatsApp — Admin" };

export default async function AdminComunicacaoPage() {
  const { email, role } = await requireAdmin();
  const data = await getAdminWhatsAppDashboard();

  return (
    <>
      <AdminHeader
        title="Comunicação WhatsApp"
        description="Captação, mensagens, automação e integração CRM"
        email={email}
        role={role}
        action={
          <Button href={adminRoutes.comunicacaoTemplates} variant="outline" size="sm">
            Ver templates
          </Button>
        }
      />
      <main className="flex-1 space-y-8 p-6 lg:p-8">
        <div className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted shadow-soft">
          <p>
            <span className="font-medium text-forest">WhatsApp API:</span>{" "}
            {data.config.configured
              ? "Configurado"
              : data.config.stubMode
                ? "Modo stub (dev)"
                : "Token não configurado"}
            {" · "}
            Número público: {data.config.displayNumber || "configure NEXT_PUBLIC_WHATSAPP_DISPLAY_NUMBER"}
            {" · "}
            Webhook: /api/webhooks/whatsapp
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AdminStatCard
            label="Leads com opt-in"
            value={data.stats.optInLeads}
            icon="users"
            accent="sage"
          />
          <AdminStatCard
            label="Enviadas (30d)"
            value={data.stats.messagesSent30d}
            icon="activity"
            accent="forest"
          />
          <AdminStatCard
            label="Recebidas (30d)"
            value={data.stats.inbound30d}
            icon="sparkle"
            accent="gold"
          />
          <AdminStatCard
            label="Falhas (30d)"
            value={data.stats.messagesFailed30d}
            icon="activity"
            accent="forest"
          />
          <AdminStatCard
            label="Automações ativas"
            value={data.stats.activeAutomations}
            icon="chart"
            accent="sage"
          />
          <AdminStatCard
            label="Steps pendentes"
            value={data.stats.pendingSteps}
            icon="chart"
            accent="gold"
          />
        </div>

        <section>
          <h2 className="mb-4 font-heading text-lg font-semibold text-forest">
            Mensagens recentes
          </h2>
          {data.recentMessages.length === 0 ? (
            <p className="text-sm text-muted">Nenhuma mensagem registrada ainda.</p>
          ) : (
            <AdminTable
              columns={["Direção", "Telefone", "Template", "Status", "Data"]}
            >
              {data.recentMessages.map((msg) => (
                <tr key={msg.id}>
                  <AdminTableCell>
                    {msg.direction === "inbound" ? "Entrada" : "Saída"}
                  </AdminTableCell>
                  <AdminTableCell>{formatPhoneDisplay(msg.phone)}</AdminTableCell>
                  <AdminTableCell>{msg.templateKey ?? msg.messageType}</AdminTableCell>
                  <AdminTableCell>
                    <Badge variant={msg.status === "failed" ? "gold" : "sage"}>
                      {msg.status}
                    </Badge>
                  </AdminTableCell>
                  <AdminTableCell>
                    {new Date(msg.createdAt).toLocaleString("pt-BR")}
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
