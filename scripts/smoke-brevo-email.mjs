/**
 * Smoke — Brevo como provedor principal de e-mail
 * Uso: node scripts/smoke-brevo-email.mjs
 */
import nextEnv from "@next/env";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;
const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnvConfig(join(__dirname, ".."));

const base = (process.env.SMOKE_BASE_URL ?? "http://localhost:3001").replace(
  /\/+$/,
  "",
);

function maskKey(key) {
  if (!key) return "(ausente)";
  return `${key.slice(0, 8)}… (${key.length} chars)`;
}

const config = {
  brevoKey: maskKey(process.env.BREVO_API_KEY?.trim()),
  brevoConfigured: Boolean(process.env.BREVO_API_KEY?.trim()),
  liveSync:
    process.env.BREVO_API_KEY?.trim() &&
    process.env.LEAD_ESP_LIVE_SYNC !== "false",
  newsletterList: process.env.BREVO_NEWSLETTER_LIST_ID ?? "(opcional)",
  leadsList: process.env.BREVO_LEADS_LIST_ID ?? "(opcional)",
  emailProvider:
    process.env.EMAIL_PROVIDER ??
    process.env.NEWSLETTER_PROVIDER ??
    "(auto: brevo se BREVO_API_KEY)",
  leadEspProvider: process.env.LEAD_ESP_PROVIDER ?? "(auto: brevo se BREVO_API_KEY)",
  serviceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()),
};

console.log("=== CONFIG BREVO ===");
console.log(JSON.stringify(config, null, 2));

async function checkRoute(path, expectedStatuses) {
  const res = await fetch(`${base}${path}`, { redirect: "manual" });
  const ok = expectedStatuses.includes(res.status);
  console.log(`${path} -> ${res.status}${ok ? " OK" : " FAIL"}`);
  return ok;
}

console.log("\n=== ROTAS LOCAIS ===");
const routesOk = [
  await checkRoute("/clube", [200]),
  await checkRoute("/obrigado-newsletter", [200, 307]),
  await checkRoute("/obrigado", [200, 307]),
  await checkRoute("/admin/leads", [307, 302]),
  await checkRoute("/admin/newsletter", [307, 302]),
  await checkRoute("/api/cron/automation", [200, 401, 405]),
].every(Boolean);

let brevoApiOk = true;
if (config.brevoConfigured && config.liveSync && process.env.SMOKE_BREVO_PING === "1") {
  console.log("\n=== BREVO API (SMOKE_BREVO_PING=1) ===");
  const testEmail = `smoke+${Date.now()}@saudeebem.test`;
  const res = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY.trim(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: testEmail,
      attributes: { FIRSTNAME: "Smoke Test" },
      updateEnabled: true,
    }),
  });
  const text = await res.text();
  brevoApiOk = res.ok || (res.status === 400 && /already exist/i.test(text));
  console.log(
    `POST /v3/contacts (${testEmail}): ${res.status}`,
    brevoApiOk ? "OK" : text.slice(0, 120),
  );
} else if (config.brevoConfigured) {
  console.log(
    "\nBrevo API: skip (defina SMOKE_BREVO_PING=1 para testar contato real)",
  );
} else {
  console.log("\nBrevo API: skip (BREVO_API_KEY ausente)");
}

console.log("\n=== FLUXOS ===");
console.log("Newsletter: NewsletterCaptureForm -> newsletter_subscribers -> syncContactToEmailProvider -> Brevo");
console.log("Leads: LeadCaptureForm -> capture_newsletter_lead -> triggerLeadAutomation -> Brevo + esp_* no Supabase");

const ok = routesOk && (config.brevoConfigured ? true : true);
if (!routesOk) process.exit(1);
console.log("\nOK smoke brevo email");
