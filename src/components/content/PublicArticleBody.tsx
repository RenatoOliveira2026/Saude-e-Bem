import { ContentBlockRenderer } from "@/components/content/ContentBlockRenderer";
import type { ContentBlock } from "@/lib/admin/cms/content-blocks";

interface PublicArticleBodyProps {
  blocks: ContentBlock[];
  fallbackParagraphs: string[];
}

function hasRichBlocks(blocks: ContentBlock[]): boolean {
  return blocks.some(
    (b) =>
      b.type === "image" ||
      b.type === "list" ||
      (b.type === "heading" && b.text.trim().length > 0),
  );
}

export function PublicArticleBody({
  blocks,
  fallbackParagraphs,
}: PublicArticleBodyProps) {
  const nonEmptyBlocks = blocks.filter(
    (b) =>
      (b.type === "paragraph" && b.text.trim()) ||
      (b.type === "heading" && b.text.trim()) ||
      (b.type === "image" && b.url) ||
      (b.type === "list" && b.items.length > 0),
  );

  if (hasRichBlocks(nonEmptyBlocks)) {
    return <ContentBlockRenderer blocks={nonEmptyBlocks} />;
  }

  return (
    <div className="prose-custom space-y-6">
      {fallbackParagraphs.map((paragraph) => (
        <p
          key={paragraph.slice(0, 48)}
          className="text-base leading-relaxed text-graphite text-pretty"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}
