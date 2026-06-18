import { BRAZILIAN_STATE_CODES } from "./constants";

export function stripDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Valida CPF brasileiro (11 dígitos + dígitos verificadores). */
export function isValidCpf(value: string): boolean {
  const cpf = stripDigits(value);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
  let digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  if (digit !== Number(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
  digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  return digit === Number(cpf[10]);
}

/** CEP brasileiro — 8 dígitos. */
export function isValidCep(value: string): boolean {
  return stripDigits(value).length === 8;
}

export function formatCep(value: string): string {
  const digits = stripDigits(value);
  if (digits.length !== 8) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function isValidBrazilianState(value: string): boolean {
  return BRAZILIAN_STATE_CODES.has(value.toUpperCase() as never);
}

export function isValidCelular(value: string): boolean {
  const digits = stripDigits(value);
  return digits.length >= 10 && digits.length <= 11;
}
