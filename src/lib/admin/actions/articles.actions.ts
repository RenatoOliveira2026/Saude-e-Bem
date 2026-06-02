"use server";

import { requireAdminPermission } from "@/lib/admin/session";
import {
  adminDeleteArticle,
  adminInsertArticle,
  adminUpdateArticle,
  type ArticleAdminInput,
} from "@/lib/admin/services/articles.service";
import type { AdminActionState } from "@/lib/admin/types";
import {
  blocksToStorage,
  parseBlocksFromFormValue,
} from "@/lib/admin/cms/content-blocks";
import {
  optionalUrl,
  parseSeoFields,
  resolvePublishStatus,
} from "@/lib/admin/cms/form-utils";
import { slugify } from "@/lib/admin/utils";
import { blogCategoryLabels } from "@/lib/data/types";
import type { BlogCategory } from "@/lib/data/types";
import { adminRoutes } from "@/lib/routes";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

function rethrowIfRedirect(err: unknown): void {
  if (isRedirectError(err)) throw err;
}

function getString(formData: FormData, key: string): string {
  return formData.get(key)?.toString().trim() ?? "";
}

function getCheckbox(formData: FormData, key: string): boolean {
  return formData.get(key) === "on";
}

function parseArticleForm(formData: FormData) {
  const title = getString(formData, "title");
  const slug = getString(formData, "slug") || slugify(title);
  const category = getString(formData, "category") as BlogCategory;
  const categoryLabel =
    blogCategoryLabels[category] ?? getString(formData, "category_label");

  const blocks = parseBlocksFromFormValue(getString(formData, "content_blocks"));

  return {
    slug,
    title,
    excerpt: getString(formData, "excerpt"),
    content: blocksToStorage(blocks) as unknown as ArticleAdminInput["content"],
    category,
    category_label: categoryLabel,
    author: getString(formData, "author"),
    author_role: getString(formData, "author_role"),
    read_time: getString(formData, "read_time"),
    published_at: getString(formData, "published_at"),
    featured: getCheckbox(formData, "featured"),
    cover_image_url: optionalUrl(formData, "cover_image_url"),
    status: resolvePublishStatus(formData),
    ...parseSeoFields(formData),
  };
}

export async function createArticleAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdminPermission("manage_content");
    const input = parseArticleForm(formData);

    if (!input.title || !input.excerpt) {
      return { error: "Título e resumo são obrigatórios." };
    }

    const id = await adminInsertArticle(input);
    revalidatePath(adminRoutes.artigos);
    revalidatePath("/blog");
    redirect(adminRoutes.artigoEditar(id));
  } catch (err) {
    rethrowIfRedirect(err);
    return {
      error: err instanceof Error ? err.message : "Erro ao criar artigo.",
    };
  }
}

export async function updateArticleAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdminPermission("manage_content");
    const id = getString(formData, "id");
    if (!id) return { error: "Artigo inválido." };

    const input = parseArticleForm(formData);
    await adminUpdateArticle(id, input);

    revalidatePath(adminRoutes.artigos);
    revalidatePath("/blog");
    revalidatePath(`/blog/${input.slug}`);

    return { success: "Artigo atualizado com sucesso." };
  } catch (err) {
    rethrowIfRedirect(err);
    return {
      error: err instanceof Error ? err.message : "Erro ao atualizar artigo.",
    };
  }
}

export async function deleteArticleAction(id: string): Promise<AdminActionState> {
  try {
    await requireAdminPermission("manage_content");
    await adminDeleteArticle(id);
    revalidatePath(adminRoutes.artigos);
    revalidatePath("/blog");
    return { success: "Artigo excluído." };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Erro ao excluir artigo.",
    };
  }
}

export async function publishArticleAction(id: string): Promise<AdminActionState> {
  try {
    await requireAdminPermission("manage_content");
    await adminUpdateArticle(id, { status: "published" });
    revalidatePath(adminRoutes.artigos);
    revalidatePath("/blog");
    return { success: "Artigo publicado." };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Erro ao publicar artigo.",
    };
  }
}

export async function publishArticleFormAction(
  formData: FormData,
): Promise<void> {
  const id = formData.get("id")?.toString();
  if (id) await publishArticleAction(id);
}
