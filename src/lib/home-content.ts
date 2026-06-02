import { routes } from "@/lib/routes";

export const heroStats = [
  { value: "12k+", label: "Pessoas impactadas" },
  { value: "50+", label: "Protocolos validados" },
  { value: "100%", label: "Base científica" },
] as const;

export const healthProfiles = [
  {
    id: "metabolico",
    title: "Perfil Metabólico",
    description:
      "Foco em composição corporal, sensibilidade à insulina e energia estável ao longo do dia.",
    traits: ["Glicemia", "Composição", "Energia"],
    icon: "◈",
  },
  {
    id: "energetico",
    title: "Perfil Energético",
    description:
      "Identifica padrões de fadiga, recuperação e ritmo circadiano para otimizar sua vitalidade.",
    traits: ["Sono", "Ritmo", "Foco"],
    icon: "◎",
  },
  {
    id: "longevidade",
    title: "Perfil Longevidade",
    description:
      "Avalia marcadores de envelhecimento saudável, inflamação e resiliência biológica.",
    traits: ["Inflamação", "Resiliência", "Prevenção"],
    icon: "❋",
  },
  {
    id: "equilibrio",
    title: "Perfil Equilíbrio",
    description:
      "Mapeia estresse, hormônios e bem-estar emocional para uma vida mais harmoniosa.",
    traits: ["Estresse", "Humor", "Recuperação"],
    icon: "✦",
  },
] as const;

export const objectives = [
  {
    title: "Dormir melhor",
    description: "Rotinas para sono profundo e recuperação noturna.",
    icon: "🌙",
    href: routes.protocolos,
  },
  {
    title: "Mais energia",
    description: "Estratégias para vitalidade consistente sem picos artificiais.",
    icon: "⚡",
    href: routes.protocolos,
  },
  {
    title: "Longevidade ativa",
    description: "Hábitos comprovados para envelhecer com qualidade.",
    icon: "🌿",
    href: routes.protocolos,
  },
  {
    title: "Imunidade forte",
    description: "Fortaleça defesas naturais com nutrição e lifestyle.",
    icon: "🛡",
    href: routes.protocolos,
  },
  {
    title: "Equilíbrio hormonal",
    description: "Abordagem integrada para hormônios e metabolismo.",
    icon: "⚖",
    href: routes.protocolos,
  },
  {
    title: "Performance mental",
    description: "Clareza, foco e saúde cognitiva no dia a dia.",
    icon: "🧠",
    href: routes.protocolos,
  },
] as const;

export const protocols = [
  {
    title: "Sono Profundo",
    description:
      "7 dias para resetar seu ritmo circadiano e melhorar a qualidade do descanso.",
    duration: "7 dias",
    level: "Iniciante",
    tag: "Mais popular",
    href: routes.protocolos,
  },
  {
    title: "Anti-inflamatório",
    description:
      "Plano alimentar e lifestyle para reduzir inflamação crônica de baixo grau.",
    duration: "21 dias",
    level: "Intermediário",
    href: routes.protocolos,
  },
  {
    title: "Longevidade 90",
    description:
      "Protocolo completo de nutrição, movimento, sono e suplementação estratégica.",
    duration: "90 dias",
    level: "Avançado",
    tag: "Premium",
    href: routes.protocolos,
  },
  {
    title: "Energia Matinal",
    description:
      "Rotina matinal baseada em ciência para começar o dia com clareza e vigor.",
    duration: "14 dias",
    level: "Iniciante",
    href: routes.protocolos,
  },
] as const;

export const freeTools = [
  {
    title: "Calculadora de IMC",
    description: "Estime seu índice de massa corporal e faixa de referência.",
    icon: "📊",
    href: routes.ferramentas,
  },
  {
    title: "Avaliação de Sono",
    description: "Descubra a qualidade do seu sono em 2 minutos.",
    icon: "😴",
    href: routes.ferramentas,
  },
  {
    title: "Score de Vitalidade",
    description: "Pontue energia, humor, foco e recuperação diária.",
    icon: "💚",
    href: routes.ferramentas,
  },
  {
    title: "Hidratação Ideal",
    description: "Calcule sua necessidade diária de água personalizada.",
    icon: "💧",
    href: routes.ferramentas,
  },
] as const;

export const libraryResources = [
  {
    title: "Guia Completo de Longevidade",
    type: "PDF · 32 páginas",
    description: "Fundamentos científicos para uma vida longa e saudável.",
    href: routes.biblioteca,
  },
  {
    title: "Manual de Sono Reparador",
    type: "PDF · 18 páginas",
    description: "Protocolos práticos para noites restauradoras.",
    href: routes.biblioteca,
  },
  {
    title: "Checklist Anti-inflamatório",
    type: "PDF · 8 páginas",
    description: "Lista de alimentos e hábitos para reduzir inflamação.",
    href: routes.biblioteca,
  },
  {
    title: "Plano de 7 Dias — Reset",
    type: "PDF · 12 páginas",
    description: "Semana intensiva para reiniciar seus hábitos de saúde.",
    href: routes.biblioteca,
  },
] as const;

export const featuredArticles = [
  {
    title: "Os 5 pilares da longevidade que a ciência confirma em 2026",
    excerpt:
      "Descubra os hábitos com maior evidência científica para viver mais e melhor.",
    category: "Longevidade",
    readTime: "8 min",
    date: "28 Mai 2026",
    href: routes.blog,
  },
  {
    title: "Como o sono impacta sua imunidade e metabolismo",
    excerpt:
      "Entenda a conexão entre descanso, hormônios e saúde metabólica.",
    category: "Sono",
    readTime: "6 min",
    date: "22 Mai 2026",
    href: routes.blog,
  },
  {
    title: "Guia prático de alimentação anti-inflamatória",
    excerpt:
      "Alimentos, combinações e timing para reduzir inflamação crônica.",
    category: "Nutrição",
    readTime: "10 min",
    date: "15 Mai 2026",
    href: routes.blog,
  },
] as const;

export const clubBenefits = [
  "Protocolos exclusivos atualizados mensalmente",
  "Comunidade privada com especialistas",
  "Lives e masterclasses ao vivo",
  "Ferramentas avançadas de acompanhamento",
  "Biblioteca premium ampliada",
  "Suporte prioritário da equipe",
] as const;

export const trustSignals = [
  "Conteúdo revisado por especialistas",
  "Baseado em evidências científicas",
  "Sem promessas milagrosas",
] as const;
