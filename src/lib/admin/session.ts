import { hasAdminPermission, type AdminPermission, type AdminRole } from "@/lib/admin/roles";
import { getCurrentUser, requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { adminRoutes, routes } from "@/lib/routes";
import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export type AdminSession = {
  user: User;
  adminId: string;
  email: string;
  role: AdminRole;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function parseAdminRole(value: string | null | undefined): AdminRole | null {
  if (value === "super_admin" || value === "admin") {
    return value;
  }
  return null;
}

/**
 * Verifica se o usuário autenticado consta em public.admin_users.
 */
export async function isAdminUser(
  email: string,
  userId?: string,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = await createClient();
  const normalizedEmail = normalizeEmail(email);

  const { data: isAdminRpc, error: rpcError } = await supabase.rpc("is_admin");
  if (!rpcError && isAdminRpc === true) {
    return true;
  }

  if (!userId) return false;

  const { data } = await supabase
    .from("admin_users")
    .select("id, email")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) return false;

  return normalizeEmail(data.email) === normalizedEmail;
}

async function loadAdminSession(user: User): Promise<AdminSession | null> {
  const email = user.email?.trim();
  if (!email) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("id, email, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) return null;

  const role = parseAdminRole(data.role as string);
  if (!role) return null;

  if (normalizeEmail(data.email) !== normalizeEmail(email)) {
    return null;
  }

  return {
    user,
    adminId: data.id,
    email: data.email,
    role,
  };
}

/** Para API routes — não redireciona */
export async function getAdminSession(): Promise<AdminSession | null> {
  const user = await getCurrentUser();
  if (!user || !isSupabaseConfigured()) return null;
  return loadAdminSession(user);
}

export async function requireAdmin(): Promise<AdminSession> {
  const user = await requireUser();

  if (!isSupabaseConfigured()) {
    redirect(routes.home);
  }

  const session = await loadAdminSession(user);
  if (!session) {
    redirect(routes.entrar);
  }

  return session;
}

export async function requireAdminPermission(
  permission: AdminPermission,
): Promise<AdminSession> {
  const session = await requireAdmin();

  if (!hasAdminPermission(session.role, permission)) {
    redirect(adminRoutes.root);
  }

  return session;
}

/** Super Admin — gerencia administradores e configurações globais */
export async function requireSuperAdmin(): Promise<AdminSession> {
  return requireAdminPermission("manage_admins");
}
