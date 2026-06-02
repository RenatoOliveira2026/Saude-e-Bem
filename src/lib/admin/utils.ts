export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Uma linha por item */
export function linesToArray(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Formato: título|descrição (uma linha por passo) */
export function linesToSteps(value: string): { title: string; description: string }[] {
  return linesToArray(value).map((line) => {
    const [title, ...rest] = line.split("|");
    return {
      title: title?.trim() ?? line,
      description: rest.join("|").trim() || title?.trim() || line,
    };
  });
}

export function arrayToLines(items: string[]): string {
  return items.join("\n");
}

export function stepsToLines(
  steps: { title: string; description: string }[],
): string {
  return steps.map((s) => `${s.title}|${s.description}`).join("\n");
}
