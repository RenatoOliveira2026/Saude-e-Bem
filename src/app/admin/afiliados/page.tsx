import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminContentList, type AdminListItem } from "@/components/admin/AdminContentList";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminTable, AdminTableCell } from "@/components/admin/AdminTable";
import { adminListAffiliateLinks } from "@/lib/admin/services/affiliates.service";
import { requireAdmin } from "@/lib/admin/session";
import { getAffiliateCategoryLabel } from "@/lib/affiliates/categories";
import { getAffiliateClickReport } from "@/lib/supabase/services/affiliates.clicks";
import { adminRoutes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Afiliados — Admin" };

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
      : `${getAffiliateCategoryLabel(link.category)} · ${report.clicksByProductId[link.id] ?? 0} cliques`,
    status: link.active ? "published" : "draft",
    updatedAt: link.createdAt,
  }));

  return (
    <>
      <AdminHeader
        title="Afiliados"
        description="Central de recomendações — produtos, cliques e parceiros em /recomendados"
        email={email}
        action={
          <Button href={adminRoutes.afiliadoNovo} variant="primary" size="sm">
            Novo produto
          </Button>
        }
      />
      <main className="flex-1 space-y-8 p-6 lg:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
            label="Produtos ativos"
            value={links.filter((link) => link.active).length}
            icon="star"
            accent="forest"
          />
        </div>

        <section className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 font-heading text-xl font-semibold text-forest">
              Produtos mais clicados
            </h2>
            {report.topProducts.length === 0 ? (
              <p className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted shadow-soft">
                Nenhum clique registrado ainda.
              </p>
            ) : (
              <AdminTable columns={["Produto", "Categoria", "Cliques"]}>
                {report.topProducts.map((product) => (
                  <tr key={product.id}>
                    <AdminTableCell>{product.title}</AdminTableCell>
                    <AdminTableCell>
                      {getAffiliateCategoryLabel(product.category)}
                    </AdminTableCell>
                    <AdminTableCell className="font-semibold text-forest">
                      {product.clicks.toLocaleString("pt-BR")}
                    </AdminTableCell>
                  </tr>
                ))}
              </AdminTable>
            )}
          </div>

          <div>
            <h2 className="mb-4 font-heading text-xl font-semibold text-forest">
              Categorias mais acessadas
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
            Catálogo de produtos
          </h2>
          <AdminContentList
            resource="affiliates"
            items={items}
            columns={["Título", "Categoria", "Status", "Criado", "Ações"]}
            emptyMessage="Nenhum produto de afiliado cadastrado."
          />
        </section>
      </main>
    </>
  );
}
