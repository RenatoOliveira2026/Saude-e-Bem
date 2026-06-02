import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  AdminContentList,
  type AdminListItem,
} from "@/components/admin/AdminContentList";
import { adminListProtocols } from "@/lib/admin/services/protocols.service";
import { requireAdmin } from "@/lib/admin/session";
import { adminRoutes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Protocolos — Admin" };

export default async function AdminProtocolosPage() {
  const { email } = await requireAdmin();
  const protocols = await adminListProtocols();

  const items: AdminListItem[] = protocols.map((protocol) => ({
    id: protocol.id,
    title: protocol.title,
    slug: protocol.slug,
    categoryLabel: protocol.categoryLabel,
    status: protocol.status,
    updatedAt: protocol.updatedAt,
  }));

  return (
    <>
      <AdminHeader
        title="Protocolos"
        description="Gerencie rotinas e protocolos de saúde"
        email={email}
        action={
          <Button href={adminRoutes.protocoloNovo} variant="primary" size="sm">
            Novo protocolo
          </Button>
        }
      />
      <main className="flex-1 p-6 lg:p-8">
        <AdminContentList
          resource="protocols"
          items={items}
          columns={["Título", "Categoria", "Status", "Atualizado", "Ações"]}
          emptyMessage="Nenhum protocolo cadastrado."
        />
      </main>
    </>
  );
}
