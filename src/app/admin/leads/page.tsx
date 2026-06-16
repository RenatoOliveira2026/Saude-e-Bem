import { PipelineBoard } from "@/components/admin/crm/PipelineBoard";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminTable, AdminTableCell } from "@/components/admin/AdminTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  adminListLeads,
  getAdminLeadStats,
} from "@/lib/admin/services/leads.service";
import { getPipelineColumns } from "@/lib/crm/pipeline";
import { requireAdmin } from "@/lib/admin/session";
import {
  configuredEmailProviders,
  isEmailAutomationConfigured,
} from "@/lib/email-automation";
import { LEAD_SOURCE_LABELS } from "@/lib/leads/lead.constants";
import {
  LEAD_SCORE_LABELS,
  LEAD_SCORE_ORDER,
  leadScoreBadgeVariant,
  type LeadScoreId,
} from "@/lib/leads/lead-score";
import type { LeadSource } from "@/lib/leads/lead.types";
import { getLeadInterestLabel } from "@/lib/leads/lead.constants";
import { adminRoutes } from "@/lib/routes";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Leads — Admin" };

const SOURCE_FILTERS: { value: LeadSource | "all"; label: string }[] = [
  { value: "all", label: "Todas origens" },
  { value: "home", label: "Home" },
  { value: "blog", label: "Blog" },
  { value: "artigo", label: "Artigo" },
  { value: "protocolo", label: "Protocolo" },
  { value: "biblioteca", label: "Biblioteca" },
  { value: "lp-hidratacao", label: "LP Hidratação" },
  { value: "lp-emagrecimento", label: "LP Emagrecimento" },
  { value: "lp-sono", label: "LP Sono" },
  { value: "lp-longevidade", label: "LP Longevidade" },
  { value: "assinar", label: "Assinatura" },
];

const SCORE_FILTERS: { value: LeadScoreId | "all"; label: string }[] = [
  { value: "all", label: "Todos scores" },
  ...LEAD_SCORE_ORDER.map((score) => ({
    value: score,
    label: LEAD_SCORE_LABELS[score],
  })),
];

interface AdminLeadsPageProps {
  searchParams: Promise<{ source?: string; score?: string; interest?: string }>;
}

