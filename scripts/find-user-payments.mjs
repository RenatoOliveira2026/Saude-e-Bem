/**
 * Busca usuário e pagamentos (ex.: Lucimar) no Supabase.
 * Uso: node scripts/find-user-payments.mjs --name=Lucimar
 */
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;
const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnvConfig(join(__dirname, ".."));

function arg(name) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=").slice(1).join("=") : null;
}

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} ausente.`);
  return value;
}

async function main() {
  const nameQuery = arg("name") ?? "Lucimar";
  const admin = createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const { data: profiles } = await admin
    .from("profiles")
    .select("id, email, name, full_name, created_at")
    .or(`name.ilike.%${nameQuery}%,full_name.ilike.%${nameQuery}%,email.ilike.%${nameQuery}%`)
    .limit(10);

  if (!profiles?.length) {
    console.log(`Nenhum perfil encontrado para "${nameQuery}".`);
    return;
  }

  for (const profile of profiles) {
    console.log("\n=== USUÁRIO ===");
    console.log(JSON.stringify(profile, null, 2));

    const { data: payments } = await admin
      .from("payments")
      .select(
        "id, status, external_id, external_reference, preference_id, amount_cents, payment_method, billing_plan_id, created_at, paid_at, metadata",
      )
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(15);

    console.log("\n--- Pagamentos ---");
    console.log(JSON.stringify(payments ?? [], null, 2));

    const { data: subs } = await admin
      .from("subscriptions")
      .select("id, status, billing_plan_id, current_period_end, created_at")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(5);

    console.log("\n--- Subscriptions ---");
    console.log(JSON.stringify(subs ?? [], null, 2));

    const { data: memberships } = await admin
      .from("user_memberships")
      .select("id, plan_id, status, expires_at, membership_origin, created_at")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(5);

    console.log("\n--- Memberships ---");
    console.log(JSON.stringify(memberships ?? [], null, 2));
  }
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
