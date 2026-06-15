/**
 * Smoke test Fase 6.1 — Assinaturas Mercado Pago
 * Uso: node scripts/smoke-subscriptions.mjs
 */
import nextEnv from "@next/env";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;
const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnvConfig(join(__dirname, ".."));

const base = (process.env.SMOKE_BASE_URL ?? "http://localhost:3001").replace(/\/+$/, "");

async function status(path, init) {
  const res = await fetch(`${base}${path}`, { redirect: "manual", ...init });
  return res.status;
}

const routes = [
  ["/clube", await status("/clube")],
  ["/assinar", await status("/assinar")],
  ["/minha-assinatura", await status("/minha-assinatura")],
  ["/admin/memberships", await status("/admin/memberships")],
  ["/api/payments/status", await status("/api/payments/status")],
  [
    "/api/payments/create-subscription",
    await status("/api/payments/create-subscription", { method: "POST" }),
  ],
  ["/api/payments/webhook", await status("/api/payments/webhook")],
  ["/protocolos", await status("/protocolos")],
  ["/biblioteca", await status("/biblioteca")],
];

for (const [path, code] of routes) {
  console.log(`${path} -> ${code}`);
}

const ok = routes.every(([path, code]) => {
  if (path === "/api/payments/status") return code === 401;
  if (path === "/api/payments/create-subscription") return code === 401;
  if (path === "/minha-assinatura" || path === "/assinar") return code === 307 || code === 302;
  if (path === "/admin/memberships") return code === 307 || code === 302;
  return code === 200;
});

if (!ok) process.exit(1);
console.log("OK smoke subscriptions");
