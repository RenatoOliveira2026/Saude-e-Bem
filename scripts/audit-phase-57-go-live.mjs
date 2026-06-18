/**
 * Fase 5.7 — Auditoria operacional Go-Live
 * Uso: node --use-system-ca scripts/audit-phase-57-go-live.mjs
 */
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const root = process.cwd();
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3001";

const approved = [];
const pending = [];
const blockers = [];

function ok(msg) {
  approved.push(msg);
}
function warn(msg) {
  pending.push(msg);
}
function block(msg) {
  blockers.push(msg);
}

function envSet(name, required = false) {
  const val = process.env[name]?.trim();
  if (val) return val;
  if (required) block(`Variável obrigatória ausente: ${name}`);
  else warn(`Variável opcional ausente: ${name}`);
  return null;
}

function fileExists(rel) {
  return existsSync(join(root, rel));
}

console.log("\n══════════════════════════════════════════════════");
console.log("  FASE 5.7 — Auditoria Go-Live Operacional");
console.log("══════════════════════════════════════════════════\n");
console.log(`Site URL: ${siteUrl}\n`);

// ── 1. Variáveis de ambiente ──
console.log("## 1. Variáveis de ambiente\n");

envSet("NEXT_PUBLIC_SUPABASE_URL", true);
envSet("NEXT_PUBLIC_SUPABASE_ANON_KEY", true);
envSet("SUPABASE_SERVICE_ROLE_KEY", true);
envSet("NEXT_PUBLIC_SITE_URL", true);

const mpToken = envSet("MERCADOPAGO_ACCESS_TOKEN", true);
const mpWebhook = envSet("MERCADOPAGO_WEBHOOK_SECRET", true);
const paymentsCron = envSet("PAYMENTS_CRON_SECRET", true);
const brevoKey = envSet("BREVO_API_KEY");
envSet("NEWSLETTER_PROVIDER");
envSet("LEAD_ESP_LIVE_SYNC");
envSet("LEAD_AUTOMATION_CRON_SECRET");
envSet("BREVO_PREMIUM_LIST_ID");
envSet("BREVO_NEWSLETTER_LIST_ID");

if (mpToken?.startsWith("TEST-")) {
  warn("MERCADOPAGO_ACCESS_TOKEN é TEST- (sandbox) — não use em produção");
} else if (mpToken?.startsWith("APP_USR-")) {
  ok("Mercado Pago Access Token formato produção (APP_USR-)");
}

if (process.env.MERCADOPAGO_STUB_MODE === "1") {
  block("MERCADOPAGO_STUB_MODE=1 ativo — desative em produção");
}

if (mpWebhook) ok("MERCADOPAGO_WEBHOOK_SECRET configurado");
if (paymentsCron) ok("PAYMENTS_CRON_SECRET configurado");
if (brevoKey) ok("BREVO_API_KEY configurado");
if (process.env.LEAD_ESP_LIVE_SYNC === "true" || (brevoKey && process.env.LEAD_ESP_LIVE_SYNC !== "false")) {
  ok("Sync Brevo habilitado (LEAD_ESP_LIVE_SYNC)");
} else if (brevoKey) {
  warn("BREVO_API_KEY presente mas LEAD_ESP_LIVE_SYNC pode estar desativado");
}

// ── 2. Arquivos de fluxo ──
console.log("\n## 2. Fluxos implementados (código)\n");

const flowFiles = [
  ["Cadastro", "src/lib/auth/actions.ts", "signUp"],
  ["Login", "src/lib/auth/actions.ts", "signIn"],
  ["Recuperação senha", "src/lib/auth/actions.ts", "resetPassword"],
  ["Redefinir senha", "src/lib/auth/actions.ts", "updatePassword"],
  ["Auth callback", "src/app/auth/callback/route.ts"],
  ["Checkout MP", "src/app/api/payments/create-checkout/route.ts"],
  ["Webhook MP", "src/app/api/payments/webhook/route.ts"],
  ["Cancelamento", "src/app/api/payments/cancel-subscription/route.ts"],
  ["Sync pós-checkout", "src/app/api/payments/sync/route.ts"],
  ["Cron assinaturas", "src/app/api/payments/cron/subscriptions/route.ts"],
  ["Sync Brevo premium", "src/lib/brevo/premium-sync.ts"],
];

for (const [label, file, needle] of flowFiles) {
  const path = join(root, file);
  if (!existsSync(path)) {
    block(`${label}: arquivo ausente (${file})`);
    continue;
  }
  const content = readFileSync(path, "utf8");
  if (needle && !content.includes(needle)) {
    warn(`${label}: ${needle} não encontrado em ${file}`);
  } else {
    ok(`${label}`);
  }
}

// ── 3. LGPD ──
console.log("\n## 3. LGPD\n");

