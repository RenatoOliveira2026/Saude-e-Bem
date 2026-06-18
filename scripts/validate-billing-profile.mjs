/**
 * Validações Fase 5.7A — CPF, CEP e estado
 * Uso: node scripts/validate-billing-profile.mjs
 */
import assert from "node:assert/strict";

function stripDigits(value) {
  return value.replace(/\D/g, "");
}

function isValidCpf(value) {
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

function isValidCep(value) {
  return stripDigits(value).length === 8;
}

const STATES = new Set([
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
]);

assert.equal(isValidCpf("529.982.247-25"), true);
assert.equal(isValidCpf("111.111.111-11"), false);
assert.equal(isValidCep("01310-100"), true);
assert.equal(isValidCep("1234"), false);
assert.equal(STATES.has("SP"), true);
assert.equal(STATES.has("XX"), false);

console.log("✅ Validações Fase 5.7A (CPF, CEP, UF) — OK");
