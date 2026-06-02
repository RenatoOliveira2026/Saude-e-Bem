/**
 * Verifica se um e-mail existe no Supabase Auth (script local).
 * Uso: node scripts/check-auth-user.mjs renatoao2013@gmail.com
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

const email = (process.argv[2] ?? "renatoao2013@gmail.com").trim().toLowerCase();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !serviceKey) {
  console.error("Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error } = await admin.auth.admin.listUsers({ perPage: 1000 });

if (error) {
  console.error("Erro ao listar usuários:", error.message);
  process.exit(1);
}

const user = data.users.find((u) => u.email?.toLowerCase() === email);

console.log("\n🔍 Verificação Auth —", email, "\n");

if (!user) {
  console.log("exists: false");
  console.log("confirmed: n/a");
  console.log("\n➡️  Cadastre em /cadastro ou crie o usuário no Supabase Dashboard.\n");
  process.exit(0);
}

console.log("exists: true");
console.log("id:", user.id);
console.log("confirmed:", Boolean(user.email_confirmed_at));
console.log("confirmed_at:", user.email_confirmed_at ?? "(pendente)");
console.log("created_at:", user.created_at);
console.log("last_sign_in:", user.last_sign_in_at ?? "(nunca)");
console.log("\n➡️  Login: /entrar");
console.log("➡️  Redefinir senha: /recuperar-senha\n");
