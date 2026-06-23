/**
 * Lista pagamentos recentes e status de membership.
 * Uso: node scripts/list-recent-payments.mjs
 */
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;
const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnvConfig(join(__dirname, ".."));

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} ausente.`);
  return value;
}

async function main() {
  const admin = createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const { data: payments, error } = await admin
    .from("payments")
    .select(
      "id, user_id, status, external_id, external_reference, preference_id, payment_method, amount_cents, created_at, paid_at",
    )
    .order("created_at", { ascending: false })
    .limit(25);

  if (error) throw error;

  for (const payment of payments ?? []) {
    const { data: profile } = await admin
      .from("profiles")
      .select("name, full_name, email")
      .eq("id", payment.user_id)
      .maybeSingle();

    const { data: membership } = await admin
      .from("user_memberships")
      .select("status, expires_at, plan_id")
      .eq("user_id", payment.user_id)
      .eq("status", "active")
      .maybeSingle();

    const { data: sub } = await admin
      .from("subscriptions")
      .select("status, current_period_end")
      .eq("user_id", payment.user_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    console.log(
      JSON.stringify({
        payment,
        user: profile,
        activeMembership: membership,
        subscription: sub,
      }),
    );
  }
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
