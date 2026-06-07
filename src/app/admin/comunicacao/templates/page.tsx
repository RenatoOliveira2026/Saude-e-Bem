import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminTable, AdminTableCell } from "@/components/admin/AdminTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { listWhatsAppTemplates } from "@/lib/admin/services/whatsapp.service";
import { requireAdmin } from "@/lib/admin/session";
import { adminRoutes } from "@/lib/routes";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Templates WhatsApp — Admin" };

export default async function AdminComunicacaoTemplatesPage() {
  const { email, role } = await requireAdmin();
  const templates = await listWhatsAppTemplates();

  return (
    <>
      <AdminHeader
        title="Templates WhatsApp"
        description="Espelho local dos templates aprovados no Meta Business Manager"
        email={email}
        role={role}
        action={
          <Button href={adminRoutes.comunicacao} variant="outline" size="sm">
            Voltar
          </Button>
        }
      />
      <main className="flex-1 p-6 lg:p-8">
        <p className="mb-6 max-w-3xl text-sm text-muted">
          Crie templates com os mesmos nomes (<code className="text-xs">meta_name</code>)
          no Meta Business Manager antes de enviar em produção. Status{" "}
          <Badge variant="gold">pending</Badge> aguarda aprovação Meta.
        </p>
        <AdminTable
          columns={["Chave", "Nome Meta", "Categoria", "Status", "Preview"]}
        >
          {templates.map((tpl) => (
            <tr key={tpl.id}>
              <AdminTableCell>{tpl.templateKey}</AdminTableCell>
              <AdminTableCell>{tpl.metaName}</AdminTableCell>
              <AdminTableCell>{tpl.category}</AdminTableCell>
              <AdminTableCell>
                <Badge variant={tpl.status === "approved" ? "sage" : "gold"}>
                  {tpl.status}
                </Badge>
              </AdminTableCell>
              <AdminTableCell className="max-w-xs truncate">
                {tpl.bodyPreview ?? "—"}
              </AdminTableCell>
            </tr>
          ))}
        </AdminTable>
      </main>
    </>
  );
}
