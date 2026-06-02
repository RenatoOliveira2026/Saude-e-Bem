import { AdminHeader } from "@/components/admin/AdminHeader";
import { AffiliateForm } from "@/components/admin/forms/AffiliateForm";
import { adminGetAffiliateLink } from "@/lib/admin/services/affiliates.service";
import { requireAdmin } from "@/lib/admin/session";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Editar afiliado — Admin" };

export default async function EditarAfiliadoPage({ params }: PageProps) {
  const { id } = await params;
  const { email } = await requireAdmin();
  const link = await adminGetAffiliateLink(id);
  if (!link) notFound();

  return (
    <>
      <AdminHeader title={`Editar: ${link.title}`} email={email} />
      <main className="flex-1 p-6 lg:p-8">
        <AffiliateForm link={link} />
      </main>
    </>
  );
}
