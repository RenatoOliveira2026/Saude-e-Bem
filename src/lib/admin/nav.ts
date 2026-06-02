import type { AdminRole } from "@/lib/admin/roles";
import { adminRoutes, routes } from "@/lib/routes";
import type { IconName } from "@/components/icons";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: IconName;
  roles: readonly AdminRole[];
};

export const adminNavItems: AdminNavItem[] = [
  {
    label: "Dashboard",
    href: adminRoutes.root,
    icon: "chart",
    roles: ["super_admin", "admin"],
  },
  {
    label: "Artigos",
    href: adminRoutes.artigos,
    icon: "book",
    roles: ["super_admin", "admin"],
  },
  {
    label: "Protocolos",
    href: adminRoutes.protocolos,
    icon: "sparkle",
    roles: ["super_admin", "admin"],
  },
  {
    label: "Biblioteca",
    href: adminRoutes.biblioteca,
    icon: "library",
    roles: ["super_admin", "admin"],
  },
  {
    label: "Afiliados",
    href: adminRoutes.afiliados,
    icon: "star",
    roles: ["super_admin", "admin"],
  },
  {
    label: "Usuários",
    href: adminRoutes.usuarios,
    icon: "users",
    roles: ["super_admin", "admin"],
  },
  {
    label: "Administradores",
    href: adminRoutes.administradores,
    icon: "users",
    roles: ["super_admin"],
  },
  {
    label: "Configurações",
    href: adminRoutes.configuracoes,
    icon: "sparkle",
    roles: ["super_admin"],
  },
];

export function getAdminNavForRole(role: AdminRole): AdminNavItem[] {
  return adminNavItems.filter((item) => item.roles.includes(role));
}

/** Destaca o item correto no menu (inclui subrotas como /admin/artigos/novo). */
export function isAdminNavItemActive(pathname: string, href: string): boolean {
  const path = pathname.replace(/\/$/, "") || "/";
  const target = href.replace(/\/$/, "") || "/";

  if (target === adminRoutes.root) {
    return path === adminRoutes.root;
  }

  return path === target || path.startsWith(`${target}/`);
}
