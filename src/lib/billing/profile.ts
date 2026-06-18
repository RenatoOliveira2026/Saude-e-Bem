import type { Profile } from "@/lib/supabase/types";
import { formatCep, isValidBrazilianState, isValidCelular, isValidCep, isValidCpf, stripDigits } from "./validators";

export type BillingProfileInput = {
  fullName: string;
  cpf: string;
  celular: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
};

export type MercadoPagoPayerData = {
  email: string;
  name: string;
  surname: string;
  identification: { type: "CPF"; number: string };
  phone: { area_code: string; number: string };
  address: {
    zip_code: string;
    street_name: string;
    street_number: string;
    neighborhood: string;
    city: string;
    federal_unit: string;
  };
};

function splitFullName(fullName: string): { name: string; surname: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) {
    return { name: parts[0] ?? fullName, surname: parts[0] ?? fullName };
  }
  return { name: parts[0], surname: parts.slice(1).join(" ") };
}

function parseBrazilianPhone(celular: string): { area_code: string; number: string } {
  const digits = stripDigits(celular);
  if (digits.length >= 10) {
    return { area_code: digits.slice(0, 2), number: digits.slice(2) };
  }
  return { area_code: digits.slice(0, 2) || "11", number: digits.slice(2) || digits };
}

export type BillingProfileFields = Pick<
  Profile,
  | "full_name"
  | "cpf"
  | "celular"
  | "cep"
  | "endereco"
  | "numero"
  | "bairro"
  | "cidade"
  | "estado"
>;

export function isBillingProfileComplete(
  profile: BillingProfileFields | null | undefined,
): boolean {
  if (!profile) return false;
  return Boolean(
    profile.full_name?.trim() &&
      profile.cpf &&
      isValidCpf(profile.cpf) &&
      profile.celular &&
      isValidCelular(profile.celular) &&
      profile.cep &&
      isValidCep(profile.cep) &&
      profile.endereco?.trim() &&
      profile.numero?.trim() &&
      profile.bairro?.trim() &&
      profile.cidade?.trim() &&
      profile.estado &&
      isValidBrazilianState(profile.estado),
  );
}

export function validateBillingProfileInput(
  input: BillingProfileInput,
): { ok: true; data: BillingProfileInput } | { ok: false; error: string } {
  const fullName = input.fullName.trim();
  const endereco = input.endereco.trim();
  const numero = input.numero.trim();
  const bairro = input.bairro.trim();
  const cidade = input.cidade.trim();
  const estado = input.estado.trim().toUpperCase();
  const cpf = stripDigits(input.cpf);
  const celular = stripDigits(input.celular);
  const cep = stripDigits(input.cep);
  const complemento = input.complemento?.trim() ?? "";

  if (!fullName) return { ok: false, error: "Informe o nome completo." };
  if (!isValidCpf(cpf)) return { ok: false, error: "Confira o CPF informado." };
  if (!isValidCelular(celular)) {
    return { ok: false, error: "Informe um celular válido com DDD." };
  }
  if (!isValidCep(cep)) {
    return { ok: false, error: "Informe seu CEP para buscarmos o endereço." };
  }
  if (!endereco) return { ok: false, error: "Informe o endereço." };
  if (!numero) return { ok: false, error: "Preencha o número da residência." };
  if (!bairro) return { ok: false, error: "Informe o bairro." };
  if (!cidade) return { ok: false, error: "Informe a cidade." };
  if (!isValidBrazilianState(estado)) {
    return { ok: false, error: "Selecione seu estado." };
  }

  return {
    ok: true,
    data: {
      fullName,
      cpf,
      celular,
      cep,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
    },
  };
}

export function profileToBillingDbPayload(data: BillingProfileInput) {
  return {
    full_name: data.fullName,
    name: data.fullName,
    cpf: data.cpf,
    celular: data.celular,
    cep: data.cep,
    endereco: data.endereco,
    numero: data.numero,
    complemento: data.complemento || null,
    bairro: data.bairro,
    cidade: data.cidade,
    estado: data.estado,
    billing_completed_at: new Date().toISOString(),
  };
}

export function buildMercadoPagoPayer(
  profile: Profile,
  email: string,
): MercadoPagoPayerData | null {
  if (!isBillingProfileComplete(profile)) return null;

  const { name, surname } = splitFullName(profile.full_name!.trim());

  return {
    email,
    name,
    surname,
    identification: {
      type: "CPF",
      number: stripDigits(profile.cpf!),
    },
    phone: parseBrazilianPhone(profile.celular!),
    address: {
      zip_code: formatCep(profile.cep!),
      street_name: profile.endereco!.trim(),
      street_number: profile.numero!.trim(),
      neighborhood: profile.bairro!.trim(),
      city: profile.cidade!.trim(),
      federal_unit: profile.estado!.toUpperCase(),
    },
  };
}
