import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  AdminTable,
  AdminTableCell,
} from "@/components/admin/AdminTable";
import { adminListUsers } from "@/lib/admin/services/users.service";
import { requireAdminPermission } from "@/lib/admin/session";
import { goalLabels } from "@/lib/journey/constants";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Usuários — Admin" };

interface PageProps {
  searchParams: Promise<{ userId?: string; email?: string }>;
}

export default async function AdminUsuariosPage({ searchParams }: PageProps) {
  const { email, role } = await requireAdminPermission("manage_platform_users");
  const params = await searchParams;
  let users = await adminListUsers();

  if (params.userId) {
    users = users.filter((user) => user.id === params.userId);
  } else if (params.email) {
    const needle = params.email.trim().toLowerCase();
    users = users.filter((user) => user.email.toLowerCase().includes(needle));
  }

  return (
    <>
      <AdminHeader
        title="Usuários"
        description={
          params.userId || params.email
            ? "Resultado filtrado a partir do dashboard de assinaturas"
            : "Visualize membros cadastrados na plataforma"
        }
        email={email}
        role={role}
      />
      <main className="flex-1 p-6 lg:p-8">
        <AdminTable columns={["Nome", "E-mail", "Objetivo", "Cadastro"]}>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-sage-muted/20">
              <AdminTableCell>
                <span className="font-medium text-forest">
                  {user.name?.trim() || "—"}
                </span>
              </AdminTableCell>
              <AdminTableCell>{user.email}</AdminTableCell>
              <AdminTableCell>
                {user.goal
                  ? (goalLabels[user.goal] ?? user.goal)
                  : "—"}
              </AdminTableCell>
              <AdminTableCell className="text-muted">
                {new Date(user.created_at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </AdminTableCell>
            </tr>
          ))}
        </AdminTable>
        {users.length === 0 && (
          <p className="mt-6 text-center text-muted">Nenhum usuário cadastrado.</p>
        )}
      </main>
    </>
  );
}
