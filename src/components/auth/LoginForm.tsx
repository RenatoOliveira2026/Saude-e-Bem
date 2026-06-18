"use client";

import {
  AuthLayout,
  AuthLink,
  AuthMessage,
} from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { signIn, type AuthActionState } from "@/lib/auth/actions";
import { getAuthUrlErrorMessage } from "@/lib/auth/url-errors";
import { routes } from "@/lib/routes";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";

const initialState: AuthActionState = {};

function AuthErrorHints({ state }: { state: AuthActionState }) {
  if (!state.error) return null;

  if (state.errorCode === "email_not_confirmed") {
    return (
      <p className="text-sm text-muted">
        Não recebeu o e-mail? Verifique a pasta de spam ou cadastre-se novamente
        apenas se ainda não tiver conta.
      </p>
    );
  }

  if (
    state.errorCode === "invalid_credentials" ||
    state.errorCode === "user_not_found"
  ) {
    return (
      <p className="text-sm text-muted">
        <AuthLink href={routes.recuperarSenha}>Esqueceu a senha?</AuthLink>
        {" · "}
        <AuthLink href={routes.cadastro}>Criar conta</AuthLink>
      </p>
    );
  }

  if (state.errorCode === "email_exists") {
    return (
      <p className="text-sm text-muted">
        Este e-mail já possui cadastro.{" "}
        <AuthLink href={routes.recuperarSenha}>Redefinir senha</AuthLink>
      </p>
    );
  }

  return null;
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? routes.minhaJornada;
  const urlError = getAuthUrlErrorMessage(searchParams.get("error"));
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <AuthLayout
      title="Entrar"
      description="Acesse sua conta para continuar sua jornada de saúde e bem-estar."
      footer={
        <>
          Ainda não tem conta?{" "}
          <AuthLink href={routes.cadastro}>Cadastre-se</AuthLink>
        </>
      }
    >
      {urlError && (
        <div className="space-y-2">
          <AuthMessage type="error" message={urlError} />
          <p className="text-sm text-muted">
            <AuthLink href={routes.recuperarSenha}>Recuperar senha</AuthLink>
          </p>
        </div>
      )}
      {state.error && (
        <div className="space-y-2">
          <AuthMessage type="error" message={state.error} />
          <AuthErrorHints state={state} />
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="redirect" value={redirect} />
        <Input
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="seu@email.com"
        />
        <Input
          label="Senha"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />
        <div className="text-right">
          <AuthLink href={routes.recuperarSenha}>Esqueceu a senha?</AuthLink>
        </div>
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full justify-center"
          disabled={pending}
        >
          {pending ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </AuthLayout>
  );
}
