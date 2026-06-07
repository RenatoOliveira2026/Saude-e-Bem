/**
 * Valida conexão com o Supabase.
 * Uso: node scripts/validate-supabase.mjs
 */
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;

function normalizeSupabaseUrl(rawUrl) {
  let url = rawUrl.trim();
  url = url.replace(/\/rest\/v1\/?$/i, "");
  return url.replace(/\/+$/, "");
}

function isPlaceholderUrl(url) {
  if (!url) return true;
  return ["your-project", "SEU-PROJECT", "seu-project-id"].some((p) =>
    url.toLowerCase().includes(p.toLowerCase()),
  );
}

function isPlaceholderKey(key) {
  if (!key) return true;
  return ["your-anon", "COLE-SUA-ANON"].some((p) => key.includes(p));
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectDir = join(__dirname, "..");

loadEnvConfig(projectDir);

function normalizeSiteUrl(raw) {
  const trimmed = String(raw ?? "").trim().replace(/\/+$/, "");
  if (!trimmed) return "http://localhost:3001";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001",
);

console.log("\n🔍 Saúde & Bem — Validação Supabase\n");
console.log("─".repeat(50));

let hasError = false;

function ok(msg) {
  console.log(`✅ ${msg}`);
}

function fail(msg) {
  console.log(`❌ ${msg}`);
  hasError = true;
}

function warn(msg) {
  console.log(`⚠️  ${msg}`);
}

// 1. Variáveis de ambiente
console.log("\n1. Variáveis de ambiente (.env.local)\n");

if (!url || isPlaceholderUrl(url)) {
  fail("NEXT_PUBLIC_SUPABASE_URL não configurada ou ainda é placeholder");
} else {
  const normalized = normalizeSupabaseUrl(url);
  ok(`NEXT_PUBLIC_SUPABASE_URL = ${normalized}`);
  if (url !== normalized) {
    warn(`URL tinha sufixo incorreto. Corrigida de "${url}" para "${normalized}"`);
  }
  if (url.includes("/rest/v1")) {
    warn("Remova /rest/v1/ da URL — use apenas a Project URL base");
  }
}

if (!anonKey || isPlaceholderKey(anonKey)) {
  fail("NEXT_PUBLIC_SUPABASE_ANON_KEY não configurada ou ainda é placeholder");
} else {
  ok(`NEXT_PUBLIC_SUPABASE_ANON_KEY = ${anonKey.slice(0, 12)}... (${anonKey.length} chars)`);
}

ok(`NEXT_PUBLIC_SITE_URL = ${siteUrl}`);

if (hasError) {
  console.log("\n➡️  Copie .env.example para .env.local e preencha os valores do Supabase.\n");
  process.exit(1);
}

// 2. Conexão com a API
console.log("\n2. Conexão com a API\n");

const supabase = createClient(normalizeSupabaseUrl(url), anonKey);

try {
  const { error: authError } = await supabase.auth.getSession();
  if (authError) {
    fail(`Auth API: ${authError.message}`);
  } else {
    ok("Auth API respondeu (getSession)");
  }
} catch (err) {
  fail(`Auth API inacessível: ${err instanceof Error ? err.message : err}`);
}

// 3. Tabelas profiles e user_preferences
console.log("\n3. Tabelas do banco\n");

const { error: profilesError } = await supabase.from("profiles").select("id").limit(1);

if (profilesError) {
  if (profilesError.message.includes("does not exist")) {
    fail('Tabela "profiles" não existe — execute o SQL em supabase/migrations/001_profiles_and_preferences.sql');
  } else {
    warn(`profiles: ${profilesError.message} (normal se RLS bloquear sem login)`);
    ok('Tabela "profiles" existe (RLS ativo)');
  }
} else {
  ok('Tabela "profiles" acessível');
}

const { error: prefsError } = await supabase
  .from("user_preferences")
  .select("id")
  .limit(1);

if (prefsError) {
  if (prefsError.message.includes("does not exist")) {
    fail('Tabela "user_preferences" não existe — execute o SQL de migration');
  } else {
    warn(`user_preferences: ${prefsError.message} (normal se RLS bloquear sem login)`);
    ok('Tabela "user_preferences" existe (RLS ativo)');
  }
} else {
  ok('Tabela "user_preferences" acessível');
}

// 4. Checklist Auth no Dashboard
console.log("\n4. Checklist manual no Supabase Dashboard\n");
console.log("   Authentication → URL Configuration:");
console.log(`   • Site URL: ${siteUrl}`);
console.log(`   • Redirect URLs: ${siteUrl}/auth/callback`);
console.log("\n   Authentication → Providers → Email:");
console.log("   • Para testes locais: desative 'Confirm email' (login imediato após cadastro)");
console.log("   • Em produção: mantenha confirmação de e-mail ativa");

console.log("\n5. Teste manual do fluxo\n");
console.log(`   • Cadastro:  ${siteUrl}/cadastro`);
console.log(`   • Login:     ${siteUrl}/entrar`);
console.log(`   • Após login → ${siteUrl}/minha-jornada`);
console.log(`   • Logout:    botão "Sair" no menu`);

console.log("\n" + "─".repeat(50));

if (hasError) {
  console.log("\n❌ Validação falhou. Corrija os itens acima.\n");
  process.exit(1);
}

console.log("\n✅ Conexão com Supabase OK. Execute o teste manual de cadastro/login.\n");
