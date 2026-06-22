/**
 * Cancela pagamentos pending órfãos de usuários com membership ativa (Fase 8.1).
 *
 * Uso:
 *   node scripts/cancel-legacy-pending-payments.mjs --dry-run
 *   node scripts/cancel-legacy-pending-payments.mjs
 *   node scripts/cancel-legacy-pending-payments.mjs --user=4781c1f1-07ad-4689-aeee-655a6acd6f48
 */
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;
const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnvConfig(join(__dirname, ".."));

const PENDING_STATUSES = ["pending", "in_process", "in_mediation"];
const ACTIVE_MEMBERSHIP_STATUSES = ["active", "trialing"];

function arg(name) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=").slice(1).join("=") : null;
}

const dryRun = process.argv.includes("--dry-run");
const userFilter = arg("user");

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} ausente.`);
  return value;
}

async function main() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const admin = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let membershipQuery = admin
    .from("user_memberships")
    .select("user_id, plan_id, status")
    .in("status", ACTIVE_MEMBERSHIP_STATUSES);

  if (userFilter) {
    membershipQuery = membershipQuery.eq("user_id", userFilter);
  }

  const { data: memberships, error: membershipError } = await membershipQuery;
  if (membershipError) throw membershipError;

  if (!memberships?.length) {
    console.log("Nenhuma membership ativa encontrada.");
    return;
  }

  const activeUserIds = [...new Set(memberships.map((row) => row.user_id))];
  console.log(
    `Memberships ativas: ${memberships.length} registro(s), ${activeUserIds.length} usuário(s).`,
  );
  if (dryRun) console.log("Modo dry-run — nenhuma alteração será gravada.\n");

  let totalCancelled = 0;

  for (const userId of activeUserIds) {
    let paymentsQuery = admin
      .from("payments")
      .select("id, status, external_reference, billing_plan_id, metadata, created_at")
      .eq("user_id", userId)
      .in("status", PENDING_STATUSES)
      .order("created_at", { ascending: false });

    const { data: pendingRows, error: pendingError } = await paymentsQuery;
    if (pendingError) throw pendingError;

    const toCancel = pendingRows ?? [];

    if (toCancel.length === 0) continue;

    console.log(`Usuário ${userId}: ${toCancel.length} pending(s) a cancelar`);
    for (const row of toCancel) {
      console.log(
        `  - ${row.id} | ${row.status} | ${row.external_reference ?? "(sem ref)"}`,
      );
    }

    if (dryRun) {
      totalCancelled += toCancel.length;
      continue;
    }

    const cancelledAt = new Date().toISOString();
    for (const row of toCancel) {
      const metadata = {
        ...((row.metadata ?? {})),
        cancelled_reason: "legacy_orphan_cleanup",
        cancelled_at: cancelledAt,
      };

      const { error: updateError } = await admin
        .from("payments")
        .update({ status: "cancelled", metadata })
        .eq("id", row.id);

      if (updateError) throw updateError;
      totalCancelled += 1;
    }
  }

  console.log(
    `\n${dryRun ? "Seriam cancelados" : "Cancelados"}: ${totalCancelled} pagamento(s).`,
  );
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exit(1);
});
