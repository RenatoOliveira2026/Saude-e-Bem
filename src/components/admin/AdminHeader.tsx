import { signOut } from "@/lib/auth/actions";
import { AdminRoleBadge } from "@/components/admin/AdminRoleBadge";
import type { AdminRole } from "@/lib/admin/roles";
import { Button } from "@/components/ui/Button";

interface AdminHeaderProps {
  title: string;
  description?: string;
  email: string;
  role?: AdminRole;
  action?: React.ReactNode;
}

export function AdminHeader({
  title,
  description,
  email,
  role,
  action,
}: AdminHeaderProps) {
  return (
    <header className="border-b border-border bg-surface px-6 py-5 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-forest">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-muted">{description}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {action}
          <div className="hidden items-center gap-2 sm:flex">
            {role && <AdminRoleBadge role={role} />}
            <span className="text-sm text-muted">{email}</span>
          </div>
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm">
              Sair
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