export default async function AdminLeadsPage({ searchParams }: AdminLeadsPageProps) {
  const { email, role } = await requireAdmin();
  const params = await searchParams;

  const sourceFilter =
    params.source && params.source !== "all" && params.source in LEAD_SOURCE_LABELS
      ? (params.source as LeadSource)
      : undefined;
  const scoreFilter =
    params.score && params.score !== "all" && LEAD_SCORE_ORDER.includes(params.score as LeadScoreId)
      ? (params.score as LeadScoreId)
      : undefined;
  const interestFilter = params.interest && params.interest !== "all" ? params.interest : undefined;

  const [stats, leads, pipeline] = await Promise.all([
    getAdminLeadStats(),
    adminListLeads({
      source: sourceFilter,
      score: scoreFilter,
      interest: interestFilter,
      limit: 500,
    }),
    getPipelineColumns(4),
  ]);

  const exportParams = new URLSearchParams();
  if (sourceFilter) exportParams.set("source", sourceFilter);
  if (scoreFilter) exportParams.set("score", scoreFilter);
  if (interestFilter) exportParams.set("interest", interestFilter);
  const exportHref = exportParams.toString()
    ? `${adminRoutes.leadsExport}?${exportParams.toString()}`
    : adminRoutes.leadsExport;

  const automationReady = isEmailAutomationConfigured();
  const providers = configuredEmailProviders();

  return (
    <>
      <AdminHeader
        title="Leads de conversão"
        description="Capturas da tabela newsletter_leads — score, interesse e origem"
        email={email}
        role={role}
        action={
          <div className="flex gap-2">
            <Button href={adminRoutes.conversao} variant="outline" size="sm">
              Dashboard conversão
            </Button>
            <Button href={exportHref} variant="outline" size="sm">
              Exportar CSV
            </Button>
          </div>
        }
      />
      <main className="flex-1 space-y-8 p-6 lg:p-8">
        <div className="flex flex-wrap gap-2">
          {SOURCE_FILTERS.map((filter) => {
            const href =
              filter.value === "all"
                ? adminRoutes.leads
                : `${adminRoutes.leads}?source=${filter.value}${scoreFilter ? `&score=${scoreFilter}` : ""}${interestFilter ? `&interest=${interestFilter}` : ""}`;
            const active = filter.value === "all" ? !sourceFilter : sourceFilter === filter.value;
            return (
              <a
                key={filter.value}
                href={href}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "bg-forest text-off-white"
                    : "border border-border bg-surface text-forest hover:bg-sage-muted/30"
                }`}
              >
                {filter.label}
              </a>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2">
          {SCORE_FILTERS.map((filter) => {
            const href =
              filter.value === "all"
                ? `${adminRoutes.leads}${sourceFilter ? `?source=${sourceFilter}` : ""}${interestFilter ? `${sourceFilter ? "&" : "?"}interest=${interestFilter}` : ""}`
                : `${adminRoutes.leads}?score=${filter.value}${sourceFilter ? `&source=${sourceFilter}` : ""}${interestFilter ? `&interest=${interestFilter}` : ""}`;
            const active = filter.value === "all" ? !scoreFilter : scoreFilter === filter.value;
            return (
              <a
                key={filter.value}
                href={href}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "bg-gold text-forest"
                    : "border border-border bg-surface text-muted hover:bg-gold-muted/30"
                }`}
              >
                {filter.label}
              </a>
            );
          })}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard label="Total de leads" value={stats.total} icon="users" accent="forest" />
          <AdminStatCard label="Últimos 7 dias" value={stats.last7Days} icon="activity" accent="sage" />
          <AdminStatCard label="Quentes + muito quentes" value={stats.byScore.quente + stats.byScore.muito_quente} icon="star" accent="gold" />
          <AdminStatCard label="Últimos 30 dias" value={stats.last30Days} icon="chart" accent="forest" />
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          {LEAD_SCORE_ORDER.map((score) => (
            <div
              key={score}
              className="rounded-xl border border-border bg-surface px-4 py-3 text-center shadow-soft"
            >
              <p className="text-xs uppercase tracking-wide text-muted">{LEAD_SCORE_LABELS[score]}</p>
              <p className="mt-1 font-heading text-2xl text-forest">{stats.byScore[score]}</p>
            </div>
          ))}
        </div>

        <section>
          <h2 className="mb-4 font-heading text-lg font-semibold text-forest">
            Pipeline
          </h2>
          <PipelineBoard columns={pipeline} />
        </section>

        <div className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted shadow-soft">
          <p>
            <span className="font-medium text-forest">Automação de e-mail:</span>{" "}
            {automationReady
              ? `Provedores configurados: ${providers.join(", ")}. Sequências prontas — envio via integração pendente.`
              : "Configure BREVO_API_KEY (provedor principal). HubSpot, RD Station e MailerLite são opções futuras."}
          </p>
          <p className="mt-2 text-xs text-muted-light">
            Inscritos legacy (newsletter_subscribers) continuam em export separado:{" "}
            <a href={adminRoutes.leadsSubscribersExport} className="text-forest underline">
              CSV newsletter
            </a>
          </p>
        </div>

        <AdminTable
          columns={["Nome", "E-mail", "Origem", "Interesse", "Score", "Contexto", "Cadastro"]}
        >
          {leads.map((row) => (
            <tr key={row.id} className="hover:bg-sage-muted/20">
              <AdminTableCell>
                <a
                  href={adminRoutes.leadDetail(row.id)}
                  className="font-medium text-forest hover:underline"
                >
                  {row.name ?? "—"}
                </a>
              </AdminTableCell>
              <AdminTableCell>
                <a
                  href={adminRoutes.leadDetail(row.id)}
                  className="text-forest hover:underline"
                >
                  {row.email}
                </a>
              </AdminTableCell>
              <AdminTableCell>{LEAD_SOURCE_LABELS[row.source] ?? row.source}</AdminTableCell>
              <AdminTableCell>
                {row.interest ? getLeadInterestLabel(row.interest) ?? row.interest : "—"}
              </AdminTableCell>
              <AdminTableCell>
                <Badge variant={leadScoreBadgeVariant(row.leadScore)}>
                  {LEAD_SCORE_LABELS[row.leadScore]}
                </Badge>
              </AdminTableCell>
              <AdminTableCell className="text-xs text-muted">
                {row.contentContext.content_type
                  ? `${row.contentContext.content_type}: ${row.contentContext.content_slug ?? ""}`
                  : row.contentContext.lp_slug
                    ? `lp: ${row.contentContext.lp_slug}`
                    : "—"}
              </AdminTableCell>
              <AdminTableCell className="text-muted">
                {new Date(row.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </AdminTableCell>
            </tr>
          ))}
        </AdminTable>

        {leads.length === 0 && (
          <p className="text-center text-muted">Nenhum lead encontrado com os filtros atuais.</p>
        )}
      </main>
    </>
  );
}
