import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function withSupabaseFallback<T>(
  fetchFromSupabase: () => Promise<T>,
  mockFallback: () => T | Promise<T>,
  label: string,
): Promise<T> {
  if (!isSupabaseConfigured()) {
    return mockFallback();
  }

  try {
    return await fetchFromSupabase();
  } catch (error) {
    console.warn(`[${label}] Supabase indisponível — usando mock local.`, error);
    return mockFallback();
  }
}

export async function withSupabaseListFallback<T>(
  fetchFromSupabase: () => Promise<T[]>,
  mockFallback: () => T[] | Promise<T[]>,
  label: string,
): Promise<T[]> {
  if (!isSupabaseConfigured()) {
    return mockFallback();
  }

  try {
    const fromDb = await fetchFromSupabase();
    if (fromDb.length > 0) return fromDb;
    return mockFallback();
  } catch (error) {
    console.warn(`[${label}] Supabase indisponível — usando mock local.`, error);
    return mockFallback();
  }
}

export async function withSupabaseNullableFallback<T>(
  fetchFromSupabase: () => Promise<T | null>,
  mockFallback: () => T | null | Promise<T | null>,
  label: string,
): Promise<T | null> {
  if (!isSupabaseConfigured()) {
    return mockFallback();
  }

  try {
    const fromDb = await fetchFromSupabase();
    if (fromDb) return fromDb;
    return mockFallback();
  } catch (error) {
    console.warn(`[${label}] Supabase indisponível — usando mock local.`, error);
    return mockFallback();
  }
}
