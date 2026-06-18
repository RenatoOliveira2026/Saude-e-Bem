"use server";

import { requireAdminPermission } from "@/lib/admin/session";
import {
  adminDeleteProtocol,
  adminInsertProtocol,
  adminUpdateProtocol,
  type ProtocolAdminInput,
} from "@/lib/admin/services/protocols.service";
import type { AdminActionState } from "@/lib/admin/types";
import {
  blocksToStorage,
  blocksToPlainParagraphs,
  parseBlocksFromFormValue,
} from "@/lib/admin/cms/content-blocks";
import {
  optionalUrl,
  parseSeoFields,
  resolvePublishStatus,
} from "@/lib/admin/cms/form-utils";
import { linesToArray, linesToSteps, slugify } from "@/lib/admin/utils";
import { categoryLabels } from "@/lib/data/types";
import type { ContentCategory, ContentLevel } from "@/lib/data/types";
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

function parseProtocolForm(formData: FormData) {
  const title = getString(formData, "title");
  const slug = getString(formData, "slug") || slugify(title);
  const category = getString(formData, "category") as ContentCategory;
  const categoryLabel = categoryLabels[category] ?? getString(formData, "category_label");
  const tag = getString(formData, "tag");
  const blocks = parseBlocksFromFormValue(getString(formData, "content_blocks"));
  const longFromBlocks = blocksToPlainParagraphs(blocks).join("\n\n");

  return {
    slug,
    title,
    description: getString(formData, "description"),
    objective: getString(formData, "objective"),
    long_description:
      longFromBlocks || getString(formData, "long_description"),
    content: blocksToStorage(blocks) as unknown as ProtocolAdminInput["content"],
    category,
    category_label: categoryLabel,
    duration: getString(formData, "duration"),
    level: getString(formData, "level") as ContentLevel,
    benefits: linesToArray(getString(formData, "benefits")),
    steps: linesToSteps(getString(formData, "steps")),
    is_premium: getCheckbox(formData, "is_premium"),
    featured: getCheckbox(formData, "featured"),
    tag: tag || null,
    participants: Number.parseInt(getString(formData, "participants") || "0", 10),
    cover_image_url: optionalUrl(formData, "cover_image_url"),
    status: resolvePublishStatus(formData),
    ...parseSeoFields(formData),
  };
}

export async function createProtocolAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdminPermission("manage_content");
    const input = parseProtocolForm(formData);

    if (!input.title || !input.description) {
      return { error: "Título e descrição são obrigatórios." };
    }

    const id = await adminInsertProtocol(input);
    revalidatePath(adminRoutes.protocolos);
    revalidatePath("/protocolos");
    redirect(adminRoutes.protocoloEditar(id));
  } catch (err) {
    rethrowIfRedirect(err);
    return {
      error: err instanceof Error ? err.message : "Erro ao criar protocolo.",
    };
  }
}

export async function updateProtocolAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdminPermission("manage_content");
    const id = getString(formData, "id");
    if (!id) return { error: "Protocolo inválido." };

    const input = parseProtocolForm(formData);
    await adminUpdateProtocol(id, input);

    revalidatePath(adminRoutes.protocolos);
    revalidatePath("/protocolos");
    revalidatePath(`/protocolos/${input.slug}`);

    return { success: "Protocolo atualizado com sucesso." };
  } catch (err) {
    rethrowIfRedirect(err);
    return {
      error: err instanceof Error ? err.message : "Erro ao atualizar protocolo.",
    };
  }
}

export async function deleteProtocolAction(id: string): Promise<AdminActionState> {
  try {
    await requireAdminPermission("manage_content");
    await adminDeleteProtocol(id);
    revalidatePath(adminRoutes.protocolos);
    revalidatePath("/protocolos");
    return { success: "Protocolo excluído." };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Erro ao excluir protocolo.",
    };
  }
}

export async function publishProtocolAction(id: string): Promise<AdminActionState> {
  try {
    await requireAdminPermission("manage_content");
    await adminUpdateProtocol(id, { status: "published" });
    revalidatePath(adminRoutes.protocolos);
    revalidatePath("/protocolos");
    return { success: "Protocolo publicado." };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Erro ao publicar protocolo.",
    };
  }
}

export async function publishProtocolFormAction(formData: FormData): Promise<void> {
  const id = formData.get("id")?.toString();
  if (id) await publishProtocolAction(id);
}
