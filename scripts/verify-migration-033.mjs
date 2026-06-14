/**
 * Verifica migration 033 (Fase 5.3)
 * Uso: node scripts/verify-migration-033.mjs
 */
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;
const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnvConfig(join(__dirname, ".."));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Supabase URL/key ausentes");
  process.exit(1);
}

const sb = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

let ok = true;

const view = await sb.from("affiliate_products").select("id, title, slug").limit(1);
if (view.error) {
  console.log("FAIL affiliate_products view:", view.error.message);
  ok = false;
} else {
  console.log("OK affiliate_products view");
}

const clicks = await sb.from("affiliate_clicks").select("user_agent, referrer").limit(1);
if (clicks.error) {
  console.log("FAIL affiliate_clicks user_agent/referrer:", clicks.error.message);
  ok = false;
} else {
  console.log("OK affiliate_clicks user_agent/referrer columns");
}

process.exit(ok ? 0 : 1);
