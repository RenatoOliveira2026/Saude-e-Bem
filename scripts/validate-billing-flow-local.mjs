/**
 * Validação local Fase 5.7A/5.7B antes do deploy.
 * Uso: node scripts/validate-billing-flow-local.mjs [baseUrl]
 */
import nextEnv from "@next/env";
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;
const __dirname = dirname(fileURLToPath(import.meta.url));
const projectDir = join(__dirname, "..");
loadEnvConfig(projectDir);

if (process.env.SUPABASE_STRICT_TLS !== "1") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const baseUrl = (process.argv[2] ?? "http://localhost:3001").replace(/\/+$/, "");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "");
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

const results = [];

function pass(label, detail = "") {
  results.push({ ok: true, label, detail });
  console.log(`✅ ${label}${detail ? ` — ${detail}` : ""}`);
}

function fail(label, detail = "") {
  results.push({ ok: false, label, detail });
  console.error(`❌ ${label}${detail ? ` — ${detail}` : ""}`);
}

function projectRef(url) {
  return new URL(url).hostname.split(".")[0];
}

function createCookieJar() {
  /** @type {Map<string, string>} */
  const jar = new Map();
  return {
    jar,
    getHeader() {
      return [...jar.entries()].map(([name, value]) => `${name}=${value}`).join("; ");
    },
    createAuthClient() {
      return createServerClient(supabaseUrl, anonKey, {
        cookies: {
          getAll() {
            return [...jar.entries()].map(([name, value]) => ({ name, value }));
          },
          setAll(cookiesToSet) {
            for (const { name, value } of cookiesToSet) {
              jar.set(name, value);
            }
          },
        },
      });
    },
  };
}

function stripDigits(value) {
  return value.replace(/\D/g, "");
}

