/** Campos base para entidades — espelha estrutura futura do Supabase */
export interface BaseEntity {
  id: string;
  slug: string;
  status: "published" | "draft" | "archived";
  createdAt: string;
  updatedAt: string;
}

export const now = () => new Date().toISOString();

export function withBase<T extends { id: string; slug: string }>(
  item: T,
  dates?: Partial<Pick<BaseEntity, "createdAt" | "updatedAt" | "status">>,
): T & BaseEntity {
  return {
    ...item,
    status: dates?.status ?? "published",
    createdAt: dates?.createdAt ?? "2026-01-15T10:00:00.000Z",
    updatedAt: dates?.updatedAt ?? "2026-05-28T10:00:00.000Z",
  };
}
