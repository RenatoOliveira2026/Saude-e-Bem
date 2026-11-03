import { createClient } from "@/lib/supabase/server";
import {
  PREMIUM_PDF_BUCKET,
  isPremiumPdfRef,
  premiumPdfRefToPath,
} from "./premium-pdf-ref";

export * from "./premium-pdf-ref";

/** Validade do link de download (segundos). */
export const PREMIUM_PDF_URL_TTL_SECONDS = 600;

/**
 * URL assinada de curta duração para um PDF premium, gerada com a sessão do
 * usuário: a política do Storage só libera assinante ativo ou admin. Devolve
 * `null` sem permissão ou se o arquivo não existir.
 */
export async function createPremiumPdfDownloadUrl(ref: string): Promise<string | null> {
  if (!isPremiumPdfRef(ref)) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(PREMIUM_PDF_BUCKET)
    .createSignedUrl(premiumPdfRefToPath(ref), PREMIUM_PDF_URL_TTL_SECONDS);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}
