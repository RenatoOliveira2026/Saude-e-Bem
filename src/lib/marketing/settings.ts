import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { isSupabaseConfigured, getSupabaseEnv } from "@/lib/supabase/config";
import {
  isMarketingSettingKey,
  type MarketingSettings,
} from "@/lib/marketing/accounts";

export const MARKETING_SETTINGS_TAG = "marketing-settings";

async function readMarketingSettings(): Promise<MarketingSettings> {
  if (!isSupabaseConfigured()) return {};
  try {
    const { url, anonKey } = getSupabaseEnv();
    // Cliente sem cookies: a leitura é pública e pode ficar em cache.
    const supabase = createSupabaseClient(url, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error } = await supabase
      .from("marketing_settings")
      .select("key, value");
    if (error || !data) return {};

    const settings: MarketingSettings = {};
    for (const row of data as { key: string; value: string }[]) {
      if (isMarketingSettingKey(row.key) && row.value) settings[row.key] = row.value;
    }
    return settings;
  } catch {
    // Tabela ainda não criada ou Supabase fora do ar: site segue sem as contas.
    return {};
  }
}

/** Contas de marketing, com cache de 1 hora (o painel limpa o cache ao salvar). */
export const getMarketingSettings = unstable_cache(
  readMarketingSettings,
  ["marketing-settings"],
  { revalidate: 3600, tags: [MARKETING_SETTINGS_TAG] },
);

/** Pixel da Meta: o valor do painel tem prioridade sobre a variável da Vercel. */
export async function getMetaPixelId(): Promise<string | null> {
  const settings = await getMarketingSettings();
  return settings.meta_pixel_id || process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || null;
}
