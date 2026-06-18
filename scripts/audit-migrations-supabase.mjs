/**
 * Auditoria de migrations e conteúdo Fase 7.1 — Supabase remoto
 * Uso: node scripts/audit-migrations-supabase.mjs
 */
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !serviceKey) {
  console.error("❌ Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const migrationsDir = join(process.cwd(), "supabase", "migrations");
const localFiles = readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

function groupByPrefix(files) {
  const map = {};
  for (const f of files) {
    const p = f.split("_")[0];
    (map[p] ??= []).push(f);
  }
  return map;
}

async function countTable(table, filter) {
  let q = supabase.from(table).select("*", { count: "exact", head: true });
  for (const [col, op, val] of filter) {
    if (op === "like") q = q.like(col, val);
    else if (op === "eq") q = q.eq(col, val);
    else if (op === "filter") q = q.filter(col, val);
  }
  const { count, error } = await q;
  if (error) return { count: null, error: error.message };
  return { count: count ?? 0, error: null };
}

async function sampleSlugs(table, filter, limit = 5) {
  let q = supabase.from(table).select("slug, title, id").limit(limit);
  for (const [col, op, val] of filter) {
    if (op === "like") q = q.like(col, val);
    else if (op === "eq") q = q.eq(col, val);
  }
  const { data, error } = await q;
  if (error) return { slugs: [], error: error.message };
  return { slugs: data ?? [], error: null };
}

async function fetchSchemaMigrations() {
  const { data, error } = await supabase
    .from("schema_migrations")
    .select("version")
    .order("version");

  if (error) {
    // supabase uses supabase_migrations.schema_migrations - try RPC or raw
    const { data: alt, error: altErr } = await supabase.rpc("version");
    void alt;
    void altErr;
    return { rows: null, error: error.message };
  }
  return { rows: data, error: null };
}

async function checkPricingMigration() {
  const { data, error } = await supabase
    .from("membership_plans")
    .select("slug, price")
    .in("slug", ["premium-mensal", "premium-anual"]);

  if (error) return { applied: null, error: error.message };
  const mensal = data?.find((p) => p.slug === "premium-mensal");
  const applied = mensal?.price === 19.9 || mensal?.price === "19.90";
  return { applied, prices: data, error: null };
}

console.log("\n══════════════════════════════════════════════════");
console.log("  RELATÓRIO — Migrations & Conteúdo Fase 7.1");
console.log("══════════════════════════════════════════════════\n");

// Local migrations inventory
console.log("## 1. Migrations locais (repositório)\n");
console.log(`Total: ${localFiles.length} arquivos`);
console.log(`Primeira: ${localFiles[0]}`);
console.log(`Última:   ${localFiles.at(-1)}\n`);

const dupes = Object.entries(groupByPrefix(localFiles)).filter(([, v]) => v.length > 1);
if (dupes.length) {
  console.log("⚠️  CONFLITO — mesmo prefixo numérico:");
  for (const [prefix, files] of dupes) {
    console.log(`   ${prefix}: ${files.join(" | ")}`);
  }
  console.log(
    "   → Supabase CLI aplica no máximo UMA migration por versão; uma pode nunca ter rodado.\n",
  );
} else {
  console.log("✅ Sem prefixos duplicados no repositório.\n");
}

// Schema migrations table (may not exist if only SQL Editor used)
console.log("## 2. Tabela schema_migrations (Supabase CLI)\n");
const schemaMig = await fetchSchemaMigrations();
if (schemaMig.error) {
  console.log(`⚠️  Não acessível via API: ${schemaMig.error}`);
  console.log("   (Normal se migrations foram aplicadas manualmente no SQL Editor.)\n");
} else {
  console.log(`Registros: ${schemaMig.rows?.length ?? 0}`);
  if (schemaMig.rows?.length) {
    const last = schemaMig.rows.at(-1)?.version;
    console.log(`Última version: ${last}`);
  }
  console.log("");
}

// Indirect migration checks
console.log("## 3. Sinais indiretos de migrations aplicadas\n");
const pricing = await checkPricingMigration();
if (pricing.error) {
  console.log(`⚠️  membership_plans: ${pricing.error}`);
} else {
  console.log(
    `${pricing.applied ? "✅" : "❌"} 037_phase_6_1_pricing — premium-mensal R$ 19,90: ${pricing.applied ? "sim" : "não"}`,
  );
  for (const p of pricing.prices ?? []) {
    console.log(`   · ${p.slug}: R$ ${p.price}`);
  }
}
console.log("");

// Content validation 7.1A
console.log("## 4. Artigos SEO (Fase 7.1A)\n");
const seoById = await countTable("articles", [["id", "like", "a7100001-%"]]);
const seoBySlug = await countTable("articles", [
  ["slug", "eq", "como-melhorar-qualidade-do-sono"],
]);
const articlesPublished = await countTable("articles", [["status", "eq", "published"]]);

console.log(`Artigos publicados (total): ${articlesPublished.count}`);
console.log(`Artigos seed 7.1A (id a7100001-%): ${seoById.count ?? "erro"}`);
if (seoById.error) console.log(`   Erro: ${seoById.error}`);
console.log(
  `Slug canário 'como-melhorar-qualidade-do-sono': ${seoBySlug.count ? "✅ presente" : "❌ ausente"}`,
);

const seoSample = await sampleSlugs("articles", [["id", "like", "a7100001-%"]], 3);
if (seoSample.slugs.length) {
  console.log("Amostra:");
  for (const a of seoSample.slugs) console.log(`   · ${a.slug}`);
}
console.log("");

// Note invalid UUID in 7.1A migration
const seoMigration = readFileSync(
  join(migrationsDir, "037_seed_seo_articles_71a.sql"),
  "utf8",
);
const invalidArticleUuid = seoMigration.includes("'a7100001-");
if (invalidArticleUuid) {
  console.log(
    "⚠️  Migration 037_seed_seo_articles_71a usa IDs com prefixo 'a' (não é UUID hex válido).",
  );
  console.log("   Se não aplicada, corrigir antes de executar (mesmo problema da 7.1B).\n");
}

// Content validation 7.1B
console.log("## 5. Protocolos premium (Fase 7.1B)\n");
const proto71b = await countTable("protocols", [["id", "like", "71000002-%"]]);
const protoPremium = await countTable("protocols", [["is_premium", "eq", true]]);
const protoCanary = await countTable("protocols", [["slug", "eq", "sono-restaurador"]]);

console.log(`Protocolos premium (total is_premium): ${protoPremium.count}`);
console.log(`Protocolos seed 7.1B (id 71000002-%): ${proto71b.count ?? "erro"}`);
if (proto71b.error) console.log(`   Erro: ${proto71b.error}`);
console.log(
  `Slug canário 'sono-restaurador': ${protoCanary.count ? "✅ presente" : "❌ ausente"}`,
);

const protoSample = await sampleSlugs("protocols", [["id", "like", "71000002-%"]], 5);
if (protoSample.slugs.length) {
  console.log("Amostra:");
  for (const p of protoSample.slugs) console.log(`   · ${p.slug}`);
}
console.log("");

console.log("## 6. Biblioteca premium — protocolos (Fase 7.1B)\n");
const lib71b = await countTable("library_items", [["id", "like", "71000004-%"]]);
const libProtocolo = await countTable("library_items", [["item_type", "eq", "protocolo"]]);
const libPremium = await countTable("library_items", [["is_premium", "eq", true]]);
const libCanary = await countTable("library_items", [["slug", "eq", "sono-restaurador"]]);

console.log(`Itens biblioteca (total): ${(await countTable("library_items", [])).count}`);
console.log(`Itens tipo protocolo: ${libProtocolo.count}`);
console.log(`Itens premium: ${libPremium.count}`);
console.log(`Itens seed 7.1B (id 71000004-%): ${lib71b.count ?? "erro"}`);
if (lib71b.error) console.log(`   Erro: ${lib71b.error}`);
console.log(
  `Slug canário biblioteca 'sono-restaurador': ${libCanary.count ? "✅ presente" : "❌ ausente"}`,
);
console.log("");

// Pending summary
console.log("## 7. Resumo — pendências\n");

const pending = [];

if (dupes.length) {
  pending.push({
    severity: "critical",
    item: "Conflito de prefixo 037 no repositório (pricing vs seed SEO)",
  });
}
if (invalidArticleUuid) {
  pending.push({
    severity: "critical",
    item: "037_seed_seo_articles_71a — IDs inválidos (prefixo 'a') se ainda não aplicada/corrigida",
  });
}
if ((seoById.count ?? 0) < 20) {
  pending.push({
    severity: "high",
    item: `Artigos SEO 7.1A incompletos no DB (${seoById.count ?? 0}/20)`,
  });
}
if ((proto71b.count ?? 0) < 10) {
  pending.push({
    severity: "high",
    item: `Protocolos premium 7.1B incompletos no DB (${proto71b.count ?? 0}/10)`,
  });
}
if ((lib71b.count ?? 0) < 10) {
  pending.push({
    severity: "high",
    item: `Biblioteca protocolos 7.1B incompleta no DB (${lib71b.count ?? 0}/10)`,
  });
}

if (!pending.length) {
  console.log("✅ Nenhuma pendência crítica detectada no banco remoto.\n");
} else {
  for (const p of pending) {
    const icon = p.severity === "critical" ? "🔴" : "🟠";
    console.log(`${icon} [${p.severity.toUpperCase()}] ${p.item}`);
  }
  console.log("");
}

// Expected local files not inferable from DB - list seed migrations status
console.log("## 8. Migrations seed Fase 7.x — status inferido\n");
const seedMigrations = [
  {
    file: "037_phase_6_1_pricing.sql",
    check: pricing.applied,
    label: "Preços Clube R$ 19,90 / R$ 197",
  },
  {
    file: "037_seed_seo_articles_71a.sql",
    check: (seoById.count ?? 0) >= 20,
    label: "20 artigos SEO (a7100001-*)",
  },
  {
    file: "038_seed_premium_protocols_71b.sql",
    check: (proto71b.count ?? 0) >= 10 && (lib71b.count ?? 0) >= 10,
    label: "10 protocolos + 10 library_items premium",
  },
];

for (const m of seedMigrations) {
  const status =
    m.check === null ? "?" : m.check === true || m.check ? "✅ aplicada" : "❌ pendente";
  console.log(`${status} — ${m.file}`);
  console.log(`         ${m.label}`);
}

console.log("\n══════════════════════════════════════════════════\n");

process.exit(pending.some((p) => p.severity === "critical" || p.severity === "high") ? 1 : 0);