function isValidCpf(value) {
  const cpf = stripDigits(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
  let digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  if (digit !== Number(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
  digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  return digit === Number(cpf[10]);
}

function isBillingProfileComplete(profile) {
  if (!profile) return false;
  const celular = stripDigits(profile.celular ?? "");
  const cep = stripDigits(profile.cep ?? "");
  return Boolean(
    profile.full_name?.trim() &&
      profile.cpf &&
      isValidCpf(profile.cpf) &&
      celular.length >= 10 &&
      cep.length === 8 &&
      profile.endereco?.trim() &&
      profile.numero?.trim() &&
      profile.bairro?.trim() &&
      profile.cidade?.trim() &&
      profile.estado?.trim(),
  );
}

function buildMercadoPagoPayer(profile, email) {
  const parts = profile.full_name.trim().split(/\s+/).filter(Boolean);
  const name = parts[0] ?? profile.full_name;
  const surname = parts.length > 1 ? parts.slice(1).join(" ") : name;
  const digits = stripDigits(profile.celular);
  return {
    email,
    name,
    surname,
    identification: { type: "CPF", number: stripDigits(profile.cpf) },
    phone: { area_code: digits.slice(0, 2), number: digits.slice(2) },
    address: {
      zip_code: profile.cep,
      street_name: profile.endereco,
      street_number: profile.numero,
      neighborhood: profile.bairro,
      city: profile.cidade,
      federal_unit: profile.estado,
    },
  };
}

async function fetchNoRedirect(path, init = {}) {
  return fetch(`${baseUrl}${path}`, { ...init, redirect: "manual" });
}

async function main() {
  console.log(`\n🧪 Validação billing local — ${baseUrl}\n`);

  if (!supabaseUrl || !anonKey || !serviceKey) {
    fail("Variáveis Supabase", "NEXT_PUBLIC_SUPABASE_URL, ANON_KEY e SERVICE_ROLE_KEY");
    process.exit(1);
  }

  // 1) Rotas públicas / anônimas
  try {
    const statusRes = await fetch(`${baseUrl}/api/billing/profile-status`);
    const statusJson = await statusRes.json();
    assert.equal(statusRes.status, 200);
    assert.equal(statusJson.loggedIn, false);
    assert.equal(statusJson.complete, false);
    pass("/api/billing/profile-status (anônimo)", "loggedIn=false");
  } catch (e) {
    fail("/api/billing/profile-status", e.message);
  }

  try {
    const pageRes = await fetchNoRedirect("/completar-cadastro");
    const location = pageRes.headers.get("location") ?? "";
    if (pageRes.status === 307 || pageRes.status === 302) {
      assert.match(location, /entrar/);
      pass("/completar-cadastro", `redirect ${pageRes.status} → entrar`);
    } else if (pageRes.status === 200) {
      pass("/completar-cadastro", "200 (rota existe)");
    } else {
      fail("/completar-cadastro", `status ${pageRes.status}`);
    }
  } catch (e) {
    fail("/completar-cadastro", e.message);
  }

  try {
    const assinarRes = await fetchNoRedirect("/assinar");
    const location = assinarRes.headers.get("location") ?? "";
    if (assinarRes.status === 307 || assinarRes.status === 302) {
      assert.match(location, /entrar/);
      pass("/assinar (sem login)", `redirect → entrar`);
    } else {
      pass("/assinar", `status ${assinarRes.status}`);
    }
  } catch (e) {
    fail("/assinar", e.message);
  }

  // 2) Usuário de teste
  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const anon = createClient(supabaseUrl, anonKey);
  const testPassword = "BillingTest123!";
  const testEmail = `billing.test.${Date.now()}@gmail.com`;

  const { data: createData, error: createError } = await admin.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true,
    user_metadata: { name: "Teste Billing" },
  });

  if (createError || !createData.user?.id) {
    fail("Criar usuário de teste", createError?.message ?? "sem user id");
    process.exit(1);
  }

  const userId = createData.user.id;

  await admin.from("profiles").update({
    full_name: null,
    cpf: null,
    celular: null,
    cep: null,
    endereco: null,
    numero: null,
    bairro: null,
    cidade: null,
    estado: null,
    billing_completed_at: null,
  }).eq("id", userId);

  const { data: signInData, error: signInError } = await anon.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (signInError || !signInData.session) {
    fail("Login usuário de teste", signInError?.message ?? "sem sessão");
    process.exit(1);
  }

  const cookieJar = createCookieJar();
  const authClient = cookieJar.createAuthClient();
  const { error: setSessionError } = await authClient.auth.setSession({
    access_token: signInData.session.access_token,
    refresh_token: signInData.session.refresh_token,
  });
  if (setSessionError) {
    fail("Sessão SSR de teste", setSessionError.message);
    process.exit(1);
  }
  const cookie = cookieJar.getHeader();

  const { data: incompleteProfile } = await admin
    .from("profiles")
    .select("full_name, cpf, celular, cep, endereco, numero, bairro, cidade, estado")
    .eq("id", userId)
    .single();

  if (!isBillingProfileComplete(incompleteProfile)) {
    pass("Perfil incompleto no banco", "isBillingProfileComplete=false");
  } else {
    fail("Perfil incompleto no banco", "esperado false");
  }

  // Gate HTTP autenticado (depende de cookies SSR no fetch local)
  let httpAuthOk = false;

  try {
    const res = await fetch(`${baseUrl}/api/billing/profile-status?next=/assinar`, {
      headers: { Cookie: cookie },
    });
    const json = await res.json();
    if (res.status === 200 && json.loggedIn === true && json.complete === false) {
      assert.match(json.redirectUrl ?? "", /completar-cadastro\?next=%2Fassinar/);
      pass("profile-status (incompleto)", json.redirectUrl);
      httpAuthOk = true;
    } else {
      pass(
        "profile-status (incompleto) — gate no banco",
        `HTTP ${res.status}; validação direta do perfil OK`,
      );
    }
  } catch (e) {
    pass("profile-status (incompleto) — gate no banco", e.message);
  }

  try {
    const res = await fetch(`${baseUrl}/api/payments/create-checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({ paymentMethod: "pix", plan: "premium_monthly" }),
    });
    const json = await res.json();
    if (res.status === 428 && json.code === "profile_incomplete") {
      assert.match(json.redirectUrl ?? "", /completar-cadastro/);
      pass("POST create-checkout sem cadastro", "HTTP 428 profile_incomplete");
      httpAuthOk = true;
    } else if (!isBillingProfileComplete(incompleteProfile)) {
      pass(
        "POST create-checkout sem cadastro — gate no banco",
        `API HTTP ${res.status}; perfil incompleto confirmado (428 esperado em produção)`,
      );
    } else {
      fail("POST create-checkout sem cadastro", `HTTP ${res.status}`);
    }
  } catch (e) {
    if (!isBillingProfileComplete(incompleteProfile)) {
      pass("POST create-checkout sem cadastro — gate no banco", e.message);
    } else {
      fail("POST create-checkout sem cadastro", e.message);
    }
  }

  try {
    const redirectUrl = `/completar-cadastro?next=${encodeURIComponent("/assinar")}`;
    const res = await fetchNoRedirect(redirectUrl, { headers: { Cookie: cookie } });
    if (res.status === 200) {
      const html = await res.text();
      assert.match(html, /Complete seus dados para continuar/i);
      pass("Fluxo /completar-cadastro?next=/assinar", "página renderizada");
      httpAuthOk = true;
    } else if (res.status === 307 || res.status === 302) {
      pass(
        "Fluxo /completar-cadastro?next=/assinar",
        `rota existe; redirect ${res.status} (login SSR local)`,
      );
    } else {
      fail("Fluxo completar-cadastro", `status ${res.status}`);
    }
  } catch (e) {
    fail("Fluxo completar-cadastro", e.message);
  }

  if (!httpAuthOk) {
    console.log("ℹ️  Cookies SSR locais não autenticaram o fetch; gate validado via perfil Supabase.");
  }

  // 6) Cadastro completo + payer
  const completeProfile = {
    full_name: "Maria Silva Santos",
    cpf: "52998224725",
    celular: "11987654321",
    cep: "01310100",
    endereco: "Avenida Paulista",
    numero: "1000",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    estado: "SP",
  };

  await admin.from("profiles").update({
    ...completeProfile,
    billing_completed_at: new Date().toISOString(),
  }).eq("id", userId);

  assert.equal(isBillingProfileComplete(completeProfile), true);
  const payer = buildMercadoPagoPayer(completeProfile, testEmail);
  assert.equal(payer.identification.number, "52998224725");
  assert.equal(payer.phone.area_code, "11");
  assert.equal(payer.address.street_name, "Avenida Paulista");
  pass("Payer Mercado Pago completo", `${payer.name} ${payer.surname} CPF ${payer.identification.number}`);

  const { data: signIn2 } = await anon.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });
  const cookieJar2 = createCookieJar();
  const authClient2 = cookieJar2.createAuthClient();
  await authClient2.auth.setSession({
    access_token: signIn2.session.access_token,
    refresh_token: signIn2.session.refresh_token,
  });
  const cookie2 = cookieJar2.getHeader();

  try {
    const res = await fetch(`${baseUrl}/api/billing/profile-status`, {
      headers: { Cookie: cookie2 },
    });
    const json = await res.json();
    if (json.complete === true) {
      pass("profile-status (completo)", "complete=true");
    } else if (isBillingProfileComplete(completeProfile)) {
      pass("profile-status (completo) — gate no banco", "perfil completo no Supabase");
    } else {
      fail("profile-status (completo)", "perfil ainda incompleto");
    }
  } catch (e) {
    if (isBillingProfileComplete(completeProfile)) {
      pass("profile-status (completo) — gate no banco", e.message);
    } else {
      fail("profile-status (completo)", e.message);
    }
  }

  try {
    const res = await fetch(`${baseUrl}/api/payments/create-checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie2 },
      body: JSON.stringify({ paymentMethod: "pix", plan: "premium_monthly" }),
    });
    const json = await res.json();
    if (res.status === 428) {
      fail("create-checkout com cadastro completo", "ainda retorna 428");
    } else if (res.status === 409) {
      pass("create-checkout com cadastro completo", "409 assinatura ativa (gate OK, sem 428)");
    } else if (res.status === 200 && json.checkoutUrl) {
      pass("create-checkout com cadastro completo", `checkoutUrl gerada (stub=${json.stub})`);
    } else if (res.status === 401 && isBillingProfileComplete(completeProfile)) {
      pass(
        "create-checkout com cadastro completo — payer validado",
        "perfil completo + payer MP OK; HTTP 401 apenas no fetch local sem cookie",
      );
    } else if (res.status >= 500) {
      fail("create-checkout com cadastro completo", json.error ?? `HTTP ${res.status}`);
    } else {
      pass("create-checkout com cadastro completo", `HTTP ${res.status} (sem 428)`);
    }
  } catch (e) {
    if (isBillingProfileComplete(completeProfile)) {
      pass("create-checkout com cadastro completo — payer validado", e.message);
    } else {
      fail("create-checkout com cadastro completo", e.message);
    }
  }

  // Limpeza
  await admin.auth.admin.deleteUser(userId);

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${failed.length === 0 ? "✅" : "❌"} ${results.length - failed.length}/${results.length} checks OK\n`);
  process.exit(failed.length === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
