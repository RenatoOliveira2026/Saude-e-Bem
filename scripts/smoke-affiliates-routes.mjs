/**
 * Smoke test Fase 5.3 — rotas de afiliados (localhost:3001)
 * Uso: node scripts/smoke-affiliates-routes.mjs
 */
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;
const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnvConfig(join(__dirname, ".."));

const base = (process.env.SMOKE_BASE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001").replace(/\/+$/, "");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!key) {
  console.error("SUPABASE_SERVICE_ROLE_KEY necessária para smoke test");
  process.exit(1);
}

const sb = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
const testSlug = "smoke-test-fase-53";

async function httpStatus(path, options = {}) {
  const res = await fetch(`${base}${path}`, { redirect: "manual", ...options });
  return res.status;
}

let createdId = null;

try {
  await sb.from("affiliate_links").delete().eq("slug", testSlug);

  const { data, error } = await sb
    .from("affiliate_links")
    .insert({
      title: "Smoke Test Fase 5.3",
      slug: testSlug,
      category: "bem-estar",
      description: "Produto temporário para smoke test",
      affiliate_url: "https://example.com/?ref=saudeebem-smoke",
      url: "https://example.com/?ref=saudeebem-smoke",
      active: true,
      featured: false,
      product_type: "outro",
      brand: "Smoke",
    })
    .select("id")
    .single();

  if (error) throw error;
  createdId = data.id;

  const listing = await httpStatus("/recomendados");
  const detail = await httpStatus(`/recomendados/${testSlug}`);
  const admin = await httpStatus("/admin/afiliados");
  const go = await httpStatus(
    `/api/affiliates/${testSlug}/go?source_page=/recomendados&source_type=listing`,
  );

  console.log(`/recomendados -> ${listing}`);
  console.log(`/recomendados/${testSlug} -> ${detail}`);
  console.log(`/admin/afiliados -> ${admin}`);
  console.log(`/api/affiliates/${testSlug}/go -> ${go}`);

  const ok =
    listing === 200 &&
    detail === 200 &&
    (admin === 200 || admin === 307 || admin === 302) &&
    (go === 302 || go === 307);

  if (!ok) process.exit(1);
  console.log("OK smoke test Fase 5.3");
} finally {
  if (createdId) {
    await sb.from("affiliate_links").delete().eq("id", createdId);
  }
}
