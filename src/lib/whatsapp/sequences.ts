import type { WhatsAppAutomationStep, WhatsAppSequence } from "./sequences.types";

export const WHATSAPP_NURTURE_SEQUENCES: WhatsAppSequence[] = [
  {
    id: "welcome-opt-in",
    name: "Boas-vindas WhatsApp",
    steps: [
      {
        id: "w1",
        type: "immediate",
        templateKey: "sb_boas_vindas",
        buildParameters: (ctx) => [ctx.name ?? "Membro"],
      },
      {
        id: "w2",
        type: "delay",
        delayHours: 24,
        templateKey: "sb_nutricao_d1",
        buildParameters: (ctx) => [ctx.interestLabel ?? "saúde e bem-estar"],
      },
    ],
  },
  {
    id: "reengagement-morno",
    name: "Reengajamento — leads mornos",
    minScore: "morno",
    steps: [
      {
        id: "r1",
        type: "delay",
        delayHours: 336,
        templateKey: "sb_reengajamento",
        buildParameters: (ctx) => [ctx.name ?? "Membro"],
      },
    ],
  },
];

export function getWhatsAppSequenceForLead(input: {
  leadScore: string;
  hasOptIn: boolean;
}): WhatsAppSequence | null {
  if (!input.hasOptIn) return null;
  return WHATSAPP_NURTURE_SEQUENCES.find((s) => s.id === "welcome-opt-in") ?? null;
}

export function getStepDelayMs(step: WhatsAppAutomationStep): number {
  if (step.type === "immediate") return 0;
  return (step.delayHours ?? 24) * 60 * 60 * 1000;
}
