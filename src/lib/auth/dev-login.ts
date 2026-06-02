/** Credenciais de desenvolvimento local — nunca use em produção */
export const DEV_LOGIN_EMAIL = "renatoao2013@gmail.com";
export const DEV_LOGIN_PASSWORD = "SaudeBem@2026";

/**
 * Libera /dev-login apenas em desenvolvimento local.
 * Produção e previews públicos ficam bloqueados.
 */
export function isDevLoginAllowed(): boolean {
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  if (process.env.DEV_LOGIN_ENABLED === "0") {
    return false;
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").toLowerCase();

  if (
    siteUrl.includes("saudeebem.com.br") &&
    !siteUrl.includes("localhost") &&
    !siteUrl.includes("127.0.0.1")
  ) {
    return false;
  }

  if (
    siteUrl.includes("localhost") ||
    siteUrl.includes("127.0.0.1") ||
    process.env.DEV_LOGIN_ENABLED === "1"
  ) {
    return true;
  }

  return process.env.NODE_ENV === "development";
}

export const DEV_LOGIN_MANUAL_SQL = `-- Executar no SQL Editor do Supabase (após usuário existir em auth.users)
insert into public.admin_users (user_id, email, role)
select id, email, 'super_admin'::public.admin_role
from auth.users where email = '${DEV_LOGIN_EMAIL}'
on conflict (user_id) do update
  set email = excluded.email, role = 'super_admin'::public.admin_role;`;
