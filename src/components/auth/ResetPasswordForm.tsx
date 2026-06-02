"use client";

import { AuthLayout, AuthMessage } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { updatePassword, type AuthActionState } from "@/lib/auth/actions";
import { useActionState } from "react";

const initialState: AuthActionState = {};

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(
    updatePassword,
    initialState,
  );

  return (
    <AuthLayout
      title="Nova senha"
      description="Defina uma nova senha segura para sua conta Saúde & Bem."
    >
      {state.error && <AuthMessage type="error" message={state.error} />}

      <form action={formAction} className="space-y-5">
        <Input
          label="Nova senha"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Mínimo 8 caracteres"
        />
        <Input
          label="Confirmar senha"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Repita a senha"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full justify-center"
          disabled={pending}
        >
          {pending ? "Salvando..." : "Redefinir senha"}
        </Button>
      </form>
    </AuthLayout>
  );
}
