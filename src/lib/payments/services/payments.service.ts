import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { PAYMENT_HISTORY_VISIBLE_STATUSES } from "../constants";
import type { Payment, PaymentMethod, PaymentStatus } from "../types";

const ORPHAN_PENDING_STATUSES: PaymentStatus[] = [
  "pending",
  "in_process",
  "in_mediation",
];

function resolvePaymentBillingPlanId(row: {
  billing_plan_id: string | null;
  metadata: unknown;
}): string | null {
  if (row.billing_plan_id) return row.billing_plan_id;
  const plan = (row.metadata as Record<string, unknown> | null)?.plan;
  return typeof plan === "string" ? plan : null;
}

type PaymentRow = Database["public"]["Tables"]["payments"]["Row"];

export function mapPaymentRow(row: PaymentRow): Payment {
  return {
    id: row.id,
    userId: row.user_id,
    subscriptionId: row.subscription_id,
    provider: row.provider,
    externalId: row.external_id,
    preferenceId: row.preference_id,
    externalReference: row.external_reference,
    status: row.status,
    paymentMethod: row.payment_method,
    amountCents: row.amount_cents,
    currency: row.currency,
    description: row.description,
    billingPlanId: row.billing_plan_id,
    metadata: row.metadata,
    paidAt: row.paid_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchUserPayments(userId: string): Promise<Payment[]> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments")
    .select(
      "id, user_id, subscription_id, provider, external_id, preference_id, external_reference, status, payment_method, amount_cents, currency, description, billing_plan_id, metadata, paid_at, created_at, updated_at",
    )
    .eq("user_id", userId)
    .in("status", [...PAYMENT_HISTORY_VISIBLE_STATUSES])
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return (data ?? []).map(mapPaymentRow);
}

/** Cancela checkouts pending do mesmo plano após aprovação (Fase 8.1). */
export async function cancelOrphanPendingPaymentsForPlan(
  admin: SupabaseClient<Database>,
  input: {
    userId: string;
    billingPlanId: string;
    excludePaymentId: string;
  },
): Promise<number> {
  const { data: rows, error } = await admin
    .from("payments")
    .select("id, billing_plan_id, metadata")
    .eq("user_id", input.userId)
    .in("status", ORPHAN_PENDING_STATUSES)
    .neq("id", input.excludePaymentId);

  if (error) throw error;

  const toCancel = (rows ?? []).filter(
    (row) => resolvePaymentBillingPlanId(row) === input.billingPlanId,
  );

  if (toCancel.length === 0) return 0;

  const cancelledAt = new Date().toISOString();

  for (const row of toCancel) {
    const metadata = {
      ...((row.metadata as Record<string, unknown> | null) ?? {}),
      cancelled_reason: "superseded_by_approved_payment",
      cancelled_at: cancelledAt,
    };

    const { error: updateError } = await admin
      .from("payments")
      .update({ status: "cancelled", metadata })
      .eq("id", row.id);

    if (updateError) throw updateError;
  }

  return toCancel.length;
}

export async function updatePaymentByReference(
  admin: SupabaseClient<Database>,
  externalReference: string,
  update: {
    externalId?: string;
    status: PaymentStatus;
    paymentMethod?: PaymentMethod;
    paidAt?: string | null;
    metadata?: Record<string, unknown>;
  },
): Promise<Payment | null> {
  const { data: existing } = await admin
    .from("payments")
    .select("id, metadata")
    .eq("external_reference", externalReference)
    .maybeSingle();

  if (!existing) return null;

  const { data, error } = await admin
    .from("payments")
    .update({
      external_id: update.externalId ?? undefined,
      status: update.status,
      payment_method: update.paymentMethod ?? undefined,
      paid_at: update.paidAt ?? undefined,
      metadata: {
        ...(existing.metadata as Record<string, unknown>),
        ...update.metadata,
      },
    })
    .eq("id", existing.id)
    .select(
      "id, user_id, subscription_id, provider, external_id, preference_id, external_reference, status, payment_method, amount_cents, currency, description, billing_plan_id, metadata, paid_at, created_at, updated_at",
    )
    .single();

  if (error) throw error;
  return data ? mapPaymentRow(data) : null;
}

export async function getPaymentByReference(
  externalReference: string,
): Promise<Payment | null> {
  const adminModule = await import("../admin-client");
  const admin = adminModule.createPaymentsAdminClient();
  if (!admin) return null;

  const { data, error } = await admin
    .from("payments")
    .select(
      "id, user_id, subscription_id, provider, external_id, preference_id, external_reference, status, payment_method, amount_cents, currency, description, billing_plan_id, metadata, paid_at, created_at, updated_at",
    )
    .eq("external_reference", externalReference)
    .maybeSingle();

  if (error) throw error;
  return data ? mapPaymentRow(data) : null;
}
