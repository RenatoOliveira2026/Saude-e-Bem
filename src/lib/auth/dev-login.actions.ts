"use server";

import {
  DEV_LOGIN_SETUP_HINT,
  DEV_LOGIN_USER_FLAG,
  getDevLoginCredentials,
  isDevLoginAllowed,
  type DevLoginCredentials,
} from "@/lib/auth/dev-login";
import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";
import { createDevAdminClient } from "@/lib/supabase/dev-admin";
import { logAuthTechnicalError } from "@/lib/supabase/config";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export type DevLoginState = {
  error?: string;
  hint?: string;
};

function rethrowIfRedirect(err: unknown): void {
  if (isRedirectError(err)) {
    throw err;
  }
}

/**
 * Cria o usuário de teste, ou redefine a senha dele, usando a service role.
 *
 * Por segurança, só redefine a senha de um usuário que tenha sido criado pelo
 * próprio dev login (marca em user_metadata) e que não seja administrador.
 * Assim o atalho nunca consegue tomar uma conta real.
 */
async function ensureDevUserExists(credentials: DevLoginCredentials): Promise<string | null> {
  const admin = createDevAdminClient();
  if (!admin) {
    return "SUPABASE_SERVICE_ROLE_KEY ausente em .env.local — não foi possível criar o usuário de teste automaticamente.";
  }

  const { data: listData, error: listError } = await admin.auth.admin.listUsers({
    perPage: 1000,
  });

  if (listError) {
    console.error("[dev-login] listUsers:", listError.message);
    return listError.message;
  }

  const existing = listData.users.find(
    (u) => u.email?.toLowerCase() === credentials.email.toLowerCase(),
  );

  if (existing) {
    const createdByDevLogin = existing.user_metadata?.[DEV_LOGIN_USER_FLAG] === true;
    if (!createdByDevLogin) {
      return "Este e-mail pertence a uma conta que não foi criada pelo dev login. Por segurança, a senha dela não é alterada. Use outro e-mail de teste em DEV_LOGIN_EMAIL.";
    }

    const { data: adminRow } = await admin
      .from("admin_users")
      .select("id")
      .eq("user_id", existing.id)
      .maybeSingle();
    if (adminRow) {
      return "O usuário de teste é administrador; por segurança a senha dele não é redefinida automaticamente. Entre pelo login normal.";
    }

    const { error: updateError } = await admin.auth.admin.updateUserById(existing.id, {
      password: credentials.password,
      email_confirm: true,
    });

    if (updateError) {
      console.error("[dev-login] updateUserById:", updateError.message);
      return updateError.message;
    }

    return null;
  }

  const { error: createError } = await admin.auth.admin.createUser({
    email: credentials.email,
    password: credentials.password,
    email_confirm: true,
    user_metadata: { name: "Usuário de teste (dev)", [DEV_LOGIN_USER_FLAG]: true },
  });

  if (createError) {
    console.error("[dev-login] createUser:", createError.message);
    return createError.message;
  }

  return null;
}

export async function devLoginAsRenato(
  _prev: DevLoginState,
  formData: FormData,
): Promise<DevLoginState> {
  const credentials = getDevLoginCredentials();
  if (!isDevLoginAllowed() || !credentials) {
    return { error: "Dev login desativado neste ambiente.", hint: DEV_LOGIN_SETUP_HINT };
  }

  const redirectTo = formData.get("redirect")?.toString();
  const target =
    redirectTo?.startsWith("/") && !redirectTo.startsWith("//")
      ? redirectTo
      : routes.minhaJornada;

  try {
    const supabase = await createClient();
    let { error: signInError } = await supabase.auth.signInWithPassword(credentials);

    if (signInError) {
      console.warn("[dev-login] signIn failed, trying ensureDevUserExists:", signInError.message);

      const ensureError = await ensureDevUserExists(credentials);
      if (ensureError) {
        return {
          error: `Não foi possível preparar o usuário de teste: ${ensureError}`,
          hint: DEV_LOGIN_SETUP_HINT,
        };
      }

      const retry = await supabase.auth.signInWithPassword(credentials);
      signInError = retry.error;
    }

    if (signInError) {
      console.error("[dev-login] signIn after ensure:", signInError.message);
      return {
        error: signInError.message,
        hint: "Confira no Supabase: Authentication → Providers → Email (login por e-mail habilitado).",
      };
    }
  } catch (err) {
    rethrowIfRedirect(err);
    logAuthTechnicalError("dev-login", err);
    return {
      error: "Falha ao conectar ao Supabase no dev-login.",
      hint: DEV_LOGIN_SETUP_HINT,
    };
  }

  redirect(target);
}
