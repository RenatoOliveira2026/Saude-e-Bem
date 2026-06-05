import { AdminHeader } from "@/components/admin/AdminHeader";
import { LibraryItemForm } from "@/components/admin/forms/LibraryItemForm";
import { getLibraryItemForEdit } from "@/lib/admin/actions/library-items.actions";
import { requireAdmin } from "@/lib/admin/session";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Editar item — Biblioteca" };

export default async function AdminBibliotecaItemEditarPage({ params }: PageProps) {
  const { email } = await requireAdmin();
  const { id } = await params;
  const item = await getLibraryItemForEdit(id);
  if (!item) notFound();

  return (
    <>
      <AdminHeader
        title="Editar item da biblioteca"
        description={item.title}
        email={email}
      />
      <main className="flex-1 p-6 lg:p-8">
        <LibraryItemForm item={item} />
      </main>
    </>
  );
}
