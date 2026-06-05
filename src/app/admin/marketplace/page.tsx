import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminContentList, type AdminListItem } from "@/components/admin/AdminContentList";
import { adminListMarketplaceProducts } from "@/lib/admin/services/marketplace.service";
import { requireAdmin } from "@/lib/admin/session";
import { adminRoutes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Marketplace — Admin" };

export default async function AdminMarketplacePage() {
  const { email } = await requireAdmin();
  const products = await adminListMarketplaceProducts().catch(() => []);

  const items: AdminListItem[] = products.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    categoryLabel: `${p.category_label} · ${p.fulfillment}`,
    status: p.status,
    updatedAt: p.updated_at,
  }));

  return (
    <>
      <AdminHeader
        title="Marketplace"
        description="Produtos digitais, afiliados e próprios — exibidos em /marketplace"
        email={email}
        action={
          <Button href={adminRoutes.marketplaceNovo} variant="primary" size="sm">
            Novo produto
          </Button>
        }
      />
      <main className="flex-1 p-6 lg:p-8">
        <AdminContentList
          resource="marketplace"
          items={items}
          columns={["Título", "Categoria", "Status", "Atualizado", "Ações"]}
          emptyMessage="Nenhum produto no marketplace. Execute a migration 025 ou crie manualmente."
        />
      </main>
    </>
  );
}
