import type { ContinueReadingItem } from "@/lib/club/types";
import type { LibraryResource, Protocol } from "@/lib/data/types";
import type { TrailProgress } from "@/lib/premium/trail-progress";
import type { JourneyProgressStats } from "@/lib/journey/types";

export interface EngagementReminder {
  id: string;
  title: string;
  description: string;
  href: string;
  kind: "continue" | "trail" | "new" | "weekly";
  priority: number;
}

export interface WeeklyProgressSummary {
  label: string;
  value: number;
  unit: string;
}

export interface EngagementSnapshot {
  /** Sequência "Continue sua jornada" */
  continueItems: ContinueReadingItem[];
  /** Trilha interrompida (iniciada, não concluída) */
  interruptedTrail: TrailProgress | null;
  /** Materiais recomendados */
  recommendedProtocols: Protocol[];
  recommendedLibrary: LibraryResource[];
  /** Conteúdos novos (flags no registry) */
  newContentCount: number;
  /** Progresso semanal derivado */
  weeklyProgress: WeeklyProgressSummary[];
  /** Lembretes ordenados por prioridade — prontos para push/e-mail futuro */
  reminders: EngagementReminder[];
}
