import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminContentList, type AdminListItem } from "@/components/admin/AdminContentList";
import { adminListLibraryItems } from "@/lib/admin/services/library-items.service";
import { requireAdmin } from "@/lib/admin/session";
import { adminRoutes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Biblioteca digital — Admin" };

export default async function AdminBibliotecaItensPage() {
  const { email } = await requireAdmin();
  const items = await adminListLibraryItems().catch(() => []);

  const listItems: AdminListItem[] = items.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    categoryLabel: `${item.category_label} · ${item.tier === "premium" ? "Premium" : "Gratuito"}`,
    status: item.status,
    updatedAt: item.updated_at,
  }));

  return (
    <>
      <AdminHeader
        title="Biblioteca digital"
        description="E-books gratuitos e premium — exibidos em /biblioteca"
        email={email}
        action={
          <Button href={adminRoutes.bibliotecaItemNovo} variant="primary" size="sm">
            Novo item
          </Button>
        }
      />
      <main className="flex-1 p-6 lg:p-8">
        <AdminContentList
          resource="library-items"
          items={listItems}
          columns={["Título", "Categoria", "Status", "Atualizado", "Ações"]}
          emptyMessage="Nenhum item na biblioteca digital. Execute a migration 025 ou crie manualmente."
        />
      </main>
    </>
  );
}
