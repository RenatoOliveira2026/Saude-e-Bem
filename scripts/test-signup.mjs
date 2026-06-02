/**
 * Testa signUp contra o Supabase (mesmas env vars do app).
 * Uso: node scripts/test-signup.mjs [email]
 */
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectDir = join(__dirname, "..");

loadEnvConfig(projectDir);

if (process.env.SUPABASE_STRICT_TLS !== "1") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const email = process.argv[2] ?? `test+${Date.now()}@example.com`;
const password = "TesteSenha123!";

const url = rawUrl?.replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");

console.log("\n🧪 Teste signUp — Saúde & Bem\n");
console.log({
  supabaseUrlExists: Boolean(url),
  supabaseUrlIsPlaceholder: !url || /your-project|SEU-PROJECT/i.test(url),
  anonKeyExists: Boolean(anonKey),
  urlNormalized: url ?? null,
  urlHasRestSuffix: rawUrl?.includes("/rest/v1") ?? false,
  email,
});

if (!url || !anonKey) {
  console.error("\n❌ .env.local incompleto na raiz do projeto.\n");
  process.exit(1);
}

const supabase = createClient(url, anonKey);

const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: { data: { name: "Teste Script" } },
});

if (error) {
  console.error("\n❌ signUp error:", {
    message: error.message,
    status: error.status,
    code: error.code,
    name: error.name,
  });
  process.exit(1);
}

console.log("\n✅ signUp OK:", {
  userId: data.user?.id ?? null,
  identities: data.user?.identities?.length ?? 0,
  hasSession: Boolean(data.session),
});
console.log("\n");
