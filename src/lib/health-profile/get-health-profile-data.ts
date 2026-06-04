import { getSessionProfile } from "@/lib/auth/session";
import { buildHealthRecommendations } from "./recommendations";
import {
  buildLatestSummaries,
  fetchUserToolResults,
} from "./services/tool-results.service";
import type { HealthProfileData } from "./types";

export async function getHealthProfileData(): Promise<HealthProfileData> {
  const { user, profile } = await getSessionProfile();
  const displayName =
    profile.profile?.name?.trim() ||
    user.email?.split("@")[0] ||
    "Membro";

  const records = await fetchUserToolResults(user.id);

  const latestByTool = buildLatestSummaries(records);
  const recommendations = await buildHealthRecommendations(records);

  return {
    displayName,
    latestByTool,
    history: records,
    recommendations,
  };
}
