import type { IconName } from "@/components/icons";
import { CLUB_PRICING } from "@/lib/payments/pricing";
import type { ClubPlan } from "./types";

export const clubBenefits = [
  {
    icon: "sparkle" as IconName,
    title: "Protocolos exclusivos",
    description: "Rotinas avançadas com passo a passo, preparadas pela equipe.",
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
    icon: "lock" as IconName,
    title: "Navegação sem anúncios",
    description: "Leia artigos e protocolos sem publicidade enquanto for membro.",
  },
] as const;

export const clubPlans: ClubPlan[] = [
  {
    id: "mensal",
    name: "Plano Mensal",
    price: CLUB_PRICING.premiumMonthly.label,
    period: "/mês",
    description: "Flexibilidade total para experimentar a experiência premium.",
    features: [
      "Todos os protocolos premium",
      "Navegação sem anúncios",
      "Ferramentas avançadas",
      "Biblioteca ampliada",
    ],
  },
  {
    id: "anual",
    name: "Plano Anual",
    price: CLUB_PRICING.premiumAnnual.label,
    period: "/ano",
    description: "Melhor custo-benefício para quem leva longevidade a sério.",
    features: [
      "Tudo do plano mensal",
      "Acesso antecipado a novidades",
    ],
    highlighted: true,
    badge: "Mais Escolhido",
    savingsLabel: CLUB_PRICING.premiumAnnual.savingsLabel,
  },
];

/**
 * Depoimentos só podem ser de membros reais, com autorização por escrito.
 * Enquanto não houver, a seção não é exibida.
 */
export const clubTestimonials: ReadonlyArray<{
  name: string;
  role: string;
  quote: string;
  avatar: string;
}> = [];

export const clubFaqs = [
  {
    question: "Como funciona a assinatura Premium?",
    answer:
      "Escolha o plano mensal ou anual, pague com PIX, cartão ou boleto via Mercado Pago e receba acesso imediato ao Clube após a confirmação do pagamento.",
  },
  {
    question: "O pagamento é seguro?",
    answer:
      "Sim. O checkout é processado pelo Mercado Pago, com criptografia e proteção antifraude. Não armazenamos dados do seu cartão em nossos servidores.",
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer:
      "Sim. No plano mensal, o cancelamento é livre e sem multas. No plano anual, você mantém acesso até o fim do período contratado.",
  },
  {
    question: "Quando meu Premium é ativado?",
    answer:
      "No cartão, a ativação é imediata. No PIX, em poucos minutos após a confirmação. No boleto, após a compensação bancária — acompanhe em Minha Assinatura.",
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
  // Apenas afirmações verificáveis: sem contagem de membros ou parceiros inventada.
  { value: "Premium", label: "Protocolos com passo a passo", icon: "sparkle" as IconName },
  { value: "Exclusiva", label: "Biblioteca ampliada para membros", icon: "library" as IconName },
  { value: "Avançadas", label: "Ferramentas de acompanhamento", icon: "tracker" as IconName },
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
    icon: "library" as IconName,
    title: "Materiais exclusivos",
    description:
      "Guias e planos liberados antes do lançamento público do Clube.",
  },
] as const;
