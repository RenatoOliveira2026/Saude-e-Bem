/**
 * Validação pré-Fase 7.2 — build data + rotas HTTP
 */
import { spawn } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const PORT = process.env.VALIDATE_PORT ?? "3012";
const BASE = `http://localhost:${PORT}`;

function readJson(path) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}

// --- Conteúdo 7.1B no mock ---
const protocols = readJson(
  "src/lib/content-engine/seed/premium-protocols-71b.generated.json",
);
const library = readJson(
  "src/lib/content-engine/seed/premium-protocols-library-71b.generated.json",
);

const invalidUuid = (id) => !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

console.log("\n📋 Validação Fase 7.1B (mock/seed)\n");
console.log(`Protocolos premium: ${protocols.length}`);
console.log(`Biblioteca protocolo: ${library.length}`);
const badIds = library.filter((i) => invalidUuid(i.id)).map((i) => i.slug);
if (badIds.length) console.log("❌ UUIDs inválidos:", badIds);
else console.log("✅ UUIDs válidos nos JSON gerados");

const slugs = protocols.map((p) => p.slug);
console.log("Slugs:", slugs.join(", "));

// --- Migrations ---
const migrations = readdirSync(join(root, "supabase/migrations"))
  .filter((f) => f.endsWith(".sql"))
  .sort();
const byPrefix = {};
for (const f of migrations) {
  const p = f.split("_")[0];
  byPrefix[p] = byPrefix[p] ?? [];
  byPrefix[p].push(f);
}
const dupes = Object.entries(byPrefix).filter(([, v]) => v.length > 1);
console.log("\n📦 Migrations\n");
console.log(`Total arquivos: ${migrations.length}`);
console.log(`Última: ${migrations.at(-1)}`);
if (dupes.length) {
  console.log("⚠️  Prefixos duplicados (Supabase CLI pode aplicar só um por número):");
  for (const [n, files] of dupes) console.log(`   ${n}: ${files.join(", ")}`);
} else console.log("✅ Sem prefixos duplicados");

const pendingSeeds = ["037_seed_seo_articles_71a.sql", "038_seed_premium_protocols_71b.sql"];
console.log("\nSeeds Fase 7.1 (verificar no SQL Editor / remoto):");
for (const s of pendingSeeds) {
  console.log(`   • ${s} — ${migrations.includes(s) ? "presente no repo" : "AUSENTE"}`);
}

// --- HTTP routes ---
const routes = ["/blog", "/protocolos", "/biblioteca", "/clube", "/lancamento"];
const premiumChecks = [
  "/protocolos/sono-restaurador",
  "/protocolos/longevidade-premium",
  "/biblioteca/sono-restaurador",
];

async function waitForServer(ms = 60000) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    try {
      const res = await fetch(`${BASE}/blog`);
      if (res.status < 500) return true;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  return false;
}

function startServer() {
  return spawn("npm", ["run", "start", "--", "-p", PORT], {
    cwd: root,
    shell: true,
    stdio: "ignore",
    env: { ...process.env, PORT },
  });
}

console.log("\n🌐 Rotas HTTP (next start)\n");
const child = startServer();
let exitCode = 0;

try {
  const up = await waitForServer();
  if (!up) {
    console.log("❌ Servidor não respondeu a tempo");
    process.exit(1);
  }

  for (const path of [...routes, ...premiumChecks]) {
    const res = await fetch(`${BASE}${path}`);
    const ok = res.status === 200;
    console.log(`${ok ? "✅" : "❌"} ${path} → ${res.status}`);
    if (!ok) exitCode = 1;
  }

  const protoPage = await fetch(`${BASE}/protocolos/sono-restaurador`);
  const protoHtml = await protoPage.text();
  const checks = [
    ["Sono Restaurador", protoHtml.includes("Sono Restaurador")],
    ["Guia completo", protoHtml.includes("Guia completo")],
    ["Checklist", protoHtml.includes("Checklist")],
  ];
  console.log("\nConteúdo premium público (/protocolos/sono-restaurador):");
  for (const [label, pass] of checks) {
    console.log(`${pass ? "✅" : "❌"} ${label}`);
    if (!pass) exitCode = 1;
  }

  const clube = await (await fetch(`${BASE}/clube`)).text();
  const clubeOk = clube.includes("Protocolos Premium") || clube.includes("sono-restaurador");
  console.log(`${clubeOk ? "✅" : "❌"} /clube menciona protocolos premium`);
  if (!clubeOk) exitCode = 1;
} finally {
  child.kill("SIGTERM");
}

console.log(exitCode === 0 ? "\n✅ Validação pré-7.2 concluída.\n" : "\n❌ Falhas na validação.\n");
process.exit(exitCode);
