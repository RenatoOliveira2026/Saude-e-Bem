"use server";

import { requireAdminPermission } from "@/lib/admin/session";
import {
  adminDeleteEbook,
  adminInsertEbook,
  adminUpdateEbook,
} from "@/lib/admin/services/ebooks.service";
import type { AdminActionState } from "@/lib/admin/types";
import {
  blocksToPlainParagraphs,
  blocksToStorage,
  parseBlocksFromFormValue,
} from "@/lib/admin/cms/content-blocks";
import {
  optionalUrl,
  parseSeoFields,
  resolvePublishStatus,
} from "@/lib/admin/cms/form-utils";
import { linesToArray, slugify } from "@/lib/admin/utils";
import type { IconName } from "@/components/icons";
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

function parseEbookForm(formData: FormData) {
  const title = getString(formData, "title");
  const slug = getString(formData, "slug") || slugify(title);
  const blocks = parseBlocksFromFormValue(getString(formData, "content_blocks"));
  const longFromBlocks = blocksToPlainParagraphs(blocks).join("\n\n");

  return {
    slug,
    title,
    description: getString(formData, "description"),
    long_description:
      longFromBlocks || getString(formData, "long_description"),
    content: blocksToStorage(blocks),
    category: getString(formData, "category"),
    category_label: getString(formData, "category_label"),
    icon: getString(formData, "icon") as IconName,
    format: getString(formData, "format") || "PDF",
    pages: Number.parseInt(getString(formData, "pages") || "0", 10),
    highlights: linesToArray(getString(formData, "highlights")),
    is_premium: getCheckbox(formData, "is_premium"),
    downloads: Number.parseInt(getString(formData, "downloads") || "0", 10),
    featured: getCheckbox(formData, "featured"),
    cover_image_url: optionalUrl(formData, "cover_image_url"),
    pdf_url: optionalUrl(formData, "pdf_url"),
    status: resolvePublishStatus(formData),
    ...parseSeoFields(formData),
  };
}

export async function createEbookAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdminPermission("manage_content");
    const input = parseEbookForm(formData);

    if (!input.title || !input.description) {
      return { error: "Título e descrição são obrigatórios." };
    }

    const id = await adminInsertEbook(input);
    revalidatePath(adminRoutes.biblioteca);
    revalidatePath("/biblioteca");
    redirect(adminRoutes.bibliotecaEditar(id));
  } catch (err) {
    rethrowIfRedirect(err);
    return {
      error: err instanceof Error ? err.message : "Erro ao criar material.",
    };
  }
}

export async function updateEbookAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdminPermission("manage_content");
    const id = getString(formData, "id");
    if (!id) return { error: "Material inválido." };

    const input = parseEbookForm(formData);
    await adminUpdateEbook(id, input);

    revalidatePath(adminRoutes.biblioteca);
    revalidatePath("/biblioteca");
    revalidatePath(`/biblioteca/${input.slug}`);

    return { success: "Material atualizado com sucesso." };
  } catch (err) {
    rethrowIfRedirect(err);
    return {
      error: err instanceof Error ? err.message : "Erro ao atualizar material.",
    };
  }
}

export async function deleteEbookAction(id: string): Promise<AdminActionState> {
  try {
    await requireAdminPermission("manage_content");
    await adminDeleteEbook(id);
    revalidatePath(adminRoutes.biblioteca);
    revalidatePath("/biblioteca");
    return { success: "Material excluído." };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Erro ao excluir material.",
    };
  }
}

export async function publishEbookAction(id: string): Promise<AdminActionState> {
  try {
    await requireAdminPermission("manage_content");
    await adminUpdateEbook(id, { status: "published" });
    revalidatePath(adminRoutes.biblioteca);
    revalidatePath("/biblioteca");
    return { success: "Material publicado." };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Erro ao publicar material.",
    };
  }
}

export async function publishEbookFormAction(formData: FormData): Promise<void> {
  const id = formData.get("id")?.toString();
  if (id) await publishEbookAction(id);
}
