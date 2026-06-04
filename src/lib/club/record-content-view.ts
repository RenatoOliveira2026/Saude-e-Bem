import { getCurrentUser } from "@/lib/auth/session";
import type { FavoriteContentType } from "@/lib/favorites/types";
import {
  isUuid,
  recordProtocolView,
} from "@/lib/protocol-library/services/history.service";
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
    if (input.contentType === "protocol" && isUuid(input.contentId)) {
      await recordProtocolView(user.id, input.contentId);
    }
  } catch {
    // não bloqueia renderização
  }
}
