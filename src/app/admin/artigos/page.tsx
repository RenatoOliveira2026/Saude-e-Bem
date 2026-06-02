import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  AdminContentList,
  type AdminListItem,
} from "@/components/admin/AdminContentList";
import { adminListArticles } from "@/lib/admin/services/articles.service";
import { requireAdmin } from "@/lib/admin/session";
import { adminRoutes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Artigos — Admin" };

export default async function AdminArtigosPage() {
  const { email } = await requireAdmin();
  const articles = await adminListArticles();

  const items: AdminListItem[] = articles.map((article) => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    categoryLabel: article.categoryLabel,
    status: article.status,
    updatedAt: article.updatedAt,
  }));

  return (
    <>
      <AdminHeader
        title="Artigos"
        description="Gerencie o conteúdo do blog"
        email={email}
        action={
          <Button href={adminRoutes.artigoNovo} variant="primary" size="sm">
            Novo artigo
          </Button>
        }
      />
      <main className="flex-1 p-6 lg:p-8">
        <AdminContentList
          resource="articles"
          items={items}
          columns={["Título", "Categoria", "Status", "Atualizado", "Ações"]}
          emptyMessage="Nenhum artigo cadastrado."
        />
      </main>
    </>
  );
}
