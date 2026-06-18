/**
 * Gera migration SQL + JSON para 10 protocolos premium — Fase 7.1B
 * Uso: npm run generate:premium-protocols
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  enrichLibraryItem,
  enrichProtocol,
  premiumProtocolId,
} from "./premium-protocols-71b-builder.mjs";
import { PREMIUM_PROTOCOL_DEFINITIONS } from "./premium-protocols-71b-data.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const PROTOCOLS = PREMIUM_PROTOCOL_DEFINITIONS.map((def, index) =>
  enrichProtocol(def, index),
);
const LIBRARY_ITEMS = PROTOCOLS.map((p, index) => enrichLibraryItem(p, index));

function sqlStr(s) {
  return `'${String(s).replace(/'/g, "''")}'`;
}

function sqlJson(obj) {
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;
}

function sqlNullableStr(s) {
  return s == null || s === "" ? "null" : sqlStr(s);
}

function buildMigrationLines() {
  const lines = [
    "-- =============================================================================",
    "-- Saúde & Bem — 10 protocolos premium (Fase 7.1B)",
    "-- Gerado por scripts/generate-premium-protocols-seed.mjs",
    "-- =============================================================================",
    "",
    "delete from public.favorites where content_id in (",
    "  select id from public.protocols where id::text like 'p7100002-%'",
    "     or id::text like '71000002-%'",
    ");",
    "delete from public.library_items where id::text like 'd7100004-%'",
    "   or id::text like '71000004-%';",
    "delete from public.protocols where id::text like 'p7100002-%'",
    "   or id::text like '71000002-%';",
    "",
    `-- Protocols (${PROTOCOLS.length})`,
  ];

  for (let i = 0; i < PROTOCOLS.length; i++) {
    const p = PROTOCOLS[i];
    lines.push(
      `insert into public.protocols (id, slug, title, description, objective, long_description, category, category_label, duration, level, benefits, steps, is_premium, featured, tag, participants, cover_image_url, content, seo_title, seo_description, seo_keywords, og_image_url, status) values (` +
        `${sqlStr(premiumProtocolId(i))}, ${sqlStr(p.slug)}, ${sqlStr(p.title)}, ${sqlStr(p.description)}, ${sqlStr(p.objective)}, ${sqlStr(p.longDescription)}, ` +
        `${sqlStr(p.category)}, ${sqlStr(p.category_label)}, ${sqlStr(p.duration)}, ${sqlStr(p.level)}, ${sqlJson(p.benefits)}, ${sqlJson(p.steps)}, ` +
        `${p.is_premium}, ${p.featured}, ${sqlNullableStr(p.tag)}, ${p.participants}, ` +
        `${sqlNullableStr(p.cover_image_url)}, ${sqlJson(p.content)}, ${sqlNullableStr(p.seo_title)}, ${sqlNullableStr(p.seo_description)}, ` +
        `${sqlNullableStr(p.seo_keywords)}, ${sqlNullableStr(p.og_image_url)}, 'published');`,
    );
  }

  lines.push("", `-- Library items (${LIBRARY_ITEMS.length})`);

  for (const item of LIBRARY_ITEMS) {
    lines.push(
      `insert into public.library_items (id, slug, title, description, long_description, category, category_label, item_type, tier, is_premium, image_url, estimated_read_time, featured, assets, seo_title, seo_description, seo_keywords, og_image_url, status) values (` +
        `${sqlStr(item.id)}, ${sqlStr(item.slug)}, ${sqlStr(item.title)}, ${sqlStr(item.description)}, ${sqlStr(item.long_description)}, ` +
        `${sqlStr(item.category)}, ${sqlStr(item.category_label)}, 'protocolo', 'premium', true, ` +
        `${sqlNullableStr(item.image_url)}, ${sqlStr(item.estimated_read_time)}, ${item.featured}, ${sqlJson(item.assets)}, ` +
        `${sqlNullableStr(item.seo_title)}, ${sqlNullableStr(item.seo_description)}, ${sqlNullableStr(item.seo_keywords)}, ` +
        `${sqlNullableStr(item.og_image_url)}, 'published');`,
    );
  }

  lines.push(
    "",
    "select 'premium_protocols_71b' as seed, count(*) as protocols from public.protocols where id::text like '71000002-%';",
    "select 'premium_library_71b' as seed, count(*) as library_items from public.library_items where id::text like '71000004-%';",
  );

  return lines;
}

const migrationPath = join(
  root,
  "supabase",
  "migrations",
  "038_seed_premium_protocols_71b.sql",
);
const protocolsJsonPath = join(
  root,
  "src",
  "lib",
  "content-engine",
  "seed",
  "premium-protocols-71b.generated.json",
);
const libraryJsonPath = join(
  root,
  "src",
  "lib",
  "content-engine",
  "seed",
  "premium-protocols-library-71b.generated.json",
);

writeFileSync(migrationPath, buildMigrationLines().join("\n") + "\n", "utf8");
writeFileSync(protocolsJsonPath, JSON.stringify(PROTOCOLS, null, 2) + "\n", "utf8");
writeFileSync(libraryJsonPath, JSON.stringify(LIBRARY_ITEMS, null, 2) + "\n", "utf8");

console.log(`Migration: ${migrationPath}`);
console.log(`Protocols JSON: ${protocolsJsonPath}`);
console.log(`Library JSON: ${libraryJsonPath}`);
console.log(`Protocolos: ${PROTOCOLS.length} | Biblioteca: ${LIBRARY_ITEMS.length}`);
