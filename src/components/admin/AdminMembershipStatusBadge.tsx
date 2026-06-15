import { cn } from "@/lib/cn";
import type { UserMembershipStatus } from "@/lib/membership/types";

const styles: Record<UserMembershipStatus, string> = {
  active: "bg-sage/15 text-forest",
  trialing: "bg-sage/10 text-forest",
  past_due: "bg-gold/20 text-forest",
  pending: "bg-gold/25 text-forest",
  canceled: "bg-muted/25 text-muted",
  expired: "bg-red-100 text-red-800",
};

const labels: Record<UserMembershipStatus, string> = {
  active: "Ativa",
  trialing: "Trial",
  past_due: "Em atraso",
  pending: "Pendente",
  canceled: "Cancelada",
  expired: "Expirada",
};

export function AdminMembershipStatusBadge({
  status,
}: {
  status: UserMembershipStatus | string;
}) {
  const key =
    status in labels ? (status as UserMembershipStatus) : "pending";

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles[key],
      )}
    >
      {labels[key]}
    </span>
  );
}
