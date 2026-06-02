import { AdminHeader } from "@/components/admin/AdminHeader";
import { EbookCmsForm } from "@/components/admin/forms/EbookCmsForm";
import { adminGetEbook } from "@/lib/admin/services/ebooks.service";
import { requireAdminPermission } from "@/lib/admin/session";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const ebook = await adminGetEbook(id);
  return { title: ebook ? `${ebook.title} — CMS` : "Material — CMS" };
}

export default async function AdminBibliotecaEditarPage({ params }: PageProps) {
  const { email, role } = await requireAdminPermission("manage_content");
  const { id } = await params;
  const ebook = await adminGetEbook(id);

  if (!ebook) notFound();

  return (
    <>
      <AdminHeader
        title="Editar material"
        description={ebook.title}
        email={email}
        role={role}
      />
      <EbookCmsForm ebook={ebook} />
    </>
  );
}
