import { createClient } from "@/lib/supabase/server";
import { createPaymentsAdminClient } from "@/lib/payments/admin-client";
import { formatPaymentAmount, paymentMethodLabels, paymentStatusLabels } from "@/lib/payments/constants";
import { mapPaymentRow } from "@/lib/payments/services/payments.service";
import type { Payment, PaymentMethod } from "@/lib/payments/types";
import type { Database } from "@/lib/supabase/types";

type SubscriptionRow = Database["public"]["Tables"]["subscriptions"]["Row"];

export interface AdminFinanceStats {
  totalRevenueCents: number;
  revenueLast30DaysCents: number;
  activeSubscriptions: number;
  pendingPayments: number;
  monthlySubscribers: number;
  annualSubscribers: number;
  estimatedMrrCents: number;
}

export interface AdminPaymentRecord extends Payment {
  userEmail: string | null;
  userName: string | null;
  billingPlanId: string | null;
}

export interface AdminSubscriptionRecord {
  id: string;
  userId: string;
  userEmail: string | null;
  userName: string | null;
  status: string;
  billingPlanId: string | null;
  autoRenew: boolean;
  currentPeriodEnd: string | null;
  provider: string;
  createdAt: string;
}

export interface AdminFinanceDashboard {
  stats: AdminFinanceStats;
  recentPayments: AdminPaymentRecord[];
  recentSubscriptions: AdminSubscriptionRecord[];
  revenueByMethod: { method: PaymentMethod | "unknown"; totalCents: number; count: number }[];
  webhookFailures: { id: string; topic: string; resourceId: string | null; message: string | null; processedAt: string }[];
}

function mapSubscription(row: SubscriptionRow, profile?: { email?: string; name?: string | null }) {
  return {
    id: row.id,
    userId: row.user_id,
    userEmail: profile?.email ?? null,
    userName: profile?.name ?? null,
    status: row.status,
    billingPlanId: row.billing_plan_id,
    autoRenew: row.auto_renew,
    currentPeriodEnd: row.current_period_end,
    provider: row.provider,
    createdAt: row.created_at,
  };
}

