/**
 * Smoke test Fase 6.0 — Clube / Área Premium
 * Uso: node scripts/smoke-phase-6-clube.mjs
 */
import nextEnv from "@next/env";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;
const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnvConfig(join(__dirname, ".."));

const base = (process.env.SMOKE_BASE_URL ?? "http://localhost:3001").replace(/\/+$/, "");

async function status(path) {
  const res = await fetch(`${base}${path}`, { redirect: "manual" });
  return res.status;
}

const checks = [
  ["/clube", await status("/clube")],
  ["/admin/memberships", await status("/admin/memberships")],
  ["/protocolos", await status("/protocolos")],
  ["/biblioteca", await status("/biblioteca")],
  ["/ferramentas", await status("/ferramentas")],
  ["/assinar", await status("/assinar")],
];

for (const [path, code] of checks) {
  console.log(`${path} -> ${code}`);
}

const ok = checks.every(([, code]) => code === 200 || code === 307 || code === 302);
if (!ok) process.exit(1);
console.log("OK smoke phase 6 clube");
