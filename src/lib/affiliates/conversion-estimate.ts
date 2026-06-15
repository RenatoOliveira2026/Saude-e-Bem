/** Taxa base para conversão estimada (placeholder até integração com parceiros) */
export const DEFAULT_ESTIMATED_CONVERSION_RATE = 0.025;

const PLATFORM_RATES: Record<string, number> = {
  amazon: 0.03,
  hotmart: 0.035,
  kiwify: 0.03,
  eduzz: 0.028,
  braip: 0.03,
};

export function getEstimatedConversionRate(platform?: string | null): number {
  if (!platform?.trim()) return DEFAULT_ESTIMATED_CONVERSION_RATE;
  return PLATFORM_RATES[platform.trim().toLowerCase()] ?? DEFAULT_ESTIMATED_CONVERSION_RATE;
}

export function estimateConversions(
  clicks: number,
  platform?: string | null,
): number {
  if (clicks <= 0) return 0;
  const rate = getEstimatedConversionRate(platform);
  return Math.round(clicks * rate * 10) / 10;
}

export function formatEstimatedConversionRate(clicks: number, estimated: number): string {
  if (clicks <= 0) return "0%";
  return `${((estimated / clicks) * 100).toFixed(1)}%`;
}
