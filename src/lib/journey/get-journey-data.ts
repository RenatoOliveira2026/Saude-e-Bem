import { getSessionProfile } from "@/lib/auth/session";
import { getFeaturedProtocol, getProtocols } from "@/lib/data/repositories/protocols.repository";
import {
  getFeaturedLibraryResource,
  getLibraryResources,
} from "@/lib/data/repositories/library.repository";
import { routes } from "@/lib/routes";
import {
  formatMemberSince,
  getDaysOnJourney,
  getProfileComplete,
  goalDescriptions,
  goalLabels,
  goalToLibraryCategory,
  goalToProtocolCategory,
} from "./constants";
import type { JourneyChecklistItem, JourneyData } from "./types";

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

  const [allProtocols, allLibrary, featuredProtocol, featuredLibrary] =
    await Promise.all([
      getProtocols(),
      getLibraryResources(),
      getFeaturedProtocol(),
      getFeaturedLibraryResource(),
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

  const checklist = buildChecklist({
    profileComplete,
    recommendedProtocols,
    librarySuggestions,
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
  };
}

function getRecommendedProtocols(
  protocols: Awaited<ReturnType<typeof getProtocols>>,
  goalKey: string | null,
  featured: Awaited<ReturnType<typeof getFeaturedProtocol>> | null,
) {
  if (goalKey && goalToProtocolCategory[goalKey]) {
    const category = goalToProtocolCategory[goalKey];
    const matched = protocols.filter(
      (p) => p.category === category && !p.isPremium,
    );
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
}: {
  profileComplete: boolean;
  recommendedProtocols: Awaited<ReturnType<typeof getProtocols>>;
  librarySuggestions: Awaited<ReturnType<typeof getLibraryResources>>;
}): JourneyChecklistItem[] {
  const firstProtocol = recommendedProtocols[0];
  const firstGuide = librarySuggestions[0];

  return [
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
      completed: false,
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
      completed: false,
    },
  ];
}
