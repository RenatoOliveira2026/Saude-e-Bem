import { AdminHeader } from "@/components/admin/AdminHeader";
import { ArticleCmsForm } from "@/components/admin/forms/ArticleCmsForm";
import { requireAdminPermission } from "@/lib/admin/session";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Novo artigo — CMS" };

export default async function AdminArtigoNovoPage() {
  const { email, role } = await requireAdminPermission("manage_content");

  return (
    <>
      <AdminHeader
        title="Novo artigo"
        description="Editor visual — salve rascunho, faça preview e publique"
        email={email}
        role={role}
      />
      <ArticleCmsForm />
    </>
  );
}