for (const page of ["privacidade", "termos", "cookies"]) {
  if (fileExists(`src/app/${page}/page.tsx`)) {
    ok(`Página /${page}`);
  } else {
    block(`Página /${page} ausente`);
  }
}

const footer = readFileSync(join(root, "src/components/layout/Footer.tsx"), "utf8");
if (footer.includes("routes.privacidade") && footer.includes("routes.termos") && footer.includes("routes.cookies")) {
  ok("Footer com links legais");
} else {
  warn("Footer sem todos os links legais");
}

// ── 4. Crons Vercel ──
console.log("\n## 4. Crons (vercel.json)\n");

const vercelJson = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));
const cronPaths = (vercelJson.crons ?? []).map((c) => c.path);
for (const path of [
  "/api/payments/cron/subscriptions",
  "/api/cron/whatsapp-automation",
  "/api/cron/automation",
]) {
  if (cronPaths.includes(path)) ok(`Cron ${path}`);
  else warn(`Cron ausente em vercel.json: ${path}`);
}

// ── 5. Supabase remoto ──
console.log("\n## 5. Supabase (remoto)\n");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (supabaseUrl && serviceKey) {
  const sb = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const tables = [
    "profiles",
    "subscriptions",
    "payments",
    "payment_webhook_events",
    "membership_plans",
    "newsletter_subscribers",
  ];

  for (const table of tables) {
    const { error } = await sb.from(table).select("id", { count: "exact", head: true });
    if (error) warn(`Tabela ${table}: ${error.message}`);
    else ok(`Tabela ${table}`);
  }

  const { data: plans } = await sb
    .from("membership_plans")
    .select("slug, price")
    .in("slug", ["premium-mensal", "premium-anual"]);
  if (plans?.length) ok(`Planos membership: ${plans.map((p) => p.slug).join(", ")}`);
}

// ── 6. Rotas HTTP (se servidor local) ──
console.log("\n## 6. Rotas HTTP\n");

const routesToCheck = [
  "/entrar",
  "/cadastro",
  "/recuperar-senha",
  "/redefinir-senha",
  "/assinar",
  "/minha-assinatura",
  "/privacidade",
  "/termos",
  "/cookies",
  "/api/payments/webhook",
];

let serverUp = false;
try {
  const ping = await fetch(`${siteUrl}/entrar`, { signal: AbortSignal.timeout(5000) });
  serverUp = ping.ok || ping.status === 200;
} catch {
  warn("Servidor local não detectado — pule validação HTTP ou rode npm run start");
}

if (serverUp) {
  for (const path of routesToCheck) {
    try {
      const res = await fetch(`${siteUrl}${path}`, {
        method: path.includes("webhook") ? "GET" : "GET",
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok || res.status === 401 || res.status === 405) {
        ok(`${path} → ${res.status}`);
      } else {
        warn(`${path} → ${res.status}`);
      }
    } catch (e) {
      warn(`${path}: ${e.message}`);
    }
  }
}

// ── 7. Mercado Pago API (token válido) ──
console.log("\n## 7. Mercado Pago API\n");

if (mpToken && !mpToken.startsWith("TEST-")) {
  try {
    const res = await fetch("https://api.mercadopago.com/users/me", {
      headers: { Authorization: `Bearer ${mpToken}` },
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) {
      const data = await res.json();
      ok(`MP users/me OK — id: ${data.id}, nickname: ${data.nickname ?? "—"}`);
      if (data.company?.brand_name) {
        ok(`Nome comercial MP: ${data.company.brand_name}`);
      } else {
        warn("Nome comercial não retornado — configure no painel Mercado Pago");
      }
    } else {
      const text = await res.text();
      block(`MP users/me falhou (${res.status}): ${text.slice(0, 120)}`);
    }
  } catch (e) {
    warn(`MP API inacessível: ${e.message}`);
  }
} else if (mpToken?.startsWith("TEST-")) {
  warn("Token TEST — validação users/me omitida (sandbox)");
}

// ── Resumo ──
console.log("\n══════════════════════════════════════════════════");
console.log("  RESUMO");
console.log("══════════════════════════════════════════════════\n");

console.log(`✅ Aprovado (${approved.length})`);
for (const a of approved.slice(0, 15)) console.log(`   · ${a}`);
if (approved.length > 15) console.log(`   … +${approved.length - 15} itens`);

console.log(`\n🟠 Pendente (${pending.length})`);
for (const p of pending) console.log(`   · ${p}`);

console.log(`\n🔴 Bloqueia faturamento (${blockers.length})`);
for (const b of blockers) console.log(`   · ${b}`);

console.log("\n══════════════════════════════════════════════════\n");

process.exit(blockers.length > 0 ? 1 : 0);
