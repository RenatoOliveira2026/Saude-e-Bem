"use server";

import { revalidatePath } from "next/cache";
import { routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Json } from "@/lib/supabase/types";
import {
  isSavableToolSlug,
  type SavableToolSlug,
} from "../constants";

export async function saveToolResultAction(input: {
  toolSlug: string;
  resultJson: Record<string, unknown>;
}): Promise<{ ok: boolean; skipped?: boolean; error?: string; id?: string }> {
  if (!isSavableToolSlug(input.toolSlug)) {
    return { ok: false, error: "Ferramenta não elegível para histórico." };
  }

  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase não configurado." };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      ok: false,
      skipped: true,
      error: "Faça login para salvar em Minha Saúde.",
    };
  }

  const rpcPayload = {
    p_tool_slug: input.toolSlug,
    p_result_json: input.resultJson as Json,
  };

  let savedId: string | undefined;
  const { data: rpcData, error: rpcError } = await supabase.rpc(
    "save_user_tool_result",
    rpcPayload,
  );

  if (rpcError) {
    const rpcMissing =
      rpcError.code === "PGRST202" ||
      rpcError.message.includes("Could not find the function");

    if (!rpcMissing) {
      const message = rpcError.message.toLowerCase();
      if (
        message.includes("not_authenticated") ||
        message.includes("jwt") ||
        rpcError.code === "42501"
      ) {
        return {
          ok: false,
          skipped: true,
          error: "Faça login para salvar em Minha Saúde.",
        };
      }

      if (process.env.NODE_ENV === "development") {
        console.error("[saveToolResultAction:rpc]", rpcError.message, rpcError.code);
      }

      return { ok: false, error: rpcError.message };
    }

    const { data: insertData, error: insertError } = await supabase
      .from("user_tool_results")
      .insert({
        user_id: user.id,
        tool_slug: input.toolSlug,
        result_json: input.resultJson as Json,
      })
      .select("id")
      .maybeSingle();

    if (insertError) {
      const message = insertError.message.toLowerCase();
      if (
        message.includes("row-level security") ||
        message.includes("jwt") ||
        insertError.code === "42501"
      ) {
        return {
          ok: false,
          skipped: true,
          error: "Faça login para salvar em Minha Saúde.",
        };
      }

      if (process.env.NODE_ENV === "development") {
        console.error(
          "[saveToolResultAction:insert]",
          insertError.message,
          insertError.code,
        );
      }

      return { ok: false, error: insertError.message };
    }

    savedId = insertData?.id;
  } else {
    savedId = rpcData ?? undefined;
  }

  revalidatePath(routes.minhaSaude);
  revalidatePath(routes.minhaJornada);

  return { ok: true, id: savedId };
}

export type SaveToolResultInput = {
  toolSlug: SavableToolSlug;
  resultJson: Record<string, unknown>;
};
