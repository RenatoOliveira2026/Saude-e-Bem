"use client";

import { Icon } from "@/components/icons";
import { toggleSavedProtocolAction } from "@/lib/club/actions/saved-protocol.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SaveProtocolButtonProps {
  protocolId: string;
  initialSaved: boolean;
  loginRequired?: boolean;
}

export function SaveProtocolButton({
  protocolId,
  initialSaved,
  loginRequired = false,
}: SaveProtocolButtonProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loginRequired) return;
    setLoading(true);

    const result = await toggleSavedProtocolAction({
      protocolId,
      saved,
    });

    if (result.ok) {
      setSaved(result.saved);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || loginRequired}
      title={saved ? "Remover dos protocolos salvos" : "Salvar protocolo"}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
        saved
          ? "border-sage bg-sage-muted/40 text-forest"
          : "border-border bg-surface text-muted hover:border-sage hover:text-forest"
      } ${loading ? "opacity-60" : ""}`}
    >
      <Icon name="plan" size={16} className="text-sage" />
      {saved ? "Protocolo salvo" : "Salvar protocolo"}
    </button>
  );
}
