import { getCurrentUser } from "@/lib/auth/session";
import type { FavoriteContentType } from "@/lib/favorites/types";
import { recordContentAccess } from "./services/access-history.service";

/** Registra visualização de conteúdo para usuário autenticado (server component). */
export async function recordContentViewForUser(input: {
  contentType: FavoriteContentType;
  contentId: string;
  contentTitle: string;
  contentSlug?: string | null;
  sourcePath?: string | null;
}): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  try {
    await recordContentAccess({
      userId: user.id,
      ...input,
    });
  } catch {
    // não bloqueia renderização
  }
}
