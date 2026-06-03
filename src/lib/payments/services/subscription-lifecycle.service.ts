import { createPaymentsAdminClient } from "../admin-client";

export async function expireDueSubscriptions(): Promise<number> {
  const admin = createPaymentsAdminClient();
  if (!admin) return 0;

  const { data, error } = await admin.rpc("expire_due_subscriptions");
  if (error) throw error;
  return typeof data === "number" ? data : 0;
}
