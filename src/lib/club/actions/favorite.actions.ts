"use server";

import { requireUser } from "@/lib/auth/session";
import type { FavoriteContentType } from "@/lib/favorites/types";
import {
  addFavorite,
  removeFavorite,
} from "@/lib/supabase/services/favorites.service";
import { revalidatePath } from "next/cache";
import { routes } from "@/lib/routes";

export async function toggleFavoriteAction(input: {
  contentType: FavoriteContentType;
  contentId: string;
  favorited: boolean;
}): Promise<{ ok: boolean; favorited: boolean; error?: string }> {
  try {
    const user = await requireUser();

    if (input.favorited) {
      await removeFavorite(user.id, {
        contentType: input.contentType,
        contentId: input.contentId,
      });
      revalidateClubPaths();
      return { ok: true, favorited: false };
    }

    await addFavorite(user.id, {
      contentType: input.contentType,
      contentId: input.contentId,
    });
    revalidateClubPaths();
    return { ok: true, favorited: true };
  } catch {
    return {
      ok: false,
      favorited: input.favorited,
      error: "Não foi possível atualizar favoritos.",
    };
  }
}

function revalidateClubPaths() {
  revalidatePath(routes.clubeDashboard);
  revalidatePath(routes.clubeFavoritos);
}
