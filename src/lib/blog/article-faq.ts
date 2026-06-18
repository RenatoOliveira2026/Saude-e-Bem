import type { ContentBlock, FaqItem } from "@/lib/admin/cms/content-blocks";

export function extractFaqFromBlocks(blocks: ContentBlock[]): FaqItem[] {
  const items: FaqItem[] = [];
  for (const block of blocks) {
    if (block.type === "faq") {
      items.push(...block.items);
    }
  }
  return items;
}
