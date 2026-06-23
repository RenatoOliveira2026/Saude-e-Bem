/**
 * Ativa Premium para pagamento pending com PIX aprovado no MP.
 * Uso:
 *   node scripts/activate-payment-reference.mjs --reference=sb_e65791ed_539b53dc
 *   node scripts/activate-payment-reference.mjs --reference=sb_xxx --mp-id=123456
 */
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;
const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnvConfig(join(__dirname, ".."));

const MP_API = "https://api.mercadopago.com";
const PREMIUM_MENSAL_PLAN_ID = "f0600006-0006-4006-8006-000000000002";

function arg(name) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=").slice(1).join("=") : null;
}

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} ausente.`);
  return value;
}

async function mpFetch(path) {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim();
  if (!token) return null;
  const res = await fetch(`${MP_API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`MP ${res.status}: ${text.slice(0, 400)}`);
  return JSON.parse(text);
}

function addDays(date, days) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

async function activate(admin, payment, mpPayment) {
  const planId = payment.billing_plan_id ?? payment.metadata?.plan ?? "premium_monthly";
  const paymentMethod = payment.payment_method ?? "pix";
  const membershipOrigin = payment.metadata?.membership_origin ?? "pix_30_dias";
  const accessDays = planId === "premium_annual" ? 365 : 30;
  const now = new Date();
  const periodStart = now;
  const periodEnd = addDays(periodStart, accessDays);

  await admin
    .from("payments")
    .update({
      external_id: String(mpPayment.id),
      status: "approved",
      paid_at: mpPayment.date_approved ?? now.toISOString(),
      metadata: {
        ...(payment.metadata ?? {}),
        mercadopago: mpPayment,
        reconciled_at: now.toISOString(),
        reconciled_via: "activate-payment-reference",
      },
    })
    .eq("id", payment.id);

  const { data: existingSub } = await admin
    .from("subscriptions")
    .select("id")
    .eq("user_id", payment.user_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const subscriptionPayload = {
    plan: "premium",
    status: "active",
    provider: "mercadopago",
    billing_plan_id: planId,
    auto_renew: false,
    cancel_at_period_end: false,
    current_period_start: periodStart.toISOString(),
    current_period_end: periodEnd.toISOString(),
    canceled_at: null,
    metadata: {
      last_payment_id: payment.id,
      last_external_reference: payment.external_reference,
      billing_plan: planId,
      membership_origin: membershipOrigin,
      access_period_days: accessDays,
      renewed_at: now.toISOString(),
    },
  };

  let subscriptionId;
  if (existingSub) {
    const { data: updated, error } = await admin
      .from("subscriptions")
      .update(subscriptionPayload)
      .eq("id", existingSub.id)
      .select("id")
      .single();
    if (error) throw error;
    subscriptionId = updated.id;
  } else {
    const { data: inserted, error } = await admin
      .from("subscriptions")
      .insert({ user_id: payment.user_id, ...subscriptionPayload })
      .select("id")
      .single();
    if (error) throw error;
    subscriptionId = inserted.id;
  }

  await admin
    .from("payments")
    .update({ subscription_id: subscriptionId })
    .eq("id", payment.id);

  await admin
    .from("user_memberships")
    .update({ status: "canceled" })
    .eq("user_id", payment.user_id)
    .in("status", ["active", "trialing", "pending", "past_due"]);

  const { data: existingMembership } = await admin
    .from("user_memberships")
    .select("id")
    .eq("user_id", payment.user_id)
    .eq("plan_id", PREMIUM_MENSAL_PLAN_ID)
    .eq("status", "active")
    .maybeSingle();

  if (existingMembership) {
    await admin
      .from("user_memberships")
      .update({
        expires_at: periodEnd.toISOString(),
        provider: "mercadopago",
        external_id: payment.external_reference,
        membership_origin: membershipOrigin,
      })
      .eq("id", existingMembership.id);
  } else {
    await admin.from("user_memberships").insert({
      user_id: payment.user_id,
      plan_id: PREMIUM_MENSAL_PLAN_ID,
      status: "active",
      started_at: periodStart.toISOString(),
      expires_at: periodEnd.toISOString(),
      provider: "mercadopago",
      external_id: payment.external_reference,
      membership_origin: membershipOrigin,
    });
  }

  return { subscriptionId, periodEnd, mpId: String(mpPayment.id) };
}

async function main() {
  const reference = arg("reference");
  const mpIdArg = arg("mp-id");
  if (!reference) throw new Error("Use --reference=sb_xxx");

  const admin = createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const { data: payment, error } = await admin
    .from("payments")
    .select("*")
    .eq("external_reference", reference)
    .maybeSingle();

  if (error) throw error;
  if (!payment) throw new Error(`Pagamento não encontrado: ${reference}`);

  let mpPayment = null;
  const force = process.argv.includes("--force");

  if (force) {
    mpPayment = {
      id: mpIdArg ?? `manual_${Date.now()}`,
      status: "approved",
      date_approved: new Date().toISOString(),
      external_reference: reference,
    };
    console.warn("Modo --force: ativando sem consulta ao Mercado Pago.");
  } else if (mpIdArg) {
    mpPayment = await mpFetch(`/v1/payments/${mpIdArg}`);
  } else {
    const search = await mpFetch(
      `/v1/payments/search?external_reference=${encodeURIComponent(reference)}`,
    );
    mpPayment =
      search?.results?.find((p) => p.status === "approved") ??
      search?.results?.find((p) => p.status === "authorized") ??
      null;
  }

  if (!mpPayment) {
    throw new Error(
      "Pagamento approved não encontrado no MP. Passe --mp-id= ou configure MERCADOPAGO_ACCESS_TOKEN.",
    );
  }

  const result = await activate(admin, payment, mpPayment);
  console.log(
    JSON.stringify(
      {
        ok: true,
        userId: payment.user_id,
        paymentId: payment.id,
        externalReference: reference,
        mercadoPagoId: result.mpId,
        subscriptionId: result.subscriptionId,
        expiresAt: result.periodEnd.toISOString(),
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
