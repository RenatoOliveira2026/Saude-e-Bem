/**
 * T-06 / S-07: referência de PDF premium (pode ser usada no cliente).
 *
 * PDFs de e-books premium ficam no bucket PRIVADO `cms-pdfs-premium`
 * (migração 055). No banco, `ebooks.pdf_url` guarda `premium-pdf:<caminho>`
 * em vez de uma URL pública. O link de download é gerado no servidor
 * (`createPremiumPdfDownloadUrl`, em `premium-pdf.ts`).
 */
export const PREMIUM_PDF_BUCKET = "cms-pdfs-premium";
export const PREMIUM_PDF_REF_PREFIX = "premium-pdf:";

export function isPremiumPdfRef(value: string | null | undefined): value is string {
  return typeof value === "string" && value.startsWith(PREMIUM_PDF_REF_PREFIX);
}

export function toPremiumPdfRef(path: string): string {
  return `${PREMIUM_PDF_REF_PREFIX}${path}`;
}

export function premiumPdfRefToPath(ref: string): string {
  return ref.slice(PREMIUM_PDF_REF_PREFIX.length);
}
