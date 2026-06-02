"use server";

import {
  parseUploadActionError,
  validateImageFileSize,
  validatePdfFileSize,
} from "@/lib/admin/cms/upload-limits";
import { requireAdminPermission } from "@/lib/admin/session";
import {
  IMAGE_BUCKET,
  PDF_BUCKET,
  uploadCmsFile,
} from "@/lib/admin/services/storage.service";

export type UploadResult = {
  url?: string;
  error?: string;
  fileName?: string;
  sizeBytes?: number;
  uploadedAt?: string;
};

export async function uploadCmsImageAction(
  _prev: UploadResult,
  formData: FormData,
): Promise<UploadResult> {
  try {
    await requireAdminPermission("manage_content");
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return { error: "Selecione uma imagem válida." };
    }

    if (!file.type.startsWith("image/")) {
      return { error: "Apenas arquivos de imagem são permitidos." };
    }

    const sizeError = validateImageFileSize(file.size);
    if (sizeError) {
      return { error: sizeError };
    }

    const folder = formData.get("folder")?.toString() || "misc";
    const url = await uploadCmsFile(IMAGE_BUCKET, folder, file);
    return {
      url,
      fileName: file.name,
      sizeBytes: file.size,
      uploadedAt: new Date().toISOString(),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Falha no upload da imagem.";
    return { error: parseUploadActionError(message) };
  }
}

export async function uploadCmsPdfAction(
  _prev: UploadResult,
  formData: FormData,
): Promise<UploadResult> {
  try {
    await requireAdminPermission("manage_content");
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return { error: "Selecione um PDF válido." };
    }

    if (file.type !== "application/pdf") {
      return { error: "Apenas arquivos PDF são permitidos." };
    }

    const sizeError = validatePdfFileSize(file.size);
    if (sizeError) {
      return { error: sizeError };
    }

    const folder = formData.get("folder")?.toString() || "biblioteca";
    const url = await uploadCmsFile(PDF_BUCKET, folder, file);
    return {
      url,
      fileName: file.name,
      sizeBytes: file.size,
      uploadedAt: new Date().toISOString(),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Falha no upload do PDF.";
    return { error: parseUploadActionError(message) };
  }
}
