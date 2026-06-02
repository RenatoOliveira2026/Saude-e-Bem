import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminContentList, type AdminListItem } from "@/components/admin/AdminContentList";
import { adminListAffiliateLinks } from "@/lib/admin/services/affiliates.service";
import { requireAdmin } from "@/lib/admin/session";
import { adminRoutes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Afiliados — Admin" };

export default async function AdminAfiliadosPage() {
  const { email } = await requireAdmin();
  const links = await adminListAffiliateLinks();

  const items: AdminListItem[] = links.map((link) => ({
    id: link.id,
    title: link.title,
    slug: link.slug,
    categoryLabel: link.featured
      ? `${link.category} · Destaque`
      : link.category,
    status: link.active ? "published" : "draft",
    updatedAt: link.createdAt,
  }));

  return (
    <>
      <AdminHeader
        title="Afiliados"
        description="Links exibidos em /recomendados, na home (destacados) e em artigos/protocolos por categoria"
        email={email}
        action={
          <Button href={adminRoutes.afiliadoNovo} variant="primary" size="sm">
            Novo link
          </Button>
        }
      />
      <main className="flex-1 p-6 lg:p-8">
        <AdminContentList
          resource="affiliates"
          items={items}
          columns={["Título", "Categoria", "Status", "Criado", "Ações"]}
          emptyMessage="Nenhum link de afiliado cadastrado."
        />
      </main>
    </>
  );
}
