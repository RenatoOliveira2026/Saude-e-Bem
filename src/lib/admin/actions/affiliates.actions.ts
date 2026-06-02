"use server";

import { optionalUrl } from "@/lib/admin/cms/form-utils";
import { requireAdminPermission } from "@/lib/admin/session";
import {
  adminDeleteAffiliateLink,
  adminInsertAffiliateLink,
  adminUpdateAffiliateLink,
} from "@/lib/admin/services/affiliates.service";
import type { AdminActionState } from "@/lib/admin/types";
import { slugify } from "@/lib/admin/utils";
import type { AffiliateLinkInput } from "@/lib/affiliates/types";
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

function getNumber(formData: FormData, key: string): number | null {
  const raw = getString(formData, key);
  if (!raw) return null;
  const n = Number(raw.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function getInt(formData: FormData, key: string, fallback = 0): number {
  const raw = getString(formData, key);
  if (!raw) return fallback;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : fallback;
}

function parseAffiliateForm(formData: FormData): AffiliateLinkInput {
  const title = getString(formData, "title");
  const slug = getString(formData, "slug") || slugify(title);
  const affiliateUrl = getString(formData, "affiliate_url");

  return {
    title,
    slug,
    category: getString(formData, "category"),
    description: getString(formData, "description"),
    productType: getString(formData, "product_type") || "outro",
    brand: getString(formData, "brand"),
    producerName: getString(formData, "producer_name"),
    rating: getNumber(formData, "rating"),
    reviewsCount: getInt(formData, "reviews_count", 0),
    editorChoice: getCheckbox(formData, "editor_choice"),
    benefits: getString(formData, "benefits"),
    targetAudience: getString(formData, "target_audience"),
    contraindications: getString(formData, "contraindications"),
    currentPrice: getNumber(formData, "current_price"),
    oldPrice: getNumber(formData, "old_price"),
    installments: getString(formData, "installments"),
    affiliatePlatform: getString(formData, "affiliate_platform"),
    affiliateUrl,
    officialUrl: getString(formData, "official_url"),
    commissionType: getString(formData, "commission_type"),
    commissionValue: getString(formData, "commission_value"),
    cookieDuration: getString(formData, "cookie_duration"),
    seoTitle: getString(formData, "seo_title") || null,
    seoDescription: getString(formData, "seo_description") || null,
    seoKeywords: getString(formData, "seo_keywords") || null,
    testimonial1: getString(formData, "testimonial_1"),
    testimonial2: getString(formData, "testimonial_2"),
    testimonial3: getString(formData, "testimonial_3"),
    imageUrl: optionalUrl(formData, "image_url"),
    videoUrl: optionalUrl(formData, "video_url"),
    active: getCheckbox(formData, "active"),
    featured: getCheckbox(formData, "featured"),
  };
}

function revalidateAffiliatePaths(slug?: string) {
  revalidatePath(adminRoutes.afiliados);
  revalidatePath("/");
  revalidatePath("/recomendados");
  if (slug) revalidatePath(`/recomendados/${slug}`);
}

export async function createAffiliateAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdminPermission("manage_content");
    const input = parseAffiliateForm(formData);
    if (!input.title || !input.slug || !input.category) {
      return { error: "Nome, slug e categoria são obrigatórios." };
    }
    if (!input.affiliateUrl) {
      return { error: "Link de afiliado é obrigatório." };
    }

    const id = await adminInsertAffiliateLink(input);
    revalidateAffiliatePaths(input.slug);
    redirect(adminRoutes.afiliadoEditar(id));
  } catch (err) {
    rethrowIfRedirect(err);
    return {
      error: err instanceof Error ? err.message : "Erro ao criar afiliado.",
    };
  }
}

export async function updateAffiliateAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  try {
    await requireAdminPermission("manage_content");
    const id = getString(formData, "id");
    if (!id) return { error: "Registro inválido." };

    const input = parseAffiliateForm(formData);
    if (!input.title || !input.slug || !input.category) {
      return { error: "Nome, slug e categoria são obrigatórios." };
    }
    if (!input.affiliateUrl) {
      return { error: "Link de afiliado é obrigatório." };
    }

    await adminUpdateAffiliateLink(id, input);
    revalidateAffiliatePaths(input.slug);
    return { success: "Afiliado atualizado." };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Erro ao atualizar afiliado.",
    };
  }
}

export async function deleteAffiliateAction(id: string): Promise<AdminActionState> {
  try {
    await requireAdminPermission("manage_content");
    await adminDeleteAffiliateLink(id);
    revalidateAffiliatePaths();
    return { success: "Afiliado excluído." };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Erro ao excluir afiliado.",
    };
  }
}
