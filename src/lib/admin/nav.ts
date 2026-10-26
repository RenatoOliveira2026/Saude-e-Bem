import type { AdminRole } from "@/lib/admin/roles";
import { adminRoutes } from "@/lib/routes";
import type { IconName } from "@/components/icons";

export type AdminNavGroup =
  | "Visão geral"
  | "Conteúdo"
  | "Marketing"
  | "Vendas"
  | "Resultados"
  | "Sistema";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: IconName;
  roles: readonly AdminRole[];
  group: AdminNavGroup;
};

export const adminNavItems: AdminNavItem[] = [
  {
    label: "Dashboard",
    href: adminRoutes.root,
    icon: "chart",
    roles: ["super_admin", "admin"],
    group: "Visão geral",
  },
  {
    label: "Conteúdos",
    href: adminRoutes.conteudos,
    icon: "book",
    roles: ["super_admin", "admin"],
    group: "Conteúdo",
  },
  {
    label: "Artigos",
    href: adminRoutes.artigos,
    icon: "book",
    roles: ["super_admin", "admin"],
    group: "Conteúdo",
  },
  {
    label: "Protocolos",
    href: adminRoutes.protocolos,
    icon: "sparkle",
    roles: ["super_admin", "admin"],
    group: "Conteúdo",
  },
  {
    label: "Biblioteca digital",
    href: adminRoutes.bibliotecaItens,
    icon: "library",
    roles: ["super_admin", "admin"],
    group: "Conteúdo",
  },
  {
    label: "Biblioteca",
    href: adminRoutes.biblioteca,
    icon: "library",
    roles: ["super_admin", "admin"],
    group: "Conteúdo",
  },
  {
    label: "Recomendações",
    href: adminRoutes.recomendacoes,
    icon: "sparkle",
    roles: ["super_admin", "admin"],
    group: "Conteúdo",
  },
  {
    label: "Painel de Marketing",
    href: adminRoutes.marketing,
    icon: "bolt",
    roles: ["super_admin", "admin"],
    group: "Marketing",
  },
  {
    label: "Leads",
    href: adminRoutes.leads,
    icon: "activity",
    roles: ["super_admin", "admin"],
    group: "Marketing",
  },
  {
    label: "Newsletter",
    href: adminRoutes.newsletter,
    icon: "book",
    roles: ["super_admin", "admin"],
    group: "Marketing",
  },
  {
    label: "Conversão",
    href: adminRoutes.conversao,
    icon: "chart",
    roles: ["super_admin", "admin"],
    group: "Marketing",
  },
  {
    label: "WhatsApp",
    href: adminRoutes.comunicacao,
    icon: "support",
    roles: ["super_admin", "admin"],
    group: "Marketing",
  },
  {
    label: "Afiliados",
    href: adminRoutes.afiliados,
    icon: "star",
    roles: ["super_admin", "admin"],
    group: "Marketing",
  },
  {
    label: "Lançamento",
    href: adminRoutes.lancamento,
    icon: "activity",
    roles: ["super_admin", "admin"],
    group: "Marketing",
  },
  {
    label: "Marketplace",
    href: adminRoutes.marketplace,
    icon: "star",
    roles: ["super_admin", "admin"],
    group: "Vendas",
  },
  {
    label: "Clube & Assinaturas",
    href: adminRoutes.memberships,
    icon: "community",
    roles: ["super_admin", "admin"],
    group: "Vendas",
  },
  {
    label: "Financeiro",
    href: adminRoutes.financeiro,
    icon: "scale",
    roles: ["super_admin", "admin"],
    group: "Vendas",
  },
  {
    label: "Analytics",
    href: adminRoutes.analytics,
    icon: "chart",
    roles: ["super_admin", "admin"],
    group: "Resultados",
  },
  {
    label: "Crescimento",
    href: adminRoutes.crescimento,
    icon: "activity",
    roles: ["super_admin", "admin"],
    group: "Resultados",
  },
  {
    label: "Usuários",
    href: adminRoutes.usuarios,
    icon: "users",
    roles: ["super_admin", "admin"],
    group: "Sistema",
  },
  {
    label: "Administradores",
    href: adminRoutes.administradores,
    icon: "users",
    roles: ["super_admin"],
    group: "Sistema",
  },
  {
    label: "Configurações",
    href: adminRoutes.configuracoes,
    icon: "sparkle",
    roles: ["super_admin"],
    group: "Sistema",
  },
];

export function getAdminNavForRole(role: AdminRole): AdminNavItem[] {
  return adminNavItems.filter((item) => item.roles.includes(role));
}

/** Itens do perfil agrupados por área, na ordem do menu. */
export function getAdminNavGroupsForRole(
  role: AdminRole,
): { group: AdminNavGroup; items: AdminNavItem[] }[] {
  const groups: { group: AdminNavGroup; items: AdminNavItem[] }[] = [];
  for (const item of getAdminNavForRole(role)) {
    const last = groups[groups.length - 1];
    if (last && last.group === item.group) last.items.push(item);
    else groups.push({ group: item.group, items: [item] });
  }
  return groups;
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
