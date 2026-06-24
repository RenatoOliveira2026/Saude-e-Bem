import { isBillingProfileComplete } from "@/lib/billing/profile";
import { getAdminFinanceDashboard } from "@/lib/admin/services/finance.service";
import { getLaunchDashboard, type LaunchDashboardData } from "@/lib/admin/services/launch.service";
import { getNewsletterLeadStats } from "@/lib/admin/services/newsletter.service";
import { createPaymentsAdminClient } from "@/lib/payments/admin-client";
import { paymentStatusLabels } from "@/lib/payments/constants";
import { goalLabels } from "@/lib/journey/constants";
import { createClient } from "@/lib/supabase/server";
import type { PaymentStatus } from "@/lib/payments/types";

export interface OperationsSignupRow {
  id: string;
  email: string;
  name: string | null;
  goal: string | null;
  goalLabel: string;
  emailConfirmed: boolean;
  billingComplete: boolean;
  createdAt: string;
}

export interface OperationsPaymentAlert {
  id: string;
  userId: string;
  userName: string | null;
  externalReference: string;
  status: PaymentStatus;
  statusLabel: string;
  amountCents: number;
  createdAt: string;
  message: string;
}

export interface OperationsDashboardData {
  kpis: {
    newSignupsTotal: number;
    newSignupsLast7Days: number;
    newSignupsLast24h: number;
    emailsConfirmed: number;
    emailsPending: number;
    profilesComplete: number;
    profilesIncomplete: number;
    paymentsPending: number;
    paymentsApproved: number;
    premiumActive: number;
    webhookFailures: number;
    newsletterLeadsTotal: number;
    newsletterLeadsLast7Days: number;
  };
  signupByOrigin: { origin: string; label: string; count: number }[];
  recentSignups: OperationsSignupRow[];
  paymentAlerts: OperationsPaymentAlert[];
  webhookFailures: {
    id: string;
    topic: string;
    resourceId: string | null;
    message: string | null;
    processedAt: string;
  }[];
  newsletterBySource: { source: string; count: number }[];
  launch: LaunchDashboardData;
}

function goalLabel(goal: string | null): string {
  if (!goal) return "Não informado";
  return goalLabels[goal] ?? goal;
}

async function countAuthUsersConfirmed(): Promise<{
  confirmed: number;
  pending: number;
}> {
  const admin = createPaymentsAdminClient();
  if (!admin) return { confirmed: 0, pending: 0 };

  let confirmed = 0;
  let pending = 0;
  let page = 1;
  const perPage = 200;

  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error || !data.users.length) break;

    for (const user of data.users) {
      if (user.email_confirmed_at) confirmed += 1;
      else pending += 1;
    }

    if (data.users.length < perPage) break;
    page += 1;
    if (page > 10) break;
  }

  return { confirmed, pending };
}

