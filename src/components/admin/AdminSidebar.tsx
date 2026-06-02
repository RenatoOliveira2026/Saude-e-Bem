"use client";

import { LogoHeader } from "@/components/brand/Logo";
import { Icon } from "@/components/icons";
import { getAdminNavForRole, isAdminNavItemActive } from "@/lib/admin/nav";
import { ADMIN_ROLE_LABELS, type AdminRole } from "@/lib/admin/roles";
import { adminFutureIntegrations } from "@/lib/admin/types";
import { routes } from "@/lib/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminSidebarProps {
  role: AdminRole;
}

export function AdminSidebar({ role }: AdminSidebarProps) {
  const pathname = usePathname();
  const navItems = getAdminNavForRole(role);

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-forest text-off-white">
      <div className="border-b border-white/10 px-5 py-6">
        <LogoHeader
          inverted
          href={navItems[0]?.href ?? routes.admin}
          className="[&_img]:brightness-110"
        />
        <p className="mt-2 text-xs font-medium uppercase tracking-wider text-gold">
          Painel Admin
        </p>
        <p className="mt-1 text-xs text-off-white/70">{ADMIN_ROLE_LABELS[role]}</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const active = isAdminNavItemActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-sage text-off-white"
                  : "text-off-white/80 hover:bg-white/10 hover:text-off-white"
              }`}
            >
              <Icon name={item.icon} className="h-4 w-4 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gold/90">
          Em breve
        </p>
        <ul className="space-y-2">
          {adminFutureIntegrations.map((item) => (
            <li
              key={item.id}
              className="rounded-lg bg-white/5 px-3 py-2 text-xs text-off-white/60"
              title={item.description}
            >
              {item.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-white/10 px-4 py-4">
        <Link
          href={routes.home}
          className="flex items-center gap-2 text-sm text-off-white/70 transition-colors hover:text-gold"
        >
          <Icon name="arrow-right" className="h-4 w-4 rotate-180" aria-hidden />
          Voltar ao site
        </Link>
      </div>
    </aside>
  );
}
