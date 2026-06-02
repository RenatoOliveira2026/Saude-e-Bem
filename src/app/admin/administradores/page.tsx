import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminTable, AdminTableCell } from "@/components/admin/AdminTable";
import { AdminRoleBadge } from "@/components/admin/AdminRoleBadge";
import { ADMIN_ROLE_DESCRIPTIONS } from "@/lib/admin/roles";
import { adminListTeamMembers } from "@/lib/admin/services/admins.service";
import { requireSuperAdmin } from "@/lib/admin/session";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Administradores — Admin" };

export default async function AdminAdministradoresPage() {
  const { email, role } = await requireSuperAdmin();
  const members = await adminListTeamMembers();

  return (
    <>
      <AdminHeader
        title="Administradores"
        description="Gerencie a equipe com acesso ao painel (apenas Super Admin)"
        email={email}
        role={role}
      />
      <main className="flex-1 space-y-6 p-6 lg:p-8">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <h2 className="font-heading text-sm font-semibold text-forest">
            Perfis
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <strong className="text-forest">Super Admin</strong> —{" "}
              {ADMIN_ROLE_DESCRIPTIONS.super_admin}
            </li>
            <li>
              <strong className="text-forest">Admin</strong> —{" "}
              {ADMIN_ROLE_DESCRIPTIONS.admin}
            </li>
            <li>
              <strong className="text-forest">Usuário</strong> — acesso normal à
              plataforma (sem registro em administradores).
            </li>
          </ul>
        </div>

        <AdminTable columns={["E-mail", "Perfil", "Desde"]}>
          {members.map((member) => (
            <tr key={member.id} className="hover:bg-sage-muted/20">
              <AdminTableCell>{member.email}</AdminTableCell>
              <AdminTableCell>
                <AdminRoleBadge role={member.role} />
              </AdminTableCell>
              <AdminTableCell className="text-muted">
                {new Date(member.created_at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </AdminTableCell>
            </tr>
          ))}
        </AdminTable>

        {members.length === 0 && (
          <p className="text-center text-muted">
            Nenhum administrador cadastrado. Execute a migration 006 ou o SQL de
            bootstrap.
          </p>
        )}

        <p className="text-xs text-muted-light">
          Para promover um admin, insira em{" "}
          <code className="text-forest">public.admin_users</code> com{" "}
          <code className="text-forest">role = &apos;admin&apos;</code> ou{" "}
          <code className="text-forest">&apos;super_admin&apos;</code>.
        </p>
      </main>
    </>
  );
}
