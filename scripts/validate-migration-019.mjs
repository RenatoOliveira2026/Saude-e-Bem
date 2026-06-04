/**
 * Valida objetos da Migration 019 no Supabase.
 * Uso: node scripts/validate-migration-019.mjs
 */
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;
const projectDir = join(dirname(fileURLToPath(import.meta.url)), "..");
loadEnvConfig(projectDir);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("\n🔍 Validação Migration 019 — Biblioteca de Protocolos\n");

if (!url || !key) {
  console.log("❌ Variáveis Supabase ausentes em .env.local\n");
  process.exit(1);
}

const supabase = createClient(url, key);
let failed = 0;

function ok(msg) {
  console.log(`✅ ${msg}`);
}
function fail(msg) {
  console.log(`❌ ${msg}`);
  failed++;
}

const { data: cats, error: catErr } = await supabase
  .from("protocol_categories")
  .select("slug")
  .order("sort_order");

if (catErr) {
  fail(`protocol_categories: ${catErr.message}`);
} else if ((cats?.length ?? 0) < 10) {
  fail(`protocol_categories: esperado 10 slugs, encontrado ${cats?.length ?? 0}`);
} else {
  ok(`protocol_categories: ${cats.length} categorias`);
}

const { error: histErr } = await supabase.from("user_protocol_history").select("id").limit(1);
if (histErr?.message?.includes("does not exist")) {
  fail("user_protocol_history: tabela não existe");
} else if (histErr) {
  ok(`user_protocol_history: existe (${histErr.message})`);
} else {
  ok("user_protocol_history: acessível");
}

const { error: favErr } = await supabase.from("user_favorites").select("id").limit(1);
if (favErr?.message?.includes("does not exist")) {
  fail("user_favorites (view): não existe");
} else if (favErr) {
  ok(`user_favorites: view existe (${favErr.message})`);
} else {
  ok("user_favorites: view acessível");
}

const { error: rpcErr } = await supabase.rpc("record_protocol_view", {
  p_user_id: "00000000-0000-4000-8000-000000000000",
  p_protocol_id: "00000000-0000-4000-8000-000000000001",
});
if (rpcErr?.message?.includes("Could not find the function")) {
  fail(`record_protocol_view: ${rpcErr.message}`);
} else if (rpcErr) {
  ok(`record_protocol_view: registrada (${rpcErr.message})`);
} else {
  ok("record_protocol_view: RPC respondeu");
}

console.log(failed ? "\n❌ Validação 019 incompleta.\n" : "\n✅ Migration 019 validada no Supabase.\n");
process.exit(failed ? 1 : 0);
