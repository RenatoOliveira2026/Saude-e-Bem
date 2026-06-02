import { AdminHeader } from "@/components/admin/AdminHeader";
import { ArticleCmsForm } from "@/components/admin/forms/ArticleCmsForm";
import { adminGetArticle } from "@/lib/admin/services/articles.service";
import { requireAdminPermission } from "@/lib/admin/session";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await adminGetArticle(id);
  return { title: article ? `${article.title} — CMS` : "Artigo — CMS" };
}

export default async function AdminArtigoEditarPage({ params }: PageProps) {
  const { email, role } = await requireAdminPermission("manage_content");
  const { id } = await params;
  const article = await adminGetArticle(id);

  if (!article) notFound();

  return (
    <>
      <AdminHeader
        title="Editar artigo"
        description={article.title}
        email={email}
        role={role}
      />
      <ArticleCmsForm article={article} />
    </>
  );
}