export async function getAdminFinanceDashboard(): Promise<AdminFinanceDashboard> {
  const supabase = await createClient();

  const { data: statsRaw, error: statsError } = await supabase.rpc(
    "get_finance_dashboard_stats",
  );

  if (statsError) throw statsError;

  const statsJson = (statsRaw ?? {}) as Record<string, number>;
  const monthlySubscribers = statsJson.monthly_subscribers ?? 0;
  const annualSubscribers = statsJson.annual_subscribers ?? 0;
  const estimatedMrrCents =
    monthlySubscribers * 2990 + Math.round((annualSubscribers * 29700) / 12);

  const stats: AdminFinanceStats = {
    totalRevenueCents: Number(statsJson.total_revenue_cents ?? 0),
    revenueLast30DaysCents: Number(statsJson.revenue_last_30_days_cents ?? 0),
    activeSubscriptions: statsJson.active_subscriptions ?? 0,
    pendingPayments: statsJson.pending_payments ?? 0,
    monthlySubscribers,
    annualSubscribers,
    estimatedMrrCents,
  };

  const { data: paymentsRaw, error: paymentsError } = await supabase
    .from("payments")
    .select(
      "id, user_id, subscription_id, provider, external_id, preference_id, external_reference, status, payment_method, amount_cents, currency, description, metadata, paid_at, created_at, updated_at, billing_plan_id",
    )
    .order("created_at", { ascending: false })
    .limit(25);

  if (paymentsError) throw paymentsError;

  const userIds = [...new Set((paymentsRaw ?? []).map((p) => p.user_id))];
  const { data: profiles } = userIds.length
    ? await supabase.from("profiles").select("id, name").in("id", userIds)
    : { data: [] };

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p.name]));

  const recentPayments: AdminPaymentRecord[] = (paymentsRaw ?? []).map((row) => ({
    ...mapPaymentRow(row),
    billingPlanId: row.billing_plan_id,
    userEmail: null,
    userName: profileMap.get(row.user_id) ?? null,
  }));

  const { data: subscriptionsRaw, error: subsError } = await supabase
    .from("subscriptions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (subsError) throw subsError;

  const subUserIds = [...new Set((subscriptionsRaw ?? []).map((s) => s.user_id))];
  const { data: subProfiles } = subUserIds.length
    ? await supabase.from("profiles").select("id, name").in("id", subUserIds)
    : { data: [] };

  const subProfileMap = new Map((subProfiles ?? []).map((p) => [p.id, p.name]));

  const recentSubscriptions = (subscriptionsRaw ?? []).map((row) =>
    mapSubscription(row, { name: subProfileMap.get(row.user_id) ?? null }),
  );

  const { data: approvedPayments } = await supabase
    .from("payments")
    .select("payment_method, amount_cents")
    .eq("status", "approved");

  const methodTotals = new Map<PaymentMethod | "unknown", { total: number; count: number }>();
  for (const row of approvedPayments ?? []) {
    const method = (row.payment_method ?? "unknown") as PaymentMethod | "unknown";
    const current = methodTotals.get(method) ?? { total: 0, count: 0 };
    current.total += row.amount_cents;
    current.count += 1;
    methodTotals.set(method, current);
  }

  const revenueByMethod = [...methodTotals.entries()]
    .map(([method, data]) => ({
      method,
      totalCents: data.total,
      count: data.count,
    }))
    .sort((a, b) => b.totalCents - a.totalCents);

  const { data: webhookRows } = await supabase
    .from("payment_webhook_events")
    .select("id, topic, resource_id, result_message, processed_at")
    .order("processed_at", { ascending: false })
    .limit(15);

  const webhookFailures = (webhookRows ?? [])
    .filter((row) => {
      const message = row.result_message?.toLowerCase() ?? "";
      return (
        message.length > 0 &&
        !message.includes("aprovado") &&
        !message.includes("ativada") &&
        !message.includes("atualizado")
      );
    })
    .slice(0, 8)
    .map((row) => ({
      id: row.id,
      topic: row.topic,
      resourceId: row.resource_id,
      message: row.result_message,
      processedAt: row.processed_at,
    }));

  return {
    stats,
    recentPayments,
    recentSubscriptions,
    revenueByMethod,
    webhookFailures,
  };
}

export function adminPaymentsToCsv(rows: AdminPaymentRecord[]): string {
  const header = [
    "id",
    "user_id",
    "user_name",
    "billing_plan_id",
    "status",
    "payment_method",
    "amount",
    "currency",
    "external_reference",
    "paid_at",
    "created_at",
  ];

  const lines = rows.map((row) =>
    [
      row.id,
      row.userId,
      row.userName ?? "",
      row.billingPlanId ?? String(row.metadata?.plan ?? ""),
      paymentStatusLabels[row.status],
      row.paymentMethod ? paymentMethodLabels[row.paymentMethod] : "",
      formatPaymentAmount(row.amountCents, row.currency),
      row.currency,
      row.externalReference,
      row.paidAt ?? "",
      row.createdAt,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(","),
  );

  return [header.join(","), ...lines].join("\n");
}

export async function adminListAllPayments(limit = 500): Promise<AdminPaymentRecord[]> {
  const admin = createPaymentsAdminClient();
  if (!admin) return [];

  const { data, error } = await admin
    .from("payments")
    .select(
      "id, user_id, subscription_id, provider, external_id, preference_id, external_reference, status, payment_method, amount_cents, currency, description, metadata, paid_at, created_at, updated_at, billing_plan_id",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    ...mapPaymentRow(row),
    billingPlanId: row.billing_plan_id,
    userEmail: null,
    userName: null,
  }));
}
