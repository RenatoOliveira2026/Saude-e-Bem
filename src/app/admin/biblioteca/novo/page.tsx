import { AdminHeader } from "@/components/admin/AdminHeader";
import { EbookCmsForm } from "@/components/admin/forms/EbookCmsForm";
import { requireAdminPermission } from "@/lib/admin/session";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Novo material — CMS" };

export default async function AdminBibliotecaNovoPage() {
  const { email, role } = await requireAdminPermission("manage_content");

  return (
    <>
      <AdminHeader
        title="Novo material"
        description="Editor visual com upload de capa e PDF"
        email={email}
        role={role}
      />
      <EbookCmsForm />
    </>
  );
}
