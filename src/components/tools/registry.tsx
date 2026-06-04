import type { ComponentType } from "react";
import { CardiometabolicRiskTool } from "./CardiometabolicRiskTool";

const toolComponents: Record<string, ComponentType> = {
  "risco-cardiometabolico": CardiometabolicRiskTool,
};

export function getToolComponent(slug: string): ComponentType | null {
  return toolComponents[slug] ?? null;
}

export const interactiveToolSlugs = Object.keys(toolComponents);
