"use server";

import { getCurrentUser } from "@/lib/auth/session";
import type { FavoriteContentType } from "@/lib/favorites/types";
import { recordContentAccess } from "../services/access-history.service";

export async function recordContentAccessAction(input: {
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
    // Histórico é auxiliar — não bloqueia a página
  }
}
