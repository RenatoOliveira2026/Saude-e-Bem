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
        <AdminTable
          columns={[
            "Nome",
            "E-mail",
            "CPF",
            "Celular",
            "Cidade/UF",
            "Cadastro completo",
            "Objetivo",
            "Cadastro",
          ]}
        >
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-sage-muted/20">
              <AdminTableCell>
                <span className="font-medium text-forest">
                  {user.full_name?.trim() || user.name?.trim() || "—"}
                </span>
              </AdminTableCell>
              <AdminTableCell>{user.email}</AdminTableCell>
              <AdminTableCell className="font-mono text-xs">
                {user.cpf
                  ? user.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
                  : "—"}
              </AdminTableCell>
              <AdminTableCell>{user.celular ?? "—"}</AdminTableCell>
              <AdminTableCell>
                {user.cidade && user.estado
                  ? `${user.cidade}/${user.estado}`
                  : "—"}
              </AdminTableCell>
              <AdminTableCell>
                {user.billing_complete ? (
                  <span className="text-sage">Sim</span>
                ) : (
                  <span className="text-muted">Não</span>
                )}
              </AdminTableCell>
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
