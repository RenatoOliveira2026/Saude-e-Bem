import { AdminHeader } from "@/components/admin/AdminHeader";
import { adminFutureIntegrations } from "@/lib/admin/types";
import { requireSuperAdmin } from "@/lib/admin/session";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Configurações — Admin" };

export default async function AdminConfiguracoesPage() {
  const { email, role } = await requireSuperAdmin();

  return (
    <>
      <AdminHeader
        title="Configurações globais"
        description="Área reservada ao Super Admin"
        email={email}
        role={role}
      />
      <main className="flex-1 p-6 lg:p-8">
        <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center shadow-soft">
          <p className="font-heading text-lg font-semibold text-forest">
            Em desenvolvimento
          </p>
          <p className="mt-2 text-sm text-muted">
            Configurações globais da plataforma estarão disponíveis nas próximas
            fases.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {adminFutureIntegrations.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-border bg-off-white p-4"
            >
              <h3 className="font-heading text-sm font-semibold text-forest">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
