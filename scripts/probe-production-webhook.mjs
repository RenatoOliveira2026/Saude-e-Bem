/**
 * Testa o webhook Mercado Pago em produção (sem alterar pagamentos reais).
 * Uso:
 *   node scripts/probe-production-webhook.mjs
 *   node scripts/probe-production-webhook.mjs --payment-id=123456789
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

const baseUrl = (
  process.env.PRODUCTION_SITE_URL ?? "https://www.saudeebem.com.br"
).replace(/\/+$/, "");

async function probe(label, url, init) {
  const res = await fetch(url, init);
  let body;
  try {
    body = await res.json();
  } catch {
    body = await res.text();
  }
  console.log(`\n=== ${label} ===`);
  console.log(`${init?.method ?? "GET"} ${url}`);
  console.log(`Status: ${res.status}`);
  console.log(JSON.stringify(body, null, 2));
  return { status: res.status, body };
}

async function main() {
  const paymentId = arg("payment-id") ?? "999999999";

  await probe("Health GET (sem params)", `${baseUrl}/api/payments/webhook`);

  await probe(
    "IPN GET Checkout Pro",
    `${baseUrl}/api/payments/webhook?topic=payment&id=${paymentId}`,
  );

  await probe("POST sem assinatura (deve 401 ou processar stub)", `${baseUrl}/api/payments/webhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "payment", data: { id: paymentId } }),
  });

  await probe("POST com x-signature inválida + payload IPN", `${baseUrl}/api/payments/webhook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-signature": "ts=1,v1=invalid",
      "x-request-id": "probe-phase-85",
    },
    body: JSON.stringify({ type: "payment", data: { id: paymentId } }),
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
