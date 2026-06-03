"use client";

import { Icon } from "@/components/icons";
import { toggleFavoriteAction } from "@/lib/club/actions/favorite.actions";
import type { FavoriteContentType } from "@/lib/favorites/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FavoriteButtonProps {
  contentType: FavoriteContentType;
  contentId: string;
  initialFavorited: boolean;
  loginRequired?: boolean;
}

export function FavoriteButton({
  contentType,
  contentId,
  initialFavorited,
  loginRequired = false,
}: FavoriteButtonProps) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loginRequired) return;
    setLoading(true);

    const result = await toggleFavoriteAction({
      contentType,
      contentId,
      favorited,
    });

    if (result.ok) {
      setFavorited(result.favorited);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || loginRequired}
      title={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
        favorited
          ? "border-gold/50 bg-gold-muted/30 text-forest"
          : "border-border bg-surface text-muted hover:border-sage hover:text-forest"
      } ${loading ? "opacity-60" : ""}`}
    >
      <Icon
        name="star"
        size={16}
        className={favorited ? "text-gold" : "text-sage"}
      />
      {favorited ? "Favoritado" : "Favoritar"}
    </button>
  );
}
