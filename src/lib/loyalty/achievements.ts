import type { Achievement, AchievementId } from "./types";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "profile-complete",
    title: "Perfil definido",
    description: "Nome e objetivo principal configurados.",
    icon: "users",
    medalLabel: "Bronze",
  },
  {
    id: "first-article",
    title: "Primeira leitura",
    description: "Leu seu primeiro artigo na plataforma.",
    icon: "book",
    medalLabel: "Bronze",
  },
  {
    id: "first-protocol",
    title: "Protocolo iniciado",
    description: "Salvou ou iniciou um protocolo.",
    icon: "sparkle",
    medalLabel: "Prata",
  },
  {
    id: "first-download",
    title: "Primeiro download",
    description: "Baixou um material da biblioteca.",
    icon: "library",
    medalLabel: "Prata",
  },
  {
    id: "trail-started",
    title: "Trilha iniciada",
    description: "Deu o primeiro passo em uma trilha premium.",
    icon: "plan",
    medalLabel: "Ouro",
  },
  {
    id: "trail-completed",
    title: "Trilha concluída",
    description: "Completou todos os passos de uma trilha.",
    icon: "checklist",
    medalLabel: "Ouro",
  },
  {
    id: "week-streak",
    title: "Semana ativa",
    description: "7 dias consecutivos com atividade na plataforma.",
    icon: "activity",
    medalLabel: "Platina",
  },
  {
    id: "month-active",
    title: "Mês consistente",
    description: "15+ dias ativos no mês atual.",
    icon: "star",
    medalLabel: "Platina",
  },
];

export function getAchievementById(id: AchievementId): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
