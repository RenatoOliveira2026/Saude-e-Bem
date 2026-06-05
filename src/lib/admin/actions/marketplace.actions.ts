"use server";

import { requireAdminPermission } from "@/lib/admin/session";
import {
  adminDeleteMarketplaceProduct,
  adminGetMarketplaceProduct,
  adminInsertMarketplaceProduct,
  adminUpdateMarketplaceProduct,
  type MarketplaceProductAdminInput,
} from "@/lib/admin/services/marketplace.service";
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

function getNumber(formData: FormData, key: string): number | null {
  const raw = getString(formData, key);
  if (!raw) return null;
  const n = Number(raw.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function parseMarketplaceForm(formData: FormData): MarketplaceProductAdminInput {
  const title = getString(formData, "title");
  const fulfillment = (getString(formData, "fulfillment") ||
    "digital") as MarketplaceProductAdminInput["fulfillment"];
  const seo = parseSeoFields(formData);
  return {
    slug: getString(formData, "slug") || slugify(title),
    title,
    description: getString(formData, "description"),
    category: getString(formData, "category"),
    categoryLabel: getString(formData, "category_label"),
    productType: getString(formData, "product_type") || "ebook",
    fulfillment,
    isPremium: getCheckbox(formData, "is_premium"),
    currentPrice: getNumber(formData, "current_price"),
    oldPrice: getNumber(formData, "old_price"),
    installments: getString(formData, "installments") || null,
    featured: getCheckbox(formData, "featured"),
    editorChoice: getCheckbox(formData, "editor_choice"),
    librarySlug: getString(formData, "library_slug") || null,
    affiliateSlug: getString(formData, "affiliate_slug") || null,
    status: (getString(formData, "status") || "draft") as MarketplaceProductAdminInput["status"],
    seoTitle: seo.seo_title,
    seoDescription: seo.seo_description,
    seoKeywords: seo.seo_keywords,
    ogImageUrl: seo.og_image_url,
  };
}

export async function createMarketplaceProductAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdminPermission("manage_content");
  try {
    const id = await adminInsertMarketplaceProduct(parseMarketplaceForm(formData));
    revalidatePath(adminRoutes.marketplace);
    revalidatePath(routes.marketplace);
    redirect(adminRoutes.marketplaceEditar(id));
  } catch (err) {
    rethrowIfRedirect(err);
    return { error: err instanceof Error ? err.message : "Erro ao criar produto." };
  }
}

export async function updateMarketplaceProductAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdminPermission("manage_content");
  const id = getString(formData, "id");
  if (!id) return { error: "ID inválido." };
  try {
    await adminUpdateMarketplaceProduct(id, parseMarketplaceForm(formData));
    revalidatePath(adminRoutes.marketplace);
    revalidatePath(routes.marketplace);
    return { success: "Produto atualizado." };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erro ao atualizar." };
  }
}

export async function deleteMarketplaceProductAction(id: string): Promise<AdminActionState> {
  try {
    await requireAdminPermission("manage_content");
    await adminDeleteMarketplaceProduct(id);
    revalidatePath(adminRoutes.marketplace);
    revalidatePath(routes.marketplace);
    return { success: "Produto excluído." };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erro ao excluir." };
  }
}

export async function getMarketplaceProductForEdit(id: string) {
  await requireAdminPermission("manage_content");
  return adminGetMarketplaceProduct(id);
}