export async function getOperationsDashboard(): Promise<OperationsDashboardData> {
  const supabase = await createClient();
  const now = Date.now();
  const day1 = now - 24 * 60 * 60 * 1000;
  const day7 = now - 7 * 24 * 60 * 60 * 1000;

  const day1Iso = new Date(day1).toISOString();
  const day7Iso = new Date(day7).toISOString();

  const [
    finance,
    launch,
    newsletterStats,
    authCounts,
    profilesTotalRes,
    signups7Res,
    signups24Res,
    profilesCompleteRes,
    prefsRes,
    membershipsRes,
    approvedCountRes,
    pendingCountRes,
  ] = await Promise.all([
    getAdminFinanceDashboard(),
    getLaunchDashboard(),
    getNewsletterLeadStats().catch(() => ({
      total: 0,
      active: 0,
      last7Days: 0,
      last30Days: 0,
      bySource: { home: 0, blog: 0, biblioteca: 0, clube: 0, other: 0 },
      pendingSync: 0,
    })),
    countAuthUsersConfirmed(),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gte("created_at", day7Iso),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gte("created_at", day1Iso),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .not("billing_completed_at", "is", null),
    supabase.from("user_preferences").select("user_id, goal"),
    supabase
      .from("user_memberships")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("payments")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved"),
    supabase
      .from("payments")
      .select("id", { count: "exact", head: true })
      .in("status", ["pending", "in_process", "in_mediation"]),
  ]);

  const { data: profileRows, error: profileListError } = await supabase
    .from("profiles")
    .select(
      "id, email, name, full_name, cpf, celular, cep, endereco, numero, bairro, cidade, estado, billing_completed_at, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (profileListError) throw profileListError;

  const profiles = profileRows ?? [];
  const goalByUser = new Map(
    (prefsRes.data ?? []).map((p) => [p.user_id, p.goal]),
  );

  const originCounts = new Map<string, number>();
  for (const pref of prefsRes.data ?? []) {
    const originKey = pref.goal ?? "nao_informado";
    originCounts.set(originKey, (originCounts.get(originKey) ?? 0) + 1);
  }
  const totalWithGoal = [...originCounts.values()].reduce((a, b) => a + b, 0);
  const totalProfiles = profilesTotalRes.count ?? 0;
  if (totalProfiles > totalWithGoal) {
    originCounts.set(
      "nao_informado",
      (originCounts.get("nao_informado") ?? 0) + (totalProfiles - totalWithGoal),
    );
  }

  const signupByOrigin = [...originCounts.entries()]
    .map(([origin, count]) => ({
      origin,
      label: goalLabel(origin === "nao_informado" ? null : origin),
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const confirmedMap = new Map<string, boolean>();
  const admin = createPaymentsAdminClient();
  if (admin) {
    const { data: authPage } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    for (const user of authPage?.users ?? []) {
      confirmedMap.set(user.id, Boolean(user.email_confirmed_at));
    }
  }

  const recentSignups: OperationsSignupRow[] = profiles.slice(0, 15).map((profile) => {
    const goal = goalByUser.get(profile.id) ?? null;
    return {
      id: profile.id,
      email: profile.email,
      name: profile.full_name ?? profile.name,
      goal,
      goalLabel: goalLabel(goal),
      emailConfirmed: confirmedMap.get(profile.id) ?? false,
      billingComplete: isBillingProfileComplete(profile),
      createdAt: profile.created_at,
    };
  });

  const paymentAlerts: OperationsPaymentAlert[] = finance.recentPayments
    .filter((p) => {
      if (["rejected", "cancelled", "charged_back", "refunded"].includes(p.status)) {
        return true;
      }
      if (p.status === "pending") {
        const age = now - new Date(p.createdAt).getTime();
        return age > 2 * 60 * 60 * 1000;
      }
      return false;
    })
    .slice(0, 10)
    .map((p) => ({
      id: p.id,
      userId: p.userId,
      userName: p.userName,
      externalReference: p.externalReference,
      status: p.status,
      statusLabel: paymentStatusLabels[p.status],
      amountCents: p.amountCents,
      createdAt: p.createdAt,
      message:
        p.status === "pending"
          ? "PIX pendente há mais de 2h — verificar MP ou reconciliar."
          : `Pagamento ${paymentStatusLabels[p.status]}.`,
    }));

  const newsletterBySource = Object.entries(newsletterStats.bySource)
    .filter(([, count]) => count > 0)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);

  return {
    kpis: {
      newSignupsTotal: profilesTotalRes.count ?? profiles.length,
      newSignupsLast7Days: signups7Res.count ?? 0,
      newSignupsLast24h: signups24Res.count ?? 0,
      emailsConfirmed: authCounts.confirmed,
      emailsPending: authCounts.pending,
      profilesComplete: profilesCompleteRes.count ?? 0,
      profilesIncomplete:
        (profilesTotalRes.count ?? 0) - (profilesCompleteRes.count ?? 0),
      paymentsPending: pendingCountRes.count ?? finance.stats.pendingPayments,
      paymentsApproved: approvedCountRes.count ?? 0,
      premiumActive: membershipsRes.count ?? 0,
      webhookFailures: finance.webhookFailures.length,
      newsletterLeadsTotal: newsletterStats.total,
      newsletterLeadsLast7Days: newsletterStats.last7Days,
    },
    signupByOrigin,
    recentSignups,
    paymentAlerts,
    webhookFailures: finance.webhookFailures,
    newsletterBySource,
    launch,
  };
}
