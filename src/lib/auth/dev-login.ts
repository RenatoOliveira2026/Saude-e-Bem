import { getSiteUrl } from "@/lib/seo/site-url";

/**
 * Dev login — atalho de login para desenvolvimento local.
 *
 * As credenciais vêm SOMENTE de variáveis locais (`.env.local`, nunca da Vercel):
 *   DEV_LOGIN_EMAIL=usuario-de-teste@exemplo.com
 *   DEV_LOGIN_PASSWORD=<senha só deste usuário de teste>
 *
 * Use um usuário de teste dedicado, nunca a conta real de um administrador.
 * Sem as duas variáveis, o dev login fica desativado.
 */
export type DevLoginCredentials = {
  email: string;
  password: string;
};

/** Marca gravada no usuário criado pelo dev login (user_metadata). */
export const DEV_LOGIN_USER_FLAG = "dev_login";

export function getDevLoginCredentials(): DevLoginCredentials | null {
  const email = process.env.DEV_LOGIN_EMAIL?.trim();
  const password = process.env.DEV_LOGIN_PASSWORD;
  if (!email || !password) return null;
  return { email, password };
}

/**
 * Libera /dev-login apenas em desenvolvimento local e com credenciais configuradas.
 * Produção e previews públicos ficam bloqueados.
 */
export function isDevLoginAllowed(): boolean {
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  if (process.env.DEV_LOGIN_ENABLED === "0") {
    return false;
  }

  if (!getDevLoginCredentials()) {
    return false;
  }

  const siteUrl = getSiteUrl().toLowerCase();

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

export const DEV_LOGIN_SETUP_HINT = `Configure no .env.local um usuário de TESTE (nunca uma conta real de administrador):
DEV_LOGIN_EMAIL=usuario-de-teste@exemplo.com
DEV_LOGIN_PASSWORD=<senha só deste usuário>
Para testar o painel, conceda admin a esse usuário de teste com supabase/scripts/grant-admin.sql.`;
