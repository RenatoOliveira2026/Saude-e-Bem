import type { LibraryItem } from "@/lib/intelligent-library/library.types";
import type { ContentLevel } from "@/lib/data/types";
import {
  getContentIntelligence,
  type ContentObjective,
  type ContentAudience,
} from "@/lib/content/intelligence";

export interface EnrichedLibraryItem extends LibraryItem {
  intelligence: {
    primaryObjective: ContentObjective;
    level: ContentLevel;
    audience: ContentAudience[];
    keywords: string[];
    isNew: boolean;
    estimatedMinutes: number;
  };
}

const CATEGORY_OBJECTIVE_MAP: Record<string, ContentObjective> = {
  sono: "sono",
  energia: "energia",
  emagrecimento: "emagrecimento",
  longevidade: "longevidade",
  intestinal: "alimentacao",
  nutricao: "alimentacao",
  "alimentacao-saudavel": "alimentacao",
  "controle-estresse": "ansiedade",
  ansiedade: "ansiedade",
  "saude-feminina": "saude-feminina",
  menopausa: "saude-feminina",
  "saude-masculina": "saude-masculina",
  mente: "energia",
  exercicios: "bem-estar",
  "bem-estar-geral": "bem-estar",
  hidratacao: "alimentacao",
};

const CATEGORY_LEVEL_MAP: Record<string, ContentLevel> = {
  longevidade: "Avançado",
  emagrecimento: "Intermediário",
  sono: "Iniciante",
};

function parseMinutesFromReadTime(readTime: string): number {
  const match = readTime.match(/(\d+)/);
  return match ? Number(match[1]) : 15;
}

export function enrichLibraryItem(item: LibraryItem): EnrichedLibraryItem {
  const intel = getContentIntelligence("library", item.slug);

  const categoryKey = item.category.toLowerCase().replace(/\s+/g, "-");
  const primaryObjective =
    intel?.primaryObjective ??
    CATEGORY_OBJECTIVE_MAP[categoryKey] ??
    "bem-estar";

  return {
    ...item,
    intelligence: {
      primaryObjective,
      level: intel?.level ?? CATEGORY_LEVEL_MAP[categoryKey] ?? "Iniciante",
      audience: intel?.audience ?? ["geral"],
      keywords: intel?.keywords ?? item.seoKeywords?.split(",").map((k) => k.trim()) ?? [],
      isNew: intel?.isNew ?? false,
      estimatedMinutes: intel?.estimatedMinutes ?? parseMinutesFromReadTime(item.estimatedReadTime),
    },
  };
}

export function enrichLibraryCatalog(items: LibraryItem[]): EnrichedLibraryItem[] {
  return items.map(enrichLibraryItem);
}

export type LibraryObjectiveFilterId = ContentObjective | "todos";

export type LibraryDifficultyFilterId = "todos" | "iniciante" | "intermediario" | "avancado";

export type LibraryDurationFilterId = "todos" | "curto" | "medio" | "longo";

export const LIBRARY_OBJECTIVE_FILTERS: { id: LibraryObjectiveFilterId; label: string }[] = [
  { id: "todos", label: "Todos objetivos" },
  { id: "sono", label: "Sono" },
  { id: "ansiedade", label: "Ansiedade" },
  { id: "alimentacao", label: "Alimentação" },
  { id: "emagrecimento", label: "Emagrecimento" },
  { id: "saude-feminina", label: "Saúde feminina" },
  { id: "saude-masculina", label: "Saúde masculina" },
  { id: "longevidade", label: "Longevidade" },
  { id: "energia", label: "Energia" },
];

export const LIBRARY_DIFFICULTY_FILTERS: { id: LibraryDifficultyFilterId; label: string }[] = [
  { id: "todos", label: "Qualquer nível" },
  { id: "iniciante", label: "Iniciante" },
  { id: "intermediario", label: "Intermediário" },
  { id: "avancado", label: "Avançado" },
];

export const LIBRARY_DURATION_FILTERS: { id: LibraryDurationFilterId; label: string }[] = [
  { id: "todos", label: "Qualquer duração" },
  { id: "curto", label: "Até 15 min" },
  { id: "medio", label: "16–30 min" },
  { id: "longo", label: "30+ min" },
];

function levelMatches(level: ContentLevel, filter: LibraryDifficultyFilterId): boolean {
  if (filter === "todos") return true;
  const normalized = level.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  if (filter === "iniciante") return normalized.includes("iniciante");
  if (filter === "intermediario") return normalized.includes("intermediario");
  if (filter === "avancado") return normalized.includes("avancado");
  return true;
}

function durationMatches(minutes: number, filter: LibraryDurationFilterId): boolean {
  if (filter === "todos") return true;
  if (filter === "curto") return minutes <= 15;
  if (filter === "medio") return minutes > 15 && minutes <= 30;
  return minutes > 30;
}

export function filterEnrichedLibrary(
  items: EnrichedLibraryItem[],
  filters: {
    typeFilter: string;
    objective: LibraryObjectiveFilterId;
    difficulty: LibraryDifficultyFilterId;
    duration: LibraryDurationFilterId;
  },
): EnrichedLibraryItem[] {
  return items.filter((item) => {
    if (filters.typeFilter !== "todos") {
      if (filters.typeFilter === "gratuitos" && item.isPremium) return false;
      if (filters.typeFilter === "premium" && !item.isPremium) return false;
      if (filters.typeFilter === "ebooks" && item.type !== "ebook" && item.type !== "pdf") return false;
      if (filters.typeFilter === "protocolos" && item.type !== "protocolo") return false;
      if (filters.typeFilter === "videos" && item.type !== "video") return false;
    }
    if (
      filters.objective !== "todos" &&
      item.intelligence.primaryObjective !== filters.objective
    ) {
      return false;
    }
    if (!levelMatches(item.intelligence.level, filters.difficulty)) return false;
    if (!durationMatches(item.intelligence.estimatedMinutes, filters.duration)) return false;
    return true;
  });
}

export function getLibraryNovidades(items: EnrichedLibraryItem[], limit = 6): EnrichedLibraryItem[] {
  const flagged = items.filter((i) => i.intelligence.isNew);
  if (flagged.length >= limit) return flagged.slice(0, limit);
  const premium = items.filter((i) => i.isPremium && !flagged.includes(i));
  return [...flagged, ...premium].slice(0, limit);
}
