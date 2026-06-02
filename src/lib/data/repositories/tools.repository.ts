import { featuredTool, tools } from "../tools";
import type { Tool } from "../types";

export async function getTools(): Promise<Tool[]> {
  return tools.filter((t) => t.status === "published");
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  return tools.find((t) => t.slug === slug && t.status === "published") ?? null;
}

export async function getFeaturedTool(): Promise<Tool> {
  return featuredTool;
}

export async function getToolsByCategory(
  category: Tool["category"] | "todos",
): Promise<Tool[]> {
  const all = await getTools();
  if (category === "todos") return all;
  return all.filter((t) => t.category === category);
}

export async function getToolSlugs(): Promise<string[]> {
  return tools.map((t) => t.slug);
}

export { featuredTool, tools };
