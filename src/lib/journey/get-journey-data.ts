import { getSessionProfile } from "@/lib/auth/session";
import { fetchContinueReading } from "@/lib/club/services/intelligent-recommendations.service";
import { getFeaturedProtocol, getProtocols } from "@/lib/data/repositories/protocols.repository";
import {
  getFeaturedLibraryResource,
  getLibraryResources,
} from "@/lib/data/repositories/library.repository";
import {
  PREMIUM_TRAILS,
  buildAllTrailsProgress,
  fetchUserActivitySnapshot,
  pickRecommendedTrail,
} from "@/lib/premium";
import { routes } from "@/lib/routes";
import {
  formatMemberSince,
  getDaysOnJourney,
  getProfileComplete,
  goalDescriptions,
  goalLabels,
  goalToLibraryCategory,
  goalToProtocolCategory,
  goalToTrailObjective,
} from "./constants";
import type { JourneyChecklistItem, JourneyData, JourneyProgressStats } from "./types";

export async function getJourneyData(): Promise<JourneyData> {
  const { user, profile: profileData } = await getSessionProfile();
  const { profile, preferences } = profileData;

  const email = user.email ?? "";
  const displayName =
    profile?.name?.trim() || email.split("@")[0] || "Membro";
  const goalKey = preferences?.goal ?? null;
  const goalLabel = goalKey ? (goalLabels[goalKey] ?? null) : null;
  const goalDescription = goalKey ? (goalDescriptions[goalKey] ?? null) : null;

  const hasName = Boolean(profile?.name?.trim());
  const hasGoal = Boolean(goalKey);
  const profileComplete = getProfileComplete(hasName, hasGoal);

  const memberSinceRaw = profile?.created_at ?? user.created_at;
  const memberSince = formatMemberSince(memberSinceRaw);
  const daysOnJourney = getDaysOnJourney(memberSinceRaw);

  const [
    allProtocols,
    allLibrary,
    featuredProtocol,
    featuredLibrary,
    activity,
    continueReading,
  ] = await Promise.all([
    getProtocols(),
    getLibraryResources(),
    getFeaturedProtocol(),
    getFeaturedLibraryResource(),
    fetchUserActivitySnapshot(user.id),
    fetchContinueReading(user.id, 4).catch(() => []),
  ]);

  const recommendedProtocols = getRecommendedProtocols(
    allProtocols,
    goalKey,
    featuredProtocol,
  );

  const librarySuggestions = getLibrarySuggestions(
    allLibrary,
    goalKey,
    featuredLibrary,
  );

  const trails = buildAllTrailsProgress(PREMIUM_TRAILS, activity);
  const trailObjective = goalKey ? goalToTrailObjective[goalKey as keyof typeof goalToTrailObjective] : null;
  const activeTrail = pickRecommendedTrail(trails, trailObjective ?? null);

  const progress = computeProgressStats(trails, activity, profileComplete);

  const checklist = buildChecklist({
    profileComplete,
    recommendedProtocols,
    librarySuggestions,
    activity,
    activeTrail,
  });

  return {
    user,
    profileData,
    displayName,
    email,
    goalKey,
    goalLabel,
    goalDescription,
    hasGoal,
    profileComplete,
    memberSince,
    daysOnJourney,
    recommendedProtocols,
    librarySuggestions,
    checklist,
    trails,
    activeTrail,
    progress,
    continueReading,
  };
}

function computeProgressStats(
  trails: ReturnType<typeof buildAllTrailsProgress>,
  activity: Awaited<ReturnType<typeof fetchUserActivitySnapshot>>,
  profileComplete: boolean,
): JourneyProgressStats {
  const trailsStarted = trails.filter((t) => t.completedCount > 0).length;
  const trailsCompleted = trails.filter((t) => t.percentComplete >= 100).length;

  let materialsCompleted = 0;
  for (const set of Object.values(activity.accessed)) {
    if (set) materialsCompleted += set.size;
  }
  materialsCompleted += activity.downloadedLibrarySlugs.size;

  const protocolsStarted = activity.protocolSlugsInProgress.size;
  const protocolsCompleted = activity.protocolSlugsCompleted.size;

  const totalTrailSteps = trails.reduce((sum, t) => sum + t.totalSteps, 0);
  const completedTrailSteps = trails.reduce((sum, t) => sum + t.completedCount, 0);
  const overallPercent =
    totalTrailSteps > 0
      ? Math.round((completedTrailSteps / totalTrailSteps) * 100)
      : profileComplete
        ? 5
        : 0;

  return {
    trailsStarted,
    trailsCompleted,
    materialsCompleted,
    protocolsStarted,
    protocolsCompleted,
    overallPercent,
  };
}

