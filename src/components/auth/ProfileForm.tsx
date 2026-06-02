"use client";

import { AuthMessage } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { updateProfile, type AuthActionState } from "@/lib/auth/actions";
import type { Profile, UserPreference } from "@/lib/supabase/types";
import { useActionState } from "react";

const initialState: AuthActionState = {};

import { goalSelectOptions, goalLabels } from "@/lib/journey/constants";

interface ProfileFormProps {
  profile: Profile | null;
  preferences: UserPreference | null;
  email: string;
}

export function ProfileForm({ profile, preferences, email }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialState,
  );

  const currentGoal = preferences?.goal ?? "";

  return (
    <div className="mx-auto max-w-lg">
      {state.error && <AuthMessage type="error" message={state.error} />}
      {state.success && <AuthMessage type="success" message={state.success} />}

      <form action={formAction} className="space-y-5">
        <Input
          label="Nome"
          name="name"
          type="text"
          defaultValue={profile?.name ?? ""}
          required
          placeholder="Seu nome"
        />
        <Input
          label="E-mail"
          name="email_display"
          type="email"
          defaultValue={email}
          readOnly
          disabled
          className="cursor-not-allowed bg-sage-muted/30"
        />
        <Select
          label="Objetivo principal"
          name="goal"
          defaultValue={currentGoal}
          options={goalSelectOptions}
        />
        {currentGoal && goalLabels[currentGoal] && (
          <p className="text-xs text-muted-light">
            Objetivo atual: {goalLabels[currentGoal]}
          </p>
        )}
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full justify-center"
          disabled={pending}
        >
          {pending ? "Salvando..." : "Salvar alterações"}
        </Button>
      </form>
    </div>
  );
}
