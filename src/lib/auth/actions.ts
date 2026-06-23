"use server";

import { translateAuthError, type AuthErrorCode } from "@/lib/auth/errors";
import { createClient } from "@/lib/supabase/server";
import {
  formatAuthFetchError,
  logAuthTechnicalError,
  logSupabaseConfig,
} from "@/lib/supabase/config";
import { routes } from "@/lib/routes";
import { buildAuthVerifyUrl } from "@/lib/auth/callback-url";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export type AuthActionState = {
  error?: string;
  success?: string;
  errorCode?: AuthErrorCode;
};

function getRedirectPath(formData: FormData): string {
  const redirectTo = formData.get("redirect")?.toString();
  if (redirectTo?.startsWith("/") && !redirectTo.startsWith("//")) {
    return redirectTo;
  }
  return routes.minhaJornada;
}

function rethrowIfRedirect(err: unknown): void {
  if (isRedirectError(err)) {
    throw err;
  }
}

function authFailure(error: { message?: string; code?: string }): AuthActionState {
  const translated = translateAuthError(error);
  return { error: translated.message, errorCode: translated.code };
}

export async function signUp(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();
  const goal = formData.get("goal")?.toString().trim();

  if (!name || !email || !password) {
    return { error: "Preencha nome, e-mail e senha." };
  }

  if (password.length < 8) {
    return { error: "A senha deve ter pelo menos 8 caracteres.", errorCode: "weak_password" };
  }

  logSupabaseConfig("signUp");

  let hasSession = false;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, goal: goal || null },
        emailRedirectTo: buildAuthVerifyUrl(routes.minhaJornada),
      },
    });

    if (error) {
      console.error("[Supabase Auth] signUp error:", {
        message: error.message,
        status: error.status,
        name: error.name,
        code: error.code,
      });
      return authFailure(error);
    }

    if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
      return {
        error:
          "Este e-mail já está cadastrado. Faça login ou use “Esqueceu a senha?” para redefinir sua senha.",
        errorCode: "email_exists",
      };
    }

    hasSession = Boolean(data.session);
  } catch (err) {
    rethrowIfRedirect(err);
    logAuthTechnicalError("signUp", err);
    const message = formatAuthFetchError(err);
    const translated = translateAuthError(message);
    return { error: translated.message, errorCode: translated.code };
  }

  if (hasSession) {
    redirect(routes.minhaJornada);
  }

  return {
    success:
      "Conta criada! Verifique seu e-mail para confirmar o cadastro e acessar sua jornada.",
  };
}

export async function signIn(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Preencha e-mail e senha." };
  }

  logSupabaseConfig("signIn");

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("[Supabase Auth] signIn error:", {
        message: error.message,
        status: error.status,
        name: error.name,
        code: error.code,
      });
      return authFailure(error);
    }
  } catch (err) {
    rethrowIfRedirect(err);
    logAuthTechnicalError("signIn", err);
    const message = formatAuthFetchError(err);
    const translated = translateAuthError(message);
    return { error: translated.message, errorCode: translated.code };
  }

  redirect(getRedirectPath(formData));
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect(routes.home);
}

export async function resetPassword(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = formData.get("email")?.toString().trim();

  if (!email) {
    return { error: "Informe seu e-mail." };
  }

  logSupabaseConfig("resetPassword");

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: buildAuthVerifyUrl(routes.redefinirSenha),
    });

    if (error) {
      return authFailure(error);
    }
  } catch (err) {
    rethrowIfRedirect(err);
    logAuthTechnicalError("resetPassword", err);
    const message = formatAuthFetchError(err);
    const translated = translateAuthError(message);
    return { error: translated.message, errorCode: translated.code };
  }

  return {
    success:
      "Enviamos um link de recuperação para seu e-mail. Verifique também a caixa de spam.",
  };
}

export async function updatePassword(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!password || !confirmPassword) {
    return { error: "Preencha a nova senha e a confirmação." };
  }

  if (password.length < 8) {
    return { error: "A senha deve ter pelo menos 8 caracteres.", errorCode: "weak_password" };
  }

  if (password !== confirmPassword) {
    return { error: "As senhas não coincidem." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return authFailure(error);
  }

  redirect(routes.minhaJornada);
}

export async function updateProfile(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const name = formData.get("name")?.toString().trim();
  const goal = formData.get("goal")?.toString().trim();

  if (!name) {
    return { error: "Informe seu nome." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sessão expirada. Faça login novamente." };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ name })
    .eq("id", user.id);

  if (profileError) {
    return { error: "Não foi possível atualizar o perfil." };
  }

  const { data: existingPrefs } = await supabase
    .from("user_preferences")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingPrefs) {
    await supabase
      .from("user_preferences")
      .update({ goal: goal || null })
      .eq("user_id", user.id);
  } else {
    await supabase.from("user_preferences").insert({
      user_id: user.id,
      goal: goal || null,
    });
  }

  revalidatePath(routes.perfil);
  revalidatePath(routes.minhaJornada);

  return { success: "Perfil atualizado com sucesso." };
}
