export const CMS_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const CMS_PDF_MAX_BYTES = 20 * 1024 * 1024;

export function formatFileSizeLimit(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return `${mb % 1 === 0 ? mb : mb.toFixed(0)} MB`;
}

export function validateImageFileSize(size: number): string | null {
  if (size > CMS_IMAGE_MAX_BYTES) {
    return `A imagem excede o limite de ${formatFileSizeLimit(CMS_IMAGE_MAX_BYTES)}. Escolha um arquivo menor ou comprima a imagem.`;
  }
  return null;
}

export function validatePdfFileSize(size: number): string | null {
  if (size > CMS_PDF_MAX_BYTES) {
    return `O PDF excede o limite de ${formatFileSizeLimit(CMS_PDF_MAX_BYTES)}. Escolha um arquivo menor.`;
  }
  return null;
}

export function parseUploadActionError(message: string): string {
  if (/body exceeded|1\s*mb|body size limit/i.test(message)) {
    return "O arquivo é grande demais para enviar. Imagens até 5 MB e PDFs até 20 MB.";
  }
  return message;
}
