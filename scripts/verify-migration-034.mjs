/**
 * Verifica migration 034 (Fase 5.4 — Marketplace)
 * Uso: node scripts/verify-migration-034.mjs
 */
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;
const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnvConfig(join(__dirname, ".."));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !key) {
  console.error("FAIL: NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY ausentes");
  process.exit(1);
}

const sb = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const checks = [];

async function runCheck(name, fn) {
  try {
    const result = await fn();
    if (result.ok) {
      console.log(`OK ${name}${result.detail ? `: ${result.detail}` : ""}`);
      checks.push(true);
    } else {
      console.log(`FAIL ${name}: ${result.detail ?? "erro desconhecido"}`);
      checks.push(false);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`FAIL ${name}: ${message}`);
    checks.push(false);
  }
}

await runCheck("affiliate_links.short_description column", async () => {
  const { error } = await sb
    .from("affiliate_links")
    .select("id, short_description")
    .limit(1);

  if (error) {
    return {
      ok: false,
      detail: error.message.includes("short_description")
        ? "coluna short_description ausente"
        : error.message,
    };
  }
  return { ok: true };
});

await runCheck("affiliate_products view SELECT", async () => {
  const { data, error } = await sb
    .from("affiliate_products")
    .select("id, title, slug, description, category, affiliate_url, partner, is_featured, created_at")
    .limit(5);

  if (error) {
    return { ok: false, detail: error.message };
  }
  return { ok: true, detail: `${data?.length ?? 0} registro(s)` };
});

await runCheck("affiliate_products view uses short_description logic", async () => {
  const { data: links, error: linksError } = await sb
    .from("affiliate_links")
    .select("id, short_description, description")
    .limit(20);

  if (linksError) return { ok: false, detail: linksError.message };

  const { data: products, error: productsError } = await sb
    .from("affiliate_products")
    .select("id, description")
    .limit(20);

  if (productsError) return { ok: false, detail: productsError.message };

  const productMap = new Map((products ?? []).map((row) => [row.id, row.description]));
  let mismatches = 0;

  for (const link of links ?? []) {
    const expected =
      (link.short_description?.trim() || link.description?.trim().slice(0, 160) || "") ?? "";
    const actual = productMap.get(link.id) ?? "";
    if (expected !== actual) mismatches += 1;
  }

  if (mismatches > 0) {
    return {
      ok: false,
      detail: `view desatualizada (${mismatches} divergência(s) em amostra)`,
    };
  }

  return { ok: true, detail: "view alinhada com short_description" };
});

await runCheck("public marketplace query (affiliate_links summary)", async () => {
  const columns =
    "id, slug, title, category, short_description, description, product_type, brand, image_url, featured, editor_choice, rating, reviews_count, current_price, old_price, installments, benefits, url, affiliate_url, active, created_at";

  const { error } = await sb
    .from("affiliate_links")
    .select(columns)
    .eq("active", true)
    .limit(1);

  if (error) {
    return { ok: false, detail: error.message };
  }
  return { ok: true, detail: "query pública compatível" };
});

const passed = checks.every(Boolean);
console.log(passed ? "\nRESULT: APROVADA" : "\nRESULT: PENDENTE");
process.exit(passed ? 0 : 1);
