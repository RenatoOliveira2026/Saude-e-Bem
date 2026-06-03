import { getCurrentUser } from "@/lib/auth/session";
import { isFavorite } from "@/lib/supabase/services/favorites.service";
import { isProtocolSaved } from "@/lib/club/services/saved-protocols.service";
import type { FavoriteContentType } from "@/lib/favorites/types";
import { FavoriteButton } from "./FavoriteButton";
import { SaveProtocolButton } from "./SaveProtocolButton";

interface ContentMemberActionsProps {
  contentType: FavoriteContentType;
  contentId: string;
  showSaveProtocol?: boolean;
}

export async function ContentMemberActions({
  contentType,
  contentId,
  showSaveProtocol = false,
}: ContentMemberActionsProps) {
  const user = await getCurrentUser();
  const loginRequired = !user;

  let initialFavorited = false;
  let initialSaved = false;

  if (user) {
    initialFavorited = await isFavorite(user.id, contentType, contentId);
    if (showSaveProtocol && contentType === "protocol") {
      const saved = await isProtocolSaved(user.id, contentId);
      initialSaved = Boolean(saved);
    }
  }

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <FavoriteButton
        contentType={contentType}
        contentId={contentId}
        initialFavorited={initialFavorited}
        loginRequired={loginRequired}
      />
      {showSaveProtocol && contentType === "protocol" && (
        <SaveProtocolButton
          protocolId={contentId}
          initialSaved={initialSaved}
          loginRequired={loginRequired}
        />
      )}
    </div>
  );
}
