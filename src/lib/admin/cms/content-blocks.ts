export type ContentBlock =
  | { type: "paragraph"; text: string; html?: string }
  | { type: "heading"; text: string; level: 1 | 2 | 3 }
  | { type: "image"; url: string; alt?: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "blockquote"; text: string }
  | { type: "divider" };

function normalizeHeadingLevel(level: unknown): 1 | 2 | 3 {
  if (level === 1 || level === 3) return level;
  return 2;
}

export function parseContentBlocks(raw: unknown): ContentBlock[] {
  if (!Array.isArray(raw)) {
    if (typeof raw === "string" && raw.trim()) {
      return raw.split("\n\n").map((text) => ({ type: "paragraph", text: text.trim() }));
    }
    return [{ type: "paragraph", text: "" }];
  }

  const blocks: ContentBlock[] = [];

  for (const item of raw) {
    if (typeof item === "string" && item.trim()) {
      blocks.push({ type: "paragraph", text: item.trim() });
      continue;
    }
    if (typeof item !== "object" || item === null) continue;

    const block = item as Record<string, unknown>;

    if (block.type === "heading" && typeof block.text === "string") {
      blocks.push({
        type: "heading",
        text: block.text,
        level: normalizeHeadingLevel(block.level),
      });
    } else if (block.type === "image" && typeof block.url === "string") {
      blocks.push({
        type: "image",
        url: block.url,
        alt: typeof block.alt === "string" ? block.alt : undefined,
      });
    } else if (block.type === "list" && Array.isArray(block.items)) {
      blocks.push({
        type: "list",
        items: block.items.filter((i): i is string => typeof i === "string"),
        ordered: block.ordered === true,
      });
    } else if (block.type === "blockquote" && typeof block.text === "string") {
      blocks.push({ type: "blockquote", text: block.text });
    } else if (block.type === "divider") {
      blocks.push({ type: "divider" });
    } else if (block.type === "paragraph") {
      blocks.push({
        type: "paragraph",
        text: typeof block.text === "string" ? block.text : "",
        html: typeof block.html === "string" ? block.html : undefined,
      });
    } else if (typeof block.text === "string") {
      blocks.push({ type: "paragraph", text: block.text });
    }
  }

  return blocks.length > 0 ? blocks : [{ type: "paragraph", text: "" }];
}

export function blocksToStorage(blocks: ContentBlock[]): ContentBlock[] {
  return blocks
    .map((block) => {
      if (block.type === "paragraph") {
        const text = block.text.trim();
        const html = block.html?.trim();
        if (!text && !html) return null;
        return {
          type: "paragraph" as const,
          text,
          ...(html ? { html } : {}),
        };
      }
      if (block.type === "heading") {
        const text = block.text.trim();
        if (!text) return null;
        return { type: "heading" as const, text, level: block.level };
      }
      if (block.type === "image" && block.url.trim()) {
        return {
          type: "image" as const,
          url: block.url.trim(),
          alt: block.alt?.trim(),
        };
      }
      if (block.type === "list") {
        const items = block.items.map((i) => i.trim()).filter(Boolean);
        if (!items.length) return null;
        return {
          type: "list" as const,
          items,
          ...(block.ordered ? { ordered: true } : {}),
        };
      }
      if (block.type === "blockquote") {
        const text = block.text.trim();
        if (!text) return null;
        return { type: "blockquote" as const, text };
      }
      if (block.type === "divider") {
        return { type: "divider" as const };
      }
      return null;
    })
    .filter((b): b is ContentBlock => b !== null);
}

export function blocksToPlainParagraphs(blocks: ContentBlock[]): string[] {
  const result: string[] = [];
  for (const block of blocks) {
    if (block.type === "paragraph") {
      const plain = block.html
        ? block.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
        : block.text;
      if (plain) result.push(plain);
    }
    if (block.type === "heading" && block.text) result.push(block.text);
    if (block.type === "blockquote" && block.text) result.push(`"${block.text}"`);
    if (block.type === "list" && block.items.length) {
      const prefix = block.ordered ? (i: number) => `${i + 1}.` : () => "•";
      result.push(
        block.items.map((item, i) => `${prefix(i)} ${item}`).join("\n"),
      );
    }
    if (block.type === "image" && block.url) {
      result.push(`[Imagem: ${block.alt ?? "conteúdo visual"}]`);
    }
    if (block.type === "divider") {
      result.push("—");
    }
  }
  return result.length > 0 ? result : [""];
}

export function parseBlocksFromFormValue(value: string): ContentBlock[] {
  if (!value.trim()) return [{ type: "paragraph", text: "" }];
  try {
    return parseContentBlocks(JSON.parse(value));
  } catch {
    return value.split("\n\n").map((text) => ({ type: "paragraph", text: text.trim() }));
  }
}
