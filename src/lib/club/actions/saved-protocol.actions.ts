"use server";

import { requireUser } from "@/lib/auth/session";
import { routes } from "@/lib/routes";
import { revalidatePath } from "next/cache";
import {
  removeSavedProtocol,
  saveUserProtocol,
  updateSavedProtocolStatus,
} from "../services/saved-protocols.service";
import type { SavedProtocolStatus } from "../types";

function revalidateSavedProtocolPaths() {
  revalidatePath(routes.clubeDashboard);
  revalidatePath(routes.clubeProtocolosSalvos);
}

export async function toggleSavedProtocolAction(input: {
  protocolId: string;
  saved: boolean;
}): Promise<{ ok: boolean; saved: boolean; error?: string }> {
  try {
    const user = await requireUser();

    if (input.saved) {
      await removeSavedProtocol(user.id, input.protocolId);
      revalidateSavedProtocolPaths();
      return { ok: true, saved: false };
    }

    await saveUserProtocol({
      userId: user.id,
      protocolId: input.protocolId,
    });
    revalidateSavedProtocolPaths();
    return { ok: true, saved: true };
  } catch {
    return {
      ok: false,
      saved: input.saved,
      error: "Não foi possível salvar o protocolo.",
    };
  }
}

export async function updateSavedProtocolStatusAction(input: {
  protocolId: string;
  status: SavedProtocolStatus;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const user = await requireUser();
    await updateSavedProtocolStatus({
      userId: user.id,
      protocolId: input.protocolId,
      status: input.status,
    });
    revalidateSavedProtocolPaths();
    return { ok: true };
  } catch {
    return { ok: false, error: "Não foi possível atualizar o status." };
  }
}
