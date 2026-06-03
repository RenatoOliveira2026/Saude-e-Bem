"use server";

import { requireUser } from "@/lib/auth/session";
import { recordUserDownload } from "@/lib/club/services/downloads.service";
import type { FavoriteContentType } from "@/lib/favorites/types";
import { routes } from "@/lib/routes";
import { revalidatePath } from "next/cache";

export async function trackDownloadAction(input: {
  contentType: FavoriteContentType;
  contentId: string;
  contentTitle: string;
  contentSlug?: string | null;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const user = await requireUser();
    await recordUserDownload({
      userId: user.id,
      ...input,
    });
    revalidatePath(routes.clubeDashboard);
    revalidatePath(routes.clubeDownloads);
    return { ok: true };
  } catch {
    return { ok: false, error: "Não foi possível registrar o download." };
  }
}
