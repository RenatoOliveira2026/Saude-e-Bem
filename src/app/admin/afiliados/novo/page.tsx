import { AdminHeader } from "@/components/admin/AdminHeader";
import { AffiliateForm } from "@/components/admin/forms/AffiliateForm";
import { requireAdmin } from "@/lib/admin/session";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Novo afiliado — Admin" };

export default async function NovoAfiliadoPage() {
  const { email } = await requireAdmin();

  return (
    <>
      <AdminHeader title="Novo link de afiliado" email={email} />
      <main className="flex-1 p-6 lg:p-8">
        <AffiliateForm />
      </main>
    </>
  );
}
