import { ADMIN_ROLE_LABELS, type AdminRole } from "@/lib/admin/roles";

export function AdminRoleBadge({ role }: { role: AdminRole }) {
  const variant =
    role === "super_admin"
      ? "bg-gold/20 text-forest"
      : "bg-sage/20 text-forest";

  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${variant}`}
    >
      {ADMIN_ROLE_LABELS[role]}
    </span>
  );
}
