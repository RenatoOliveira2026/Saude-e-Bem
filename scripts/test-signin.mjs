/**
 * Testa signInWithPassword (API Auth).
 * Uso: node scripts/test-signin.mjs <email> <password>
 */
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;
const projectDir = join(dirname(fileURLToPath(import.meta.url)), "..");
loadEnvConfig(projectDir);

if (process.env.SUPABASE_STRICT_TLS !== "1") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const email = process.argv[2];
const password = process.argv[3];

const url = rawUrl?.replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");

if (!url || !anonKey || !email || !password) {
  console.error("Uso: node scripts/test-signin.mjs <email> <password>");
  process.exit(1);
}

const supabase = createClient(url, anonKey);
const { data, error } = await supabase.auth.signInWithPassword({ email, password });

if (error) {
  console.log("RESULT: FAIL");
  console.log({ message: error.message, code: error.code, status: error.status });
  process.exit(1);
}

console.log("RESULT: OK");
console.log({
  userId: data.user?.id,
  hasSession: Boolean(data.session),
  emailConfirmed: Boolean(data.user?.email_confirmed_at),
});
