import { getSessionProfile } from "@/lib/auth/session";
import {
  PREMIUM_TRAILS,
  buildAllTrailsProgress,
  fetchUserActivitySnapshot,
} from "@/lib/premium";

export async function getPremiumTrailsPageData() {
  const { user } = await getSessionProfile();
  const activity = await fetchUserActivitySnapshot(user.id);
  const trails = buildAllTrailsProgress(PREMIUM_TRAILS, activity);
  return { trails, activity };
}
