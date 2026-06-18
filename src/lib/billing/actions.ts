"use server";

import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { routes } from "@/lib/routes";
import { resolveBillingReturnPath } from "./guards";
import {
  profileToBillingDbPayload,
  validateBillingProfileInput,
  type BillingProfileInput,
} from "./profile";

export type BillingActionState = {
  error?: string;
  success?: string;
};

function readReturnPath(formData: FormData): string {
  const next = formData.get("next")?.toString() ?? null;
  const redirect = formData.get("redirect")?.toString() ?? null;
  return resolveBillingReturnPath(next, redirect, routes.minhaAssinatura);
}

export async function completeBillingProfile(
  _prev: BillingActionState,
  formData: FormData,
): Promise<BillingActionState> {
  const user = await requireUser();

  const input: BillingProfileInput = {
    fullName: formData.get("full_name")?.toString() ?? "",
    cpf: formData.get("cpf")?.toString() ?? "",
    celular: formData.get("celular")?.toString() ?? "",
    cep: formData.get("cep")?.toString() ?? "",
    endereco: formData.get("endereco")?.toString() ?? "",
    numero: formData.get("numero")?.toString() ?? "",
    complemento: formData.get("complemento")?.toString() ?? "",
    bairro: formData.get("bairro")?.toString() ?? "",
    cidade: formData.get("cidade")?.toString() ?? "",
    estado: formData.get("estado")?.toString() ?? "",
  };

  const validated = validateBillingProfileInput(input);
  if (!validated.ok) {
    return { error: validated.error };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update(profileToBillingDbPayload(validated.data))
    .eq("id", user.id);

  if (error) {
    return { error: "Não foi possível salvar seus dados. Tente novamente." };
  }

  revalidatePath(routes.completarCadastro);
  revalidatePath(routes.assinar);
  revalidatePath(routes.perfil);

  const redirectTo = readReturnPath(formData);

  try {
    redirect(redirectTo);
  } catch (err) {
    if (isRedirectError(err)) throw err;
    return { success: "Cadastro atualizado com sucesso." };
  }

  return { success: "Cadastro atualizado com sucesso." };
}
