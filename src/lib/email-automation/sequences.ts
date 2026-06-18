import type { EmailAutomationSequence } from "./types";

/** Sequências editoriais — preparadas para sync com ESPs (Fase 5.2). */
export const EMAIL_AUTOMATION_SEQUENCES: EmailAutomationSequence[] = [
  {
    id: "welcome-hidratacao",
    name: "Boas-vindas — Hidratação",
    interest: "hidratacao",
    minScore: "morno",
    steps: [
      {
        id: "h1",
        type: "immediate",
        subject: "Seu guia de hidratação chegou",
        templateKey: "welcome_hidratacao",
      },
      {
        id: "h2",
        type: "delay",
        delayHours: 72,
        subject: "3 hábitos simples para beber mais água",
        templateKey: "nurture_hidratacao_d3",
      },
    ],
  },
  {
    id: "welcome-emagrecimento",
    name: "Boas-vindas — Emagrecimento",
    interest: "emagrecimento",
    minScore: "morno",
    steps: [
      {
        id: "e1",
        type: "immediate",
        subject: "Emagrecimento sustentável: por onde começar",
        templateKey: "welcome_emagrecimento",
      },
      {
        id: "e2",
        type: "delay",
        delayHours: 48,
        subject: "Proteína, saciedade e platôs",
        templateKey: "nurture_emagrecimento_d2",
      },
    ],
  },
  {
    id: "welcome-sono",
    name: "Boas-vindas — Sono",
    interest: "sono",
    minScore: "morno",
    steps: [
      {
        id: "s1",
        type: "immediate",
        subject: "Guia prático de higiene do sono",
        templateKey: "welcome_sono",
      },
      {
        id: "s2",
        type: "delay",
        delayHours: 96,
        subject: "Ambiente ideal para noites reparadoras",
        templateKey: "nurture_sono_d4",
      },
    ],
  },
  {
    id: "welcome-longevidade",
    name: "Boas-vindas — Longevidade",
    interest: "longevidade",
    minScore: "morno",
    steps: [
      {
        id: "l1",
        type: "immediate",
        subject: "Os pilares da longevidade saudável",
        templateKey: "welcome_longevidade",
      },
      {
        id: "l2",
        type: "delay",
        delayHours: 120,
        subject: "Biomarcadores que vale a pena acompanhar",
        templateKey: "nurture_longevidade_d5",
      },
    ],
  },
  {
    id: "hot-clube-offer",
    name: "Oferta Clube — leads quentes",
    interest: "default",
    minScore: "quente",
    steps: [
      {
        id: "c1",
        type: "immediate",
        subject: "Conteúdo premium alinhado ao seu interesse",
        templateKey: "offer_clube_quente",
      },
    ],
  },
  {
    id: "launch-vip-nurture",
    name: "Lançamento — Lista VIP (5 e-mails)",
    interest: "default",
    minScore: "frio",
    steps: [
      {
        id: "lv1",
        type: "immediate",
        subject: "Boas-vindas ao Saúde & Bem",
        templateKey: "launch_welcome",
      },
      {
        id: "lv2",
        type: "delay",
        delayHours: 48,
        subject: "Como melhorar sua rotina de saúde em pequenos passos",
        templateKey: "launch_rotina_passos",
      },
      {
        id: "lv3",
        type: "delay",
        delayHours: 120,
        subject: "Protocolos recomendados para começar",
        templateKey: "launch_protocolos",
      },
      {
        id: "lv4",
        type: "delay",
        delayHours: 192,
        subject: "Recursos e produtos recomendados",
        templateKey: "launch_recursos",
      },
      {
        id: "lv5",
        type: "delay",
        delayHours: 264,
        subject: "Convite para o Clube Saúde & Bem",
        templateKey: "launch_clube_convite",
      },
    ],
  },
];

export function getSequenceForLead(
  interest: string,
  leadScore: string,
  source?: string,
): EmailAutomationSequence | null {
  if (source === "lista-vip-lancamento") {
    return (
      EMAIL_AUTOMATION_SEQUENCES.find((seq) => seq.id === "launch-vip-nurture") ?? null
    );
  }

  const scoreRank = { frio: 0, morno: 1, quente: 2, muito_quente: 3 } as const;
  const rank = scoreRank[leadScore as keyof typeof scoreRank] ?? 0;

  const byInterest = EMAIL_AUTOMATION_SEQUENCES.find(
    (seq) => seq.interest === interest && rank >= scoreRank[seq.minScore],
  );
  if (byInterest) return byInterest;

  if (rank >= scoreRank.quente) {
    return (
      EMAIL_AUTOMATION_SEQUENCES.find((seq) => seq.id === "hot-clube-offer") ?? null
    );
  }

  return null;
}
