import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminTable, AdminTableCell } from "@/components/admin/AdminTable";
import { Button } from "@/components/ui/Button";
import {
  adminListNewsletterSubscribers,
  getNewsletterLeadStats,
} from "@/lib/admin/services/newsletter.service";
import { requireAdmin } from "@/lib/admin/session";
import {
  isEmailProviderConfigured,
  getEmailMarketingProvider,
} from "@/lib/email";
import {
  NEWSLETTER_SOURCE_LABELS,
  NEWSLETTER_SOURCES,
  isNewsletterSource,
} from "@/lib/newsletter/sources";
import type { NewsletterSource } from "@/lib/newsletter/types";
import { adminRoutes } from "@/lib/routes";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Newsletter — Admin" };

interface AdminNewsletterPageProps {
  searchParams: Promise<{ source?: string }>;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default async function AdminNewsletterPage({
  searchParams,
}: AdminNewsletterPageProps) {
  const { email, role } = await requireAdmin();
  const params = await searchParams;

  const sourceFilter =
    params.source && params.source !== "all" && isNewsletterSource(params.source)
      ? (params.source as NewsletterSource)
      : undefined;

  const [stats, subscribers] = await Promise.all([
    getNewsletterLeadStats(),
    adminListNewsletterSubscribers({ source: sourceFilter, limit: 500 }),
  ]);

  const emailProvider = getEmailMarketingProvider();
  const exportHref = sourceFilter
    ? `${adminRoutes.leadsSubscribersExport}?source=${sourceFilter}`
    : adminRoutes.leadsSubscribersExport;

  return (
    <>
      <AdminHeader
        title="Newsletter"
        description="Inscritos da newsletter global e lead magnet — origem, status e exportação"
        email={email}
        role={role}
        action={
          <Button href={exportHref} variant="outline" size="sm">
            Exportar CSV
          </Button>
        }
      />
      <main className="flex-1 space-y-8 p-6 lg:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard
            label="Total de inscritos"
            value={stats.total}
            icon="users"
            accent="forest"
          />
          <AdminStatCard
            label="Ativos"
            value={stats.active}
            icon="activity"
            accent="sage"
          />
          <AdminStatCard
            label="Últimos 7 dias"
            value={stats.last7Days}
            icon="chart"
            accent="gold"
          />
          <AdminStatCard
            label="Últimos 30 dias"
            value={stats.last30Days}
            icon="chart"
            accent="sage"
          />
        </div>

        <section className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted shadow-soft">
          <p>
            <span className="font-medium text-forest">E-mail marketing:</span>{" "}
            {emailProvider && isEmailProviderConfigured()
              ? `Provedor ${emailProvider.id} configurado (sync automático)`
              : "Configure BREVO_API_KEY (provedor principal). MailerLite e ConvertKit são opções futuras."}
          </p>
          {stats.pendingSync > 0 && (
            <p className="mt-2 text-xs text-muted-light">
              {stats.pendingSync} contato(s) aguardando sync com provedor externo.
            </p>
          )}
        </section>

        <section>
          <h2 className="mb-4 font-heading text-xl font-semibold text-forest">
            Inscritos por origem
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {NEWSLETTER_SOURCES.map((source) => (
              <div
                key={source}
                className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-sm shadow-soft"
              >
                <span className="text-muted">{NEWSLETTER_SOURCE_LABELS[source]}</span>
                <span className="font-heading font-semibold text-forest">
                  {stats.bySource[source].toLocaleString("pt-BR")}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-heading text-xl font-semibold text-forest">
              Inscrições recentes
            </h2>
            <div className="flex flex-wrap gap-2">
              <FilterLink href={adminRoutes.newsletter} active={!sourceFilter}>
                Todas
              </FilterLink>
              {NEWSLETTER_SOURCES.map((source) => (
                <FilterLink
                  key={source}
                  href={`${adminRoutes.newsletter}?source=${source}`}
                  active={sourceFilter === source}
                >
                  {NEWSLETTER_SOURCE_LABELS[source]}
                </FilterLink>
              ))}
            </div>
          </div>

          {subscribers.length === 0 ? (
            <p className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-muted shadow-soft">
              Nenhum inscrito encontrado
              {sourceFilter ? ` para ${NEWSLETTER_SOURCE_LABELS[sourceFilter]}` : ""}.
            </p>
          ) : (
            <AdminTable
              columns={["Nome", "E-mail", "WhatsApp", "Origem", "Data", "Status"]}
            >
              {subscribers.map((row) => (
                <tr key={row.id}>
                  <AdminTableCell>{row.name}</AdminTableCell>
                  <AdminTableCell>{row.email}</AdminTableCell>
                  <AdminTableCell className="text-muted">
                    {row.phone ?? "—"}
                  </AdminTableCell>
                  <AdminTableCell>
                    {NEWSLETTER_SOURCE_LABELS[row.source]}
                  </AdminTableCell>
                  <AdminTableCell className="whitespace-nowrap text-muted">
                    {formatDate(row.created_at)}
                  </AdminTableCell>
                  <AdminTableCell>
                    <SubscriberStatusBadge status={row.status} />
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

function SubscriberStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-sage/15 text-forest",
    unsubscribed: "bg-muted/20 text-muted",
    bounced: "bg-gold/20 text-forest",
  };
  const labels: Record<string, string> = {
    active: "Ativo",
    unsubscribed: "Cancelado",
    bounced: "Bounce",
  };
  const key = status in labels ? status : "active";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[key]}`}
    >
      {labels[key]}
    </span>
  );
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "bg-forest text-off-white"
          : "border border-border bg-surface text-muted hover:text-forest"
      }`}
    >
      {children}
    </Link>
  );
}
