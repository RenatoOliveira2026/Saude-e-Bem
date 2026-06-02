"use server";

import {
  DEV_LOGIN_EMAIL,
  DEV_LOGIN_MANUAL_SQL,
  DEV_LOGIN_PASSWORD,
  isDevLoginAllowed,
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

async function ensureDevUserExists(): Promise<string | null> {
  const admin = createDevAdminClient();
  if (!admin) {
    return "SUPABASE_SERVICE_ROLE_KEY ausente em .env.local — não foi possível criar o usuário automaticamente.";
  }

  const { data: listData, error: listError } = await admin.auth.admin.listUsers({
    perPage: 1000,
  });

  if (listError) {
    console.error("[dev-login] listUsers:", listError.message);
    return listError.message;
  }

  const existing = listData.users.find(
    (u) => u.email?.toLowerCase() === DEV_LOGIN_EMAIL.toLowerCase(),
  );

  if (existing) {
    const { error: updateError } = await admin.auth.admin.updateUserById(existing.id, {
      password: DEV_LOGIN_PASSWORD,
      email_confirm: true,
    });

    if (updateError) {
      console.error("[dev-login] updateUserById:", updateError.message);
      return updateError.message;
    }

    return null;
  }

  const { error: createError } = await admin.auth.admin.createUser({
    email: DEV_LOGIN_EMAIL,
    password: DEV_LOGIN_PASSWORD,
    email_confirm: true,
    user_metadata: { name: "Renato (dev)" },
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
  if (!isDevLoginAllowed()) {
    return { error: "Dev login desativado neste ambiente." };
  }

  const redirectTo = formData.get("redirect")?.toString();
  const target =
    redirectTo?.startsWith("/") && !redirectTo.startsWith("//")
      ? redirectTo
      : routes.minhaJornada;

  try {
    const supabase = await createClient();
    let { error: signInError } = await supabase.auth.signInWithPassword({
      email: DEV_LOGIN_EMAIL,
      password: DEV_LOGIN_PASSWORD,
    });

    if (signInError) {
      console.warn("[dev-login] signIn failed, trying ensureDevUserExists:", signInError.message);

      const ensureError = await ensureDevUserExists();
      if (ensureError) {
        return {
          error: `Não foi possível preparar o usuário de teste: ${ensureError}`,
          hint: DEV_LOGIN_MANUAL_SQL,
        };
      }

      const retry = await supabase.auth.signInWithPassword({
        email: DEV_LOGIN_EMAIL,
        password: DEV_LOGIN_PASSWORD,
      });
      signInError = retry.error;
    }

    if (signInError) {
      console.error("[dev-login] signIn after ensure:", signInError.message);
      return {
        error: signInError.message,
        hint: "Confira no Supabase: Authentication → Providers → Email (habilite signups/login) ou use o SQL abaixo para admin.",
      };
    }
  } catch (err) {
    rethrowIfRedirect(err);
    logAuthTechnicalError("dev-login", err);
    return {
      error: "Falha ao conectar ao Supabase no dev-login.",
      hint: DEV_LOGIN_MANUAL_SQL,
    };
  }

  redirect(target);
}
