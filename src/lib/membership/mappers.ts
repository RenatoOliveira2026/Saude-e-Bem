import type { MembershipPlanRecord } from "@/lib/membership/types";

type MembershipPlanRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number | string;
  billing_cycle: string;
  features: unknown;
  is_active: boolean;
  created_at: string;
};

export function mapMembershipPlanRow(row: MembershipPlanRow): MembershipPlanRecord {
  const features = Array.isArray(row.features)
    ? row.features.filter((f): f is string => typeof f === "string")
    : [];

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: typeof row.price === "string" ? Number(row.price) : row.price,
    billingCycle: row.billing_cycle as MembershipPlanRecord["billingCycle"],
    features,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}
