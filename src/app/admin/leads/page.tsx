import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import {
  AdminTable,
  AdminTableCell,
} from "@/components/admin/AdminTable";
import { Button } from "@/components/ui/Button";
import {
  adminListNewsletterSubscribers,
  getNewsletterLeadStats,
} from "@/lib/admin/services/newsletter.service";
import { requireAdmin } from "@/lib/admin/session";
import { isNewsletterProviderConfigured } from "@/lib/newsletter/providers";
import { NEWSLETTER_SOURCE_LABELS } from "@/lib/newsletter/sources";
import type { NewsletterSource } from "@/lib/newsletter/types";
import { adminRoutes } from "@/lib/routes";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Leads — Admin" };

const SOURCE_FILTERS: { value: NewsletterSource | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "home", label: "Home" },
  { value: "blog", label: "Blog" },
  { value: "biblioteca", label: "Biblioteca" },
  { value: "clube", label: "Clube" },
  { value: "other", label: "Outro" },
];

interface AdminLeadsPageProps {
  searchParams: Promise<{ source?: string }>;
}

export default async function AdminLeadsPage({ searchParams }: AdminLeadsPageProps) {
  const { email, role } = await requireAdmin();
  const params = await searchParams;
  const sourceFilter =
    params.source && params.source !== "all"
      ? (params.source as NewsletterSource)
      : undefined;

  const [stats, subscribers] = await Promise.all([
    getNewsletterLeadStats(),
    adminListNewsletterSubscribers({
      source: sourceFilter,
      limit: 500,
    }),
  ]);

  const providerReady = isNewsletterProviderConfigured();
  const exportHref = sourceFilter
    ? `${adminRoutes.leadsExport}?source=${sourceFilter}`
    : adminRoutes.leadsExport;

  return (
    <>
      <AdminHeader
        title="Leads / Newsletter"
        description="Inscritos capturados no portal público"
        email={email}
        role={role}
      />
      <main className="flex-1 space-y-8 p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {SOURCE_FILTERS.map((filter) => {
              const href =
                filter.value === "all"
                  ? adminRoutes.leads
                  : `${adminRoutes.leads}?source=${filter.value}`;
              const active =
                filter.value === "all"
                  ? !sourceFilter
                  : sourceFilter === filter.value;
              return (
                <a
                  key={filter.value}
                  href={href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
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
          <Button href={exportHref} variant="outline" size="sm">
            Exportar CSV
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard
            label="Total de leads"
            value={stats.total}
            icon="users"
            accent="forest"
          />
          <AdminStatCard
            label="Ativos"
            value={stats.active}
            icon="checklist"
            accent="sage"
          />
          <AdminStatCard
            label="Últimos 7 dias"
            value={stats.last7Days}
            icon="activity"
            accent="gold"
          />
          <AdminStatCard
            label="Últimos 30 dias"
            value={stats.last30Days}
            icon="chart"
            accent="forest"
          />
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted shadow-soft">
          <p>
            <span className="font-medium text-forest">Integração externa:</span>{" "}
            {providerReady
              ? "Provedor configurado — sync automático ao inscrever (quando implementado)."
              : "Não configurada. Defina NEWSLETTER_PROVIDER e API key no servidor para Brevo ou MailerLite."}
          </p>
          {stats.pendingSync > 0 && (
            <p className="mt-2">
              {stats.pendingSync} inscrito(s) aguardando sincronização com provedor.
            </p>
          )}
        </div>

        <AdminTable
          columns={[
            "Nome",
            "E-mail",
            "Origem",
            "Status",
            "Provedor",
            "Cadastro",
          ]}
        >
          {subscribers.map((row) => (
            <tr key={row.id} className="hover:bg-sage-muted/20">
              <AdminTableCell>
                <span className="font-medium text-forest">{row.name}</span>
              </AdminTableCell>
              <AdminTableCell>{row.email}</AdminTableCell>
              <AdminTableCell>
                {NEWSLETTER_SOURCE_LABELS[row.source] ?? row.source}
              </AdminTableCell>
              <AdminTableCell>{row.status}</AdminTableCell>
              <AdminTableCell>
                {row.provider
                  ? `${row.provider}${row.synced_at ? " ✓" : ""}`
                  : "—"}
              </AdminTableCell>
              <AdminTableCell className="text-muted">
                {new Date(row.created_at).toLocaleDateString("pt-BR", {
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

        {subscribers.length === 0 && (
          <p className="text-center text-muted">
            Nenhum lead encontrado
            {sourceFilter
              ? ` para ${NEWSLETTER_SOURCE_LABELS[sourceFilter]}.`
              : "."}
          </p>
        )}
      </main>
    </>
  );
}
