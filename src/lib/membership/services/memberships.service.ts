import { mapMembershipPlanRow } from "@/lib/membership/mappers";
import { mapBillingPlanToMembershipSlug } from "@/lib/membership/providers";
import type { UserMembershipRecord } from "@/lib/membership/types";
import { FALLBACK_MEMBERSHIP_PLANS } from "@/lib/membership/constants";
import { createClient } from "@/lib/supabase/server";

type UserMembershipRow = {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  started_at: string;
  expires_at: string | null;
  provider: string | null;
  external_id: string | null;
  membership_origin: string | null;
  created_at: string;
  membership_plans?: { name: string; slug: string } | { name: string; slug: string }[] | null;
};

function resolvePlanMeta(
  row: UserMembershipRow,
): { name: string; slug: string } {
  const plan = row.membership_plans;
  if (Array.isArray(plan)) return plan[0] ?? { name: "—", slug: "—" };
  return plan ?? { name: "—", slug: "—" };
}

function mapUserMembershipRow(
  row: UserMembershipRow,
  profile?: { email?: string | null; name?: string | null },
): UserMembershipRecord {
  const planMeta = resolvePlanMeta(row);
  return {
    id: row.id,
    userId: row.user_id,
    planId: row.plan_id,
    planName: planMeta.name,
    planSlug: planMeta.slug,
    status: row.status as UserMembershipRecord["status"],
    startedAt: row.started_at,
    expiresAt: row.expires_at,
    provider: row.provider,
    externalId: row.external_id,
    membershipOrigin: row.membership_origin,
    createdAt: row.created_at,
    userEmail: profile?.email ?? null,
    userName: profile?.name ?? null,
  };
}

async function loadProfilesMap(userIds: string[]) {
  if (userIds.length === 0) return new Map<string, { email: string | null; name: string | null }>();
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, email, name")
    .in("id", userIds);
  return new Map(
    (data ?? []).map((p) => [p.id, { email: p.email, name: p.name }]),
  );
}

export async function fetchUserMembershipsForAdmin(): Promise<UserMembershipRecord[]> {
  const supabase = await createClient();

  const { data: membershipRows, error } = await supabase
    .from("user_memberships")
    .select(
      "id, user_id, plan_id, status, started_at, expires_at, provider, external_id, membership_origin, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (!error && membershipRows?.length) {
    const { data: planRows } = await supabase
      .from("membership_plans")
      .select("id, name, slug");
    const planMap = new Map((planRows ?? []).map((p) => [p.id, p]));

    const profileMap = await loadProfilesMap([
      ...new Set(membershipRows.map((r) => r.user_id)),
    ]);
    return membershipRows.map((row) => {
      const plan = planMap.get(row.plan_id);
      return mapUserMembershipRow(
        {
          ...row,
          membership_plans: plan
            ? { name: plan.name, slug: plan.slug }
            : null,
        },
        profileMap.get(row.user_id),
      );
    });
  }

  const { data: subs, error: subsError } = await supabase
    .from("subscriptions")
    .select(
      "id, user_id, status, billing_plan_id, provider, current_period_start, current_period_end, metadata, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (subsError || !subs?.length) return [];

  const { data: plans } = await supabase
    .from("membership_plans")
    .select("id, name, slug");

  const planBySlug = new Map((plans ?? []).map((p) => [p.slug, p]));
  const profileMap = await loadProfilesMap([...new Set(subs.map((s) => s.user_id))]);

  return subs.map((sub) => {
    const slug = mapBillingPlanToMembershipSlug(sub.billing_plan_id) ?? "gratuito";
    const plan = planBySlug.get(slug);
    const profile = profileMap.get(sub.user_id);
    const metadata =
      sub.metadata && typeof sub.metadata === "object"
        ? (sub.metadata as Record<string, unknown>)
        : {};
    return {
      id: sub.id,
      userId: sub.user_id,
      planId: plan?.id ?? sub.billing_plan_id ?? "—",
      planName: plan?.name ?? sub.billing_plan_id ?? "—",
      planSlug: slug,
      status: sub.status as UserMembershipRecord["status"],
      startedAt: sub.current_period_start ?? sub.created_at,
      expiresAt: sub.current_period_end,
      provider: sub.provider,
      externalId: null,
      membershipOrigin:
        typeof metadata.membership_origin === "string"
          ? metadata.membership_origin
          : null,
      createdAt: sub.created_at,
      userEmail: profile?.email ?? null,
      userName: profile?.name ?? null,
    };
  });
}

export async function fetchMembershipPlansForAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("membership_plans")
    .select(
      "id, name, slug, description, price, billing_cycle, features, is_active, created_at",
    )
    .order("price", { ascending: true });

  if (error || !data?.length) return FALLBACK_MEMBERSHIP_PLANS;
  return data.map((row) => mapMembershipPlanRow(row));
}
