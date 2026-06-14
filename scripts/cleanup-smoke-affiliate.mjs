import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;
const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnvConfig(join(__dirname, ".."));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const sb = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

await sb.from("affiliate_links").delete().eq("slug", "smoke-test-fase-53");
console.log("cleaned smoke-test-fase-53");
