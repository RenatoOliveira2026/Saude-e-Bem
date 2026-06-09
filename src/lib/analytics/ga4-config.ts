/** Measurement ID público — override via NEXT_PUBLIC_GA4_MEASUREMENT_ID na Vercel. */
export const DEFAULT_GA4_MEASUREMENT_ID = "G-QD8EB7D38Y";

export function getGa4MeasurementId(): string | null {
  const fromEnv = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim();
  return fromEnv || DEFAULT_GA4_MEASUREMENT_ID;
}

export function isGa4Enabled(): boolean {
  return Boolean(getGa4MeasurementId());
}
