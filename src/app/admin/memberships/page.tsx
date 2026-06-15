import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminMembershipStatusBadge } from "@/components/admin/AdminMembershipStatusBadge";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import {
  AdminTable,
  AdminTableCell,
} from "@/components/admin/AdminTable";
import { Badge } from "@/components/ui/Badge";
import {
  fetchMembershipPlansForAdmin,
  fetchUserMembershipsForAdmin,
  formatMembershipPrice,
  getMembershipAdminStats,
  getMembershipProviderLabel,
} from "@/lib/membership";
import { requireAdminPermission } from "@/lib/admin/session";
import { adminRoutes } from "@/lib/routes";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Assinaturas — Admin",
  robots: { index: false, follow: false },
};

const RECENT_LIMIT = 25;

function userAdminHref(userId: string, userEmail: string | null | undefined) {
  const params = new URLSearchParams({ userId });
  if (userEmail) params.set("email", userEmail);
  return `${adminRoutes.usuarios}?${params.toString()}`;
}

export default async function AdminMembershipsPage() {
  const { email, role } = await requireAdminPermission("manage_platform_users");
  const [plans, members, stats] = await Promise.all([
    fetchMembershipPlansForAdmin(),
    fetchUserMembershipsForAdmin(),
    getMembershipAdminStats(),
  ]);

  const recentSubscriptions = members.slice(0, RECENT_LIMIT);

  return (
    <>
      <AdminHeader
        title="Clube & Assinaturas"
        description="Dashboard de membros, planos premium e assinaturas recentes"
        email={email}
        role={role}
      />
      <main className="flex-1 space-y-8 p-6 lg:p-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AdminStatCard
            label="Total de membros"
            value={stats.totalMembers}
            icon="users"
          />
          <AdminStatCard
            label="Premium ativos"
            value={stats.premiumActiveMembers}
            icon="vitality"
            accent="gold"
          />
          <AdminStatCard
            label="Planos cadastrados"
            value={stats.plansRegistered}
            icon="star"
          />
          <AdminStatCard
            label="Assinaturas ativas"
            value={stats.activeSubscriptions}
            icon="sparkle"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Badge variant="sage">
            Ativas: {stats.activeSubscriptions}
          </Badge>
          <Badge variant="gold">
            Pendentes: {stats.pendingSubscriptions}
          </Badge>
          <Badge variant="default">
            Canceladas: {stats.canceledSubscriptions}
          </Badge>
          <Badge variant="default">
            Expiradas: {stats.expiredSubscriptions}
          </Badge>
        </div>

        <section>
          <h2 className="mb-4 font-heading text-lg text-forest">
            Assinaturas recentes
          </h2>
          <AdminTable
            columns={[
              "Usuário",
              "Plano",
              "Status",
              "Início",
              "Expiração",
              "Provedor",
            ]}
          >
            {recentSubscriptions.map((member) => (
              <tr key={member.id} className="hover:bg-sage-muted/20">
                <AdminTableCell>
                  <Link
                    href={userAdminHref(member.userId, member.userEmail)}
                    className="group block"
                  >
                    <p className="font-medium text-forest group-hover:underline">
                      {member.userName?.trim() || "—"}
                    </p>
                    <p className="text-xs text-muted">
                      {member.userEmail ?? member.userId}
                    </p>
                    <span className="mt-1 inline-block text-xs text-sage opacity-0 transition-opacity group-hover:opacity-100">
                      Ver usuário →
                    </span>
                  </Link>
                </AdminTableCell>
                <AdminTableCell>{member.planName}</AdminTableCell>
                <AdminTableCell>
                  <AdminMembershipStatusBadge status={member.status} />
                </AdminTableCell>
                <AdminTableCell className="text-muted">
                  {new Date(member.startedAt).toLocaleDateString("pt-BR")}
                </AdminTableCell>
                <AdminTableCell className="text-muted">
                  {member.expiresAt
                    ? new Date(member.expiresAt).toLocaleDateString("pt-BR")
                    : "—"}
                </AdminTableCell>
                <AdminTableCell className="text-muted">
                  {getMembershipProviderLabel(member.provider)}
                </AdminTableCell>
              </tr>
            ))}
          </AdminTable>
          {recentSubscriptions.length === 0 && (
            <p className="mt-6 text-center text-muted">
              Nenhuma assinatura registrada ainda.
            </p>
          )}
        </section>

        <section>
          <h2 className="mb-4 font-heading text-lg text-forest">
            Planos cadastrados
          </h2>
          <AdminTable
            columns={["Nome", "Slug", "Preço", "Ciclo", "Status", "Recursos"]}
          >
            {plans.map((plan) => (
              <tr key={plan.id} className="hover:bg-sage-muted/20">
                <AdminTableCell>
                  <span className="font-medium text-forest">{plan.name}</span>
                </AdminTableCell>
                <AdminTableCell className="font-mono text-xs">
                  {plan.slug}
                </AdminTableCell>
                <AdminTableCell>{formatMembershipPrice(plan)}</AdminTableCell>
                <AdminTableCell>{plan.billingCycle}</AdminTableCell>
                <AdminTableCell>
                  {plan.isActive ? (
                    <Badge variant="sage">Ativo</Badge>
                  ) : (
                    <Badge variant="default">Inativo</Badge>
                  )}
                </AdminTableCell>
                <AdminTableCell className="text-muted">
                  {plan.features.length} itens
                </AdminTableCell>
              </tr>
            ))}
          </AdminTable>
        </section>
      </main>
    </>
  );
}
