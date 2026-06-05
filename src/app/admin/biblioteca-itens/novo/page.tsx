import { AdminHeader } from "@/components/admin/AdminHeader";
import { LibraryItemForm } from "@/components/admin/forms/LibraryItemForm";
import { requireAdmin } from "@/lib/admin/session";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Novo item — Biblioteca" };

export default async function AdminBibliotecaItemNovoPage() {
  const { email } = await requireAdmin();

  return (
    <>
      <AdminHeader
        title="Novo item da biblioteca"
        description="E-book gratuito ou premium"
        email={email}
      />
      <main className="flex-1 p-6 lg:p-8">
        <LibraryItemForm />
      </main>
    </>
  );
}