function getRecommendedProtocols(
  protocols: Awaited<ReturnType<typeof getProtocols>>,
  goalKey: string | null,
  featured: Awaited<ReturnType<typeof getFeaturedProtocol>> | null,
) {
  if (goalKey && goalToProtocolCategory[goalKey]) {
    const category = goalToProtocolCategory[goalKey];
    const matched = protocols.filter((p) => p.category === category);
    if (matched.length > 0) return matched.slice(0, 3);
  }

  const fallback = protocols.filter((p) => !p.isPremium).slice(0, 3);
  if (fallback.length > 0) return fallback;
  return featured ? [featured] : [];
}

function getLibrarySuggestions(
  resources: Awaited<ReturnType<typeof getLibraryResources>>,
  goalKey: string | null,
  featured: Awaited<ReturnType<typeof getFeaturedLibraryResource>> | null,
) {
  if (goalKey && goalToLibraryCategory[goalKey]) {
    const category = goalToLibraryCategory[goalKey];
    const matched = resources.filter((r) => r.category === category);
    if (matched.length > 0) return matched.slice(0, 3);
  }

  const fallback = resources.slice(0, 3);
  if (fallback.length > 0) return fallback;
  return featured ? [featured] : [];
}

function buildChecklist({
  profileComplete,
  recommendedProtocols,
  librarySuggestions,
  activity,
  activeTrail,
}: {
  profileComplete: boolean;
  recommendedProtocols: Awaited<ReturnType<typeof getProtocols>>;
  librarySuggestions: Awaited<ReturnType<typeof getLibraryResources>>;
  activity: Awaited<ReturnType<typeof fetchUserActivitySnapshot>>;
  activeTrail: ReturnType<typeof pickRecommendedTrail>;
}): JourneyChecklistItem[] {
  const firstProtocol = recommendedProtocols[0];
  const firstGuide = librarySuggestions[0];

  const protocolStarted =
    firstProtocol &&
    (activity.protocolSlugsInProgress.has(firstProtocol.slug) ||
      activity.protocolSlugsCompleted.has(firstProtocol.slug) ||
      activity.accessed.protocol?.has(firstProtocol.slug));

  const guideDownloaded =
    firstGuide &&
    (activity.downloadedLibrarySlugs.has(firstGuide.slug) ||
      activity.accessed.library?.has(firstGuide.slug));

  const items: JourneyChecklistItem[] = [
    {
      id: "complete-profile",
      label: "Completar perfil",
      description: "Nome e objetivo principal configurados.",
      href: routes.perfil,
      icon: "profile",
      completed: profileComplete,
    },
    {
      id: "start-protocol",
      label: "Iniciar protocolo",
      description: firstProtocol
        ? `Comece por ${firstProtocol.title} · ${firstProtocol.duration}`
        : "Escolha um protocolo para iniciar sua rotina.",
      href: firstProtocol
        ? routes.protocolo(firstProtocol.slug)
        : routes.protocolos,
      icon: "sparkle",
      completed: Boolean(protocolStarted),
    },
    {
      id: "download-guide",
      label: "Baixar primeiro guia",
      description: firstGuide
        ? `${firstGuide.title} · ${firstGuide.format}`
        : "Explore materiais gratuitos na biblioteca.",
      href: firstGuide
        ? routes.bibliotecaItem(firstGuide.slug)
        : routes.biblioteca,
      icon: "download",
      completed: Boolean(guideDownloaded),
    },
  ];

  if (activeTrail) {
    const nextStep = activeTrail.stepsProgress.find((s) => !s.completed);
    items.push({
      id: "trail-continue",
      label: `Trilha: ${activeTrail.title}`,
      description: nextStep
        ? `Próximo passo: ${nextStep.label}`
        : `Trilha concluída — ${activeTrail.percentComplete}%`,
      href: nextStep?.href ?? routes.clubeTrilhas,
      icon: activeTrail.icon,
      completed: activeTrail.percentComplete >= 100,
    });
  }

  return items;
}
