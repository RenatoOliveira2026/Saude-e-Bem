/**
 * Templates Brevo para sequência de lançamento (Fase 7.0).
 * Crie templates com os mesmos `templateKey` no painel Brevo antes de ativar automação.
 * Disparo automático depende de workflow configurado no Brevo — apenas estrutura local preparada.
 */
export interface LaunchEmailTemplate {
  templateKey: string;
  brevoName: string;
  subject: string;
  stepOrder: number;
  delayHours: number;
  description: string;
}

export const LAUNCH_EMAIL_TEMPLATES: LaunchEmailTemplate[] = [
  {
    templateKey: "launch_welcome",
    brevoName: "SB Lançamento — Boas-vindas",
    subject: "Boas-vindas ao Saúde & Bem",
    stepOrder: 1,
    delayHours: 0,
    description:
      "E-mail de boas-vindas para leads da lista VIP. Apresentação da plataforma e próximos passos.",
  },
  {
    templateKey: "launch_rotina_passos",
    brevoName: "SB Lançamento — Rotina em passos",
    subject: "Como melhorar sua rotina de saúde em pequenos passos",
    stepOrder: 2,
    delayHours: 48,
    description:
      "Nutrição educativa com hábitos simples e aplicáveis para consistência diária.",
  },
  {
    templateKey: "launch_protocolos",
    brevoName: "SB Lançamento — Protocolos",
    subject: "Protocolos recomendados para começar",
    stepOrder: 3,
    delayHours: 120,
    description:
      "Destaque de protocolos gratuitos e premium alinhados ao interesse do lead.",
  },
  {
    templateKey: "launch_recursos",
    brevoName: "SB Lançamento — Recursos",
    subject: "Recursos e produtos recomendados",
    stepOrder: 4,
    delayHours: 192,
    description:
      "Curadoria de e-books, ferramentas e ofertas do marketplace com transparência editorial.",
  },
  {
    templateKey: "launch_clube_convite",
    brevoName: "SB Lançamento — Convite Clube",
    subject: "Convite para o Clube Saúde & Bem",
    stepOrder: 5,
    delayHours: 264,
    description:
      "Convite ao Clube Premium com benefícios, planos e CTA para assinatura ou lista de espera.",
  },
];

export const LAUNCH_SEQUENCE_ID = "launch-vip-nurture";
