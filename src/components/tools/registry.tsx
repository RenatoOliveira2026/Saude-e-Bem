import type { ComponentType } from "react";
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

export const interactiveToolSlugs = Object.keys(toolComponents);
