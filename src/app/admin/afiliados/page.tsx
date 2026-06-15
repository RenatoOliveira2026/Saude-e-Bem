import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminContentList, type AdminListItem } from "@/components/admin/AdminContentList";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminTable, AdminTableCell } from "@/components/admin/AdminTable";
import { adminListAffiliateLinks } from "@/lib/admin/services/affiliates.service";
import { requireAdmin } from "@/lib/admin/session";
import { AFFILIATE_PLATFORMS } from "@/lib/affiliates/types";
import { getAffiliateCategoryLabel } from "@/lib/affiliates/categories";
import { getAffiliateClickReport } from "@/lib/supabase/services/affiliates.clicks";
import { adminRoutes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Marketplace — Admin" };

function platformLabel(value: string): string {
  const match = AFFILIATE_PLATFORMS.find((item) => item.value === value)?.label;
  if (match) return match;
  return value || "—";
}

export default async function AdminAfiliadosPage() {
  const { email } = await requireAdmin();
  const [links, report] = await Promise.all([
    adminListAffiliateLinks(),
    getAffiliateClickReport(30),
  ]);

  const items: AdminListItem[] = links.map((link) => ({
    id: link.id,
    title: link.title,
    slug: link.slug,
    categoryLabel: link.featured
      ? `${getAffiliateCategoryLabel(link.category)} · Destaque · ${report.clicksByProductId[link.id] ?? 0} cliques`
      : `${getAffiliateCategoryLabel(link.category)} · ${platformLabel(link.affiliatePlatform)} · ${report.clicksByProductId[link.id] ?? 0} cliques`,
    status: link.active ? "published" : "draft",
    updatedAt: link.createdAt,
  }));

  return (
    <>
      <AdminHeader
        title="Marketplace de Ofertas"
        description="Cadastro de ofertas reais, cliques, conversão estimada e ranking em /recomendados"
        email={email}
        action={
          <Button href={adminRoutes.afiliadoNovo} variant="primary" size="sm">
            Nova oferta
          </Button>
        }
      />
      <main className="flex-1 space-y-8 p-6 lg:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <AdminStatCard
            label="Total de cliques"
            value={report.totalClicks}
            icon="activity"
            accent="forest"
          />
          <AdminStatCard
            label="Cliques (7 dias)"
            value={report.clicksLast7Days}
            icon="chart"
            accent="sage"
          />
          <AdminStatCard
            label="Cliques (30 dias)"
            value={report.clicksLast30Days}
            icon="chart"
            accent="gold"
          />
          <AdminStatCard
            label="Conv. estimada"
            value={Math.round(report.estimatedConversions * 10) / 10}
            icon="star"
            accent="forest"
          />
          <AdminStatCard
            label="Produtos ativos"
            value={links.filter((link) => link.active).length}
            icon="star"
            accent="sage"
          />
        </div>

        <section className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted shadow-soft">
          <p>
            <span className="font-medium text-forest">Taxa de conversão estimada:</span>{" "}
            {report.estimatedConversionRate} com base em cliques dos últimos 30 dias (modelo
            placeholder até integração com parceiros).
          </p>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 font-heading text-xl font-semibold text-forest">
              Ranking de produtos
            </h2>
            {report.topProducts.length === 0 ? (
              <p className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted shadow-soft">
                Nenhum clique registrado ainda.
              </p>
            ) : (
              <AdminTable
                columns={["Produto", "Categoria", "Cliques", "Conv. est."]}
              >
                {report.topProducts.map((product) => (
                  <tr key={product.id}>
                    <AdminTableCell>{product.title}</AdminTableCell>
                    <AdminTableCell>
                      {getAffiliateCategoryLabel(product.category)}
                    </AdminTableCell>
                    <AdminTableCell className="font-semibold text-forest">
                      {product.clicks.toLocaleString("pt-BR")}
                    </AdminTableCell>
                    <AdminTableCell>
                      {product.estimatedConversions.toLocaleString("pt-BR", {
                        maximumFractionDigits: 1,
                      })}{" "}
                      <span className="text-muted">({product.estimatedConversionRate})</span>
                    </AdminTableCell>
                  </tr>
                ))}
              </AdminTable>
            )}
          </div>

          <div>
            <h2 className="mb-4 font-heading text-xl font-semibold text-forest">
              Top categorias
            </h2>
            {report.topCategories.length === 0 ? (
              <p className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted shadow-soft">
                Sem dados de categoria no período.
              </p>
            ) : (
              <AdminTable columns={["Categoria", "Cliques"]}>
                {report.topCategories.map((row) => (
                  <tr key={row.category}>
                    <AdminTableCell>
                      {getAffiliateCategoryLabel(row.category)}
                    </AdminTableCell>
                    <AdminTableCell className="font-semibold text-forest">
                      {row.clicks.toLocaleString("pt-BR")}
                    </AdminTableCell>
                  </tr>
                ))}
              </AdminTable>
            )}
          </div>
        </section>

        {report.clicksByDay.length > 0 && (
          <section>
            <h2 className="mb-4 font-heading text-xl font-semibold text-forest">
              Cliques por período (últimos 14 dias)
            </h2>
            <AdminTable columns={["Data", "Cliques"]}>
              {report.clicksByDay.map((row) => (
                <tr key={row.date}>
                  <AdminTableCell>
                    {new Date(`${row.date}T12:00:00`).toLocaleDateString("pt-BR")}
                  </AdminTableCell>
                  <AdminTableCell className="font-semibold text-forest">
                    {row.clicks.toLocaleString("pt-BR")}
                  </AdminTableCell>
                </tr>
              ))}
            </AdminTable>
          </section>
        )}

        <section>
          <h2 className="mb-4 font-heading text-xl font-semibold text-forest">
            Catálogo de ofertas
          </h2>
          <AdminContentList
            resource="affiliates"
            items={items}
            columns={["Título", "Categoria", "Status", "Criado", "Ações"]}
            emptyMessage="Nenhuma oferta cadastrada."
          />
        </section>
      </main>
    </>
  );
}
