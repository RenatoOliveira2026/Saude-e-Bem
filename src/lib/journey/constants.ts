import type { ContentCategory } from "@/lib/data/types";

/** Objetivos oficiais da plataforma */
export const JOURNEY_GOALS = [
  {
    value: "energia",
    label: "Mais Energia",
    description:
      "Vitalidade matinal, ritmo circadiano e hábitos que sustentam energia ao longo do dia.",
  },
  {
    value: "sono",
    label: "Sono",
    description:
      "Higiene do sono, ambiente reparador e rotinas noturnas baseadas em evidências.",
  },
  {
    value: "intestinal",
    label: "Saúde Intestinal",
    description:
      "Equilíbrio da microbiota, digestão otimizada e conexão intestino-cérebro.",
  },
  {
    value: "emagrecimento",
    label: "Emagrecimento",
    description:
      "Nutrição consciente, metabolismo saudável e hábitos sustentáveis para composição corporal.",
  },
  {
    value: "longevidade",
    label: "Longevidade",
    description:
      "Abordagem integrada de nutrição, movimento, sono e gestão do estresse.",
  },
] as const;

export type JourneyGoalValue = (typeof JOURNEY_GOALS)[number]["value"];

export const goalLabels: Record<string, string> = Object.fromEntries(
  JOURNEY_GOALS.map((g) => [g.value, g.label]),
);

export const goalDescriptions: Record<string, string> = Object.fromEntries(
  JOURNEY_GOALS.map((g) => [g.value, g.description]),
);

export const goalSelectOptions = [
  { value: "", label: "Selecione seu objetivo principal" },
  ...JOURNEY_GOALS.map((g) => ({ value: g.value, label: g.label })),
];

export const goalToProtocolCategory: Record<string, ContentCategory> = {
  energia: "energia",
  sono: "sono",
  intestinal: "intestinal",
  emagrecimento: "detox",
  longevidade: "longevidade",
};

export const goalToLibraryCategory: Record<string, string> = {
  energia: "Energia",
  sono: "Sono",
  intestinal: "Intestinal",
  emagrecimento: "Hábitos",
  longevidade: "Hábitos",
};

export function formatMemberSince(dateString: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export function getDaysOnJourney(dateString: string): number {
  const start = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getProfileComplete(hasName: boolean, hasGoal: boolean): boolean {
  return hasName && hasGoal;
}
