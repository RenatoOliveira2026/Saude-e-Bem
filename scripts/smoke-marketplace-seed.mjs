/**
 * Smoke test marketplace Fase 5.5 — rotas com produtos seed
 * Uso: node scripts/smoke-marketplace-seed.mjs
 */
import nextEnv from "@next/env";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;
const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnvConfig(join(__dirname, ".."));

const base = (process.env.SMOKE_BASE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001").replace(/\/+$/, "");
const slug = process.env.SMOKE_SLUG ?? "habitos-atomicos";

async function httpStatus(path) {
  const res = await fetch(`${base}${path}`, { redirect: "manual" });
  return res.status;
}

const listing = await httpStatus("/recomendados");
const detail = await httpStatus(`/recomendados/${slug}`);
const admin = await httpStatus("/admin/afiliados");
const go = await httpStatus(
  `/api/affiliates/${slug}/go?source_page=/recomendados&source_type=listing`,
);

console.log(`/recomendados -> ${listing}`);
console.log(`/recomendados/${slug} -> ${detail}`);
console.log(`/admin/afiliados -> ${admin}`);
console.log(`/api/affiliates/${slug}/go -> ${go}`);

const ok =
  listing === 200 &&
  detail === 200 &&
  (admin === 200 || admin === 307 || admin === 302) &&
  (go === 302 || go === 307);

if (!ok) process.exit(1);
console.log("OK smoke marketplace seed");
