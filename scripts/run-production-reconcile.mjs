/**
 * Chama a reconciliação em produção usando SUPABASE_SERVICE_ROLE_KEY local.
 * Uso: node --use-system-ca scripts/run-production-reconcile.mjs [--reference=sb_xxx] [--limit=10]
 */
import nextEnv from "@next/env";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;
const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnvConfig(join(__dirname, ".."));

function arg(name) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=").slice(1).join("=") : null;
}

async function main() {
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.saudeebem.com.br"
  ).replace(/\/+$/, "");

  if (!serviceRole) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY ausente no .env.local");
  }

  const externalReference = arg("reference");
  const limit = Number(arg("limit") ?? "10");

  const res = await fetch(`${baseUrl}/api/admin/payments/reconcile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${serviceRole}`,
    },
    body: JSON.stringify({
      limit,
      ...(externalReference ? { externalReference } : {}),
    }),
  });

  const body = await res.json();
  console.log(JSON.stringify({ status: res.status, body }, null, 2));
  if (!res.ok) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
