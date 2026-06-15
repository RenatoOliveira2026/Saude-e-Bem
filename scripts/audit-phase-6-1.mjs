/**
 * Auditoria Fase 6.1 — rotas de pagamento e integração MP
 * Uso: node scripts/audit-phase-6-1.mjs [baseUrl]
 */
import nextEnv from "@next/env";
import { createHmac } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;
const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnvConfig(join(__dirname, ".."));

const base = (process.argv[2] ?? process.env.SMOKE_BASE_URL ?? "http://localhost:3001").replace(
  /\/+$/,
  "",
);

function maskToken(token) {
  if (!token) return "(ausente)";
  if (token.length <= 8) return "***";
  return `${token.slice(0, 6)}…${token.slice(-4)} (${token.length} chars)`;
}

function configSummary() {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim() ?? "";
  const placeholders = ["your-access-token", "COLE-SEU-TOKEN", "test-your-token"];
  const mpConfigured =
    Boolean(token) &&
    !placeholders.some((p) => token.toLowerCase().includes(p.toLowerCase()));
  const stub =
    process.env.MERCADOPAGO_STUB_MODE === "1" && process.env.NODE_ENV !== "production";
  const webhookSecret = Boolean(process.env.MERCADOPAGO_WEBHOOK_SECRET?.trim());
  const serviceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
  const sandbox =
    process.env.MERCADOPAGO_USE_SANDBOX === "1" || token.startsWith("TEST-");

  return {
    base,
    mpConfigured,
    mpToken: maskToken(token),
    stubMode: stub,
    webhookSecretConfigured: webhookSecret,
    serviceRoleConfigured: serviceRole,
    sandbox,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "(default)",
  };
}

async function request(path, init = {}) {
  const url = `${base}${path}`;
  const started = Date.now();
  let res;
  let bodyText = "";
  try {
    res = await fetch(url, { redirect: "manual", ...init });
    bodyText = await res.text();
  } catch (err) {
    return {
      path,
      ok: false,
      status: 0,
      error: err instanceof Error ? err.message : String(err),
      ms: Date.now() - started,
    };
  }

  let json = null;
  try {
    json = bodyText ? JSON.parse(bodyText) : null;
  } catch {
    json = { _raw: bodyText.slice(0, 500) };
  }

  return {
    path,
    ok: res.ok,
    status: res.status,
    json,
    ms: Date.now() - started,
  };
}

function signWebhook({ dataId, requestId, ts, secret }) {
  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const v1 = createHmac("sha256", secret).update(manifest).digest("hex");
  return { ts, v1, manifest };
}

async function testMpPreferenceDirect() {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim();
  if (!token || token.toLowerCase().includes("cole-seu-token")) {
    return { skipped: true, reason: "MERCADOPAGO_ACCESS_TOKEN não configurado" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? "http://localhost:3001";
  const body = {
    items: [
      {
        id: "premium_annual",
        title: "Audit Test — Premium Anual",
        quantity: 1,
        currency_id: "BRL",
        unit_price: 197.0,
      },
    ],
    external_reference: `audit_${Date.now()}`,
    back_urls: {
      success: `${siteUrl}/minha-assinatura?status=success`,
      failure: `${siteUrl}/minha-assinatura?status=failure`,
      pending: `${siteUrl}/minha-assinatura?status=pending`,
    },
    notification_url: `${siteUrl}/api/payments/webhook`,
  };

  const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text.slice(0, 400) };
  }

  return {
    skipped: false,
    status: res.status,
    ok: res.ok,
    preferenceId: json?.id ?? null,
    initPoint: json?.init_point ? "(presente)" : null,
    error: json?.message ?? json?.error ?? (!res.ok ? text.slice(0, 300) : null),
  };
}

