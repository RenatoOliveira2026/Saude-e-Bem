import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProtocolCmsForm } from "@/components/admin/forms/ProtocolCmsForm";
import { adminGetProtocol } from "@/lib/admin/services/protocols.service";
import { requireAdminPermission } from "@/lib/admin/session";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const protocol = await adminGetProtocol(id);
  return {
    title: protocol ? `${protocol.title} — CMS` : "Protocolo — CMS",
  };
}

export default async function AdminProtocoloEditarPage({ params }: PageProps) {
  const { email, role } = await requireAdminPermission("manage_content");
  const { id } = await params;
  const protocol = await adminGetProtocol(id);

  if (!protocol) notFound();

  return (
    <>
      <AdminHeader
        title="Editar protocolo"
        description={protocol.title}
        email={email}
        role={role}
      />
      <ProtocolCmsForm protocol={protocol} />
    </>
  );
}
