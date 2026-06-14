import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;
const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnvConfig(join(__dirname, ".."));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const sb = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

const { data, error } = await sb
  .from("affiliate_links")
  .select("id, slug, title, active, affiliate_url, url")
  .order("created_at", { ascending: false })
  .limit(10);

if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log(JSON.stringify(data ?? [], null, 2));
