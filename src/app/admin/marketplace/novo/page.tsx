import { AdminHeader } from "@/components/admin/AdminHeader";
import { MarketplaceProductForm } from "@/components/admin/forms/MarketplaceProductForm";
import { requireAdmin } from "@/lib/admin/session";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Novo produto — Marketplace" };

export default async function AdminMarketplaceNovoPage() {
  const { email } = await requireAdmin();

  return (
    <>
      <AdminHeader
        title="Novo produto marketplace"
        description="Digital, afiliado, próprio ou assinatura"
        email={email}
      />
      <main className="flex-1 p-6 lg:p-8">
        <MarketplaceProductForm />
      </main>
    </>
  );
}
