import { withBase } from "./base";
import type { Tool } from "./types";

export const toolCategories = [
  { id: "todos", label: "Todos" },
  { id: "calculadora", label: "Calculadoras" },
  { id: "avaliacao", label: "Avaliações" },
] as const;

const rawTools: Omit<Tool, "status" | "createdAt" | "updatedAt">[] = [
  {
    id: "1",
    slug: "calculadora-imc",
    title: "Calculadora de IMC",
    description:
      "Estime seu Índice de Massa Corporal com faixas de referência e orientações contextuais.",
    longDescription:
      "Ferramenta que calcula IMC e explica faixas OMS com contexto sobre composição corporal e limitações do indicador.",
    category: "calculadora",
    categoryLabel: "Calculadora",
    icon: "chart",
    duration: "1 min",
    features: ["Faixas OMS", "Interpretação", "Calculadora interativa"],
    isPremium: false,
    featured: true,
  },
  {
    id: "2",
    slug: "consumo-agua",
    title: "Consumo diário de água",
    description:
      "Calcule sua necessidade diária de hidratação com base em peso, atividade e clima.",
    longDescription:
      "Personalize sua meta de água considerando peso corporal, nível de atividade física e condições ambientais.",
    category: "calculadora",
    categoryLabel: "Calculadora",
    icon: "water",
    duration: "1 min",
    features: ["Personalizado", "Ajuste por clima", "Calculadora interativa"],
    isPremium: false,
  },
  {
    id: "3",
    slug: "proteina-diaria",
    title: "Proteína diária",
    description:
      "Defina sua meta diária de proteína conforme objetivo, peso e nível de atividade.",
    longDescription:
      "Calculadora baseada em evidências para ingestão proteica ideal — manutenção, ganho muscular ou longevidade.",
    category: "calculadora",
    categoryLabel: "Calculadora",
    icon: "nutrition",
    duration: "1 min",
    features: ["Por objetivo", "Por peso", "Calculadora interativa"],
    isPremium: false,
  },
  {
    id: "4",
    slug: "metabolismo-basal",
    title: "Metabolismo basal",
    description:
      "Estime seu gasto calórico basal (TMB) e necessidades energéticas diárias totais.",
    longDescription:
      "Cálculo de taxa metabólica basal usando fórmulas validadas, com ajuste por nível de atividade física.",
    category: "calculadora",
    categoryLabel: "Calculadora",
    icon: "activity",
    duration: "2 min",
    features: ["Fórmula Mifflin-St Jeor", "TMB e GET", "Calculadora interativa"],
    isPremium: false,
  },
  {
    id: "6",
    slug: "risco-cardiometabolico",
    title: "Risco cardiometabólico",
    description:
      "Triagem educativa de risco cardiometabólico com base em medidas, hábitos e histórico de saúde.",
    longDescription:
      "Avalie de forma orientativa fatores como IMC, circunferência abdominal, tabagismo, atividade física e histórico familiar. Receba um nível de risco e recomendações práticas — sem substituir avaliação médica.",
    category: "avaliacao",
    categoryLabel: "Avaliação",
    icon: "heart-leaf",
    duration: "3 min",
    features: [
      "IMC e cintura",
      "Fatores de estilo de vida",
      "Recomendações personalizadas",
    ],
    isPremium: false,
  },
  {
    id: "5",
    slug: "quiz-saude-bem",
    title: "Quiz Saúde & Bem",
    description:
      "Descubra seu perfil de saúde e receba recomendações personalizadas de protocolos.",
    longDescription:
      "Avaliação interativa de 3 minutos que identifica seu perfil dominante e sugere protocolos alinhados à sua biologia.",
    category: "avaliacao",
    categoryLabel: "Avaliação",
    icon: "profile",
    duration: "3 min",
    features: ["Perfil personalizado", "Quiz interativo", "Protocolos sugeridos"],
    isPremium: false,
  },
];

export const tools: Tool[] = rawTools.map((t) => withBase(t));
export const featuredTool = tools.find((t) => t.featured)!;

/** Ordem estável de exibição na listagem e seções inferiores */
export const toolDisplayOrder = [
  "calculadora-imc",
  "consumo-agua",
  "proteina-diaria",
  "metabolismo-basal",
  "quiz-saude-bem",
  "risco-cardiometabolico",
] as const;

export function sortToolsForDisplay(list: Tool[]): Tool[] {
  const order = new Map<string, number>(
    toolDisplayOrder.map((slug, index) => [slug, index]),
  );
  return [...list].sort(
    (a, b) => (order.get(a.slug) ?? 999) - (order.get(b.slug) ?? 999),
  );
}
