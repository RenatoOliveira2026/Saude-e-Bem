import type { IconName } from "@/components/icons";
import type { ClubPlan } from "./types";

export const clubBenefits = [
  {
    icon: "sparkle" as IconName,
    title: "Protocolos exclusivos",
    description: "Acesso a rotinas avançadas atualizadas mensalmente pela equipe.",
  },
  {
    icon: "community" as IconName,
    title: "Comunidade privada",
    description: "Grupo fechado com especialistas, membros e suporte contínuo.",
  },
  {
    icon: "live" as IconName,
    title: "Lives & masterclasses",
    description: "Encontros ao vivo mensais com profissionais convidados.",
  },
  {
    icon: "tracker" as IconName,
    title: "Ferramentas avançadas",
    description: "Trackers, dashboards e avaliações premium desbloqueadas.",
  },
  {
    icon: "library" as IconName,
    title: "Biblioteca ampliada",
    description: "Guias, estudos e planos exclusivos para membros.",
  },
  {
    icon: "support" as IconName,
    title: "Suporte prioritário",
    description: "Canal direto com a equipe Saúde & Bem para suas dúvidas.",
  },
] as const;

export const clubPlans: ClubPlan[] = [
  {
    id: "mensal",
    name: "Mensal",
    price: "R$ 97",
    period: "/mês",
    description: "Flexibilidade total para experimentar a experiência premium.",
    features: [
      "Todos os protocolos premium",
      "Comunidade privada",
      "Ferramentas avançadas",
      "Biblioteca ampliada",
    ],
  },
  {
    id: "anual",
    name: "Anual",
    price: "R$ 797",
    period: "/ano",
    description: "Melhor custo-benefício para quem leva longevidade a sério.",
    features: [
      "Tudo do plano mensal",
      "2 meses grátis",
      "Lives exclusivas gravadas",
      "Suporte prioritário",
      "Acesso antecipado a novidades",
    ],
    highlighted: true,
    badge: "Mais escolhido",
  },
];

export const clubTestimonials = [
  {
    name: "Patricia M.",
    role: "Empresária, 52 anos",
    quote:
      "Em 90 dias seguindo os protocolos do clube, minha energia e qualidade de sono mudaram completamente. Finalmente algo baseado em ciência.",
    avatar: "PM",
  },
  {
    name: "Roberto S.",
    role: "Médico, 45 anos",
    quote:
      "Recomendo aos meus pacientes. A curadoria de conteúdo é impecável e a comunidade agrega muito valor.",
    avatar: "RS",
  },
  {
    name: "Luciana F.",
    role: "Coach de bem-estar, 38 anos",
    quote:
      "As ferramentas de acompanhamento e os protocolos premium elevaram minha prática pessoal e profissional.",
    avatar: "LF",
  },
] as const;

export const clubFaqs = [
  {
    question: "Quando o Clube será lançado?",
    answer:
      "Estamos na fase final de preparação. Membros da lista de espera terão acesso antecipado e condições especiais de lançamento.",
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer:
      "Sim. No plano mensal, o cancelamento é livre e sem multas. No plano anual, você mantém acesso até o fim do período contratado.",
  },
  {
    question: "Os protocolos substituem acompanhamento médico?",
    answer:
      "Não. Nosso conteúdo é educacional e preventivo. Sempre consulte seu médico antes de mudanças significativas na saúde.",
  },
  {
    question: "Há garantia de resultados?",
    answer:
      "Prometemos conteúdo de qualidade baseado em evidências, não milagres. Resultados dependem de consistência e individualidade biológica.",
  },
] as const;

export const clubStats = [
  { value: "2.400+", label: "Na lista de espera", icon: "users" as IconName },
  { value: "50+", label: "Protocolos premium", icon: "sparkle" as IconName },
  { value: "12", label: "Especialistas parceiros", icon: "star" as IconName },
] as const;

export const clubVipList = [
  {
    icon: "star" as IconName,
    title: "Acesso antecipado",
    description:
      "Seja entre os primeiros a usar protocolos premium, ferramentas avançadas e a nova plataforma completa.",
  },
  {
    icon: "sparkle" as IconName,
    title: "Condições de fundador",
    description:
      "Preço especial de lançamento e benefícios exclusivos reservados apenas para quem entrou na lista VIP.",
  },
  {
    icon: "community" as IconName,
    title: "Comunidade fundadora",
    description:
      "Grupo fechado com outros membros VIP, encontros de boas-vindas e canal direto com a equipe Saúde & Bem.",
  },
  {
    icon: "library" as IconName,
    title: "Materiais exclusivos",
    description:
      "Guias, planos e masterclasses liberados antes do lançamento público do Clube.",
  },
  {
    icon: "live" as IconName,
    title: "Lives de pré-lançamento",
    description:
      "Convite para encontros ao vivo sobre longevidade, protocolos e novidades da plataforma.",
  },
  {
    icon: "support" as IconName,
    title: "Prioridade no suporte",
    description:
      "Atendimento preferencial e onboarding personalizado quando o Clube for aberto.",
  },
] as const;
