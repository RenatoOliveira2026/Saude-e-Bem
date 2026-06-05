"use server";

import { requireAdminPermission } from "@/lib/admin/session";
import {
  adminDeleteLibraryItem,
  adminGetLibraryItem,
  adminInsertLibraryItem,
  adminUpdateLibraryItem,
  type LibraryItemAdminInput,
} from "@/lib/admin/services/library-items.service";
import type { AdminActionState } from "@/lib/admin/types";
import { parseSeoFields } from "@/lib/admin/cms/form-utils";
import { slugify } from "@/lib/admin/utils";
import { adminRoutes, routes } from "@/lib/routes";
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

function parseLibraryItemForm(formData: FormData): LibraryItemAdminInput {
  const title = getString(formData, "title");
  const tier = getString(formData, "tier") === "premium" ? "premium" : "free";
  const seo = parseSeoFields(formData);
  return {
    slug: getString(formData, "slug") || slugify(title),
    title,
    description: getString(formData, "description"),
    longDescription: getString(formData, "long_description") || getString(formData, "description"),
    category: getString(formData, "category"),
    categoryLabel: getString(formData, "category_label"),
    itemType: getString(formData, "item_type") || "ebook",
    tier,
    isPremium: tier === "premium" || getCheckbox(formData, "is_premium"),
    estimatedReadTime: getString(formData, "estimated_read_time") || "10 min",
    featured: getCheckbox(formData, "featured"),
    status: (getString(formData, "status") || "draft") as LibraryItemAdminInput["status"],
    seoTitle: seo.seo_title,
    seoDescription: seo.seo_description,
    seoKeywords: seo.seo_keywords,
    ogImageUrl: seo.og_image_url,
  };
}

export async function createLibraryItemAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdminPermission("manage_content");
  try {
    const id = await adminInsertLibraryItem(parseLibraryItemForm(formData));
    revalidatePath(adminRoutes.bibliotecaItens);
    revalidatePath(routes.biblioteca);
    redirect(adminRoutes.bibliotecaItemEditar(id));
  } catch (err) {
    rethrowIfRedirect(err);
    return { error: err instanceof Error ? err.message : "Erro ao criar item." };
  }
}

export async function updateLibraryItemAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdminPermission("manage_content");
  const id = getString(formData, "id");
  if (!id) return { error: "ID inválido." };
  try {
    await adminUpdateLibraryItem(id, parseLibraryItemForm(formData));
    revalidatePath(adminRoutes.bibliotecaItens);
    revalidatePath(routes.biblioteca);
    return { success: "Item atualizado." };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erro ao atualizar." };
  }
}

export async function deleteLibraryItemAction(id: string): Promise<AdminActionState> {
  try {
    await requireAdminPermission("manage_content");
    await adminDeleteLibraryItem(id);
    revalidatePath(adminRoutes.bibliotecaItens);
    revalidatePath(routes.biblioteca);
    return { success: "Item excluído." };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erro ao excluir." };
  }
}

export async function getLibraryItemForEdit(id: string) {
  await requireAdminPermission("manage_content");
  return adminGetLibraryItem(id);
}
