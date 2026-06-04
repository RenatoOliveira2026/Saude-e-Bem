"use client";

import { saveToolResultAction } from "@/lib/health-profile/actions/save-tool-result.action";
import type { SavableToolSlug } from "@/lib/health-profile/constants";
import { useCallback, useState } from "react";

export type PersistSaveStatus = "idle" | "saving" | "saved" | "skipped" | "error";

export function usePersistToolResult(toolSlug: SavableToolSlug) {
  const [status, setStatus] = useState<PersistSaveStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const persist = useCallback(
    async (resultJson: Record<string, unknown>) => {
      setStatus("saving");
      setMessage(null);

      const response = await saveToolResultAction({ toolSlug, resultJson });

      if (response.ok) {
        setStatus("saved");
        setMessage(null);
        return;
      }

      if (response.skipped) {
        setStatus("skipped");
        setMessage(response.error ?? "Entre para salvar automaticamente.");
        return;
      }

      setStatus("error");
      setMessage(response.error ?? "Não foi possível salvar o resultado.");
    },
    [toolSlug],
  );

  return {
    persist,
    saved: status === "saved",
    status,
    message,
  };
}
