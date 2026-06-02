import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProtocolCmsForm } from "@/components/admin/forms/ProtocolCmsForm";
import { requireAdminPermission } from "@/lib/admin/session";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Novo protocolo — CMS" };

export default async function AdminProtocoloNovoPage() {
  const { email, role } = await requireAdminPermission("manage_content");

  return (
    <>
      <AdminHeader
        title="Novo protocolo"
        description="Editor visual — rascunho, preview e publicação"
        email={email}
        role={role}
      />
      <ProtocolCmsForm />
    </>
  );
}
