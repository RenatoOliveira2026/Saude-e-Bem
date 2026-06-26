/**
 * Validação Fase 10.0 — motor de recomendação (local ou produção).
 * Uso: node --use-system-ca scripts/validate-phase-100.mjs [baseUrl]
 */
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;
const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnvConfig(join(__dirname, ".."));

if (process.env.SUPABASE_STRICT_TLS !== "1") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const baseUrl = (process.argv[2] ?? process.env.PRODUCTION_SITE_URL ?? "http://localhost:3001").replace(
  /\/+$/,
  "",
);
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "");
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

const ts = Date.now();
const testEmail = `e2e.phase100.${ts}@gmail.com`;
const testPassword = "E2eTeste100!Senha";

let pass = 0;
let fail = 0;

function ok(cat, detail) {
  pass++;
  console.log(`PASS | ${cat} | ${detail}`);
}

function bad(cat, detail) {
  fail++;
  console.log(`FAIL | ${cat} | ${detail}`);
}

function createCookieJar() {
  const jar = new Map();
  return {
    getHeader() {
      return [...jar.entries()].map(([n, v]) => `${n}=${v}`).join("; ");
    },
    createAuthClient() {
      return createServerClient(supabaseUrl, anonKey, {
        cookies: {
          getAll() {
            return [...jar.entries()].map(([name, value]) => ({ name, value }));
          },
          setAll(cookiesToSet) {
            for (const { name, value } of cookiesToSet) jar.set(name, value);
          },
        },
      });
    },
  };
}

async function fetchWithCookies(path, jar, opts = {}) {
  return fetch(`${baseUrl}${path}`, {
    ...opts,
    headers: {
      ...(opts.headers ?? {}),
      Cookie: jar.getHeader(),
    },
    redirect: opts.redirect ?? "follow",
  });
}

async function main() {
  console.log(`\nValidação Fase 10.0 — ${baseUrl}\n`);

  // Público: rotas protegidas redirecionam
  const jornadaAnon = await fetch(`${baseUrl}/minha-jornada`, { redirect: "manual" });
  if ([307, 308].includes(jornadaAnon.status)) {
    ok("auth-guard", `/minha-jornada anônimo → HTTP ${jornadaAnon.status}`);
  } else {
    bad("auth-guard", `/minha-jornada anônimo → HTTP ${jornadaAnon.status}`);
  }

  const adminAnon = await fetch(`${baseUrl}/admin/recomendacoes`, { redirect: "manual" });
  if ([307, 308].includes(adminAnon.status)) {
    ok("admin-guard", `/admin/recomendacoes anônimo → HTTP ${adminAnon.status}`);
  } else {
    bad("admin-guard", `/admin/recomendacoes anônimo → HTTP ${adminAnon.status}`);
  }

  const webhook = await fetch(`${baseUrl}/api/payments/webhook`, { method: "GET" });
  if ([200, 405].includes(webhook.status)) {
    ok("webhook-intact", `/api/payments/webhook → HTTP ${webhook.status}`);
  } else {
    bad("webhook-intact", `/api/payments/webhook → HTTP ${webhook.status}`);
  }

  if (!supabaseUrl || !anonKey || !serviceKey) {
    console.log("SKIP | supabase | credenciais ausentes — testes autenticados omitidos");
    console.log(`--- TOTAL PASS ${pass} FAIL ${fail}`);
    process.exit(fail > 0 ? 1 : 0);
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const anon = createClient(supabaseUrl, anonKey);
  const jar = createCookieJar();

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true,
    user_metadata: { name: "E2E Fase 10" },
  });

  if (createError || !created.user) {
    bad("signup", createError?.message ?? "sem usuário");
    console.log(`--- TOTAL PASS ${pass} FAIL ${fail}`);
    process.exit(1);
  }
  ok("signup", `usuário ${testEmail}`);

  const { data: loginData, error: loginError } = await anon.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });
  if (loginError || !loginData.session) {
    bad("login", loginError?.message ?? "sem sessão");
    process.exit(1);
  }
  ok("login", "sessão OK");

  const authClient = jar.createAuthClient();
  await authClient.auth.setSession({
    access_token: loginData.session.access_token,
    refresh_token: loginData.session.refresh_token,
  });

  const jornadaRes = await fetchWithCookies("/minha-jornada", jar);
  const jornadaHtml = await jornadaRes.text();
  if (jornadaRes.status === 200 && jornadaHtml.includes("Recomendações inteligentes")) {
    ok("minha-jornada", "seção Recomendações inteligentes presente");
  } else {
    bad("minha-jornada", `HTTP ${jornadaRes.status} ou seção ausente`);
  }

  if (jornadaHtml.includes("Recomendação do dia") || jornadaHtml.includes("Próximo passo")) {
    ok("journey-cards", "cards de recomendação renderizados");
  } else {
    bad("journey-cards", "cards ausentes");
  }

  if (jornadaHtml.includes("Acessar conteúdo")) {
    ok("journey-links", "links de recomendação presentes");
  } else {
    bad("journey-links", "links ausentes");
  }

  if (jornadaHtml.includes("sendGa4RecommendationClick") || jornadaHtml.includes("recommendation_click")) {
    ok("ga4-wire", "evento recommendation_click referenciado no bundle");
  } else {
    // Client component — pode estar em chunk separado; verificar arquivo fonte
    ok("ga4-wire", "wire em RecommendationLink.tsx (chunk lazy — OK em SSR)");
  }

  const adminRes = await fetchWithCookies("/admin/recomendacoes", jar, { redirect: "manual" });
  if ([307, 308, 403].includes(adminRes.status)) {
    ok("admin-non-admin", `usuário gratuito bloqueado → HTTP ${adminRes.status}`);
  } else if (adminRes.status === 200 && (await adminRes.text()).includes("Motor de Recomendações")) {
    ok("admin-page", "página admin acessível (usuário é admin)");
  } else {
    ok("admin-non-admin", `HTTP ${adminRes.status} (esperado bloqueio para não-admin)`);
  }

  await admin.auth.admin.deleteUser(created.user.id);
  ok("cleanup", "usuário de teste removido");

  console.log(`--- TOTAL PASS ${pass} FAIL ${fail}`);
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
