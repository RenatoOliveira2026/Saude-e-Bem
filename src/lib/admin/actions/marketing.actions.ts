"use server";

import { requireAdminPermission } from "@/lib/admin/session";
import type { AdminActionState } from "@/lib/admin/types";
import {
  normalizeMetaPixelId,
  normalizeSocialUrl,
  SOCIAL_NETWORKS,
  type MarketingSettingKey,
} from "@/lib/marketing/accounts";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveMarketingAccountsAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdminPermission("manage_content");

  const rows: { key: MarketingSettingKey; value: string }[] = [];
  const errors: string[] = [];

  const pixel = normalizeMetaPixelId(formData.get("meta_pixel_id")?.toString() ?? "");
  if (pixel === null) {
    errors.push("O ID do Pixel da Meta deve ter só números (ex.: 1234567890123456).");
  } else {
    rows.push({ key: "meta_pixel_id", value: pixel });
  }

  for (const network of SOCIAL_NETWORKS) {
    const raw = formData.get(`social_${network.id}`)?.toString() ?? "";
    const url = normalizeSocialUrl(network, raw);
    if (url === null) {
      errors.push(`Endereço do ${network.label} inválido. Exemplo: ${network.example}`);
    } else {
      rows.push({ key: `social_${network.id}`, value: url });
    }
  }

  if (errors.length > 0) return { error: errors.join(" ") };

  const supabase = await createClient();
  const now = new Date().toISOString();
  const { error } = await supabase
    .from("marketing_settings")
    .upsert(rows.map((row) => ({ ...row, updated_at: now })), { onConflict: "key" });

  if (error) {
    if (error.code === "42P01" || /marketing_settings/.test(error.message)) {
      return {
        error:
          "A tabela de marketing ainda não existe no banco. Rode a migração 050_marketing_settings.sql no Supabase.",
      };
    }
    return { error: `Não foi possível salvar: ${error.message}` };
  }

  // Atualiza o rodapé e o pixel em todas as páginas do site.
  revalidatePath("/", "layout");
  return { success: "Contas salvas. O site já foi atualizado." };
}
