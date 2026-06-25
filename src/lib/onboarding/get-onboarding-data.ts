import { getSessionProfile } from "@/lib/auth/session";
import { getBlogArticles } from "@/lib/data/repositories/blog.repository";
import { getProtocols } from "@/lib/data/repositories/protocols.repository";
import { getProfileComplete } from "@/lib/journey/constants";
import { buildOnboardingPlanForUser } from "./plan";
import type { OnboardingData } from "./types";

export async function getOnboardingData(): Promise<OnboardingData> {
  const { user, profile: profileData } = await getSessionProfile();
  const { profile, preferences } = profileData;

  const displayName =
    profile?.name?.trim() || user.email?.split("@")[0] || "Membro";
  const goalKey = preferences?.goal ?? null;
  const hasGoal = Boolean(goalKey);
  const profileComplete = getProfileComplete(
    Boolean(profile?.name?.trim()),
    hasGoal,
  );

  const [protocols, articles] = await Promise.all([
    getProtocols(),
    getBlogArticles(),
  ]);

  const plan = await buildOnboardingPlanForUser(
    user.id,
    goalKey,
    protocols,
    articles,
  );

  return {
    displayName,
    hasGoal,
    profileComplete,
    plan,
  };
}
