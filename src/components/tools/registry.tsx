import { createElement, type ComponentType, type ReactNode } from "react";
import { BasalMetabolismTool } from "./BasalMetabolismTool";
import { BmiCalculatorTool } from "./BmiCalculatorTool";
import { CardiometabolicRiskTool } from "./CardiometabolicRiskTool";
import { DailyProteinTool } from "./DailyProteinTool";
import { HealthQuizTool } from "./HealthQuizTool";
import { WaterIntakeTool } from "./WaterIntakeTool";

const toolComponents: Record<string, ComponentType> = {
  "calculadora-imc": BmiCalculatorTool,
  "consumo-agua": WaterIntakeTool,
  "proteina-diaria": DailyProteinTool,
  "metabolismo-basal": BasalMetabolismTool,
  "quiz-saude-bem": HealthQuizTool,
  "risco-cardiometabolico": CardiometabolicRiskTool,
};

export function getToolComponent(slug: string): ComponentType | null {
  return toolComponents[slug] ?? null;
}

/** Elemento da ferramenta interativa (ou `null`), sem criar componente no render. */
export function renderToolComponent(slug: string): ReactNode {
  const Component = toolComponents[slug];
  return Component ? createElement(Component) : null;
}

export const interactiveToolSlugs = Object.keys(toolComponents);
