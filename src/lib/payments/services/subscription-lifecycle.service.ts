import { createPaymentsAdminClient } from "../admin-client";

let lastRunAt = 0;
const MIN_INTERVAL_MS = 60_000;

/**
 * Expira assinaturas e memberships cujo período já terminou.
 *
 * - Assinaturas: RPC `expire_due_subscriptions` (o trigger do banco volta o
 *   perfil para "free").
 * - Memberships (`user_memberships`): marcadas como "expired" quando
 *   `expires_at` já passou, para não bloquear uma nova compra.
 *
 * Roda no cron diário e também sob demanda (Minha assinatura, Clube e
 * checkout), no máximo uma vez por minuto por servidor.
 */
export async function expireDueSubscriptions(options: { force?: boolean } = {}): Promise<number> {
  const now = Date.now();
  if (!options.force && now - lastRunAt < MIN_INTERVAL_MS) return 0;
  lastRunAt = now;

  const admin = createPaymentsAdminClient();
  if (!admin) return 0;

  const { data, error } = await admin.rpc("expire_due_subscriptions");
  if (error) throw error;

  const { data: memberships } = await admin
    .from("user_memberships")
    .update({ status: "expired" })
    .in("status", ["active", "trialing", "past_due"])
    .not("expires_at", "is", null)
    .lte("expires_at", new Date(now).toISOString())
    .select("id");

  const expiredSubs = typeof data === "number" ? data : 0;
  return expiredSubs + (memberships?.length ?? 0);
}

/** Versão que nunca derruba a página: falhas só vão para o log. */
export async function expireDueSubscriptionsSafely(): Promise<void> {
  try {
    await expireDueSubscriptions();
  } catch (error) {
    console.error("[subscriptions] falha ao expirar assinaturas vencidas", error);
  }
}
