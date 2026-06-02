/**
 * Auditoria Fase 3.2 — tabelas affiliate_links e affiliate_clicks
 * Uso: node scripts/audit-affiliates.mjs
 */
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;
const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnvConfig(join(__dirname, ".."));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "");
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const sb = createClient(url, key);

const premiumCols =
  "id, slug, title, active, featured, affiliate_url, product_type, rating, editor_choice";

const { data: links, error: le } = await sb
  .from("affiliate_links")
  .select(premiumCols)
  .eq("active", true)
  .limit(5);

if (le) {
  console.log("affiliate_links ERROR:", le.message);
  if (le.message.includes("slug") || le.message.includes("product_type")) {
    console.log("→ Aplique supabase/migrations/011_affiliates_premium.sql");
  }
  process.exit(1);
}

console.log("affiliate_links active:", links?.length ?? 0);
if (links?.[0]) {
  console.log("sample:", { slug: links[0].slug, title: links[0].title });
}

const { error: ce } = await sb.from("affiliate_clicks").select("id").limit(1);
console.log(
  "affiliate_clicks SELECT (anon):",
  ce ? `blocked/esperado: ${ce.message}` : "permitido (inesperado)",
);

const affiliateId = links?.[0]?.id;
if (affiliateId) {
  const { error: ins } = await sb.from("affiliate_clicks").insert({
    affiliate_id: affiliateId,
    source_page: "/audit",
    source_type: "direct",
  });
  console.log("affiliate_clicks INSERT:", ins ? `FAIL: ${ins.message}` : "OK");
} else {
  console.log("affiliate_clicks INSERT: skip (sem afiliado ativo)");
}
