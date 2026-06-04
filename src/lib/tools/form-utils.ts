export function parsePositiveNumber(
  data: FormData,
  name: string,
  label: string,
  min: number,
  max: number,
): number | { error: string } {
  const value = Number(data.get(name));
  if (!Number.isFinite(value) || value < min || value > max) {
    return { error: `${label}: informe um valor entre ${min} e ${max}.` };
  }
  return value;
}
