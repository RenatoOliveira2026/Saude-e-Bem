/**
 * Reconcilia pagamentos pending no Supabase consultando o Mercado Pago.
 *
 * Uso:
 *   node scripts/reconcile-pending-payments.mjs
 *   node scripts/reconcile-pending-payments.mjs --reference=sb_xxx
 *   node scripts/reconcile-pending-payments.mjs --limit=5
 */
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;
const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnvConfig(join(__dirname, ".."));

const MP_API = "https://api.mercadopago.com";

function arg(name) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=").slice(1).join("=") : null;
}

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} ausente no ambiente.`);
  return value;
}

async function mpFetch(path) {
  const token = requireEnv("MERCADOPAGO_ACCESS_TOKEN");
  const res = await fetch(`${MP_API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`MP ${res.status}: ${text.slice(0, 300)}`);
  return JSON.parse(text);
}

async function searchApprovedByReference(externalReference) {
  const data = await mpFetch(
    `/v1/payments/search?external_reference=${encodeURIComponent(externalReference)}`,
  );
  const results = data.results ?? [];
  return (
    results.find((p) => p.status === "approved") ??
    results.find((p) => p.status === "authorized") ??
    null
  );
}

async function main() {
  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRole = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SMOKE_BASE_URL ??
    "https://www.saudeebem.com.br"
  ).replace(/\/+$/, "");

  const limit = Number(arg("limit") ?? "10");
  const externalReference = arg("reference");
  const paymentId = arg("payment-id");

  const admin = createClient(supabaseUrl, serviceRole, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let query = admin
    .from("payments")
    .select("id, external_reference, preference_id, status, created_at")
    .eq("provider", "mercadopago")
    .in("status", ["pending", "in_process", "in_mediation"])
    .order("created_at", { ascending: false })
    .limit(limit);

  if (externalReference) query = query.eq("external_reference", externalReference);
  if (paymentId) query = query.eq("id", paymentId);

  const { data: pending, error } = await query;
  if (error) throw error;

  if (!pending?.length) {
    console.log("Nenhum pagamento pending encontrado.");
    return;
  }

  console.log(`Encontrados ${pending.length} pagamento(s) pending.\n`);

  for (const row of pending) {
    console.log(`— ${row.id}`);
    console.log(`  reference: ${row.external_reference}`);
    console.log(`  preference: ${row.preference_id ?? "—"}`);

    const mpPayment = await searchApprovedByReference(row.external_reference);
    if (!mpPayment) {
      console.log("  MP: nenhum pagamento approved/authorized\n");
      continue;
    }

    console.log(`  MP: #${mpPayment.id} status=${mpPayment.status}`);

    const webhookUrl = `${baseUrl}/api/payments/webhook?topic=payment&id=${mpPayment.id}`;
    const res = await fetch(webhookUrl, { method: "GET" });
    const body = await res.json().catch(() => ({}));

    const { data: paymentRow } = await admin
      .from("payments")
      .select("user_id, status, external_id, subscription_id")
      .eq("id", row.id)
      .maybeSingle();

    console.log(`  webhook HTTP ${res.status}:`, JSON.stringify(body));
    console.log(
      `  local após sync: status=${paymentRow?.status ?? "?"}, external_id=${paymentRow?.external_id ?? "?"}`,
    );

    if (paymentRow?.user_id) {
      const { count } = await admin
        .from("user_memberships")
        .select("id", { count: "exact", head: true })
        .eq("user_id", paymentRow.user_id)
        .eq("status", "active");
      console.log(`  user_memberships ativos: ${count ?? 0}\n`);
    } else {
      console.log("");
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
