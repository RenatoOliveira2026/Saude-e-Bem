import { LeadTimeline } from "@/components/admin/crm/LeadTimeline";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminTable, AdminTableCell } from "@/components/admin/AdminTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getAdminLeadById } from "@/lib/admin/services/leads.service";
import { requireAdmin } from "@/lib/admin/session";
import { listLeadAutomationRuns } from "@/lib/crm/automation-runs";
import { listLeadInteractions } from "@/lib/crm/interactions";
import {
  getLeadInterestLabel,
  LEAD_SOURCE_LABELS,
} from "@/lib/leads/lead.constants";
import { LEAD_SCORE_LABELS, leadScoreBadgeVariant } from "@/lib/leads/lead-score";
import { adminRoutes } from "@/lib/routes";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface AdminLeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AdminLeadDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const lead = await getAdminLeadById(id);
  return { title: lead ? `${lead.email} — Lead` : "Lead não encontrado" };
}

export default async function AdminLeadDetailPage({ params }: AdminLeadDetailPageProps) {
  const { email, role } = await requireAdmin();
  const { id } = await params;

  const lead = await getAdminLeadById(id);
  if (!lead) notFound();

  const [interactions, automationRuns] = await Promise.all([
    listLeadInteractions(id),
    listLeadAutomationRuns(id),
  ]);

  return (
    <>
      <AdminHeader
        title={lead.name ?? lead.email}
        description="Histórico de interações, automação e sync ESP"
        email={email}
        role={role}
        action={
          <Button href={adminRoutes.leads} variant="outline" size="sm">
            Voltar aos leads
          </Button>
        }
      />
      <main className="flex-1 space-y-8 p-6 lg:p-8">
        <div className="grid gap-4 rounded-2xl border border-border bg-surface p-6 shadow-soft md:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">E-mail</p>
            <p className="mt-1 font-medium text-forest">{lead.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Origem</p>
            <p className="mt-1 text-forest">{LEAD_SOURCE_LABELS[lead.source]}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Interesse</p>
            <p className="mt-1 text-forest">
              {lead.interest ? getLeadInterestLabel(lead.interest) ?? lead.interest : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Score</p>
            <div className="mt-1">
              <Badge variant={leadScoreBadgeVariant(lead.leadScore)}>
                {LEAD_SCORE_LABELS[lead.leadScore]}
              </Badge>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Interações</p>
            <p className="mt-1 text-forest">{lead.interactionCount}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">ESP</p>
            <p className="mt-1 text-forest">{lead.espProvider ?? "—"}</p>
            {lead.espSyncError && (
              <p className="mt-1 text-xs text-red-600">{lead.espSyncError}</p>
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Cadastro</p>
            <p className="mt-1 text-sm text-muted">
              {new Date(lead.createdAt).toLocaleString("pt-BR")}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Última interação</p>
            <p className="mt-1 text-sm text-muted">
              {lead.lastInteractionAt
                ? new Date(lead.lastInteractionAt).toLocaleString("pt-BR")
                : "—"}
            </p>
          </div>
        </div>

        <section>
          <h2 className="mb-4 font-heading text-lg font-semibold text-forest">
            Sequências de nutrição
          </h2>
          {automationRuns.length === 0 ? (
            <p className="text-sm text-muted">Nenhuma sequência iniciada.</p>
          ) : (
            <AdminTable columns={["Sequência", "Status", "Step", "Próximo step", "Início"]}>
              {automationRuns.map((run) => (
                <tr key={run.id}>
                  <AdminTableCell>{run.sequenceId}</AdminTableCell>
                  <AdminTableCell>{run.status}</AdminTableCell>
                  <AdminTableCell>{run.currentStepIndex + 1}</AdminTableCell>
                  <AdminTableCell>
                    {run.nextStepAt
                      ? new Date(run.nextStepAt).toLocaleString("pt-BR")
                      : "—"}
                  </AdminTableCell>
                  <AdminTableCell>
                    {new Date(run.startedAt).toLocaleString("pt-BR")}
                  </AdminTableCell>
                </tr>
              ))}
            </AdminTable>
          )}
        </section>

        <section>
          <h2 className="mb-4 font-heading text-lg font-semibold text-forest">
            Histórico de interações
          </h2>
          <LeadTimeline interactions={interactions} />
        </section>
      </main>
    </>
  );
}
