"use client";

import {
  AuthLayout,
  AuthLink,
  AuthMessage,
} from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { signUp, type AuthActionState } from "@/lib/auth/actions";
import { goalSelectOptions } from "@/lib/journey/constants";
import { routes } from "@/lib/routes";
import { useActionState } from "react";

const initialState: AuthActionState = {};

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState);
  const emailExists = state.errorCode === "email_exists";

  return (
    <AuthLayout
      title="Criar conta"
      description="Comece sua jornada personalizada com protocolos, ferramentas e conteúdo curado."
      footer={
        <>
          Já tem conta? <AuthLink href={routes.entrar}>Entrar</AuthLink>
        </>
      }
    >
      {state.error && (
        <div className="space-y-2">
          <AuthMessage type="error" message={state.error} />
          {emailExists && (
            <p className="text-sm text-muted">
              <AuthLink href={routes.entrar}>Ir para o login</AuthLink>
              {" · "}
              <AuthLink href={routes.recuperarSenha}>Redefinir senha</AuthLink>
            </p>
          )}
        </div>
      )}
      {state.success && <AuthMessage type="success" message={state.success} />}

      {!state.success && !emailExists && (
        <form action={formAction} className="space-y-5">
          <Input
            label="Nome completo"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Seu nome"
          />
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
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="Mínimo 8 caracteres"
            hint="Use pelo menos 8 caracteres."
          />
          <Select label="Objetivo principal" name="goal" options={goalSelectOptions} />
          <Button
            type="submit"
            variant="gold"
            size="md"
            className="w-full justify-center"
            disabled={pending}
          >
            {pending ? "Criando conta..." : "Cadastrar"}
          </Button>
        </form>
      )}

      {emailExists && (
        <div className="flex flex-col gap-3 pt-2">
          <Button href={routes.entrar} variant="primary" size="md" className="w-full justify-center">
            Entrar com este e-mail
          </Button>
          <Button
            href={routes.recuperarSenha}
            variant="outline"
            size="md"
            className="w-full justify-center"
          >
            Redefinir senha
          </Button>
        </div>
      )}
    </AuthLayout>
  );
}
