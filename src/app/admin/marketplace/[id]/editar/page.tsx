import { AdminHeader } from "@/components/admin/AdminHeader";
import { MarketplaceProductForm } from "@/components/admin/forms/MarketplaceProductForm";
import { getMarketplaceProductForEdit } from "@/lib/admin/actions/marketplace.actions";
import { requireAdmin } from "@/lib/admin/session";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Editar produto — Marketplace" };

export default async function AdminMarketplaceEditarPage({ params }: PageProps) {
  const { email } = await requireAdmin();
  const { id } = await params;
  const product = await getMarketplaceProductForEdit(id);
  if (!product) notFound();

  return (
    <>
      <AdminHeader
        title="Editar produto marketplace"
        description={product.title}
        email={email}
      />
      <main className="flex-1 p-6 lg:p-8">
        <MarketplaceProductForm product={product} />
      </main>
    </>
  );
}
