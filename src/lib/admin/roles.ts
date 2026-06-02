/** Perfis do painel — usuário comum não está em admin_users */
export type AdminRole = "super_admin" | "admin";

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
};

export const ADMIN_ROLE_DESCRIPTIONS: Record<AdminRole, string> = {
  super_admin:
    "Acesso total, gerencia administradores e configurações globais.",
  admin:
    "Cria e edita conteúdos, protocolos e biblioteca. Não gerencia administradores.",
};

export type AdminPermission =
  | "manage_content"
  | "manage_platform_users"
  | "manage_admins"
  | "global_settings";

const ROLE_PERMISSIONS: Record<AdminRole, readonly AdminPermission[]> = {
  super_admin: [
    "manage_content",
    "manage_platform_users",
    "manage_admins",
    "global_settings",
  ],
  admin: ["manage_content", "manage_platform_users"],
};

export function hasAdminPermission(
  role: AdminRole,
  permission: AdminPermission,
): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function isSuperAdminRole(role: AdminRole): boolean {
  return role === "super_admin";
}
