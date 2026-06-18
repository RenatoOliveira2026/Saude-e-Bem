"use client";

import {
  AuthLayout,
  AuthLink,
  AuthMessage,
} from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { resetPassword, type AuthActionState } from "@/lib/auth/actions";
import { getAuthUrlErrorMessage } from "@/lib/auth/url-errors";
import { routes } from "@/lib/routes";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";

const initialState: AuthActionState = {};

export function RecoverPasswordForm() {
  const searchParams = useSearchParams();
  const urlError = getAuthUrlErrorMessage(searchParams.get("error"));
  const [state, formAction, pending] = useActionState(
    resetPassword,
    initialState,
  );

  return (
    <AuthLayout
      title="Recuperar senha"
      description="Informe seu e-mail e enviaremos um link para redefinir sua senha."
      footer={
        <>
          Lembrou a senha? <AuthLink href={routes.entrar}>Voltar ao login</AuthLink>
        </>
      }
    >
      {urlError && <AuthMessage type="error" message={urlError} />}
      {state.error && <AuthMessage type="error" message={state.error} />}
      {state.success && <AuthMessage type="success" message={state.success} />}

      <form action={formAction} className="space-y-5">
        <Input
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="seu@email.com"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full justify-center"
          disabled={pending}
        >
          {pending ? "Enviando..." : "Enviar link de recuperação"}
        </Button>
      </form>
    </AuthLayout>
  );
}