async function testMpPreapprovalDirect() {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim();
  if (!token || token.toLowerCase().includes("cole-seu-token")) {
    return { skipped: true, reason: "MERCADOPAGO_ACCESS_TOKEN não configurado" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? "http://localhost:3001";
  const body = {
    reason: "Audit Test — Premium Mensal",
    external_reference: `audit_pre_${Date.now()}`,
    payer_email: "test@testuser.com",
    auto_recurring: {
      frequency: 1,
      frequency_type: "months",
      transaction_amount: 19.9,
      currency_id: "BRL",
    },
    back_url: `${siteUrl}/minha-assinatura?status=success`,
    notification_url: `${siteUrl}/api/payments/webhook`,
    status: "pending",
  };

  const res = await fetch("https://api.mercadopago.com/preapproval", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text.slice(0, 400) };
  }

  return {
    skipped: false,
    status: res.status,
    ok: res.ok,
    preapprovalId: json?.id ?? null,
    initPoint: json?.init_point ? "(presente)" : null,
    error: json?.message ?? json?.cause?.[0]?.description ?? (!res.ok ? text.slice(0, 300) : null),
  };
}

async function main() {
  const cfg = configSummary();
  console.log("=== CONFIG ===");
  console.log(JSON.stringify(cfg, null, 2));

  console.log("\n=== ROTAS HTTP ===");
  const tests = [
    ["GET /api/payments/webhook", "/api/payments/webhook", { method: "GET" }],
    [
      "POST /api/payments/webhook (sem assinatura)",
      "/api/payments/webhook",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "payment", data: { id: "123" } }),
      },
    ],
    [
      "POST /api/payments/create-subscription (sem auth)",
      "/api/payments/create-subscription",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "premium_monthly" }),
      },
    ],
    [
      "POST /api/payments/create-subscription (plano inválido)",
      "/api/payments/create-subscription",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "invalid_plan" }),
      },
    ],
    [
      "POST /api/payments/create-subscription (mensal)",
      "/api/payments/create-subscription",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "premium_monthly" }),
      },
    ],
    [
      "POST /api/payments/create-subscription (anual)",
      "/api/payments/create-subscription",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "premium_annual" }),
      },
    ],
    ["GET /api/payments/status (sem auth)", "/api/payments/status", { method: "GET" }],
    ["GET /clube", "/clube", { method: "GET" }],
  ];

  const results = [];
  for (const [label, path, init] of tests) {
    const r = await request(path, init);
    results.push({ label, ...r });
    const errMsg = r.json?.error ?? r.error ?? null;
    console.log(
      `${label}: HTTP ${r.status}${errMsg ? ` — ${errMsg}` : ""}${r.json?.checkoutUrl ? " — checkoutUrl OK" : ""}`,
    );
  }

  // Webhook com assinatura válida (se secret configurado)
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET?.trim();
  if (secret) {
    const dataId = "999888777";
    const requestId = "audit-request-id";
    const ts = String(Math.floor(Date.now() / 1000));
    const { v1 } = signWebhook({ dataId, requestId, ts, secret });
    const signed = await request(
      `/api/payments/webhook?type=payment&data.id=${dataId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-request-id": requestId,
          "x-signature": `ts=${ts},v1=${v1}`,
        },
        body: JSON.stringify({ type: "payment", data: { id: dataId }, action: "payment.updated" }),
      },
    );
    results.push({ label: "POST /api/payments/webhook (assinado)", ...signed });
    console.log(
      `POST /api/payments/webhook (assinado): HTTP ${signed.status} — ${signed.json?.message ?? signed.json?.error ?? ""}`,
    );
  } else {
    console.log(
      "POST /api/payments/webhook (assinado): SKIP — MERCADOPAGO_WEBHOOK_SECRET ausente",
    );
  }

  console.log("\n=== MP API DIRETA (REST, não SDK npm) ===");
  const pref = await testMpPreferenceDirect();
  console.log("Preference (anual/checkout pro):", JSON.stringify(pref, null, 2));
  const pre = await testMpPreapprovalDirect();
  console.log("Preapproval (mensal):", JSON.stringify(pre, null, 2));

  console.log("\n=== DIAGNÓSTICO ===");
  const failures = [];

  const webhookUnsigned = results.find((r) =>
    r.label?.includes("webhook (sem assinatura)"),
  );
  if (webhookUnsigned?.status === 0) {
    failures.push({
      rota: "POST /api/payments/webhook",
      erro: webhookUnsigned.error ?? "Servidor inacessível",
    });
  } else if (cfg.mpConfigured && cfg.webhookSecretConfigured && webhookUnsigned?.status !== 401) {
    failures.push({
      rota: "POST /api/payments/webhook (sem assinatura)",
      erro: `Esperado 401, recebeu ${webhookUnsigned?.status}`,
    });
  }

  const createNoAuth = results.find((r) => r.label?.includes("sem auth") && r.path?.includes("create"));
  if (createNoAuth?.status !== 401) {
    failures.push({
      rota: "POST /api/payments/create-subscription (sem auth)",
      erro: `Esperado 401, recebeu ${createNoAuth?.status}`,
    });
  }

  const statusNoAuth = results.find((r) => r.label?.includes("status (sem auth)"));
  if (statusNoAuth?.status !== 401) {
    failures.push({
      rota: "GET /api/payments/status (sem auth)",
      erro: `Esperado 401, recebeu ${statusNoAuth?.status}`,
    });
  }

  if (!pref.skipped && !pref.ok) {
    failures.push({
      rota: "MP API /checkout/preferences",
      erro: `HTTP ${pref.status}: ${pref.error}`,
    });
  }

  if (!pre.skipped && !pre.ok) {
    failures.push({
      rota: "MP API /preapproval",
      erro: `HTTP ${pre.status}: ${pre.error}`,
    });
  }

  const createMonthly = results.find((r) => r.label?.includes("(mensal)"));
  const createAnnual = results.find((r) => r.label?.includes("(anual)"));
  if (createMonthly?.status === 401) {
    console.log("create-subscription mensal: 401 esperado sem sessão — botão redireciona para /entrar");
  } else if (createMonthly && createMonthly.status !== 200) {
    failures.push({
      rota: "POST /api/payments/create-subscription (premium_monthly)",
      erro: `HTTP ${createMonthly.status}: ${createMonthly.json?.error ?? createMonthly.json?._raw ?? "?"}`,
    });
  }

  if (createAnnual?.status === 401) {
    console.log("create-subscription anual: 401 esperado sem sessão — botão redireciona para /entrar");
  } else if (createAnnual && createAnnual.status !== 200) {
    failures.push({
      rota: "POST /api/payments/create-subscription (premium_annual)",
      erro: `HTTP ${createAnnual.status}: ${createAnnual.json?.error ?? createAnnual.json?._raw ?? "?"}`,
    });
  }

  if (failures.length === 0) {
    console.log("Nenhuma falha crítica detectada nos testes automatizados.");
  } else {
    console.log("FALHAS:");
    for (const f of failures) {
      console.log(`  • ${f.rota}: ${f.erro}`);
    }
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
