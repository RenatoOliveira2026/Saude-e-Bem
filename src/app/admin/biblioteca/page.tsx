import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  AdminContentList,
  type AdminListItem,
} from "@/components/admin/AdminContentList";
import { adminListEbooks } from "@/lib/admin/services/ebooks.service";
import { requireAdmin } from "@/lib/admin/session";
import { adminRoutes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Biblioteca — Admin" };

export default async function AdminBibliotecaPage() {
  const { email } = await requireAdmin();
  const ebooks = await adminListEbooks();

  const items: AdminListItem[] = ebooks.map((ebook) => ({
    id: ebook.id,
    title: ebook.title,
    slug: ebook.slug,
    categoryLabel: `${ebook.categoryLabel} · ${ebook.format}`,
    status: ebook.status,
    updatedAt: ebook.updatedAt,
  }));

  return (
    <>
      <AdminHeader
        title="Biblioteca"
        description="Gerencie ebooks e materiais para download"
        email={email}
        action={
          <Button href={adminRoutes.bibliotecaNovo} variant="primary" size="sm">
            Novo material
          </Button>
        }
      />
      <main className="flex-1 p-6 lg:p-8">
        <AdminContentList
          resource="ebooks"
          items={items}
          columns={["Título", "Categoria", "Status", "Atualizado", "Ações"]}
          emptyMessage="Nenhum material cadastrado."
        />
      </main>
    </>
  );
}
