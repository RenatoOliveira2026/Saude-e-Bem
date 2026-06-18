"use client";

import { AuthMessage } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import {
  completeBillingProfile,
  type BillingActionState,
} from "@/lib/billing/actions";
import { BRAZILIAN_STATES } from "@/lib/billing/constants";
import type { Profile } from "@/lib/supabase/types";
import { useActionState, useState } from "react";

const initialState: BillingActionState = {};

interface CompleteBillingProfileFormProps {
  profile: Profile | null;
  email: string;
  returnPath: string;
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-xl border border-border bg-surface p-5">
      <h2 className="font-heading text-lg font-semibold text-forest">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function CompleteBillingProfileForm({
  profile,
  email,
  returnPath,
}: CompleteBillingProfileFormProps) {
  const [state, formAction, pending] = useActionState(
    completeBillingProfile,
    initialState,
  );
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  async function handleCepBlur(event: React.FocusEvent<HTMLInputElement>) {
    const cep = event.target.value.replace(/\D/g, "");
    if (cep.length !== 8) {
      if (cep.length > 0) {
        setCepError("Informe seu CEP para buscarmos o endereço.");
      }
      return;
    }

    setCepLoading(true);
    setCepError(null);

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = (await res.json()) as {
        erro?: boolean;
        logradouro?: string;
        bairro?: string;
        localidade?: string;
        uf?: string;
      };

      if (data.erro) {
        setCepError("CEP não encontrado. Confira os números digitados.");
        return;
      }

      const form = event.target.form;
      if (!form) return;

      const endereco = form.elements.namedItem("endereco") as HTMLInputElement | null;
      const bairro = form.elements.namedItem("bairro") as HTMLInputElement | null;
      const cidade = form.elements.namedItem("cidade") as HTMLInputElement | null;
      const estado = form.elements.namedItem("estado") as HTMLSelectElement | null;
      const numero = form.elements.namedItem("numero") as HTMLInputElement | null;

      if (endereco && data.logradouro) endereco.value = data.logradouro;
      if (bairro && data.bairro) bairro.value = data.bairro;
      if (cidade && data.localidade) cidade.value = data.localidade;
      if (estado && data.uf) estado.value = data.uf;
      numero?.focus();
    } catch {
      setCepError("Não foi possível buscar o CEP. Preencha o endereço manualmente.");
    } finally {
      setCepLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <p className="mb-6 text-sm text-muted">
        E-mail da sua conta: <strong className="text-forest">{email}</strong>
      </p>

      {state.error && <AuthMessage type="error" message={state.error} />}
      {state.success && <AuthMessage type="success" message={state.success} />}

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="next" value={returnPath} />

        <FormSection title="Dados pessoais">
          <Input
            label="Nome completo"
            name="full_name"
            defaultValue={profile?.full_name ?? profile?.name ?? ""}
            required
            placeholder="Como está no seu documento"
            autoComplete="name"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="CPF"
              name="cpf"
              defaultValue={profile?.cpf ?? ""}
              required
              placeholder="000.000.000-00"
              inputMode="numeric"
              autoComplete="off"
            />
            <Input
              label="Celular"
              name="celular"
              defaultValue={profile?.celular ?? ""}
              required
              placeholder="(11) 99999-9999"
              inputMode="tel"
              autoComplete="tel"
            />
          </div>
        </FormSection>

        <FormSection title="Endereço">
          <Input
            label="CEP"
            name="cep"
            defaultValue={profile?.cep ?? ""}
            required
            placeholder="00000-000"
            inputMode="numeric"
            autoComplete="postal-code"
            onBlur={handleCepBlur}
          />
          {cepLoading && (
            <p className="text-xs text-muted">Buscando seu endereço…</p>
          )}
          {cepError && <p className="text-sm text-red-600">{cepError}</p>}

          <Input
            label="Endereço"
            name="endereco"
            defaultValue={profile?.endereco ?? ""}
            required
            placeholder="Rua, avenida…"
            autoComplete="street-address"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Número"
              name="numero"
              defaultValue={profile?.numero ?? ""}
              required
              placeholder="Ex.: 123"
            />
            <Input
              label="Complemento"
              name="complemento"
              defaultValue={profile?.complemento ?? ""}
              placeholder="Apto, bloco (opcional)"
            />
          </div>

          <Input
            label="Bairro"
            name="bairro"
            defaultValue={profile?.bairro ?? ""}
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Cidade"
              name="cidade"
              defaultValue={profile?.cidade ?? ""}
              required
            />
            <Select
              label="Estado"
              name="estado"
              defaultValue={profile?.estado ?? ""}
              required
              options={[
                { value: "", label: "Selecione…" },
                ...BRAZILIAN_STATES.map((s) => ({
                  value: s.value,
                  label: s.label,
                })),
              ]}
            />
          </div>
        </FormSection>

        <Button
          type="submit"
          variant="gold"
          size="lg"
          className="w-full justify-center"
          disabled={pending}
        >
          {pending ? "Salvando…" : "Salvar e continuar para pagamento"}
        </Button>
      </form>
    </div>
  );
}
